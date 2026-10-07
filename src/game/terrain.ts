import type { Traits } from '../models/Racer';
import { dampen } from './personality';

/** Terrein-modifier voor deze racer; koppige racers hebben minder last van zwaar terrein. */
export function terrainMultiplier(terrain: number, traits: Traits): number {
  return dampen(terrain, traits.stubborn);
}
