// Boter-kaas-en-eieren: de speler ('p') tegen een racer ('r').
import type { Traits } from '../models/Racer';
import type { Rng } from '../utils/random';
import { playStyle } from './style';

export type Mark = 'p' | 'r';
export type Board = (Mark | null)[];
export type Outcome = Mark | 'draw' | null;

export const emptyBoard = (): Board => Array(9).fill(null);

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

/** De drie vakjes op een rij als iemand gewonnen heeft. */
export function winningLine(board: Board): number[] | null {
  return LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) ?? null;
}

export function outcome(board: Board): Outcome {
  const line = winningLine(board);
  if (line) return board[line[0]];
  return board.every(Boolean) ? 'draw' : null;
}

export const freeCells = (board: Board) => board.flatMap((c, i) => (c ? [] : [i]));

const other = (m: Mark): Mark => (m === 'p' ? 'r' : 'p');

// Uitkomsten onthouden: er zijn maar een paar duizend standen.
const memo = new Map<string, number>();

/** Minimax: +1 als `me` wint, -1 als de ander wint, 0 gelijk. Wie aan de beurt is: `turn`. */
function score(board: Board, me: Mark, turn: Mark): number {
  const key = board.map((c) => c ?? '.').join('') + me + turn;
  const known = memo.get(key);
  if (known !== undefined) return known;
  const value = rawScore(board, me, turn);
  memo.set(key, value);
  return value;
}

function rawScore(board: Board, me: Mark, turn: Mark): number {
  const o = outcome(board);
  if (o === me) return 1;
  if (o === other(me)) return -1;
  if (o === 'draw') return 0;
  const results = freeCells(board).map((i) => {
    const next = board.slice();
    next[i] = turn;
    return score(next, me, other(turn));
  });
  return turn === me ? Math.max(...results) : Math.min(...results);
}

/** Alle beste zetten voor `me` (die nu aan de beurt is). */
export function bestMoves(board: Board, me: Mark): number[] {
  const scored = freeCells(board).map((i) => {
    const next = board.slice();
    next[i] = me;
    return { i, s: score(next, me, other(me)) };
  });
  const top = Math.max(...scored.map((x) => x.s));
  return scored.filter((x) => x.s === top).map((x) => x.i);
}

export type RacerTurn =
  | { kind: 'move'; cell: number; reason: 'best' | 'distracted' | 'chaos' | 'opening' }
  | { kind: 'nap' }
  | { kind: 'pass' };

/** Koppige racers beginnen altijd linksboven. */
export const OPENING_CELL = 0;

/** Wat doet de racer deze beurt? */
export function racerTurn(board: Board, traits: Traits, rng: Rng): RacerTurn {
  const style = playStyle(traits);
  if (style.doesNothing) return { kind: 'pass' };
  const free = freeCells(board);
  // Eerste zet van het potje (racer begint): koppig = altijd hetzelfde vakje.
  if (free.length === 9 && rng.chance(style.stubborn)) return { kind: 'move', cell: OPENING_CELL, reason: 'opening' };
  // Een dutje kan alleen als de speler daarna nog iets te doen heeft.
  if (free.length > 1 && rng.chance(style.nap)) return { kind: 'nap' };
  if (rng.chance(style.distracted)) return { kind: 'move', cell: rng.pick(free), reason: 'distracted' };
  if (rng.chance(style.chaos)) return { kind: 'move', cell: rng.pick(free), reason: 'chaos' };
  return { kind: 'move', cell: rng.pick(bestMoves(board, 'r')), reason: 'best' };
}
