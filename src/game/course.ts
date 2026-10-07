import type { Course } from '../models/Course';

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
