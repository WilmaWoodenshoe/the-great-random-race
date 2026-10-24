import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { BottomNav } from '../components/BottomNav';
import { PrimaryButton } from '../components/PrimaryButton';
import { api, type RaceSummary } from '../account/api';
import { isApproved, useAccount } from '../account/AccountProvider';
import { useGame } from '../state/GameProvider';
import { DAY } from '../utils/dates';
import { img } from '../utils/images';

const RACERS_PER_RACE = 6;

/** Alle gedeelde races: open (meedoen), bezig en net afgelopen. */
export function Races() {
  const t = nl.races;
  const { me, status, refresh } = useAccount();
  const { now } = useGame();
  const [races, setRaces] = useState<RaceSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  // Wacht je nog op goedkeuring? Dan even opnieuw kijken: misschien is het al zo ver.
  useEffect(() => {
    if (me && !isApproved(me)) void refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    api
      .races()
      .then((res) => !cancelled && setRaces(res.races))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const mine = races?.find((r) => r.status !== 'finished' && r.participants.some((p) => p.userId === me?.id));
  const canJoin = isApproved(me) && !mine;
  const open = (races ?? []).filter((r) => r.status === 'open').sort((a, b) => a.startTime - b.startTime);
  const running = (races ?? []).filter((r) => r.status === 'running');
  const finished = (races ?? []).filter((r) => r.status === 'finished');

  const card = (r: RaceSummary) => {
    const isMine = r.participants.some((p) => p.userId === me?.id);
    const free = RACERS_PER_RACE - r.participants.length;
    const day = Math.min(r.days, Math.floor((now - r.startTime) / DAY) + 1);
    return (
      <li key={r.id} className={`card card--wit race-card${isMine ? ' race-card--mine' : ''}`}>
        <div className="race-card__head">
          <div>
            <div className="race-card__name">{t.name(r.id, r.name)}</div>
            <div className="race-card__meta">
              {r.status === 'open' && `${t.startsAt(r.startTime)} · ${t.days(r.days)}`}
              {r.status === 'running' && t.dayOf(day, r.days)}
              {r.status === 'finished' && t.endedAt(r.endTime)}
            </div>
            {r.createdBy && <div className="race-card__by">{t.by(r.createdBy)}</div>}
          </div>
          {isMine && <span className="badge race-card__badge">{t.yours}</span>}
        </div>
        <ul className="race-card__players">
          {r.participants.map((p) => {
            const racer = racers.find((x) => x.id === p.racerId);
            return (
              <li key={p.racerId}>
                <img src={racer ? img(racer.image) : img('ui/icon-people.png')} alt="" />
                <span className="race-card__racer">{racer?.name ?? p.racerId}</span>
                <span className="race-card__nick">{p.nickname || t.removed}</span>
              </li>
            );
          })}
        </ul>
        {r.status === 'open' && (
          <div className="race-card__foot">
            <span>{free > 0 ? t.spots(free) : t.full}</span>
            {isMine ? (
              <Link to="/wachtruimte" className="chip-btn">
                {t.toYourRace} →
              </Link>
            ) : (
              canJoin &&
              free > 0 && (
                <Link to={`/races/${r.id}/meedoen`} className="chip-btn chip-btn--groen">
                  {t.join} →
                </Link>
              )
            )}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="screen screen--nav">
      <BackHeader title={t.title} fallback="/home">
        <p className="back-header__intro">{t.intro}</p>
      </BackHeader>
      <main className="screen__main races">
        {status === 'out' && <p className="account__note">{t.needAccount}</p>}
        {me && !isApproved(me) && <p className="account__note">{t.pendingNote}</p>}
        {mine && (
          <PrimaryButton to={mine.status === 'open' ? '/wachtruimte' : '/home'} arrow>
            {t.toYourRace}
          </PrimaryButton>
        )}
        {canJoin && (
          <PrimaryButton to="/races/nieuw" arrow>
            {t.newRace}
          </PrimaryButton>
        )}
        {failed && <p className="account__error">{t.error}</p>}
        {!races && !failed && <p className="account__note">{t.loading}</p>}

        {races && (
          <>
            <h2 className="more__h2">{t.open}</h2>
            {open.length === 0 ? <p className="account__note">{t.openEmpty}</p> : <ul className="races__list">{open.map(card)}</ul>}
            {running.length > 0 && (
              <>
                <h2 className="more__h2">{t.running}</h2>
                <ul className="races__list">{running.map(card)}</ul>
              </>
            )}
            {finished.length > 0 && (
              <>
                <h2 className="more__h2">{t.finished}</h2>
                <ul className="races__list">{finished.map(card)}</ul>
              </>
            )}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
