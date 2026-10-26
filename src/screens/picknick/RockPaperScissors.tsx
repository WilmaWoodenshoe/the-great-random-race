import { useCallback, useMemo, useState } from 'react';
import { nl } from '../../content/nl';
import { picknickRacer } from '../../content/picknick';
import type { PicknickGame, PicknickMoment } from '../../models/Picknick';
import { HandIcon } from '../../components/PicknickIcons';
import { remark } from '../../picknick/remarks';
import { HANDS, WINS_NEEDED, racerHand, roundWinner, type Hand } from '../../picknick/rps';
import { bumpSteveStreak, recordResult } from '../../picknick/score';
import { playStyle } from '../../picknick/style';
import { usePicknickRacer } from '../../picknick/useRacer';
import { createRng } from '../../utils/random';
import { GameFrame } from './GameFrame';

/** Steen-papier-schaar, wie het eerst twee rondes wint. */
export function RockPaperScissors({ game }: { game: PicknickGame }) {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const own = picknickRacer(racer.id);
  const rng = useMemo(() => createRng(Date.now() ^ Math.floor(Math.random() * 1e9)), []);
  const say = useCallback(
    (m: PicknickMoment, extra?: Record<string, string>) => remark(game, racer, own, m, rng, extra),
    [game, racer, own, rng],
  );
  const steveLike = playStyle(racer.traits).doesNothing;

  const [wins, setWins] = useState({ p: 0, r: 0 });
  const [last, setLast] = useState<{ player: Hand; racer: Hand } | null>(null);
  const [bubble, setBubble] = useState<string | undefined>(() => `${say('start') ?? ''} ${say('hint') ?? ''}`.trim());
  const [done, setDone] = useState<'p' | 'r' | null>(null);

  const play = (hand: Hand) => {
    if (done) return;
    const theirs = racerHand(racer.traits, last?.racer ?? null, rng);
    const w = roundWinner(hand, theirs);
    const next = { p: wins.p + (w === 'p' ? 1 : 0), r: wins.r + (w === 'r' ? 1 : 0) };
    setLast({ player: hand, racer: theirs });
    setWins(next);
    // Steve kiest altijd steen: de app telt hoe vaak achter elkaar.
    const streak = steveLike ? say('streak', { aantal: String(bumpSteveStreak()) }) : undefined;
    if (next.p >= WINS_NEEDED || next.r >= WINS_NEEDED) {
      const winner = next.p >= WINS_NEEDED ? 'p' : 'r';
      setDone(winner);
      recordResult(game.id, racer.id, winner === 'p' ? 'player' : 'racer');
      setBubble(say(winner === 'p' ? 'playerWins' : 'racerWins'));
      return;
    }
    const roundText = say(w === 'p' ? 'playerRound' : w === 'r' ? 'racerRound' : 'tieRound');
    setBubble([streak ?? roundText, say('hint')].filter(Boolean).join(' '));
  };

  const again = () => {
    setWins({ p: 0, r: 0 });
    setLast(null);
    setDone(null);
    setBubble(`${say('start') ?? ''} ${say('hint') ?? ''}`.trim());
  };

  const result = done ? { title: done === 'p' ? t.youWin : t.racerWins(racer.name), won: done === 'p' } : undefined;

  return (
    <GameFrame game={game} racer={racer} bubble={bubble} status={t.rounds(racer.name, wins.p, wins.r)} result={result} onAgain={again}>
      {last && (
        <div className="pk-rps__reveal grr-pop" key={`${wins.p}-${wins.r}-${last.player}-${last.racer}`}>
          <div className="pk-rps__side">
            <HandIcon hand={last.player} size={64} />
            <span>
              {t.youChose}: {t.hands[last.player]}
            </span>
          </div>
          <div className="pk-rps__vs">vs</div>
          <div className="pk-rps__side">
            <HandIcon hand={last.racer} size={64} />
            <span>
              {racer.name}: {t.hands[last.racer]}
            </span>
          </div>
        </div>
      )}
      {!done && (
        <>
          <p className="pk-rps__pick">{t.pick}</p>
          <div className="pk-rps__hands">
            {HANDS.map((h) => (
              <button key={h} type="button" className="pk-rps__hand" onClick={() => play(h)}>
                <HandIcon hand={h} />
                <span>{t.hands[h]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </GameFrame>
  );
}
