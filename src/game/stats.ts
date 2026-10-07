import { nl } from '../content/nl';
import type { Race } from '../models/Race';
import { formatDuration } from '../utils/dates';
import { createRng, deriveSeed } from '../utils/random';
import { finalStandings, racerMovement } from './engine';

export interface FinishStat {
  label: string;
  value: string;
}

const s = nl.engine.stats;

/** Statistieken die niemand vroeg, voor het finishscherm (hoofdstuk 14). */
export function finishStats(race: Race): FinishStat[] {
  const stats: FinishStat[] = [];
  const name = (id: string) => race.racers.find((r) => r.id === id)?.name ?? id;

  // Telt alleen events tot de finish (of het einde) van die racer.
  const until = (id: string) => racerMovement(race, id, race.endTime).finishTime ?? race.endTime;
  const eventsOf = (id: string, type: string) =>
    race.events.filter((e) => e.racerId === id && e.type === type && e.time < until(id));
  const totalMs = (id: string, type: string) =>
    eventsOf(id, type).reduce((sum, e) => sum + e.phases.reduce((a, p) => a + (p.end - p.start), 0), 0);

  // 1. Hoe lang de speler naar bloemen keek.
  const flower = totalMs(race.playerId, 'flower');
  if (flower > 0) stats.push({ label: s.flowerTime(name(race.playerId)), value: formatDuration(flower) });

  // 2. Wie het meest verloor aan 'kortere wegen'.
  const losses = race.racers
    .map((r) => ({ id: r.id, km: -eventsOf(r.id, 'wrong_turn').reduce((sum, e) => sum + (e.jumpKm ?? 0), 0) }))
    .sort((a, b) => b.km - a.km);
  if (losses[0] && losses[0].km > 0) {
    stats.push({ label: s.wrongTurnLoss(name(losses[0].id)), value: s.meters(Math.round(losses[0].km * 1000)) });
  }

  // 3. Wie het langst sliep (niet de speler; die heeft al een regel).
  const sleepers = race.racers
    .filter((r) => r.id !== race.playerId)
    .map((r) => ({ id: r.id, ms: totalMs(r.id, 'nap') }))
    .sort((a, b) => b.ms - a.ms);
  if (sleepers[0] && sleepers[0].ms > 0) {
    stats.push({ label: s.napTime(name(sleepers[0].id)), value: formatDuration(sleepers[0].ms) });
  }

  // 4. Hoe vaak de laatste racer voor decor werd aangezien.
  const last = finalStandings(race).at(-1);
  if (last && last.racerId !== race.playerId) {
    const quiet = eventsOf(last.racerId, 'nothing').length + eventsOf(last.racerId, 'rock').length;
    const times = quiet * 2 + createRng(deriveSeed(race.seed, 'decor')).int(3, 12);
    stats.push({ label: s.decor(name(last.racerId)), value: s.times(times) });
  }

  return stats;
}
