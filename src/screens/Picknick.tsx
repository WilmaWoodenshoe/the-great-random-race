import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { picknickGames } from '../content/picknick';
import { BackHeader } from '../components/BackHeader';
import { LivingRacer } from '../components/Gerard';
import { GameIcon } from '../components/PicknickIcons';
import { tally } from '../picknick/score';
import { usePicknickRacer } from '../picknick/useRacer';
import { img } from '../utils/images';

/** Het Picknickkleed: kies een racer en een spelletje. Alleen voor de lol. */
export function Picknick() {
  const t = nl.picknick;
  const racer = usePicknickRacer();
  const navigate = useNavigate();
  const [choosing, setChoosing] = useState(false);
  const q = `?racer=${racer.id}`;

  return (
    <div className="screen pk">
      <BackHeader title={t.title} subtitle={t.subtitle} fallback="/home" />
      <main className="screen__main pk__main">
        <section className="pk-hero">
          <div className="pk-hero__blanket" aria-hidden="true" />
          <LivingRacer image={racer.image} alt={t.racerAlt(racer.name)} wobble className="pk-hero__racer" />
          <button type="button" className="pk-hero__switch" onClick={() => setChoosing((c) => !c)} aria-expanded={choosing}>
            {t.otherRacer}
          </button>
        </section>

        {choosing && (
          <section className="card card--wit pk-choose">
            <h2 className="pk-choose__title">{t.chooseRacer}</h2>
            <div className="pk-choose__grid">
              {racers.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`pk-choose__racer${r.id === racer.id ? ' pk-choose__racer--on' : ''}`}
                  onClick={() => {
                    navigate(`/picknick?racer=${r.id}`, { replace: true });
                    setChoosing(false);
                  }}
                >
                  <img src={img(r.image)} alt="" />
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <ul className="pk-games">
          {picknickGames.map((g) => {
            const s = tally(g.id, racer.id);
            const played = s.player + s.racer + s.draw > 0;
            return (
              <li key={g.id}>
                <Link to={`/picknick/${g.id}${q}`} className="card card--wit pk-game">
                  <span className="pk-game__icon">{g.image ? <img src={img(g.image)} alt="" /> : <GameIcon id={g.id} />}</span>
                  <span className="pk-game__body">
                    <span className="pk-game__name">{g.name}</span>
                    <span className="pk-game__intro">{g.intro}</span>
                    <span className="pk-game__score">{played ? t.score(racer.name, s.player, s.racer) : t.noScore}</span>
                  </span>
                  <span className="pk-game__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
          <li className="card pk-game pk-game--soon">
            <span className="pk-game__body">
              <span className="pk-game__name">{t.soonTitle}</span>
              <span className="pk-game__intro">{t.soonText}</span>
            </span>
          </li>
        </ul>
      </main>
    </div>
  );
}
