import { describe, expect, it } from 'vitest';
import { summaryOf } from '../src/account/summary';
import { EMPTY_SAVE } from '../src/models/Save';
import { startRace } from '../src/game/session';
import { DAY } from '../src/utils/dates';
import { START } from './helpers';

describe('stand voor het spelersoverzicht', () => {
  it('is leeg zonder race', () => {
    expect(summaryOf(EMPTY_SAVE, START)).toBeNull();
  });

  it('geeft racer, racenummer, plek en km', () => {
    const save = startRace(EMPTY_SAVE, START, 'isabelle', 3);
    const s = summaryOf(save, START + 2 * DAY)!;
    expect(s.racerId).toBe('isabelle');
    expect(s.raceNumber).toBe(1);
    expect(s.racersCount).toBe(6);
    expect(s.position).toBeGreaterThanOrEqual(1);
    expect(s.position).toBeLessThanOrEqual(6);
    expect(s.km).toBeGreaterThan(0);
    expect(s.finished).toBe(false);
  });

  it('na afloop: de einduitslag', () => {
    const save = startRace(EMPTY_SAVE, START, 'gerard', 3);
    expect(summaryOf(save, START + 8 * DAY)!.finished).toBe(true);
  });
});
