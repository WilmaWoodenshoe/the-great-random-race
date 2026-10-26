// Mini-sudoku van 4 × 4 met vier plaatjes (0–3). Elk plaatje één keer per rij,
// kolom en blok van 2 × 2. Altijd precies één oplossing.
import type { Rng } from '../utils/random';

export type Grid = (number | null)[];
export type Level = 'makkelijk' | 'gemiddeld' | 'lastig';
export const CLUES: Record<Level, number> = { makkelijk: 8, gemiddeld: 6, lastig: 5 };

const row = (i: number) => Math.floor(i / 4);
const col = (i: number) => i % 4;
const box = (i: number) => Math.floor(row(i) / 2) * 2 + Math.floor(col(i) / 2);

/** Mag `v` op vakje `i`? */
export function fits(grid: Grid, i: number, v: number): boolean {
  return grid.every((x, j) => j === i || x !== v || (row(j) !== row(i) && col(j) !== col(i) && box(j) !== box(i)));
}

/** Aantal oplossingen (stopt bij `limit`). */
export function countSolutions(grid: Grid, limit = 2): number {
  const i = grid.indexOf(null);
  if (i < 0) return 1;
  let n = 0;
  for (let v = 0; v < 4 && n < limit; v++) {
    if (fits(grid, i, v)) {
      const next = grid.slice();
      next[i] = v;
      n += countSolutions(next, limit - n);
    }
  }
  return n;
}

function solveRandom(grid: Grid, rng: Rng): Grid | null {
  const i = grid.indexOf(null);
  if (i < 0) return grid;
  const values = [0, 1, 2, 3].sort(() => rng.next() - 0.5);
  for (const v of values) {
    if (fits(grid, i, v)) {
      const next = grid.slice();
      next[i] = v;
      const done = solveRandom(next, rng);
      if (done) return done;
    }
  }
  return null;
}

export interface Puzzle {
  start: Grid;
  solution: number[];
}

/** Een nieuwe puzzel met precies één oplossing. */
export function makePuzzle(level: Level, rng: Rng): Puzzle {
  const want = CLUES[level];
  for (;;) {
    const solution = solveRandom(Array(16).fill(null), rng) as number[];
    let start: Grid = solution.slice();
    // Vakjes leeghalen zolang er één oplossing blijft.
    const order = Array.from({ length: 16 }, (_, i) => i).sort(() => rng.next() - 0.5);
    for (const i of order) {
      if (start.filter((x) => x !== null).length <= want) break;
      const next = start.slice();
      next[i] = null;
      if (countSolutions(next) === 1) start = next;
    }
    if (start.filter((x) => x !== null).length === want) return { start, solution };
  }
}

/** Vakjes die (al ingevuld) niet kloppen met de oplossing. */
export function mistakes(grid: Grid, solution: number[]): number[] {
  return grid.flatMap((v, i) => (v !== null && v !== solution[i] ? [i] : []));
}

export const solved = (grid: Grid, solution: number[]) => grid.every((v, i) => v === solution[i]);

export interface Tip {
  cell: number;
  value: number;
  right: boolean;
}

/**
 * Een tip van de racer: een leeg (of fout) vakje en een plaatje. Hoe nieuwsgieriger
 * of chaotischer, hoe vaker de tip niet klopt. `alwaysRight`: Roger, de harde werker.
 */
export function sudokuTip(grid: Grid, solution: number[], traits: { curious: number; chaotic: number }, rng: Rng, alwaysRight = false): Tip | null {
  const open = grid.flatMap((v, i) => (v === solution[i] ? [] : [i]));
  if (!open.length) return null;
  const cell = rng.pick(open);
  const wrongChance = alwaysRight ? 0 : ((traits.curious + traits.chaotic) / 200) * 0.7;
  if (rng.chance(wrongChance)) {
    const value = rng.pick([0, 1, 2, 3].filter((v) => v !== solution[cell]));
    return { cell, value, right: false };
  }
  return { cell, value: solution[cell], right: true };
}
