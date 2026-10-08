import { Link, Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BottomNav } from '../components/BottomNav';
import { TrophyIcon } from '../components/Icons';
import { Pill } from '../components/Pill';
import { getRaceRacer } from '../game/engine';
import { useGame } from '../state/GameProvider';
import { useRaceView, type RaceView } from '../state/useRaceView';
import { DAY } from '../utils/dates';
import { formatDaysHours, formatKm } from '../utils/format';
import { img } from '../utils/images';

/** Een droog commentaartje onder de stand; wisselt per dag. */
function comment(view: RaceView): { bold: string; rest: string } {
  const t = nl.leaderboard;
  const { race, standings, me, player, now } = view;
  const name = (id: string) => getRaceRacer(race, id).name;
  const ahead = standings[me.position - 2];
  const last = standings[standings.length - 1];
  const day = Math.max(0, Math.floor((now - race.startTime) / DAY));
  const quip = t.quips[day % t.quips.length];

  if (me.finishTime !== null) return { bold: t.finished(player.name, me.position), rest: '' };
  if (!ahead) {
    return { bold: t.leading(player.name), rest: quip(player.name, name(last.racerId)) };
  }
  return {
    bold: t.behind(player.name, formatKm(Math.max(0, ahead.km - me.km)), name(ahead.racerId)),
    rest: quip(name(ahead.racerId), name(last.racerId === race.playerId ? standings[standings.length - 2].racerId : last.racerId)),
  };
}

/** Tussenstand (Leaderboard.html). */
export function Leaderboard() {
  const { loading } = useGame();
  const view = useRaceView();
  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const { race, standings } = view;
  const c = comment(view);

  return (
    <div className="screen screen--nav">
      <header className="board__header">
        <h1 className="kop kop--32 kop--met-icoon">
          <TrophyIcon />
          {nl.leaderboard.title}
        </h1>
        <div className="center">
          <Pill>
            {nl.common.raceNumber(race.number)} · {race.racers.length} {nl.common.racers} ·{' '}
            {(view.finished ? nl.home.raceOver : nl.common.daysLeft(view.daysLeft)).toLowerCase()}
          </Pill>
        </div>
      </header>

      <main className="screen__main board">
        <ol className="board__list">
          {standings.map((s) => {
            const racer = getRaceRacer(race, s.racerId);
            const isMe = s.racerId === race.playerId;
            return (
              <li key={s.racerId}>
                <Link
                  to={isMe ? '/gerard' : `/racer/${s.racerId}`}
                  className={`board__row${isMe ? ' board__row--me' : ''}`}
                  aria-label={nl.racer.open(racer.name)}
                >
                  {s.position <= 3 ? (
                    <img className="board__medal" src={img(`ui/medal${s.position}.png`)} alt={nl.leaderboard.place(s.position)} />
                  ) : (
                    <div className="board__place">{s.position}</div>
                  )}
                  <img className="board__racer" src={img(racer.image)} alt="" />
                  <div className="board__name">{racer.name}</div>
                  <div className={`board__km${isMe ? ' board__km--me' : ''}`}>
                    {s.finishTime !== null ? formatDaysHours((s.finishTime - race.startTime) / 3_600_000) : formatKm(s.km)}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="card card--wit board__comment">
          <b>{c.bold}</b> {c.rest}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
