// De race-engine. Geen React, geen opslag: alleen rekenen. Alles is te
// testen zonder browser (briefing hoofdstuk 18).
//
// Principe (hoofdstuk 10): bij de start liggen starttijd, eindtijd en seed
// vast, en wordt het complete eventschema berekend. De positie op elk
// moment volgt daaruit. Zo is de race altijd hetzelfde, hoe vaak je de app
// ook opent of sluit.

import type { Choice } from '../models/Choice';
import type { Course } from '../models/Course';
import type { SpeedPhase } from '../models/Event';
import type { ActionId, Race, ScheduledChoice } from '../models/Race';
import type { Racer } from '../models/Racer';
import { DAY, localDateKey } from '../utils/dates';
import { createRng, deriveSeed } from '../utils/random';
import { actionPhases } from './actions';
import { decisionPhases, effectiveDecisions, humansOf, openChoice, ownerOf } from './choices';
import { generateRacerEvents, generateRain } from './events';
import { simulate, type Movement } from './movement';
import { daysScale, snapshotRacer } from './racers';
import { scheduleChoices } from './choices';

export interface CreateRaceInput {
  now: number;
  seed: number;
  number: number;
  course: Course;
  racers: Racer[];
  choices: Choice[];
  /** De racer van de speler; standaard de racer met `playable`. */
  playerId?: string;
  /**
   * Gedeelde race: alle racers die door mensen bestuurd worden. Zij krijgen
   * elk eigen keuze-events. De race is dan voor iedereen precies dezelfde,
   * welke racer ook `playerId` is.
   */
  humanIds?: string[];
}

/** Maak een nieuwe race. Alles wat toeval is, wordt nu met de seed vastgelegd. */
export function createRace(input: CreateRaceInput): Race {
  const { now, seed, number } = input;
  const course = structuredClone(input.course);
  const racers = input.racers.map(snapshotRacer);
  const player = racers.find((r) => r.id === input.playerId) ?? racers.find((r) => r.playable) ?? racers[0];
  const humans = input.humanIds?.length ? input.humanIds : [player.id];
  const startTime = now;
  const endTime = startTime + course.days * DAY;
  const racerIds = racers.map((r) => r.id);
  // Eén speler: zoals altijd. Meerdere: per speler een eigen reeks keuzes.
  const choices = humans
    .flatMap((h) =>
      humans.length === 1
        ? scheduleChoices(seed, input.choices, getById(racers, h), startTime, endTime, racerIds, undefined, undefined, course.id)
        : scheduleChoices(seed, input.choices, getById(racers, h), startTime, endTime, racerIds, `choices:${h}`, `keuze-${h}`, course.id),
    )
    .sort((a, b) => a.time - b.time);

  const rain = generateRain(seed, racers, startTime, endTime);
  const events = [
    ...rain,
    ...racers.flatMap((racer) =>
      generateRacerEvents({ seed, course, racer, isPlayer: humans.includes(racer.id), startTime, endTime, rain }),
    ),
  ].sort((a, b) => a.time - b.time);

  return {
    version: 1,
    id: `race-${number}-${seed.toString(36)}`,
    number,
    seed,
    startTime,
    endTime,
    playerId: player.id,
    ...(input.humanIds?.length ? { humans } : {}),
    course,
    racers,
    events,
    choices,
    decisions: [],
    actions: [],
  };
}

function getById(racers: Racer[], id: string): Racer {
  const r = racers.find((x) => x.id === id);
  if (!r) throw new Error(`Racer ${id} rijdt niet mee`);
  return r;
}

export function getRaceRacer(race: Race, racerId: string): Racer {
  const r = race.racers.find((x) => x.id === racerId);
  if (!r) throw new Error(`Racer ${racerId} rijdt niet mee in deze race`);
  return r;
}

/** Na het einde van de race verandert er niets meer. */
const clampTime = (race: Race, now: number) => Math.min(Math.max(now, race.startTime), race.endTime);

/** Alle snelheidseffecten voor één racer tot moment `now`. */
function phasesFor(race: Race, racerId: string, now: number): SpeedPhase[] {
  const phases: SpeedPhase[] = [];
  for (const e of race.events) {
    if (e.racerId === racerId) phases.push(...e.phases);
    else if (e.racerId === null) phases.push(...(e.phasesByRacer?.[racerId] ?? []));
  }
  if (humansOf(race).includes(racerId)) {
    phases.push(...decisionPhases(race, now, racerId), ...actionPhases(race, now, racerId));
  }
  return phases;
}

