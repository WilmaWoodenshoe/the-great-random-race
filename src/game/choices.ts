import type { Choice } from '../models/Choice';
import type { SpeedPhase } from '../models/Event';
import type { Decision, Race, ScheduledChoice } from '../models/Race';
import type { Racer } from '../models/Racer';
import { DAY, HOUR, MINUTE, localDateKey } from '../utils/dates';
import { createRng, deriveSeed, type Rng } from '../utils/random';

/** Van welke racer is deze keuze, beslissing of actie? Oude races: de speler. */
export const ownerOf = (race: Race, item: { racerId?: string }): string => item.racerId ?? race.playerId;

/** Racers die door mensen bestuurd worden. */
export const humansOf = (race: Race): string[] => race.humans ?? [race.playerId];

// Keuze-events (briefing hoofdstuk 11): maximaal één per dag, op een
// vooraf berekend moment. De speler heeft 12 uur om te kiezen; anders
// kiest de racer zelf, passend bij zijn persoonlijkheid.

export const CHOICE_WINDOW = 12 * HOUR;
/** Kans dat er op een dag een keuze-event is. */
export const CHOICE_CHANCE_PER_DAY = 0.7;

/** Wat de racer zelf kiest: opties die bij zijn eigenschappen passen, wegen zwaarder. */
export function autoChoose(choice: Choice, racer: Racer, rng: Rng): string {
  return rng.weighted(
    choice.options.map((o) => ({
      item: o.id,
      weight: 1 + (o.prefers ?? []).reduce((sum, trait) => sum + racer.traits[trait] / 40, 0),
    })),
  );
}

export function scheduleChoices(
  seed: number,
  available: Choice[],
  player: Racer,
  startTime: number,
  endTime: number,
  racerIds: string[] = [],
  label = 'choices',
  idPrefix = 'keuze',
): ScheduledChoice[] {
  // Een event over een andere racer alleen als die meedoet en niet de speler is.
  available = available.filter((c) => !c.aboutRacer || (c.aboutRacer !== player.id && racerIds.includes(c.aboutRacer)));
  if (available.length === 0) return [];
  const rng = createRng(deriveSeed(seed, label));
  // Elke keuze eerst één keer, in willekeurige volgorde.
  const deck = [...available];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const days = Math.ceil((endTime - startTime) / DAY);
  const result: ScheduledChoice[] = [];

  for (let d = 0; d < days; d++) {
    if (!rng.chance(CHOICE_CHANCE_PER_DAY)) continue;
    const time = startTime + d * DAY + rng.range(1 * HOUR, 23 * HOUR);
    const last = result[result.length - 1];
    if (time + CHOICE_WINDOW > endTime) continue;
    // Niet twee keuzes op dezelfde kalenderdag, en nooit twee tegelijk open.
    if (last && (localDateKey(last.time) === localDateKey(time) || time < last.deadline)) continue;

    const choice = deck[result.length % deck.length];
    result.push({
      id: `${idPrefix}-${result.length}`,
      racerId: player.id,
      choice: structuredClone(choice),
      time: Math.round(time / MINUTE) * MINUTE,
      deadline: Math.round(time / MINUTE) * MINUTE + CHOICE_WINDOW,
      autoOptionId: autoChoose(choice, player, rng),
      variant: rng.int(0, 99),
    });
  }
  return result;
}

/**
 * De keuzes die op moment `now` gemaakt zijn: door de speler, of door
 * de racer zelf als de 12 uur om zijn.
 */
export function effectiveDecisions(race: Race, now: number, racerId?: string): (Decision & { auto: boolean })[] {
  const result: (Decision & { auto: boolean })[] = [];
  for (const sc of race.choices) {
    const owner = ownerOf(race, sc);
    if (racerId && owner !== racerId) continue;
    const own = race.decisions.find((d) => d.scheduledId === sc.id);
    if (own && own.time <= now) result.push({ ...own, racerId: owner, auto: false });
    else if (!own && sc.deadline <= now) {
      result.push({ racerId: owner, scheduledId: sc.id, optionId: sc.autoOptionId, time: sc.deadline, auto: true });
    }
  }
  return result;
}

/** Snelheidseffecten van gemaakte keuzes: ze beginnen op het moment van kiezen. */
export function decisionPhases(race: Race, now: number, racerId: string = race.playerId): SpeedPhase[] {
  const phases: SpeedPhase[] = [];
  for (const d of effectiveDecisions(race, now, racerId)) {
    const sc = race.choices.find((c) => c.id === d.scheduledId)!;
    const option = sc.choice.options.find((o) => o.id === d.optionId);
    let t = d.time;
    for (const e of option?.effects ?? []) {
      phases.push({ start: t, end: t + e.minutes * MINUTE, speed: e.speed });
      t += e.minutes * MINUTE;
    }
  }
  return phases;
}

/** Het keuze-event dat nu openstaat voor deze racer (standaard die van de speler), of null. */
export function openChoice(race: Race, now: number, racerId: string = race.playerId): ScheduledChoice | null {
  return (
    race.choices.find(
      (c) =>
        ownerOf(race, c) === racerId &&
        c.time <= now &&
        now < c.deadline &&
        !race.decisions.some((d) => d.scheduledId === c.id),
    ) ?? null
  );
}
