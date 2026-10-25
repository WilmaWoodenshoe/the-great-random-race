import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { BottomNav } from '../components/BottomNav';
import { RaceSwitcher } from '../components/RaceSwitcher';
import { ShareButton } from '../components/ShareButton';
import { PushInvite } from '../components/PushInvite';
import { api, ApiError, type RaceSummary } from '../account/api';
import { useAccount } from '../account/AccountProvider';
import { useGame } from '../state/GameProvider';
import { DAY, HOUR, MINUTE } from '../utils/dates';
import { racers } from '../content';
import { img } from '../utils/images';

const RACERS_PER_RACE = 6;

/** "over 2 dagen en 3 uur" */
function untilText(ms: number): string {
  const t = nl.more;
  if (ms < HOUR) return nl.lobby.minutes(Math.max(1, Math.ceil(ms / MINUTE)));
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  return [days ? t.days(days) : '', hours ? t.hours(hours) : ''].filter(Boolean).join(' en ');
}

/** Wachtruimte: je race is nog niet begonnen. Wie doen er mee, en wanneer begint hij? */
export function Lobby() {
  const t = nl.lobby;
  const { race, now, loading } = useGame();
  const { me, reloadRace } = useAccount();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<RaceSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const serverId = race?.serverId;

  // Elke halve minuut kijken wie er nog bij zijn gekomen.
  useEffect(() => {
    if (!serverId) return;
    let cancelled = false;
    const load = () =>
      api
        .race(serverId)
        .then((r) => !cancelled && setSummary(r))
        .catch(() => undefined);
    void load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [serverId]);

  // Gestart? Dan de race opnieuw narekenen (met de computerracers) en naar Home.
  const started = !!race && now >= race.startTime;
  useEffect(() => {
    if (started) void reloadRace().then(() => navigate('/home', { replace: true }));
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="screen" aria-busy="true" />;
  if (!race || !serverId) return <Navigate to="/races" replace />;

  const participants = summary?.participants ?? [];
  const isCreator = summary?.createdBy === me?.nickname;

  const run = async (confirmText: string, job: () => Promise<unknown>) => {
    if (!window.confirm(confirmText)) return;
    try {
      await job();
      await reloadRace();
      navigate('/races', { replace: true });
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : nl.error.text);
    }
  };

  return (
    <div className="screen screen--nav">
      <BackHeader title={summary ? nl.races.name(summary.id, summary.name) : t.title} fallback="/races" />
      <main className="screen__main account">
        <RaceSwitcher />
        {message && <p className="account__error">{message}</p>}
        <section className="card card--wit account__card lobby__start">
          <div className="lobby__when">{race.startTime - now > MINUTE ? t.startsIn(untilText(race.startTime - now)) : t.startsSoon}</div>
          <div className="account__small">
            {race.course.name} · {nl.races.startsAt(race.startTime)} · {t.duration(race.course.days)}
          </div>
        </section>
        <PushInvite />

        <h2 className="more__h2">{t.participants}</h2>
        <ul className="card card--wit lobby__list">
          {participants.map((p) => {
            const r = racers.find((x) => x.id === p.racerId);
            return (
              <li key={p.racerId} className="lobby__row">
                <img src={r ? img(r.image) : img('ui/icon-people.png')} alt="" />
                <div>
                  <b>{r?.name ?? p.racerId}</b>
                  <div className="account__small">
                    {p.nickname || nl.races.removed}
                    {p.userId === me?.id && ` (${t.you})`}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {summary && (
          <p className="account__small center">
            {summary.computerFill === false ? t.noComputer : t.computerFill(RACERS_PER_RACE - participants.length)}
          </p>
        )}
        {summary && participants.length < RACERS_PER_RACE && <ShareButton race={summary} />}
        {summary && participants.some((p) => p.userId === me?.id) && (
          <Link to={`/races/${serverId}/andere-racer`} className="players__join lobby__switch">
            {t.switchRacer} →
          </Link>
        )}

        {isCreator ? (
          <button type="button" className="link-btn account__delete" onClick={() => run(t.cancelConfirm, () => api.cancelRace(serverId))}>
            {t.cancel}
          </button>
        ) : (
          <button type="button" className="link-btn account__delete" onClick={() => run(t.leaveConfirm, () => api.leaveRace(serverId))}>
            {t.leave}
          </button>
        )}
        <Link to="/races" className="players__join">
          {t.toRaces} →
        </Link>
      </main>
      <BottomNav />
    </div>
  );
}
