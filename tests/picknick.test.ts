import { describe, expect, it } from 'vitest';
import { racers } from '../src/content';
import { bestMoves, emptyBoard, outcome, racerTurn, type Board, type Mark } from '../src/picknick/tictactoe';
import { HANDS, racerHand, roundWinner } from '../src/picknick/rps';
import { createRng } from '../src/utils/random';

/** Een potje tegen een foutloze speler. Geeft de winnaar ('p', 'r' of 'draw'). */
function playGame(traits: (typeof racers)[number]['traits'], seed: number, playerStarts: boolean) {
  const rng = createRng(seed);
  let board: Board = emptyBoard();
  let turn: Mark = playerStarts ? 'p' : 'r';
  let passes = 0;
  while (!outcome(board)) {
    if (turn === 'p') {
      board = board.slice();
      board[rng.pick(bestMoves(board, 'p'))] = 'p';
    } else {
      const t = racerTurn(board, traits, rng);
      if (t.kind === 'move') {
        board = board.slice();
        board[t.cell] = 'r';
      } else passes++;
    }
    turn = turn === 'p' ? 'r' : 'p';
  }
  return { result: outcome(board), passes };
}

describe('Picknickkleed: boter-kaas-en-eieren', () => {
  for (const racer of racers) {
    it(`van ${racer.name} kun je winnen`, () => {
      let wins = 0;
      let losses = 0;
      for (let i = 0; i < 1000; i++) {
        const { result } = playGame(racer.traits, 1000 + i, i % 2 === 0);
        if (result === 'p') wins++;
        if (result === 'r') losses++;
      }
      // Een foutloze speler verliest nooit.
      expect(losses).toBe(0);
      if (racer.id === 'steve') expect(wins).toBe(1000);
      else expect(wins).toBeGreaterThanOrEqual(100);
    });
  }

  it('Steve zet nooit iets', () => {
    const steve = racers.find((r) => r.id === 'steve')!;
    expect(racerTurn(emptyBoard(), steve.traits, createRng(1)).kind).toBe('pass');
  });
});

describe('Picknickkleed: steen-papier-schaar', () => {
  it('Steve kiest altijd steen', () => {
    const steve = racers.find((r) => r.id === 'steve')!;
    const rng = createRng(5);
    for (let i = 0; i < 50; i++) expect(racerHand(steve.traits, 'steen', rng)).toBe('steen');
  });
  it('papier wint van steen, steen van schaar, schaar van papier', () => {
    expect(roundWinner('papier', 'steen')).toBe('p');
    expect(roundWinner('steen', 'schaar')).toBe('p');
    expect(roundWinner('schaar', 'papier')).toBe('p');
    expect(roundWinner('steen', 'papier')).toBe('r');
    expect(roundWinner('schaar', 'schaar')).toBe('tie');
  });
  it('andere racers kiezen niet altijd hetzelfde', () => {
    const mrM = racers.find((r) => r.id === 'ducky')!;
    const rng = createRng(9);
    const seen = new Set(Array.from({ length: 30 }, () => racerHand(mrM.traits, 'steen', rng)));
    expect(seen.size).toBe(HANDS.length);
  });
});

import { picknickGames, picknickRacer } from '../src/content/picknick';
import { remark } from '../src/picknick/remarks';
import { recordResult, tally } from '../src/picknick/score';

describe('Picknickkleed: opmerkingen', () => {
  const momentsPerGame: Record<string, string[]> = {
    'boter-kaas-en-eieren': ['start', 'think', 'opening', 'distracted', 'nap', 'pass', 'playerWins', 'racerWins', 'draw'],
    'steen-papier-schaar': ['start', 'hint', 'playerRound', 'racerRound', 'tieRound', 'playerWins', 'racerWins'],
  };

  it('elk spelletje heeft minstens 3 algemene opmerkingen per moment', () => {
    for (const g of picknickGames) {
      for (const m of momentsPerGame[g.id] ?? []) {
        expect(g.remarks[m as keyof typeof g.remarks]?.length ?? 0, `${g.id} ${m}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('elke racer heeft minstens 2 eigen opmerkingen per spelletje', () => {
    for (const r of racers) {
      const own = picknickRacer(r.id);
      expect(own, r.id).toBeDefined();
      for (const g of picknickGames) {
        const n = Object.values(own!.remarks[g.id] ?? {}).flat().length;
        expect(n, `${r.id} ${g.id}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('zonder eigen teksten werkt de terugval, en alle invulplekken worden ingevuld', () => {
    const rng = createRng(3);
    const nieuw = { ...racers[0], id: 'nieuwe-racer', name: 'Nieuwkomer' };
    for (const g of picknickGames) {
      for (const m of momentsPerGame[g.id] ?? []) {
        for (const r of [...racers, nieuw]) {
          const text = remark(g, r, picknickRacer(r.id), m as never, rng, { aantal: '3' });
          expect(text, `${g.id} ${m} ${r.id}`).toBeTruthy();
          expect(text).not.toMatch(/[{}]/);
        }
      }
    }
  });
});

describe('Picknickkleed: stand', () => {
  it('wordt bewaard en per racer bijgehouden', () => {
    const mem = new Map<string, string>();
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
    };
    recordResult('boter-kaas-en-eieren', 'gerard', 'player');
    recordResult('boter-kaas-en-eieren', 'gerard', 'player');
    recordResult('boter-kaas-en-eieren', 'gerard', 'racer');
    recordResult('boter-kaas-en-eieren', 'roger', 'draw');
    expect(tally('boter-kaas-en-eieren', 'gerard')).toEqual({ player: 2, racer: 1, draw: 0 });
    expect(tally('boter-kaas-en-eieren', 'roger')).toEqual({ player: 0, racer: 0, draw: 1 });
    expect(tally('steen-papier-schaar', 'gerard')).toEqual({ player: 0, racer: 0, draw: 0 });
    expect(mem.has('grr-picknick')).toBe(true);
    delete (globalThis as { localStorage?: unknown }).localStorage;
  });
});
