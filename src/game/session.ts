// Races starten en afsluiten, en de uitslagen bijhouden. Puur rekenwerk
// op de opgeslagen gegevens (SaveData); de opslag zelf zit in src/storage.

import { choices as allChoices, getCourse, racers as allRacers } from '../content';
import type { Race } from '../models/Race';
import type { RaceResult, SaveData } from '../models/Save';
import type { Racer } from '../models/Racer';
import { createRng, deriveSeed, randomSeed } from '../utils/random';
import { createRace, finalStandings, isFinished } from './engine';

/** Uitslag van de speler in een afgelopen race. */
export function resultOf(race: Race): RaceResult {
  const me = finalStandings(race).find((s) => s.racerId === race.playerId)!;
  return {
    raceId: race.id,
    racerId: race.playerId,
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

/** Aantal racers in een race: de speler plus vijf tegenstanders. */
export const RACERS_PER_RACE = 6;

/** De racer van de speler plus willekeurige tegenstanders, vast per seed. */
export function pickLineup(playerId: string, seed: number, pool: Racer[] = allRacers): Racer[] {
  const player = pool.find((r) => r.id === playerId);
  if (!player) throw new Error(`Onbekende racer: ${playerId}`);
  const others = pool.filter((r) => r.id !== playerId);
  const rng = createRng(deriveSeed(seed, 'tegenstanders'));
  for (let i = others.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [player, ...others.slice(0, RACERS_PER_RACE - 1)];
}

/** De racer die als eerste geselecteerd staat: die van de vorige race, anders de standaard. */
export function defaultRacerId(save: SaveData): string {
  const last = save.race?.playerId;
  if (last && allRacers.some((r) => r.id === last)) return last;
  return (allRacers.find((r) => r.playable) ?? allRacers[0]).id;
}

/** Start een nieuwe race. Een afgelopen race gaat eerst naar de geschiedenis. */
export function startRace(save: SaveData, now: number, racerId = defaultRacerId(save), seed = randomSeed()): SaveData {
  if (!canStartRace(save, now)) throw new Error('Er loopt al een race');
  const archived = archiveIfFinished(save, now);
  const number = archived.raceCounter + 1;
  const race = createRace({
    now,
    seed,
    number,
    course: getCourse('grote-bosrace'), // er is nog één route
    racers: pickLineup(racerId, seed),
    choices: allChoices,
    playerId: racerId,
  });
  return { ...archived, race, raceCounter: number };
}

/**
 * Voor het racerprofiel: aantal races, overwinningen en beste positie.
 * Met `racerId` alleen de races waarin je met die racer speelde.
 */
export function careerStats(save: SaveData, now: number, racerId?: string) {
  const all = archiveIfFinished(save, now).history;
  // Uitslagen van vóór 'Kies je racer' waren altijd met Gerard.
  const history = racerId ? all.filter((h) => (h.racerId ?? 'gerard') === racerId) : all;
  const running = save.race && !isFinished(save.race, now) && (!racerId || save.race.playerId === racerId) ? 1 : 0;
  return {
    races: history.length + running,
    wins: history.filter((h) => h.position === 1).length,
    best: history.length ? Math.min(...history.map((h) => h.position)) : null,
  };
}
