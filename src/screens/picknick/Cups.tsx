import { useEffect, useRef, useState } from 'react';
import { nl } from '../../content/nl';
import { racers } from '../../content';
import type { PicknickGame } from '../../models/Picknick';
import { Cup } from '../../components/PicknickIcons';
import { planShuffle, positionsAfter, type Shuffle } from '../../picknick/cups';
import { recordResult } from '../../picknick/score';
import { playStyle } from '../../picknick/style';
import { usePicknickRacer } from '../../picknick/useRacer';
import { img } from '../../utils/images';
import { GameFrame } from './GameFrame';
import { useSay } from './useSay';

type Phase = 'show' | 'shuffle' | 'guess' | 'done';

/** Bekertje-schuiven: Steve ligt onder een bekertje, de racer schuift, jij raadt. */
export function Cups({ game }: { game: PicknickGame }) {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const { rng, say } = useSay(game, racer);
  const steve = racers.find((r) => r.id === 'steve')!;
  const lazySteve = playStyle(racer.traits).doesNothing;

  const newRound = () => ({ plan: planShuffle(racer.traits, rng), steveCup: lazySteve ? 1 : rng.int(0, 2) });
  const [round, setRound] = useState<{ plan: Shuffle; steveCup: number }>(newRound);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('show');
  const [picked, setPicked] = useState<number | null>(null);
  const [bubble, setBubble] = useState<string | undefined>(() => say('start'));
  const timer = useRef<number>();

  // Eerst Steve laten zien, dan bekertjes dicht en schuiven.
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (phase === 'show') {
      timer.current = window.setTimeout(() => {
        if (round.plan.swaps.length === 0) {
          setBubble(say('noShuffle'));
          setPhase('guess');
        } else {
          setBubble(say('shuffle'));
          setPhase('shuffle');
        }
      }, 1600);
    } else if (phase === 'shuffle') {
      timer.current = window.setTimeout(() => {
        if (step >= round.plan.swaps.length) setPhase('guess');
        else setStep((s) => s + 1);
      }, step === 0 ? 500 : round.plan.stepMs);
    }
    return () => window.clearTimeout(timer.current);
  }, [phase, step, round, say]);

  const positions = positionsAfter(round.plan.swaps, step);

  const guess = (cup: number) => {
    if (phase !== 'guess') return;
    setPicked(cup);
    setPhase('done');
    const won = cup === round.steveCup;
    recordResult(game.id, racer.id, won ? 'player' : 'racer');
    setBubble(say(won ? 'playerWins' : 'racerWins'));
  };

  const again = () => {
    setRound(newRound());
    setStep(0);
    setPicked(null);
    setPhase('show');
    setBubble(say('start'));
  };

  const lifted = (cup: number) => phase === 'show' || (phase === 'done' && (cup === picked || cup === round.steveCup));
  const won = phase === 'done' && picked === round.steveCup;
  const status = phase === 'show' ? t.cupsWatch : phase === 'shuffle' ? t.cupsShuffling : phase === 'guess' ? t.cupsGuess : undefined;

  return (
    <GameFrame
      game={game}
      racer={racer}
      bubble={bubble}
      status={status}
      result={phase === 'done' ? { title: won ? t.found : t.missed, won } : undefined}
      onAgain={again}
    >
      <div className="pk-cups" style={{ ['--pk-step' as string]: `${Math.max(200, round.plan.stepMs - 60)}ms` }}>
        {[0, 1, 2].map((cup) => (
          <button
            key={cup}
            type="button"
            className={`pk-cups__cup${lifted(cup) ? ' pk-cups__cup--up' : ''}${phase === 'guess' ? ' pk-cups__cup--pick' : ''}`}
            style={{ left: `${positions[cup] * 33.33}%` }}
            onClick={() => guess(cup)}
            disabled={phase !== 'guess'}
            aria-label={t.cup(positions[cup] + 1)}
          >
            {cup === round.steveCup && <img className="pk-cups__steve" src={img(steve.image)} alt={steve.name} />}
            <span className="pk-cups__shell">
              <Cup />
            </span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}
