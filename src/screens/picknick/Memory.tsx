import { useEffect, useMemo, useRef, useState } from 'react';
import { nl } from '../../content/nl';
import { accessories, racers } from '../../content';
import type { PicknickGame } from '../../models/Picknick';
import { makeDeck, racerPoint, type Card } from '../../picknick/memory';
import { recordPlayed } from '../../picknick/score';
import { usePicknickRacer } from '../../picknick/useRacer';
import { img } from '../../utils/images';
import { GameFrame } from './GameFrame';
import { useSay } from './useSay';

/** Plaatjes voor de kaarten: alle racers en accessoires. */
const POOL = [...racers.map((r) => r.image), ...accessories.map((a) => a.image)];

/** Memory: zoek de 6 paren. De racer kijkt mee en wijst soms een kaart aan. */
export function Memory({ game }: { game: PicknickGame }) {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const { rng, say } = useSay(game, racer);
  const gerard = useMemo(() => racers.find((r) => r.id === 'gerard')!.image, []);

  const [cards, setCards] = useState<Card[]>(() => makeDeck(POOL, rng));
  const [turns, setTurns] = useState(0);
  const [pointed, setPointed] = useState<number | null>(null);
  const [bubble, setBubble] = useState<string | undefined>(() => say('start'));
  const [done, setDone] = useState(false);
  const seen = useRef(new Set<number>());
  const lastPoint = useRef<number | null>(null);
  const busy = useRef(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const tap = (i: number) => {
    const c = cards[i];
    if (busy.current || done || c.open || c.found) return;
    seen.current.add(i);
    const open = cards.flatMap((x, j) => (x.open && !x.found ? [j] : []));
    const next = cards.map((x, j) => (j === i ? { ...x, open: true } : x));
    setPointed(null);
    if (open.length === 0) {
      setCards(next);
      return;
    }
    // Tweede kaart: een paar of niet?
    const first = open[0];
    const n = turns + 1;
    setTurns(n);
    if (cards[first].face === c.face) {
      const found = next.map((x, j) => (j === i || j === first ? { ...x, found: true } : x));
      setCards(found);
      if (found.every((x) => x.found)) {
        setDone(true);
        recordPlayed(game.id, racer.id, n);
        setBubble(say('finished', { beurten: String(n) }));
      } else if (rng.chance(0.5)) setBubble(say('match'));
      return;
    }
    setCards(next);
    busy.current = true;
    timer.current = window.setTimeout(() => {
      busy.current = false;
      const closed = next.map((x) => (x.found ? x : { ...x, open: false }));
      setCards(closed);
      // Soms wijst de racer een kaart aan.
      if (!rng.chance(0.55)) {
        if (rng.chance(0.4)) setBubble(say('miss'));
        return;
      }
      const p = racerPoint(closed, seen.current, lastPoint.current, racer.traits, rng);
      if (p.kind === 'none') {
        setBubble(say('noTip'));
        return;
      }
      lastPoint.current = p.card;
      setPointed(p.card);
      setBubble(say(p.kind === 'known' ? 'pointKnown' : p.kind === 'same' ? 'pointSame' : 'point'));
    }, 950);
  };

  const again = () => {
    window.clearTimeout(timer.current);
    busy.current = false;
    seen.current = new Set();
    lastPoint.current = null;
    setCards(makeDeck(POOL, rng));
    setTurns(0);
    setPointed(null);
    setDone(false);
    setBubble(say('start'));
  };

  return (
    <GameFrame
      game={game}
      racer={racer}
      bubble={bubble}
      status={t.turns(turns)}
      result={done ? { title: t.done, won: true } : undefined}
      onAgain={again}
    >
      <div className="pk-memory">
        {cards.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`pk-memory__card${c.open || c.found ? ' pk-memory__card--open' : ''}${c.found ? ' pk-memory__card--found' : ''}${
              pointed === i ? ' pk-memory__card--pointed' : ''
            }`}
            onClick={() => tap(i)}
            aria-label={c.open || c.found ? t.cardFace(i + 1) : t.cardBack}
          >
            <span className="pk-memory__inner">
              <span className="pk-memory__back">
                <img src={img(gerard)} alt="" />
              </span>
              <span className="pk-memory__face">
                <img src={img(c.face)} alt="" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}
