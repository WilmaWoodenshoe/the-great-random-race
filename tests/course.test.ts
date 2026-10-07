import { describe, expect, it } from 'vitest';
import { getCourse, getRacer } from '../src/content';
import { segmentBounds, segmentIndexAt } from '../src/game/course';
import { simulate } from '../src/game/movement';
import { baseKmh } from '../src/game/racers';
import { terrainMultiplier } from '../src/game/terrain';
import { DAY, HOUR } from '../src/utils/dates';
import { START } from './helpers';

const course = getCourse('grote-bosrace');
const gerard = getRacer('gerard');

describe('parcours', () => {
  it('de delen sluiten op elkaar aan en eindigen precies bij de finish', () => {
    const b = segmentBounds(course);
    expect(b[0].startKm).toBe(0);
    for (let i = 1; i < b.length; i++) expect(b[i].startKm).toBeCloseTo(b[i - 1].endKm, 9);
    expect(b.at(-1)!.endKm).toBe(course.lengthKm);
  });

  it('vindt het juiste deel bij een afstand', () => {
    expect(course.segments[segmentIndexAt(course, 0)].id).toBe('startweide');
    expect(course.segments[segmentIndexAt(course, course.lengthKm * 0.35)].id).toBe('modderveld');
    expect(course.segments[segmentIndexAt(course, course.lengthKm)].id).toBe('kasteeltuin');
  });
});

describe('beweging', () => {
  const input = { course, racer: gerard, startTime: START, phases: [], jumps: [] };

  it('zonder events: tijd = afstand / (snelheid × terrein), per deel', () => {
    const expectedMs = segmentBounds(course).reduce(
      (sum, b) => sum + ((b.endKm - b.startKm) / (baseKmh(gerard) * terrainMultiplier(b.terrain, gerard.traits))) * HOUR,
      0,
    );
    const m = simulate(input, START + 30 * DAY);
    expect(m.km).toBe(course.lengthKm);
    expect(m.finishTime! - START).toBeCloseTo(expectedMs, -1);
    expect(m.arrivals.map((a) => a.index)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('stilstaan (× 0) houdt de racer echt stil', () => {
    const still = simulate({ ...input, phases: [{ start: START, end: START + 10 * HOUR, speed: 0 }] }, START + 10 * HOUR);
    expect(still.km).toBe(0);
  });

  it('een afstand komt nooit onder nul', () => {
    const m = simulate({ ...input, jumps: [{ time: START + HOUR, km: -50 }] }, START + 2 * HOUR);
    expect(m.km).toBeGreaterThanOrEqual(0);
    expect(m.km).toBeCloseTo(baseKmh(gerard) * 1, 5); // alleen het uur na de sprong
  });

  it('een sprong over de finish is meteen finish', () => {
    const m = simulate({ ...input, jumps: [{ time: START + HOUR, km: 100 }] }, START + 2 * HOUR);
    expect(m.km).toBe(course.lengthKm);
    expect(m.finishTime).toBe(START + HOUR);
  });

  it('de toekomst verandert het verleden niet', () => {
    const later = { start: START + 20 * HOUR, end: START + 30 * HOUR, speed: 0 };
    const a = simulate(input, START + 10 * HOUR);
    const b = simulate({ ...input, phases: [later] }, START + 10 * HOUR);
    expect(b.km).toBe(a.km);
  });
});
