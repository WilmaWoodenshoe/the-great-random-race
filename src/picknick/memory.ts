// Memory: 6 paren, de speler draait steeds twee kaarten om. De racer kijkt mee.
import type { Traits } from '../models/Racer';
import type { Rng } from '../utils/random';
import { playStyle } from './style';

export const PAIRS = 6;

export interface Card {
  /** Wat erop staat (sleutel van het plaatje). */
  face: string;
  open: boolean;
  found: boolean;
}

/** Een geschud spel van 6 paren, gekozen uit de plaatjes in `pool`. */
export function makeDeck(pool: string[], rng: Rng): Card[] {
  const faces = shuffle(pool.slice(), rng).slice(0, PAIRS);
  return shuffle([...faces, ...faces], rng).map((face) => ({ face, open: false, found: false }));
}

function shuffle<T>(list: T[], rng: Rng): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export type Point =
  | { kind: 'none' }
  | { kind: 'known'; card: number }
  | { kind: 'pretty'; card: number }
  | { kind: 'same'; card: number };

/**
 * Wijst de racer een kaart aan? `seen` = kaarten die al eens open lagen.
 * Lui = geen tip, koppig = steeds dezelfde kaart, nieuwsgierig = een kaart die hij mooi vindt,
 * anders een kaart waarvan het paar al eens te zien was.
 */
export function racerPoint(cards: Card[], seen: Set<number>, previous: number | null, traits: Traits, rng: Rng): Point {
  const style = playStyle(traits);
  const closed = cards.flatMap((c, i) => (c.found || c.open ? [] : [i]));
  if (style.doesNothing || !closed.length || rng.chance(style.nap * 3)) return { kind: 'none' };
  if (previous !== null && closed.includes(previous) && rng.chance(style.stubborn * 0.8)) return { kind: 'same', card: previous };
  if (rng.chance(style.distracted + style.chaos)) return { kind: 'pretty', card: rng.pick(closed) };
  // Een kaart waarvan de tweede ook al eens open lag: die weet hij.
  const known = closed.filter((i) => closed.some((j) => j !== i && cards[j].face === cards[i].face && seen.has(i) && seen.has(j)));
  if (known.length) return { kind: 'known', card: rng.pick(known) };
  return { kind: 'pretty', card: rng.pick(closed) };
}
