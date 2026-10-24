import { describe, expect, it } from 'vitest';
import { choices, getCourse, racers } from '../src/content';
import { createRace } from '../src/game/engine';
import { hasEasterEgg, mapImageOf } from '../src/game/course';
import { journalAt } from '../src/game/journal';
import { DAY } from '../src/utils/dates';
import { START } from './helpers';

const race = (seed: number, courseId = 'strandrace') =>
  createRace({ now: START, seed, number: 1, course: getCourse(courseId), racers: racers.slice(0, 6), choices, playerId: racers[0].id });

describe('paasei op de Strandrace (#84)', () => {
  it('komt in ongeveer 1 op de 4 races voor, vast per race', () => {
    const hits = Array.from({ length: 400 }, (_, i) => hasEasterEgg(race(i))).filter(Boolean).length;
    expect(hits / 400).toBeGreaterThan(0.15);
    expect(hits / 400).toBeLessThan(0.35);
    expect(hasEasterEgg(race(7))).toBe(hasEasterEgg(race(7)));
  });

  it('met paasei: andere kaart en één journaalregel', () => {
    const seed = Array.from({ length: 100 }, (_, i) => i).find((i) => hasEasterEgg(race(i)))!;
    const r = race(seed);
    expect(mapImageOf(r)).toContain('84');
    const egg = journalAt(r, START + 7 * DAY).filter((e) => e.id === 'paasei');
    expect(egg).toHaveLength(1);
    expect(egg[0].text).toContain('84');
  });

  it('andere routes hebben geen paasei', () => {
    for (let i = 0; i < 20; i++) expect(hasEasterEgg(race(i, 'grote-bosrace'))).toBe(false);
  });
});
