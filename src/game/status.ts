import { nl } from '../content/nl';
import type { Race } from '../models/Race';
import { openChoice } from './choices';
import { racerMovement } from './engine';

/** Wat doet een racer nu? Geeft een sleutel uit nl.engine.status. */
export function activityAt(race: Race, racerId: string, now: number): string {
  if (now >= race.endTime) return 'raceOver';
  if (racerMovement(race, racerId, now).finishTime !== null) return 'finished';
  if (racerId === race.playerId && openChoice(race, now)) return 'choice';

  let current: string | null = null;
  let since = -Infinity;
  for (const e of race.events) {
    const phases = e.racerId === racerId ? e.phases : e.racerId === null ? (e.phasesByRacer?.[racerId] ?? []) : [];
    for (const p of phases) {
      // Het meest recente event dat nu loopt, telt.
      if (p.start <= now && now < p.end && e.time > since) {
        current = e.type;
        since = e.time;
      }
    }
  }
  return current ?? 'racing';
}

/** De tekst achter "Gerard is momenteel…". */
export function statusText(race: Race, racerId: string, now: number): string {
  const key = activityAt(race, racerId, now);
  return nl.engine.status[key] ?? nl.engine.status.racing;
}
