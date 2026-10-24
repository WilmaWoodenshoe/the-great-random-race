import { describe, expect, it } from 'vitest';
import { pickLineup } from '../src/game/session';
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

  it('de dagelijkse actie helpt een beetje, maar beslist de race niet', () => {
    const fed = runBalance(1000, 1, 'voeren');
    const winsWithout = pct(p.gerard.wins);
    const winsWith = fed.perRacer.gerard.wins / fed.races;
    expect(winsWith).toBeGreaterThanOrEqual(winsWithout);
    expect(winsWith - winsWithout).toBeLessThan(0.1);
  });

  it('Charles verrast soms, maar wint zelden', () => {
    expect(pct(p.charles.finishes)).toBeGreaterThan(0.05);
    expect(pct(p.charles.wins)).toBeLessThan(0.15);
  });

  it('Kevin haalt de finish zelden, Steve nooit', () => {
    expect(pct(p.kevin.finishes)).toBeGreaterThan(0);
    expect(pct(p.kevin.finishes)).toBeLessThan(0.15);
    expect(p.steve.finishes).toBe(0);
  });
});

describe('balans met willekeurige tegenstanders (kies je racer)', () => {
  // Elke racer als speler, steeds met vijf willekeurige tegenstanders.
  const asPlayer = (id: string, count: number) => {
    let wins = 0;
    let finishes = 0;
    for (let i = 0; i < count; i++) {
      const seed = 5000 + i * 13;
      const rep = runBalance(1, seed, null, pickLineup(id, seed).map((r) => r.id));
      wins += rep.perRacer[id].wins;
      finishes += rep.perRacer[id].finishes;
    }
    return { wins: wins / count, finishes: finishes / count };
  };

  it('Gerard, Mr. M en Philippe maken echt kans op de winst', () => {
    for (const id of ['gerard', 'ducky', 'philippe']) {
      const r = asPlayer(id, 200);
      expect(r.wins, id).toBeGreaterThan(0.03);
      expect(r.wins, id).toBeLessThan(0.4);
    }
  });

  it('Roger en Gerard halen bijna altijd de finish; Steve nooit', () => {
    expect(asPlayer('roger', 100).finishes).toBeGreaterThan(0.9);
    expect(asPlayer('gerard', 100).finishes).toBeGreaterThan(0.9);
    expect(asPlayer('steve', 50).finishes).toBe(0);
  });
});

describe('De Kasteelrace', () => {
  it('is ongeveer even zwaar als De Grote Bosrace', () => {
    const bos = runBalance(300, 1).perRacer.gerard;
    const kasteel = runBalance(300, 1, null, undefined, 7, 'kasteelrace').perRacer.gerard;
    expect(kasteel.finishes / 300).toBeGreaterThan(0.8);
    expect(Math.abs(kasteel.medianFinishDay! - bos.medianFinishDay!)).toBeLessThan(0.3);
    expect(Math.abs(kasteel.wins - bos.wins) / 300).toBeLessThan(0.12);
  }, 60_000);
});
