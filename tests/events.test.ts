import { describe, expect, it } from 'vitest';
import { choices as allChoices, racers } from '../src/content';
import { nl } from '../src/content/nl';
import { EVENT_TYPES } from '../src/models/Event';
import { dampen, personalityModifier } from '../src/game/personality';
import { localDateKey, HOUR } from '../src/utils/dates';
import { createRng } from '../src/utils/random';
import { makeRace } from './helpers';

describe('toeval met seed', () => {
  it('dezelfde seed geeft dezelfde getallen', () => {
    const a = createRng(7);
    const b = createRng(7);
    for (let i = 0; i < 20; i++) expect(a.next()).toBe(b.next());
  });
});

describe('persoonlijkheid', () => {
  it('modifier blijft tussen 0,9 en 1,1', () => {
    for (const r of racers) {
      expect(personalityModifier(r.traits)).toBeGreaterThanOrEqual(0.9);
      expect(personalityModifier(r.traits)).toBeLessThanOrEqual(1.1);
    }
  });

  it('stubborn 100 halveert een negatief effect; positieve effecten blijven', () => {
    expect(dampen(0.6, 100)).toBeCloseTo(0.8);
    expect(dampen(0.6, 0)).toBeCloseTo(0.6);
    expect(dampen(1.2, 100)).toBe(1.2);
  });
});

describe('eventschema', () => {
  const races = Array.from({ length: 30 }, (_, i) => makeRace(1000 + i));

  it('is vooraf volledig berekend en hetzelfde bij dezelfde seed', () => {
    expect(makeRace(5).events).toEqual(makeRace(5).events);
    expect(makeRace(5).events).not.toEqual(makeRace(6).events);
  });

  it('Gerard krijgt 2–4 events per dag, tegenstanders hooguit 2', () => {
    for (const race of races) {
      const gerard = race.events.filter((e) => e.racerId === 'gerard');
      expect(gerard.length).toBeLessThanOrEqual(4 * 7);
      expect(gerard.length).toBeGreaterThanOrEqual(2 * 5); // na de finish stoppen events
      for (const r of race.racers.filter((x) => x.id !== 'gerard')) {
        expect(race.events.filter((e) => e.racerId === r.id).length).toBeLessThanOrEqual(2 * 7);
      }
    }
  });

  it('events van één racer overlappen niet', () => {
    for (const race of races) {
      for (const r of race.racers) {
        const own = race.events.filter((e) => e.racerId === r.id);
        for (let i = 1; i < own.length; i++) {
          const prevEnd = Math.max(own[i - 1].time, ...own[i - 1].phases.map((p) => p.end));
          expect(own[i].time).toBeGreaterThanOrEqual(prevEnd);
        }
      }
    }
  });

  it('alle events vallen binnen de race', () => {
    for (const race of races) {
      for (const e of race.events) {
        expect(e.time).toBeGreaterThanOrEqual(race.startTime);
        expect(e.time).toBeLessThan(race.endTime);
      }
    }
  });

  it('speciale regels: slakken houden van regen, eenden van plassen, Steve heeft familie', () => {
    const all = races.flatMap((r) => r.events);
    const rain = all.find((e) => e.type === 'rain')!;
    expect(rain.phasesByRacer!.gerard[0].speed).toBeCloseTo(1.15);
    expect(rain.phasesByRacer!.ducky[0].speed).toBeLessThan(1);
    const duckPuddle = all.find((e) => e.type === 'puddle' && e.racerId === 'ducky');
    if (duckPuddle) expect(duckPuddle.phases[0].speed).toBe(1.5);
    const steveRock = all.find((e) => e.type === 'rock' && e.racerId === 'steve');
    if (steveRock) expect(steveRock.textKey).toBe('rock_family');
  });
});

describe('teksten', () => {
  it('elk eventtype heeft minstens 4 tekstvarianten', () => {
    for (const type of EVENT_TYPES) expect(nl.engine.events[type].length).toBeGreaterThanOrEqual(4);
    expect(nl.engine.events.rock_family.length).toBeGreaterThanOrEqual(4);
    expect(nl.engine.events.puddle_duck.length).toBeGreaterThanOrEqual(4);
  });

  it('elk eventtype heeft een statustekst', () => {
    for (const type of EVENT_TYPES) expect(nl.engine.status[type]).toBeTruthy();
  });
});

describe('keuze-events', () => {
  it('er zijn 5 keuze-events', () => {
    expect(allChoices).toHaveLength(5);
  });

  it('maximaal één per kalenderdag, 12 uur om te kiezen, nooit twee tegelijk open', () => {
    for (let seed = 0; seed < 50; seed++) {
      const race = makeRace(seed);
      const days = race.choices.map((c) => localDateKey(c.time));
      expect(new Set(days).size).toBe(days.length);
      for (let i = 0; i < race.choices.length; i++) {
        const c = race.choices[i];
        expect(c.deadline - c.time).toBe(12 * HOUR);
        expect(c.deadline).toBeLessThanOrEqual(race.endTime);
        expect(c.choice.options.some((o) => o.id === c.autoOptionId)).toBe(true);
        if (i > 0) expect(c.time).toBeGreaterThanOrEqual(race.choices[i - 1].deadline);
      }
    }
  });
});
