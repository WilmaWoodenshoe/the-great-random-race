// Leest de spelletjes en de opmerkingen van de racers voor het Picknickkleed in.
// Een nieuw bestand in spellen/ of racers/ is genoeg.
import type { PicknickGame, PicknickRacer } from '../../models/Picknick';

export const picknickGames: PicknickGame[] = Object.values(
  import.meta.glob<PicknickGame>('./spellen/*.ts', { eager: true, import: 'default' }),
).sort((a, b) => a.order - b.order);

export const picknickRacers: PicknickRacer[] = Object.values(
  import.meta.glob<PicknickRacer>('./racers/*.ts', { eager: true, import: 'default' }),
);

export const picknickGame = (id: string) => picknickGames.find((g) => g.id === id);
export const picknickRacer = (racerId: string) => picknickRacers.find((r) => r.id === racerId);
