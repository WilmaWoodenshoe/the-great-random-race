import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { Confetti } from '../components/Confetti';
import { LivingRacer } from '../components/Gerard';
import { PrimaryButton } from '../components/PrimaryButton';
import { finalStandings, getRaceRacer } from '../game/engine';
import { finishStats } from '../game/stats';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { HOUR } from '../utils/dates';
import { formatDaysHours, formatKm } from '../utils/format';
import { img } from '../utils/images';

/** Uitslag met confetti (Finish.html): dramatisch, met statistieken die niemand vroeg. */
export function Finish() {
  const { loading, startNewRace, markFinishSeen } = useGame();
  const view = useRaceView();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const raceId = view?.finished ? view.race.id : null;
  useEffect(() => {
    if (raceId) void markFinishSeen(raceId);
    // Eén keer per race markeren als gezien.
  }, [raceId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const t = nl.finish;
  const { race, player } = view;

  // De race loopt nog: dan is er nog geen uitslag.
  if (!view.finished) {
    return (
      <div className="screen not-found">
        <div className="badge badge--finish">{t.badge}</div>
        <h1 className="kop kop--36">{t.notOver}</h1>
        <p>{t.notOverText(nl.common.daysLeft(view.daysLeft))}</p>
        <PrimaryButton to="/home">{t.toHome}</PrimaryButton>
      </div>
    );
  }

  const standings = finalStandings(race);
  const me = standings.find((s) => s.racerId === race.playerId)!;
  const won = me.position === 1;
  const podium = me.position <= 3;
  // De eerste drie, en Gerard erbij als hij daar niet tussen staat.
  const rows = standings.filter((s) => s.position <= 3 || s.racerId === race.playerId);
  const stats = finishStats(race);

  const title = won
    ? t.winner(player.name)
    : me.finishTime !== null
      ? t.place(player.name, me.position)
      : t.placeNotFinished(player.name, me.position);
  const line = won
    ? t.winnerLine
    : podium
      ? t.podiumLine
      : me.finishTime !== null
        ? t.finishedLine
        : t.notFinishedLine(formatKm(me.km));

  const newRace = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await startNewRace();
      navigate('/home', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen finish">
      {podium && <Confetti amount={won ? 'groot' : 'klein'} />}

      <header className="finish__header">
        <div className="badge badge--finish">{t.badge}</div>
        <h1 className="kop kop--38 finish__title">{title}</h1>
        <div className="finish__sub">
          {nl.common.raceNumber(race.number)} · {race.course.name}
        </div>
      </header>

      <main className="screen__main finish__main">
        <div className="finish__hero">
          <img className="finish__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
          <LivingRacer
            image={won ? 'racers/gerard-kroon.webp' : player.image}
            alt={won ? t.winnerAlt(player.name) : player.name}
            hat={won ? undefined : view.hat}
            mood={me.finishTime === null ? 'slaapt' : 'gewoon'}
            wobble
            className="finish__gerard"
          />
        </div>

        <p className="finish__line">{line}</p>

        <section aria-label={t.podium} className="card card--wit finish__podium">
          {rows.map((s) => {
            const racer = getRaceRacer(race, s.racerId);
            const isMe = s.racerId === race.playerId;
            return (
              <div className={`finish__row${isMe ? ' finish__row--me' : ''}`} key={s.racerId}>
                {s.position <= 3 ? (
                  <img className="finish__medal" src={img(`ui/medal${s.position}.png`)} alt={nl.leaderboard.place(s.position)} />
                ) : (
                  <div className="finish__place">{s.position}</div>
                )}
                <img className="finish__racer" src={img(racer.image)} alt="" />
                <div className="finish__name">{racer.name}</div>
                <div className="finish__value">
                  {s.finishTime !== null ? formatDaysHours((s.finishTime - race.startTime) / HOUR) : formatKm(s.km)}
                </div>
              </div>
            );
          })}
        </section>

        {stats.length > 0 && (
          <section className="finish__stats">
            <div className="finish__stats-title">{t.statsTitle}</div>
            {stats.map((s) => (
              <div className="finish__stat" key={s.label}>
                <span>{s.label}</span>
                <b>{s.value}</b>
              </div>
            ))}
          </section>
        )}
      </main>

      <div className="screen__footer">
        <PrimaryButton onClick={newRace} arrow={!busy}>
          {busy ? nl.welcome.starting : t.newRace}
        </PrimaryButton>
      </div>
    </div>
  );
}
