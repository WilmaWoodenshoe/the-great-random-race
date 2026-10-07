import type { EventType } from '../models/Event';
import type { Traits } from '../models/Racer';

// Wat de eigenschappen doen (briefing hoofdstuk 8).

/**
 * Kleine vaste modifier op de snelheid, tussen 0,9 en 1,1. Koppige racers
 * houden iets beter vol; luie en chaotische racers lopen iets minder
 * efficiënt. Persoonlijkheid werkt vooral via welke events er gebeuren.
 */
export function personalityModifier(t: Traits): number {
  const m = 1 + (t.stubborn - t.lazy - t.chaotic) / 1000;
  return Math.min(1.1, Math.max(0.9, m));
}

/**
 * Stubborn dempt negatieve effecten: bij 100 wordt het effect gehalveerd.
 * Een vertraging × 0,6 wordt bij stubborn 100 dus × 0,8.
 */
export function dampen(multiplier: number, stubborn: number): number {
  if (multiplier >= 1 || multiplier <= 0) return multiplier;
  return 1 - (1 - multiplier) * (1 - stubborn / 200);
}

/**
 * Bij volledig stilstaan (× 0) maakt koppigheid de stilstand korter
 * in plaats van minder diep: bij 100 duurt hij half zo lang.
 */
export function dampenStopDuration(ms: number, stubborn: number): number {
  return ms * (1 - stubborn / 200);
}

const CURIOUS_EVENTS: EventType[] = ['flower', 'butterfly', 'worm', 'strange_noise'];
const CHAOTIC_EVENTS: EventType[] = ['shortcut', 'wrong_turn'];
const LAZY_EVENTS: EventType[] = ['nap', 'food'];

/** Hoeveel vaker (of minder vaak) een event voorkomt bij deze racer. */
export function eventWeightFactor(type: EventType, t: Traits): number {
  if (CURIOUS_EVENTS.includes(type)) return 0.2 + (1.6 * t.curious) / 100;
  if (CHAOTIC_EVENTS.includes(type)) return 0.05 + (3 * t.chaotic) / 100;
  if (LAZY_EVENTS.includes(type)) return 0.3 + (1.4 * t.lazy) / 100;
  return 1;
}

/** Chaotic maakt kortere wegen en verkeerde afslagen groter (0,5 tot 2,7 ×). */
export function chaosScale(t: Traits): number {
  return 0.5 + (2.2 * t.chaotic) / 100;
}

/** Lazy maakt dutjes langer (0,7 tot 1,3 ×). */
export function napScale(t: Traits): number {
  return 0.7 + (0.6 * t.lazy) / 100;
}
