// Leest automatisch alle inhoud in uit de mappen hiernaast.
// Een nieuw bestand in racers/, accessories/, courses/ of choices/ is
// genoeg; hier hoeft niets aangepast te worden.
import type { Accessory } from '../models/Accessory';
import type { Choice } from '../models/Choice';
import type { Course } from '../models/Course';
import type { Racer } from '../models/Racer';

function collect<T extends { id: string }>(modules: Record<string, T>): T[] {
  return Object.values(modules).sort((a, b) => a.id.localeCompare(b.id));
}

export const racers: Racer[] = collect(
  import.meta.glob<Racer>('./racers/*.ts', { eager: true, import: 'default' }),
);
export const accessories: Accessory[] = collect(
  import.meta.glob<Accessory>('./accessories/*.ts', { eager: true, import: 'default' }),
);
export const courses: Course[] = collect(
  import.meta.glob<Course>('./courses/*.ts', { eager: true, import: 'default' }),
);
export const choices: Choice[] = collect(
  import.meta.glob<Choice>('./choices/*.ts', { eager: true, import: 'default' }),
);

function byId<T extends { id: string }>(list: T[], id: string, kind: string): T {
  const item = list.find((x) => x.id === id);
  if (!item) throw new Error(`Onbekende ${kind}: ${id}`);
  return item;
}

export const getRacer = (id: string) => byId(racers, id, 'racer');
export const getCourse = (id: string) => byId(courses, id, 'route');
export const getChoice = (id: string) => byId(choices, id, 'keuze-event');

/** De racer van de speler (in v0.1: Gerard). */
export const playerRacer: Racer = racers.find((r) => r.playable) ?? getRacer('gerard');
