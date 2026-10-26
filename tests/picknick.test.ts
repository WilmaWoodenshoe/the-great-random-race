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
    memory: ['start', 'point', 'pointKnown', 'pointSame', 'noTip', 'match', 'miss', 'finished'],
    'bekertje-schuiven': ['start', 'shuffle', 'noShuffle', 'playerWins', 'racerWins'],
    'mini-sudoku': ['start', 'tip', 'tipDoubt', 'noTip', 'checkGood', 'checkBad', 'finished'],
  };

  it('alle vijf spelletjes staan erin', () => {
    expect(picknickGames.map((g) => g.id)).toEqual(Object.keys(momentsPerGame));
  });

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
          const text = remark(g, r, picknickRacer(r.id), m as never, rng, { aantal: '3', beurten: '9', plaatje: 'de slak' });
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

import { CLUES, countSolutions, fits, makePuzzle, mistakes, sudokuTip, type Level } from '../src/picknick/sudoku';
import { makeDeck, racerPoint } from '../src/picknick/memory';
import { planShuffle, positionsAfter } from '../src/picknick/cups';

describe('Picknickkleed: mini-sudoku', () => {
  for (const level of ['makkelijk', 'gemiddeld', 'lastig'] as Level[]) {
    it(`elke puzzel (${level}) heeft precies één oplossing en ${CLUES[level]} gegeven vakjes`, () => {
      const rng = createRng(77);
      for (let n = 0; n < 60; n++) {
        const { start, solution } = makePuzzle(level, rng);
        expect(start.filter((x) => x !== null)).toHaveLength(CLUES[level]);
        expect(countSolutions(start, 3)).toBe(1);
        // De oplossing klopt: elk plaatje één keer per rij, kolom en blok.
        solution.forEach((v, i) => expect(fits(solution, i, v)).toBe(true));
        start.forEach((v, i) => v !== null && expect(v).toBe(solution[i]));
      }
    });
  }
  it('fouten worden gevonden; Roger geeft altijd een goede tip', () => {
    const rng = createRng(4);
    const { start, solution } = makePuzzle('gemiddeld', rng);
    const wrong = start.slice();
    const empty = wrong.indexOf(null);
    wrong[empty] = (solution[empty] + 1) % 4;
    expect(mistakes(wrong, solution)).toEqual([empty]);
    const roger = racers.find((r) => r.id === 'roger')!;
    for (let i = 0; i < 40; i++) expect(sudokuTip(start, solution, roger.traits, rng, true)!.right).toBe(true);
  });
});

describe('Picknickkleed: memory', () => {
  it('6 paren, elk plaatje precies twee keer', () => {
    const deck = makeDeck(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], createRng(2));
    expect(deck).toHaveLength(12);
    const counts = new Map<string, number>();
    deck.forEach((c) => counts.set(c.face, (counts.get(c.face) ?? 0) + 1));
    expect([...counts.values()]).toEqual([2, 2, 2, 2, 2, 2]);
  });
  it('Steve wijst nooit iets aan; anderen wel eens', () => {
    const deck = makeDeck(['a', 'b', 'c', 'd', 'e', 'f'], createRng(2));
    const steve = racers.find((r) => r.id === 'steve')!;
    const roger = racers.find((r) => r.id === 'roger')!;
    const rng = createRng(8);
    expect(racerPoint(deck, new Set(), null, steve.traits, rng).kind).toBe('none');
    const kinds = new Set(Array.from({ length: 40 }, () => racerPoint(deck, new Set(), null, roger.traits, rng).kind));
    expect(kinds.has('pretty')).toBe(true);
  });
});

describe('Picknickkleed: bekertje-schuiven', () => {
  it('Steve schuift niet; anderen wel, en de wissels kloppen', () => {
    const steve = racers.find((r) => r.id === 'steve')!;
    expect(planShuffle(steve.traits, createRng(1)).swaps).toHaveLength(0);
    for (const r of racers.filter((x) => x.id !== 'steve')) {
      const plan = planShuffle(r.traits, createRng(5));
      expect(plan.swaps.length, r.id).toBeGreaterThanOrEqual(2);
      expect(plan.stepMs).toBeGreaterThan(300);
    }
    expect(positionsAfter([[0, 1]])).toEqual([1, 0, 2]);
    expect(positionsAfter([[0, 1], [1, 2]])).toEqual([2, 0, 1]);
    expect(positionsAfter([[0, 1], [0, 1]])).toEqual([0, 1, 2]);
  });
  it('luie racers schuiven minder dan chaotische', () => {
    const avg = (id: string) => {
      const r = racers.find((x) => x.id === id)!;
      let n = 0;
      for (let s = 0; s < 50; s++) n += planShuffle(r.traits, createRng(s)).swaps.length;
      return n / 50;
    };
    expect(avg('bintje')).toBeLessThan(avg('ducky'));
  });
});
