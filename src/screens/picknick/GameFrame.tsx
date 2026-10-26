import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { nl } from '../../content/nl';
import type { PicknickGame } from '../../models/Picknick';
import type { Racer } from '../../models/Racer';
import { BackHeader } from '../../components/BackHeader';
import { Confetti } from '../../components/Confetti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RacerBubble } from '../../components/RacerBubble';

interface Props {
  game: PicknickGame;
  racer: Racer;
  bubble?: string;
  /** Regel boven het speelveld (beurt, stand). */
  status?: ReactNode;
  /** Na afloop: de uitslag. */
  result?: { title: string; won: boolean };
  onAgain: () => void;
  children: ReactNode;
}

/** Zelfde opbouw voor elk spelletje: kop, racer met wolkje, speelveld, uitslag. */
export function GameFrame({ game, racer, bubble, status, result, onAgain, children }: Props) {
  const t = nl.picknick;
  return (
    <div className="screen pk">
      <BackHeader title={game.name} to={`/picknick?racer=${racer.id}`} />
      <main className="screen__main pk__main">
        <RacerBubble racer={racer} text={bubble} />
        {status && <p className="pk-status">{status}</p>}
        {children}
        {result && (
          <section className="pk-result grr-pop">
            <h2 className="kop kop--30 center">{result.title}</h2>
            <PrimaryButton onClick={onAgain} arrow>
              {t.again}
            </PrimaryButton>
            <Link to={`/picknick?racer=${racer.id}`} className="players__join pk-result__other">
              {t.otherGame} →
            </Link>
          </section>
        )}
      </main>
      {result?.won && <Confetti amount="groot" />}
    </div>
  );
}
