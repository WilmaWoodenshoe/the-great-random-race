import { useState } from 'react';
import { nl } from '../../content/nl';
import { racers } from '../../content';
import type { PicknickGame } from '../../models/Picknick';
import { recordPlayed } from '../../picknick/score';
import { playStyle } from '../../picknick/style';
import { makePuzzle, mistakes, solved, sudokuTip, type Grid, type Level, type Puzzle } from '../../picknick/sudoku';
import { usePicknickRacer } from '../../picknick/useRacer';
import { img } from '../../utils/images';
import { GameFrame } from './GameFrame';
import { useSay } from './useSay';

/** De vier plaatjes van de sudoku en hoe ze heten in de tips. */
const SYMBOLS = [
  { racer: 'gerard', name: 'de slak' },
  { racer: 'ducky', name: 'de eend' },
  { racer: 'turbo', name: 'de schildpad' },
  { racer: 'steve', name: 'de steen' },
].map((s) => ({ ...s, image: racers.find((r) => r.id === s.racer)!.image }));
const LEVELS: Level[] = ['makkelijk', 'gemiddeld', 'lastig'];

/** Mini-sudoku van 4 × 4 met plaatjes. De racer geeft tips (niet altijd goede). */
export function MiniSudoku({ game }: { game: PicknickGame }) {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const { rng, say } = useSay(game, racer);
  const roger = racers.find((r) => r.id === 'roger')!;

  const [level, setLevel] = useState<Level>('makkelijk');
  const [puzzle, setPuzzle] = useState<Puzzle>(() => makePuzzle('makkelijk', rng));
  const [grid, setGrid] = useState<Grid>(() => puzzle.start.slice());
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [tipCell, setTipCell] = useState<number | null>(null);
  const [bubble, setBubble] = useState<string | undefined>(() => say('start'));
  const [done, setDone] = useState(false);

  const start = (lvl: Level) => {
    const p = makePuzzle(lvl, rng);
    setLevel(lvl);
    setPuzzle(p);
    setGrid(p.start.slice());
    setSelected(null);
    setWrong([]);
    setTipCell(null);
    setDone(false);
    setBubble(say('start'));
  };

  const put = (v: number | null) => {
    if (selected === null || done) return;
    const next = grid.slice();
    next[selected] = v;
    setGrid(next);
    setWrong((w) => w.filter((i) => i !== selected));
    setTipCell(null);
    if (solved(next, puzzle.solution)) {
      setDone(true);
      setSelected(null);
      recordPlayed(game.id, racer.id);
      setBubble(say('finished'));
    }
  };

  const check = () => {
    const m = mistakes(grid, puzzle.solution).filter((i) => puzzle.start[i] === null);
    setWrong(m);
    setBubble(say(m.length ? 'checkBad' : 'checkGood'));
  };

  const ask = (who: typeof racer) => {
    const lazy = who.id === racer.id && playStyle(racer.traits).doesNothing;
    const tip = lazy ? null : sudokuTip(grid, puzzle.solution, who.traits, rng, who.id === 'roger');
    if (!tip) {
      setTipCell(null);
      setBubble(say('noTip'));
      return;
    }
    setTipCell(tip.cell);
    setSelected(tip.cell);
    const extra = { plaatje: SYMBOLS[tip.value].name };
    // Roger zegt het zelf; anders de gekozen racer, met twijfel als het niet klopt.
    if (who.id === 'roger' && racer.id !== 'roger') setBubble(t.rogerTip(SYMBOLS[tip.value].name));
    else setBubble(say(tip.right ? 'tip' : 'tipDoubt', extra));
  };

  return (
    <GameFrame game={game} racer={racer} bubble={bubble} result={done ? { title: t.solved, won: true } : undefined} onAgain={() => start(level)}>
      <div className="pk-levels" role="tablist">
        {LEVELS.map((l) => (
          <button key={l} type="button" role="tab" aria-selected={l === level} className={`pk-levels__btn${l === level ? ' pk-levels__btn--on' : ''}`} onClick={() => start(l)}>
            {t.levels[l]}
          </button>
        ))}
      </div>
      <div className="pk-sudoku">
        {grid.map((v, i) => {
          const given = puzzle.start[i] !== null;
          return (
            <button
              key={i}
              type="button"
              className={[
                'pk-sudoku__cell',
                given ? 'pk-sudoku__cell--given' : '',
                selected === i ? 'pk-sudoku__cell--selected' : '',
                wrong.includes(i) ? 'pk-sudoku__cell--wrong' : '',
                tipCell === i ? 'pk-sudoku__cell--tip' : '',
              ].join(' ')}
              // Een smalle lege kolom en rij in het midden: de dikke lijn tussen de blokken.
              style={{ gridColumn: (i % 4) + 1 + (i % 4 >= 2 ? 1 : 0), gridRow: Math.floor(i / 4) + 1 + (i >= 8 ? 1 : 0) }}
              onClick={() => !given && !done && setSelected(i)}
              disabled={given || done}
              aria-label={`${t.sudokuCell(i + 1)}${v !== null ? `: ${SYMBOLS[v].name}` : ''}`}
            >
              {v !== null && <img src={img(SYMBOLS[v].image)} alt="" />}
            </button>
          );
        })}
      </div>
      {!done && (
        <>
          <p className="pk-rps__pick">{t.sudokuPick}</p>
          <div className="pk-sudoku__picker">
            {SYMBOLS.map((s, v) => (
              <button key={s.racer} type="button" className="pk-sudoku__pick" onClick={() => put(v)} disabled={selected === null} aria-label={s.name}>
                <img src={img(s.image)} alt="" />
              </button>
            ))}
            <button type="button" className="pk-sudoku__pick pk-sudoku__pick--clear" onClick={() => put(null)} disabled={selected === null}>
              {t.clear}
            </button>
          </div>
          <div className="pk-sudoku__actions">
            <button type="button" className="chip-btn chip-btn--groen" onClick={check}>
              {t.check}
            </button>
            {racer.id !== 'roger' && (
              <button type="button" className="chip-btn" onClick={() => ask(racer)}>
                {t.askRacer(racer.name)}
              </button>
            )}
            <button type="button" className="chip-btn" onClick={() => ask(roger)}>
              {t.askRoger}
            </button>
          </div>
        </>
      )}
    </GameFrame>
  );
}
