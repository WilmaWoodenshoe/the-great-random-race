import type { Choice } from '../models/Choice';
import type { SpeedPhase } from '../models/Event';
import type { Decision, Race, ScheduledChoice } from '../models/Race';
import type { Racer } from '../models/Racer';
import { DAY, HOUR, MINUTE, localDateKey } from '../utils/dates';
import { createRng, deriveSeed, type Rng } from '../utils/random';

// Keuze-events (briefing hoofdstuk 11): maximaal één per dag, op een
// vooraf berekend moment. De speler heeft 12 uur om te kiezen; anders
// kiest Gerard zelf, passend bij zijn persoonlijkheid.

export const CHOICE_WINDOW = 12 * HOUR;
/** Kans dat er op een dag een keuze-event is. */
export const CHOICE_CHANCE_PER_DAY = 0.7;

/** Wat Gerard zelf kiest: opties die bij zijn eigenschappen passen, wegen zwaarder. */
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
): ScheduledChoice[] {
  if (available.length === 0) return [];
  const rng = createRng(deriveSeed(seed, 'choices'));
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
      id: `keuze-${result.length}`,
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
 * Gerard zelf als de 12 uur om zijn.
 */
export function effectiveDecisions(race: Race, now: number): (Decision & { auto: boolean })[] {
  const result: (Decision & { auto: boolean })[] = [];
  for (const sc of race.choices) {
    const own = race.decisions.find((d) => d.scheduledId === sc.id);
    if (own && own.time <= now) result.push({ ...own, auto: false });
    else if (!own && sc.deadline <= now) {
      result.push({ scheduledId: sc.id, optionId: sc.autoOptionId, time: sc.deadline, auto: true });
    }
  }
  return result;
}

/** Snelheidseffecten van gemaakte keuzes: ze beginnen op het moment van kiezen. */
export function decisionPhases(race: Race, now: number): SpeedPhase[] {
  const phases: SpeedPhase[] = [];
  for (const d of effectiveDecisions(race, now)) {
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

/** Het keuze-event dat nu openstaat, of null. */
export function openChoice(race: Race, now: number): ScheduledChoice | null {
  return (
    race.choices.find(
      (c) => c.time <= now && now < c.deadline && !race.decisions.some((d) => d.scheduledId === c.id),
    ) ?? null
  );
}
