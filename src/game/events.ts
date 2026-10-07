import type { Course } from '../models/Course';
import type { EventType, RaceEvent, SpeedPhase } from '../models/Event';
import type { Racer } from '../models/Racer';
import { DAY, MINUTE } from '../utils/dates';
import { createRng, deriveSeed, type Rng } from '../utils/random';
import { segmentIndexAt } from './course';
import { simulate } from './movement';
import { chaosScale, dampen, dampenStopDuration, eventWeightFactor, napScale } from './personality';

// Gewone events (briefing hoofdstuk 11). Alles wordt bij het aanmaken van
// de race vooraf berekend met de seed.

/** Basiskans per eventtype (voor persoonlijkheid). Regen is weer en komt apart. */
export const BASE_WEIGHTS: Record<Exclude<EventType, 'rain'>, number> = {
  flower: 10,
  food: 6,
  bird: 6,
  mud: 3,
  nap: 8,
  shortcut: 3,
  wrong_turn: 22,
  worm: 6,
  rock: 5,
  butterfly: 6,
  puddle: 5,
  snack: 5,
  strange_noise: 5,
  nothing: 8,
};

/** Hoeveel vaker modder voorkomt als de racer op het Modderveld is. */
const MUD_SEGMENT_BOOST = 8;

/** Aantal events per dag: de speler 2–4, tegenstanders 1–2. */
export function eventsPerDay(isPlayer: boolean): [number, number] {
  return isPlayer ? [2, 4] : [1, 2];
}

/** Kans op een regenbui per dag. */
export const RAIN_CHANCE_PER_DAY = 0.45;

const minutes = (rng: Rng, min: number, max: number) => rng.range(min, max) * MINUTE;

/** Speciale regels per soort: slakken houden van regen, eenden van plassen. */
function rainSpeed(racer: Racer): number {
  return racer.species === 'Slak' ? 1.15 : 0.8;
}

interface Built {
  phases: SpeedPhase[];
  jumpKm?: number;
  textKey?: string;
}

/** Duur en effect van één event voor één racer, vanaf moment `t`. */
function buildEffect(type: Exclude<EventType, 'rain'>, racer: Racer, course: Course, t: number, rng: Rng): Built {
  const s = racer.traits.stubborn;
  const slow = (ms: number, speed: number): SpeedPhase => ({ start: t, end: t + ms, speed: dampen(speed, s) });
  const stop = (ms: number): SpeedPhase => ({ start: t, end: t + dampenStopDuration(ms, s), speed: 0 });
  const then = (prev: SpeedPhase, ms: number, speed: number): SpeedPhase => ({
    start: prev.end,
    end: prev.end + ms,
    speed,
  });
  const pct = (min: number, max: number) => (rng.range(min, max) / 100) * course.lengthKm;

  switch (type) {
    case 'flower':
      return { phases: [slow(minutes(rng, 30, 240), 0.3)] };
    case 'food': {
      const eat = stop(minutes(rng, 20, 60));
      return { phases: [eat, then(eat, 120 * MINUTE, 1.1)] };
    }
    case 'bird':
      return { phases: [stop(minutes(rng, 10, 30))] };
    case 'mud':
      return { phases: [slow(minutes(rng, 60, 180), 0.6)] };
    case 'nap':
      return { phases: [stop(minutes(rng, 60, 300) * napScale(racer.traits))] };
    case 'shortcut':
      return { phases: [], jumpKm: pct(2, 5) * chaosScale(racer.traits) };
    case 'wrong_turn':
      return { phases: [], jumpKm: -pct(1, 4) * chaosScale(racer.traits) * (1 - s / 200) };
    case 'worm':
      return { phases: [slow(minutes(rng, 30, 90), 0.5)] };
    case 'rock':
      return {
        phases: [slow(30 * MINUTE, 0.7)],
        textKey: racer.species === 'Steen' ? 'rock_family' : undefined,
      };
    case 'butterfly':
      return { phases: [slow(minutes(rng, 20, 60), 0.4)] };
    case 'puddle': {
      const duck = racer.species === 'Eend';
      const ms = minutes(rng, 30, 60);
      return duck
        ? { phases: [{ start: t, end: t + ms, speed: 1.5 }], textKey: 'puddle_duck' }
        : { phases: [slow(ms, 0.7)] };
    }
    case 'snack':
      return { phases: [{ start: t, end: t + 120 * MINUTE, speed: 1.2 }] };
    case 'strange_noise': {
      const shock = stop(15 * MINUTE);
      return { phases: [shock, then(shock, 60 * MINUTE, 1.3)] };
    }
    case 'nothing':
      return { phases: [] };
  }
}