/** Waar is deze racer op moment `now`? */
export function racerMovement(race: Race, racerId: string, now: number): Movement {
  const t = clampTime(race, now);
  return simulate(
    {
      course: race.course,
      racer: getRaceRacer(race, racerId),
      startTime: race.startTime,
      phases: phasesFor(race, racerId, t),
      // Sprongen zijn een stukje van de route; in een langere race zijn er meer, dus kleinere.
      jumps: race.events
        .filter((e) => e.racerId === racerId && e.jumpKm)
        .map((e) => ({ time: e.time, km: e.jumpKm! * daysScale(race.course.days) })),
    },
    t,
  );
}

export interface Standing {
  racerId: string;
  position: number;
  km: number;
  finishTime: number | null;
}

/**
 * Tussenstand of eindstand. Wie de finish haalde, staat vooraan op
 * finishtijd; de rest op afgelegde afstand.
 */
export function standingsAt(race: Race, now: number): Standing[] {
  return race.racers
    .map((r) => ({ racerId: r.id, ...racerMovement(race, r.id, now) }))
    .sort((a, b) => {
      if (a.finishTime !== null && b.finishTime !== null) return a.finishTime - b.finishTime;
      if (a.finishTime !== null) return -1;
      if (b.finishTime !== null) return 1;
      if (b.km !== a.km) return b.km - a.km;
      // Gelijke stand (bijv. bij de start): de racer van de speler vooraan.
      if (a.racerId === race.playerId) return -1;
      if (b.racerId === race.playerId) return 1;
      return a.racerId.localeCompare(b.racerId);
    })
    .map((s, i) => ({ racerId: s.racerId, position: i + 1, km: s.km, finishTime: s.finishTime }));
}

export function isFinished(race: Race, now: number): boolean {
  return now >= race.endTime;
}

/** Eindstand: precies op het einde van de race. */
export function finalStandings(race: Race): Standing[] {
  return standingsAt(race, race.endTime);
}

/** Hele dagen die nog over zijn, naar boven afgerond (0 als de race voorbij is). */
export function daysLeft(race: Race, now: number): number {
  return Math.min(race.course.days, Math.max(0, Math.ceil((race.endTime - now) / DAY)));
}

// ---------- Keuze-events ----------

export { openChoice, effectiveDecisions };

/** Een speler kiest een optie. Alleen mogelijk zolang het keuze-event openstaat. */
export function decideChoice(
  race: Race,
  scheduledId: string,
  optionId: string,
  now: number,
  racerId: string = race.playerId,
): Race {
  const open = openChoice(race, now, racerId);
  if (!open || open.id !== scheduledId) throw new Error('Dit keuze-event staat niet (meer) open');
  if (!open.choice.options.some((o) => o.id === optionId)) throw new Error(`Onbekende optie: ${optionId}`);
  return { ...race, decisions: [...race.decisions, { racerId, scheduledId, optionId, time: now }] };
}

export function scheduledChoice(race: Race, id: string): ScheduledChoice | undefined {
  return race.choices.find((c) => c.id === id);
}

// ---------- Dagelijkse actie ----------

/** Mag deze speler vandaag (lokale kalenderdag) nog een actie doen? */
export function canDoAction(race: Race, now: number, racerId: string = race.playerId): boolean {
  if (now < race.startTime || now >= race.endTime) return false;
  if (racerMovement(race, racerId, now).finishTime !== null) return false;
  return todaysAction(race, now, racerId) === null;
}

/** De actie van vandaag uitvoeren. */
export function doAction(race: Race, actionId: ActionId, now: number, racerId: string = race.playerId): Race {
  if (!canDoAction(race, now, racerId)) throw new Error('Vandaag is er al een actie gedaan');
  const day = localDateKey(now);
  const label = humansOf(race).length > 1 ? `action:${racerId}:${day}` : `action:${day}`;
  const variant = createRng(deriveSeed(race.seed, label)).int(0, 99);
  return { ...race, actions: [...race.actions, { racerId, actionId, time: now, day, variant }] };
}

/** De actie van vandaag van deze speler, als die al gedaan is. */
export function todaysAction(race: Race, now: number, racerId: string = race.playerId) {
  const today = localDateKey(now);
  return race.actions.find((a) => a.day === today && ownerOf(race, a) === racerId) ?? null;
}
