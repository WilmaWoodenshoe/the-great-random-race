import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { api, type Player } from '../account/api';
import { useAccount } from '../account/AccountProvider';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';

/** Spelersoverzicht: wie speelt met welke racer (voor iedereen zichtbaar). */
export function Players() {
  const t = nl.players;
  const { me, status } = useAccount();
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .players()
      .then((res) => !cancelled && setPlayers(res.players))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const racer = (id: string) => racers.find((r) => r.id === id);
  // Hoe vaak elke racer gekozen is, de populairste eerst.
  const tally = players
    ? racers
        .map((r) => ({ racer: r, count: players.filter((p) => p.racerId === r.id).length }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count || a.racer.name.localeCompare(b.racer.name))
    : [];

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback="/meer">
        <p className="back-header__intro">{t.intro}</p>
      </BackHeader>
      <main className="screen__main players">
        {failed && <p className="account__error">{t.error}</p>}
        {!players && !failed && <p className="account__note">{t.loading}</p>}
        {players && players.length === 0 && <p className="account__note">{t.empty}</p>}

        {tally.length > 0 && (
          <section className="card card--wit players__tally" aria-label={t.popular}>
            {tally.map(({ racer: r, count }) => (
              <div className="players__tally-item" key={r.id}>
                <img src={img(r.image)} alt="" />
                <span className="players__tally-name">{r.name}</span>
                <span className="players__tally-count">{t.count(count)}</span>
              </div>
            ))}
          </section>
        )}

        {players && players.length > 0 && (
          <ul className="players__list">
            {players.map((p) => {
              const r = racer(p.racerId);
              const isMe = me?.nickname === p.nickname;
              return (
                <li key={p.nickname} className={`card card--wit players__row${isMe ? ' players__row--me' : ''}`}>
                  <img className="players__img" src={r ? img(r.image) : img('ui/icon-people.png')} alt="" />
                  <div className="players__main">
                    <div className="players__nick">
                      {p.nickname}
                      {isMe && <span className="players__you"> ({t.you})</span>}
                    </div>
                    <div className="players__line">{t.race(r?.name ?? p.racerId, p.raceNumber)}</div>
                    <div className="players__small">{t.updated(p.updatedAt * 1000)}</div>
                  </div>
                  <div className="players__score">
                    <b>{p.finished ? t.finished(p.position) : t.position(p.position, p.racersCount)}</b>
                    <span>{formatKm(p.km)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {status === 'out' && (
          <Link to="/account" className="players__join">
            {t.makeAccount} →
          </Link>
        )}
      </main>
    </div>
  );
}
