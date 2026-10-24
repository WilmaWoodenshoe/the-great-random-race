import type { Racer } from '../models/Racer';
import { personalityModifier } from './personality';

/**
 * Snelheid van een racer met snelheid 1,00 (Gerard), in km per uur, zonder
 * events en terrein. Afgestemd met de balanstest (tests/balance.test.ts).
 */
export const BASE_KMH = 0.318;

/**
 * Alles is afgesteld op een race van 7 dagen. Een langere race heeft een
 * langere route (zie courseForDays) en meer events; elke sprong (kortere
 * weg, verkeerde afslag) telt dan naar verhouding minder zwaar.
 */
export const REFERENCE_DAYS = 7;

export function daysScale(days: number): number {
  return days > 0 ? REFERENCE_DAYS / days : 1;
}

/** Basissnelheid van deze racer in km per uur, inclusief persoonlijkheid. */
export function baseKmh(racer: Racer): number {
  return BASE_KMH * racer.speed * personalityModifier(racer.traits);
}

/** Racers worden altijd als kopie in een race opgeslagen. */
export function snapshotRacer(racer: Racer): Racer {
  return structuredClone(racer);
}
