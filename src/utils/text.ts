// Teksten met invulplekken, bijv. "{naam} kijkt naar een bloem. {Hij} kijkt nog steeds."
// Zo werken dezelfde teksten voor elke racer, ook voor wie 'zij' is.

import type { Racer } from '../models/Racer';

/** De woorden voor een racer: naam en voornaamwoorden. */
export type Who = {
  naam: string;
  hij: string;
  zijn: string;
  hem: string;
};

export function who(racer: Pick<Racer, 'name' | 'pronoun'>): Who {
  return racer.pronoun === 'zij'
    ? { naam: racer.name, hij: 'zij', zijn: 'haar', hem: 'haar' }
    : { naam: racer.name, hij: 'hij', zijn: 'zijn', hem: 'hem' };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Vul {naam}, {hij}, {zijn}, {hem} (en andere waarden) in. Met een
 * hoofdletter ({Hij}, {Zijn}) komt de waarde ook met een hoofdletter.
 */
export function fill(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{([A-Za-z]+)\}/g, (match, key: string) => {
    const lower = key.charAt(0).toLowerCase() + key.slice(1);
    const value = values[key] ?? values[lower];
    if (value === undefined) return match;
    return key === lower ? value : capitalize(value);
  });
}
