// Steen-papier-schaar, best of 3 (wie het eerst 2 rondes wint).
import type { Traits } from '../models/Racer';
import type { Rng } from '../utils/random';
import { playStyle } from './style';

export type Hand = 'steen' | 'papier' | 'schaar';
export const HANDS: Hand[] = ['steen', 'papier', 'schaar'];
export const WINS_NEEDED = 2;

const BEATS: Record<Hand, Hand> = { steen: 'schaar', papier: 'steen', schaar: 'papier' };

/** 'p' als de speler de ronde wint, 'r' als de racer wint, 'tie' bij gelijk. */
export function roundWinner(player: Hand, racer: Hand): 'p' | 'r' | 'tie' {
  if (player === racer) return 'tie';
  return BEATS[player] === racer ? 'p' : 'r';
}

/** Wat kiest de racer? Steve kiest altijd steen; koppig = vaak hetzelfde als vorige keer. */
export function racerHand(traits: Traits, previous: Hand | null, rng: Rng): Hand {
  const style = playStyle(traits);
  if (style.doesNothing) return 'steen';
  if (previous && !rng.chance(style.chaos) && rng.chance(style.stubborn * 0.7)) return previous;
  return rng.pick(HANDS);
}
