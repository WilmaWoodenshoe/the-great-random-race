import { describe, expect, it } from 'vitest';
import { runBalance } from '../src/game/balance';

// Kalibratie (briefing hoofdstuk 10), gemeten over 1.000 gesimuleerde races.
describe('balans over 1.000 races', () => {
  const report = runBalance(1000);
  const p = report.perRacer;
  const pct = (n: number) => n / report.races;

  it('Gerard finisht meestal rond dag 6 à 7 en wint 15–35% van de races', () => {
    expect(pct(p.gerard.finishes)).toBeGreaterThan(0.8);
    expect(p.gerard.medianFinishDay!).toBeGreaterThan(5.5);
    expect(p.gerard.medianFinishDay!).toBeLessThanOrEqual(7);
    expect(pct(p.gerard.wins)).toBeGreaterThanOrEqual(0.15);
    expect(pct(p.gerard.wins)).toBeLessThanOrEqual(0.35);
  });

  it('Ducky wint meestal, maar niet altijd', () => {
    expect(pct(p.ducky.wins)).toBeGreaterThan(0.5);
    expect(pct(p.ducky.wins)).toBeLessThan(0.9);
  });

  it('Turbo haalt de finish soms net wel en soms net niet', () => {
    expect(pct(p.turbo.finishes)).toBeGreaterThan(0.2);
    expect(pct(p.turbo.finishes)).toBeLessThan(0.8);
  });

  it('Kevin haalt de finish zelden, Steve nooit', () => {
    expect(pct(p.kevin.finishes)).toBeGreaterThan(0);
    expect(pct(p.kevin.finishes)).toBeLessThan(0.15);
    expect(p.steve.finishes).toBe(0);
  });
});
