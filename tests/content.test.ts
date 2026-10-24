import { describe, expect, it } from 'vitest';
import { accessories, choices, courses, defaultRacer, getRacer, racers } from '../src/content';
import { nl } from '../src/content/nl';
import { fill, who } from '../src/utils/text';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const imageExists = (path: string) => existsSync(resolve(process.cwd(), 'public/images', path));

describe('racers', () => {
  it('er zijn 10 racers, met Gerard als standaardkeuze', () => {
    expect(racers).toHaveLength(10);
    expect(defaultRacer.id).toBe('gerard');
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
      expect(r.tagline, r.id).toBeTruthy();
      // Elke racer kan een hoed krijgen (dagelijkse actie).
      expect(r.hatSpot, r.id).toBeDefined();
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

describe('teksten met invulplekken', () => {
  // Alle teksten waarin de racer van de speler voorkomt.
  const templates: string[] = [
    ...Object.values(nl.engine.events).flat(),
    ...nl.engine.start,
    ...nl.engine.end,
    ...nl.engine.segment,
    ...nl.engine.finish,
    ...Object.values(nl.engine.actions).flat(),
    ...Object.values(nl.engine.status),
    ...choices.flatMap((c) => [c.heading, c.title, c.text, c.announce, c.imageAlt, ...c.options.flatMap((o) => [o.label, ...o.journal])]),
  ];

  it('noemen Gerard nergens vast bij naam', () => {
    for (const s of templates) expect(s, s).not.toMatch(/Gerard/);
  });

  it('worden volledig ingevuld, ook voor een racer die zij is', () => {
    const isabelle = getRacer('isabelle');
    expect(isabelle.pronoun).toBe('zij');
    for (const s of templates) {
      const filled = fill(s, { ...who(isabelle), plek: 'de Kasteeltuin' });
      expect(filled, s).not.toMatch(/[{}]/);
    }
    expect(fill('{Hij} pakt {zijn} hoed. Het past {hem}.', who(isabelle))).toBe('Zij pakt haar hoed. Het past haar.');
  });
});
