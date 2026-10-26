import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { nl } from '../../content/nl';
import { picknickRacer } from '../../content/picknick';
import type { PicknickGame, PicknickMoment } from '../../models/Picknick';
import { Leaf } from '../../components/PicknickIcons';
import { remark } from '../../picknick/remarks';
import { recordResult, tally } from '../../picknick/score';
import { emptyBoard, outcome, racerTurn, winningLine, type Board, type Mark } from '../../picknick/tictactoe';
import { usePicknickRacer } from '../../picknick/useRacer';
import { createRng } from '../../utils/random';
import { img } from '../../utils/images';
import { GameFrame } from './GameFrame';

/** Boter-kaas-en-eieren tegen een racer. */
export function TicTacToe({ game }: { game: PicknickGame }) {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const own = picknickRacer(racer.id);
  const rng = useMemo(() => createRng(Date.now() ^ Math.floor(Math.random() * 1e9)), []);
  const say = useCallback((m: PicknickMoment) => remark(game, racer, own, m, rng), [game, racer, own, rng]);

  // Wie begint, wisselt per potje.
  const firstStarter = (): Mark => {
    const s = tally(game.id, racer.id);
    return (s.player + s.racer + s.draw) % 2 === 0 ? 'p' : 'r';
  };
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Mark>(firstStarter);
  const [bubble, setBubble] = useState<string | undefined>(() => say('start'));
  const [done, setDone] = useState<Mark | 'draw' | null>(null);
  const timer = useRef<number>();

  const finish = useCallback(
    (b: Board) => {
      const o = outcome(b);
      if (!o) return false;
      setDone(o);
      recordResult(game.id, racer.id, o === 'p' ? 'player' : o === 'r' ? 'racer' : 'draw');
      setBubble(say(o === 'p' ? 'playerWins' : o === 'r' ? 'racerWins' : 'draw'));
      return true;
    },
    [game.id, racer.id, say],
  );

  // De racer is aan de beurt: even nadenken, dan zetten (of een dutje, of passen).
  useEffect(() => {
    if (turn !== 'r' || done) return;
    if (rng.chance(0.35)) setBubble(say('think'));
    const wait = (own?.thinkSeconds ?? 1) * 1000;
    timer.current = window.setTimeout(() => {
      const move = racerTurn(board, racer.traits, rng);
      if (move.kind === 'move') {
        const next = board.slice();
        next[move.cell] = 'r';
        setBoard(next);
        if (move.reason !== 'best' && move.reason !== 'chaos') setBubble(say(move.reason));
        if (!finish(next)) setTurn('p');
      } else {
        setBubble(say(move.kind));
        setTurn('p');
      }
    }, wait);
    return () => window.clearTimeout(timer.current);
  }, [turn, done, board, racer, own, rng, say, finish]);

  const tap = (i: number) => {
    if (turn !== 'p' || done || board[i]) return;
    const next = board.slice();
    next[i] = 'p';
    setBoard(next);
    if (!finish(next)) setTurn('r');
  };

  const again = () => {
    window.clearTimeout(timer.current);
    setBoard(emptyBoard());
    setDone(null);
    setTurn(firstStarter());
    setBubble(say('start'));
  };

  const line = winningLine(board) ?? [];
  const result = done
    ? { title: done === 'p' ? t.youWin : done === 'r' ? t.racerWins(racer.name) : t.draw, won: done === 'p' }
    : undefined;

  return (
    <GameFrame
      game={game}
      racer={racer}
      bubble={bubble}
      status={done ? undefined : turn === 'p' ? t.yourTurn : t.racerTurn(racer.name)}
      result={result}
      onAgain={again}
    >
      <div className="pk-ttt" role="grid">
        {board.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`pk-ttt__cell${line.includes(i) ? ' pk-ttt__cell--win' : ''}`}
            onClick={() => tap(i)}
            disabled={!!c || !!done || turn !== 'p'}
            aria-label={c === 'p' ? t.leafAlt : c === 'r' ? racer.name : t.cell(i + 1)}
          >
            {c === 'p' && <Leaf size={52} />}
            {c === 'r' && <img className="pk-ttt__racer grr-pop" src={img(racer.image)} alt="" />}
          </button>
        ))}
      </div>
    </GameFrame>
  );
}
