import type { Racer } from '../models/Racer';
import { personalityModifier } from './personality';

/**
 * Snelheid van een racer met snelheid 1,00 (Gerard), in km per uur, zonder
 * events en terrein. Afgestemd met de balanstest (tests/balance.test.ts).
 */
export const BASE_KMH = 0.318;

/** Basissnelheid van deze racer in km per uur, inclusief persoonlijkheid. */
export function baseKmh(racer: Racer): number {
  return BASE_KMH * racer.speed * personalityModifier(racer.traits);
}

/** Racers worden altijd als kopie in een race opgeslagen. */
export function snapshotRacer(racer: Racer): Racer {
  return structuredClone(racer);
}
