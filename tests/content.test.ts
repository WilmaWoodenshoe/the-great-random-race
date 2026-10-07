import { describe, expect, it } from 'vitest';
import { accessories, choices, courses, playerRacer, racers } from '../src/content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const imageExists = (path: string) => existsSync(resolve(process.cwd(), 'public/images', path));

describe('racers', () => {
  it('v0.1 heeft precies 5 racers, met Gerard als speler', () => {
    expect(racers).toHaveLength(5);
    expect(playerRacer.id).toBe('gerard');
    expect(racers.filter((r) => r.playable)).toHaveLength(1);
  });

  it('elke racer heeft geldige eigenschappen en een bestaande afbeelding', () => {
    for (const r of racers) {
      expect(r.speed).toBeGreaterThan(0);
      for (const v of Object.values(r.traits)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      expect(imageExists(r.image), r.image).toBe(true);
    }
  });

  it('ids zijn uniek', () => {
    for (const list of [racers, accessories, courses, choices]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('routes', () => {
  it('de delen van elke route tellen op tot 100%', () => {
    for (const c of courses) {
      const total = c.segments.reduce((sum, s) => sum + s.share, 0);
      expect(total).toBeCloseTo(1, 6);
      expect(imageExists(c.map.image)).toBe(true);
    }
  });

  it('bordjes staan binnen de kaart', () => {
    for (const c of courses) {
      for (const s of c.segments) {
        expect(s.sign.x).toBeGreaterThanOrEqual(0);
        expect(s.sign.x).toBeLessThanOrEqual(c.map.width);
        expect(s.sign.y).toBeGreaterThanOrEqual(0);
        expect(s.sign.y).toBeLessThanOrEqual(c.map.height);
      }
    }
  });
});

describe('keuze-events', () => {
  it('hebben 2 of 3 opties met elk minstens 4 journaalteksten', () => {
    expect(choices.length).toBeGreaterThan(0);
    for (const ch of choices) {
      expect(ch.options.length).toBeGreaterThanOrEqual(2);
      expect(ch.options.length).toBeLessThanOrEqual(3);
      expect(imageExists(ch.image)).toBe(true);
      for (const o of ch.options) expect(o.journal.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('accessoires', () => {
  it('hebben een bestaande afbeelding', () => {
    for (const a of accessories) expect(imageExists(a.image), a.image).toBe(true);
  });
});
