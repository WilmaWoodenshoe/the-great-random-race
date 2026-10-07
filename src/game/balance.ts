import { choices, getCourse, racers } from '../content';
import { DAY } from '../utils/dates';
import { createRace, finalStandings } from './engine';

export interface BalanceReport {
  races: number;
  perRacer: Record<
    string,
    {
      wins: number;
      finishes: number;
      avgFinishDay: number | null;
      medianFinishDay: number | null;
      sdFinishDay: number | null;
      avgKm: number;
    }
  >;
}

/**
 * Simuleer veel races (zonder acties van de speler; keuzes maakt Gerard
 * zelf) en tel wie er wint en finisht. Voor de balanstest (hoofdstuk 10).
 */
export function runBalance(count: number, firstSeed = 1): BalanceReport {
  const course = getCourse('grote-bosrace');
  const perRacer: BalanceReport['perRacer'] = {};
  const finishDays: Record<string, number[]> = {};
  const kmSum: Record<string, number> = {};
  for (const r of racers) {
    perRacer[r.id] = { wins: 0, finishes: 0, avgFinishDay: null, medianFinishDay: null, sdFinishDay: null, avgKm: 0 };
    finishDays[r.id] = [];
    kmSum[r.id] = 0;
  }
  const start = Date.UTC(2026, 9, 5, 7, 0);
  for (let i = 0; i < count; i++) {
    const race = createRace({ now: start, seed: firstSeed + i * 7919, number: i + 1, course, racers, choices });
    const standings = finalStandings(race);
    perRacer[standings[0].racerId].wins++;
    for (const s of standings) {
      kmSum[s.racerId] += s.km;
      if (s.finishTime !== null) {
        perRacer[s.racerId].finishes++;
        finishDays[s.racerId].push((s.finishTime - race.startTime) / DAY);
      }
    }
  }
  for (const r of racers) {
    const days = finishDays[r.id].sort((a, b) => a - b);
    perRacer[r.id].avgKm = kmSum[r.id] / count;
    if (days.length) {
      perRacer[r.id].avgFinishDay = days.reduce((a, b) => a + b, 0) / days.length;
      perRacer[r.id].medianFinishDay = days[Math.floor(days.length / 2)];
      const avg = perRacer[r.id].avgFinishDay!;
      perRacer[r.id].sdFinishDay = Math.sqrt(days.reduce((a, d) => a + (d - avg) ** 2, 0) / days.length);
    }
  }
  return { races: count, perRacer };
}