export interface GenerateInput {
  seed: number;
  course: Course;
  racer: Racer;
  isPlayer: boolean;
  startTime: number;
  endTime: number;
  /** Regen die al vastligt; telt mee voor de positie (voor modder). */
  rain: RaceEvent[];
}

/**
 * Het complete eventschema van één racer. Events overlappen niet: een nieuw
 * event begint pas als het vorige voorbij is.
 */
export function generateRacerEvents(input: GenerateInput): RaceEvent[] {
  const { seed, course, racer, isPlayer, startTime, endTime } = input;
  const rng = createRng(deriveSeed(seed, `events:${racer.id}`));
  const [minPerDay, maxPerDay] = eventsPerDay(isPlayer);
  const days = Math.ceil((endTime - startTime) / DAY);
  const rainPhases = input.rain.flatMap((r) => r.phasesByRacer?.[racer.id] ?? []);
  const muddy = course.segments.findIndex((s) => s.id === 'modderveld');

  const events: RaceEvent[] = [];
  let busyUntil = startTime;

  for (let d = 0; d < days; d++) {
    const dayStart = startTime + d * DAY;
    const count = rng.int(minPerDay, maxPerDay);
    const times = Array.from({ length: count }, () => dayStart + rng.next() * DAY).sort((a, b) => a - b);

    for (let time of times) {
      if (time < busyUntil) time = busyUntil + minutes(rng, 10, 60);
      if (time >= endTime) break;

      // Waar is de racer nu (zonder keuzes en acties)? Voor de kans op modder.
      const here = simulate(
        {
          course,
          racer,
          startTime,
          phases: [...rainPhases, ...events.flatMap((e) => e.phases)],
          jumps: events.filter((e) => e.jumpKm).map((e) => ({ time: e.time, km: e.jumpKm! })),
        },
        time,
      );
      if (here.finishTime !== null) return events;
      const onMud = muddy >= 0 && segmentIndexAt(course, here.km) === muddy;

      const type = rng.weighted(
        (Object.keys(BASE_WEIGHTS) as (keyof typeof BASE_WEIGHTS)[]).map((t) => ({
          item: t,
          weight:
            BASE_WEIGHTS[t] * eventWeightFactor(t, racer.traits) * (t === 'mud' && onMud ? MUD_SEGMENT_BOOST : 1),
        })),
      );
      const built = buildEffect(type, racer, course, time, rng);
      events.push({
        id: `${racer.id}-${events.length}`,
        type,
        racerId: racer.id,
        time,
        phases: built.phases,
        jumpKm: built.jumpKm,
        textKey: built.textKey,
        variant: rng.int(0, 99),
      });
      busyUntil = Math.max(time, ...built.phases.map((p) => p.end));
    }
  }
  return events;
}

/** Regenbuien: weer dat iedereen tegelijk treft. */
export function generateRain(seed: number, racers: Racer[], startTime: number, endTime: number): RaceEvent[] {
  const rng = createRng(deriveSeed(seed, 'weather'));
  const days = Math.ceil((endTime - startTime) / DAY);
  const rain: RaceEvent[] = [];
  for (let d = 0; d < days; d++) {
    if (!rng.chance(RAIN_CHANCE_PER_DAY)) continue;
    const time = startTime + d * DAY + rng.next() * DAY;
    const end = time + minutes(rng, 60, 180);
    if (time >= endTime) continue;
    const phasesByRacer: Record<string, SpeedPhase[]> = {};
    for (const r of racers) phasesByRacer[r.id] = [{ start: time, end, speed: dampen(rainSpeed(r), r.traits.stubborn) }];
    rain.push({
      id: `rain-${rain.length}`,
      type: 'rain',
      racerId: null,
      time,
      phases: [],
      phasesByRacer,
      variant: rng.int(0, 99),
    });
  }
  return rain;
}
