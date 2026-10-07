import { choices, getCourse, racers } from '../src/content';
import { createRace } from '../src/game/engine';

/** Woensdag 7 oktober 2026, 09:00 in Nederland. */
export const START = Date.UTC(2026, 9, 7, 7, 0);

export function makeRace(seed = 42, now = START) {
  return createRace({ now, seed, number: 1, course: getCourse('grote-bosrace'), racers, choices });
}
