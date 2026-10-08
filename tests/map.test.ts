import { describe, expect, it } from 'vitest';
import { courses, getCourse } from '../src/content';
import { mapPointAt, placeRacers, pointAlong } from '../src/game/mapPosition';

const course = getCourse('grote-bosrace');

describe('pad op de kaart', () => {
  it('de delen sluiten op elkaar aan en blijven binnen de kaart', () => {
    for (const c of courses) {
      for (let i = 0; i < c.segments.length; i++) {
        const path = c.segments[i].path;
        expect(path.length).toBeGreaterThanOrEqual(2);
        for (const p of path) {
          expect(p.x).toBeGreaterThanOrEqual(0);
          expect(p.x).toBeLessThanOrEqual(c.map.width);
          expect(p.y).toBeGreaterThanOrEqual(0);
          expect(p.y).toBeLessThanOrEqual(c.map.height);
        }
        if (i > 0) expect(path[0]).toEqual(c.segments[i - 1].path.at(-1));
      }
    }
  });

  it('start en finish liggen aan het begin en eind van het pad', () => {
    expect(mapPointAt(course, 0)).toEqual(course.segments[0].path[0]);
    expect(mapPointAt(course, course.lengthKm)).toEqual(course.segments.at(-1)!.path.at(-1));
    expect(mapPointAt(course, -5)).toEqual(mapPointAt(course, 0));
  });

  it('halverwege een rechte lijn is precies in het midden', () => {
    expect(pointAlong([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }], 0.5)).toEqual({ x: 10, y: 0 });
    expect(pointAlong([{ x: 0, y: 0 }, { x: 10, y: 0 }], 0.25)).toEqual({ x: 2.5, y: 0 });
  });

  it('racers op dezelfde plek worden uit elkaar gezet', () => {
    const placed = placeRacers(course, [
      { racerId: 'a', km: 0 },
      { racerId: 'b', km: 0 },
      { racerId: 'c', km: 0 },
      { racerId: 'd', km: 0 },
      { racerId: 'e', km: 0 },
    ]);
    const pts = Object.values(placed);
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        expect(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)).toBeGreaterThanOrEqual(100);
  });
});
