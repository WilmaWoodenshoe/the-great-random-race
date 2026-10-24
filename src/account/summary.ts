import { finalStandings, isFinished, standingsAt } from '../game/engine';
import type { SaveData } from '../models/Save';
import type { Summary } from './api';

/** Wat iedereen mag zien: met welke racer je speelt en hoe het gaat. */
export function summaryOf(save: SaveData, now: number): Summary | null {
  const race = save.race;
  if (!race) return null;
  const finished = isFinished(race, now);
  const standings = finished ? finalStandings(race) : standingsAt(race, now);
  const me = standings.find((s) => s.racerId === race.playerId);
  if (!me) return null;
  return {
    racerId: race.playerId,
    raceNumber: race.number,
    position: me.position,
    racersCount: race.racers.length,
    km: Math.round(me.km * 10) / 10,
    finished,
  };
}
