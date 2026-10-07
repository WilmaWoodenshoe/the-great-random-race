import type { SpeedPhase } from '../models/Event';
import type { ActionId, Race } from '../models/Race';
import { HOUR } from '../utils/dates';

// Dagelijkse actie (briefing hoofdstuk 12). Acties veranderen het vooraf
// berekende eventschema niet; ze werken alleen als extra modifier.

export const ACTION_EFFECTS: Record<ActionId, { speed: number; hours: number } | null> = {
  voeren: { speed: 1.05, hours: 12 },
  aanmoedigen: { speed: 1.03, hours: 24 },
  hoed: null,
  niets: null,
};

export const ACTION_IDS = Object.keys(ACTION_EFFECTS) as ActionId[];

export function actionPhases(race: Race, now: number): SpeedPhase[] {
  return race.actions
    .filter((a) => a.time <= now)
    .flatMap((a) => {
      const e = ACTION_EFFECTS[a.actionId];
      return e ? [{ start: a.time, end: a.time + e.hours * HOUR, speed: e.speed }] : [];
    });
}

/** Draagt Gerard op dit moment een hoed? (rest van de race) */
export function hasHat(race: Race, now: number): boolean {
  return race.actions.some((a) => a.actionId === 'hoed' && a.time <= now);
}
