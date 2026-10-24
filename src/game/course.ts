import type { Course } from '../models/Course';
import { createRng, deriveSeed } from '../utils/random';

export interface SegmentBounds {
  index: number;
  startKm: number;
  endKm: number;
  terrain: number;
}

/** Begin en eind van elk deel van het parcours, in km. */
export function segmentBounds(course: Course): SegmentBounds[] {
  let km = 0;
  return course.segments.map((s, index) => {
    const startKm = km;
    km += s.share * course.lengthKm;
    const isLast = index === course.segments.length - 1;
    return { index, startKm, endKm: isLast ? course.lengthKm : km, terrain: s.terrain };
  });
}

/** In welk deel ligt dit punt? Bij precies de grens telt het volgende deel. */
export function segmentIndexAt(course: Course, km: number): number {
  const bounds = segmentBounds(course);
  for (const b of bounds) {
    if (km < b.endKm) return b.index;
  }
  return bounds.length - 1;
}

/**
 * De route voor een race van `days` dagen. Een langere race heeft een
 * langere route (14 dagen = twee keer zo ver), zodat de racers even snel
 * gaan en je elke dag net zoveel kilometers vooruitkomt.
 */
export function courseForDays(course: Course, days: number): Course {
  if (days === course.days) return course;
  return { ...course, days, lengthKm: Math.round(((course.lengthKm * days) / course.days) * 10) / 10 };
}

/** Heeft deze race het paasei van de route? Vast per race (seed). */
export function hasEasterEgg(race: { seed: number; course: Course }): boolean {
  const egg = race.course.map.easterEgg;
  return !!egg && createRng(deriveSeed(race.seed, 'paasei')).chance(egg.chance);
}

/** De kaartafbeelding van deze race (met paasei als het zo uitkomt). */
export function mapImageOf(race: { seed: number; course: Course }): string {
  return hasEasterEgg(race) ? race.course.map.easterEgg!.image : race.course.map.image;
}

/** De achtergrond bij je racer: die van de route, anders het landschap. */
export function backgroundOf(course: Course | undefined | null): string {
  return course?.background ?? 'backgrounds/bg-landschap.webp';
}
