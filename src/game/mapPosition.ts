import type { Course, MapPoint } from '../models/Course';
import { segmentBounds } from './course';

const dist = (a: MapPoint, b: MapPoint) => Math.hypot(b.x - a.x, b.y - a.y);

/** Punt op een lijn van punten, op een deel `f` (0–1) van de totale lengte. */
export function pointAlong(path: MapPoint[], f: number): MapPoint {
  if (path.length === 1) return path[0];
  const lengths = path.slice(1).map((p, i) => dist(path[i], p));
  const total = lengths.reduce((a, b) => a + b, 0);
  let left = Math.min(1, Math.max(0, f)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] === 0 ? 0 : Math.min(1, left / lengths[i]);
      return { x: path[i].x + (path[i + 1].x - path[i].x) * t, y: path[i].y + (path[i + 1].y - path[i].y) * t };
    }
    left -= lengths[i];
  }
  return path[path.length - 1];
}

/** Waar op de kaart is een racer die `km` heeft afgelegd? */
export function mapPointAt(course: Course, km: number): MapPoint {
  const bounds = segmentBounds(course);
  const clamped = Math.min(course.lengthKm, Math.max(0, km));
  const b = bounds.find((x) => clamped < x.endKm) ?? bounds[bounds.length - 1];
  const f = (clamped - b.startKm) / (b.endKm - b.startKm);
  return pointAlong(course.segments[b.index].path, f);
}

/**
 * Plekken voor alle racers op de kaart. Staan er twee (bijna) op dezelfde
 * plek, dan schuiven we ze een stukje opzij zodat je ze allebei ziet.
 */
export function placeRacers(
  course: Course,
  racers: { racerId: string; km: number }[],
  minDistance = 100,
): Record<string, MapPoint> {
  const placed: Record<string, MapPoint> = {};
  const taken: MapPoint[] = [];
  // Eerst de plek zelf, dan steeds verder eromheen (in een kring).
  const candidates: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  for (let ring = 1; ring <= 3; ring++) {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      candidates.push({ x: Math.cos(a) * ring * minDistance, y: Math.sin(a) * ring * minDistance * 0.8 });
    }
  }
  const inside = (p: MapPoint) => p.x >= 0 && p.y >= 0 && p.x <= course.map.width && p.y <= course.map.height;

  for (const r of [...racers].sort((a, b) => b.km - a.km)) {
    const base = mapPointAt(course, r.km);
    let point = base;
    for (const c of candidates) {
      const candidate = { x: base.x + c.x, y: base.y + c.y };
      if (inside(candidate) && taken.every((t) => dist(t, candidate) >= minDistance)) {
        point = candidate;
        break;
      }
    }
    placed[r.racerId] = point;
    taken.push(point);
  }
  return placed;
}
