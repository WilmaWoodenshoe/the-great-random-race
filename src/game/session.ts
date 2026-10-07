// Races starten en afsluiten, en de uitslagen bijhouden. Puur rekenwerk
// op de opgeslagen gegevens (SaveData); de opslag zelf zit in src/storage.

import { choices as allChoices, getCourse, racers as allRacers } from '../content';
import type { Race } from '../models/Race';
import type { RaceResult, SaveData } from '../models/Save';
import { randomSeed } from '../utils/random';
import { createRace, finalStandings, isFinished } from './engine';

/** Uitslag van de speler in een afgelopen race. */
export function resultOf(race: Race): RaceResult {
  const me = finalStandings(race).find((s) => s.racerId === race.playerId)!;
  return {
    raceId: race.id,
    number: race.number,
    courseId: race.course.id,
    endTime: race.endTime,
    position: me.position,
    km: me.km,
    finishTime: me.finishTime,
  };
}

/** Zet een afgelopen race in de geschiedenis (één keer per race). */
export function archiveIfFinished(save: SaveData, now: number): SaveData {
  const race = save.race;
  if (!race || !isFinished(race, now)) return save;
  if (save.history.some((h) => h.raceId === race.id)) return save;
  return { ...save, history: [...save.history, resultOf(race)] };
}

/** Kan er een nieuwe race beginnen? Alleen als er geen race loopt. */
export function canStartRace(save: SaveData, now: number): boolean {
  return !save.race || isFinished(save.race, now);
}

/** Start een nieuwe race. Een afgelopen race gaat eerst naar de geschiedenis. */
export function startRace(save: SaveData, now: number, seed = randomSeed()): SaveData {
  if (!canStartRace(save, now)) throw new Error('Er loopt al een race');
  const archived = archiveIfFinished(save, now);
  const number = archived.raceCounter + 1;
  const race = createRace({
    now,
    seed,
    number,
    course: getCourse('grote-bosrace'), // v0.1 heeft één route
    racers: allRacers,
    choices: allChoices,
  });
  return { ...archived, race, raceCounter: number };
}

/** Voor het racerprofiel: aantal races, overwinningen en beste positie. */
export function careerStats(save: SaveData, now: number) {
  const history = archiveIfFinished(save, now).history;
  const running = save.race && !isFinished(save.race, now) ? 1 : 0;
  return {
    races: history.length + running,
    wins: history.filter((h) => h.position === 1).length,
    best: history.length ? Math.min(...history.map((h) => h.position)) : null,
  };
}
