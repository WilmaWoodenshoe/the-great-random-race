import { nl } from '../content/nl';
import { playerRacer, racers } from '../content';
import { demoRace } from '../demo/voorbeeld';
import { BottomNav } from '../components/BottomNav';
import { TrophyIcon } from '../components/Icons';
import { Pill } from '../components/Pill';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';
import { standings } from './standings';

/** Tussenstand (Leaderboard.html). */
export function Leaderboard() {
  const rows = standings();
  return (
    <div className="screen screen--nav">
      <header className="board__header">
        <h1 className="kop kop--32 kop--met-icoon">
          <TrophyIcon />
          {nl.leaderboard.title}
        </h1>
        <div className="center">
          <Pill>
            {nl.common.raceNumber(demoRace.number)} · {racers.length} {nl.common.racers} ·{' '}
            {nl.common.daysLeft(demoRace.daysLeft).toLowerCase()}
          </Pill>
        </div>
      </header>

      <main className="screen__main board">
        <ol className="board__list">
          {rows.map(({ racer, km }, i) => {
            const place = i + 1;
            const isMe = racer.id === playerRacer.id;
            return (
              <li key={racer.id} className={`board__row${isMe ? ' board__row--me' : ''}`}>
                {place <= 3 ? (
                  <img className="board__medal" src={img(`ui/medal${place}.png`)} alt={nl.leaderboard.place(place)} />
                ) : (
                  <div className="board__place">{place}</div>
                )}
                <img className="board__racer" src={img(racer.image)} alt="" />
                <div className="board__name">{racer.name}</div>
                <div className={`board__km${isMe ? ' board__km--me' : ''}`}>{formatKm(km)}</div>
              </li>
            );
          })}
        </ol>
        <div className="card card--wit board__comment">
          <b>{demoRace.leaderboardComment.bold}</b> {demoRace.leaderboardComment.rest}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
