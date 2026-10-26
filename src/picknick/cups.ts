// Bekertje-schuiven: Steve ligt onder een van de drie bekertjes, de racer schuift.
import type { Traits } from '../models/Racer';
import type { Rng } from '../utils/random';
import { playStyle } from './style';

export type Swap = [number, number];

export interface Shuffle {
  swaps: Swap[];
  /** Tijd per wissel in milliseconden. */
  stepMs: number;
}

const PAIRS: Swap[] = [[0, 1], [1, 2], [0, 2]];

/** Hoe schuift deze racer? Lui = weinig, chaotisch = veel en snel, koppig = steeds dezelfde wissel. Steve schuift niet. */
export function planShuffle(traits: Traits, rng: Rng): Shuffle {
  const style = playStyle(traits);
  if (style.doesNothing) return { swaps: [], stepMs: 0 };
  const count = Math.max(2, Math.round(4 + traits.chaotic / 20 - traits.lazy / 30 + rng.int(0, 2)));
  const stepMs = Math.round(620 - traits.chaotic * 2.6);
  const favorite = rng.pick(PAIRS);
  const swaps = Array.from({ length: count }, () => (rng.chance(style.stubborn * 0.75) ? favorite : rng.pick(PAIRS)));
  return { swaps, stepMs };
}

/** Waar staat elk bekertje (index = bekertje, waarde = plek 0–2) na de wissels? Wissels gaan over plekken. */
export function positionsAfter(swaps: Swap[], steps = swaps.length): number[] {
  const pos = [0, 1, 2];
  for (const [a, b] of swaps.slice(0, steps)) {
    const ca = pos.indexOf(a);
    const cb = pos.indexOf(b);
    pos[ca] = b;
    pos[cb] = a;
  }
  return pos;
}
