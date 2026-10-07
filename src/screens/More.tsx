import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { BottomNav } from '../components/BottomNav';
import { ChevronRight } from '../components/Icons';
import { careerStats } from '../game/session';
import { isFinished } from '../game/engine';
import { useGame } from '../state/GameProvider';
import { DAY, HOUR } from '../utils/dates';

interface Item {
  to: string;
  title: string;
  hint: string;
}

function MenuList({ items }: { items: Item[] }) {
  return (
    <ul className="card card--wit menu">
      {items.map((i) => (
        <li key={i.to}>
          <Link to={i.to} className="menu__item">
            <span>
              <span className="menu__title">{i.title}</span>
              <span className="menu__hint">{i.hint}</span>
            </span>
            <ChevronRight />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function clockText(offset: number): string {
  const t = nl.more;
  const days = Math.floor(offset / DAY);
  const hours = Math.round((offset % DAY) / HOUR);
  const parts = [days ? t.days(days) : '', hours ? t.hours(hours) : ''].filter(Boolean);
  return parts.length ? t.clockAhead(parts.join(' en ')) : t.clockNow;
}

/** Meer: toegang tot de overige schermen, je race en de testhulpjes. */
export function More() {
  const t = nl.more;
  const { race, save, now, setClockOffset, resetAll } = useGame();
  const career = careerStats(save, now);

  const reset = async () => {
    if (window.confirm(t.resetConfirm)) await resetAll();
  };

  return (
    <div className="screen screen--nav">
      <header className="board__header">
        <h1 className="kop kop--32 center">{t.title}</h1>
      </header>
      <main className="screen__main more">
        <h2 className="more__h2">{t.raceSection}</h2>
        <MenuList
          items={[
            { to: '/tussenstand', title: t.leaderboard, hint: t.leaderboardHint },
            { to: '/journaal', title: t.journal, hint: t.journalHint },
            { to: '/actie', title: t.action, hint: t.actionHint },
          ]}
        />

        <h2 className="more__h2">{t.yourRace}</h2>
        <div className="card card--wit info">
          {race ? (
            <dl className="info__list">
              <dt>{nl.common.raceNumber(race.number)}</dt>
              <dd>{race.course.name}</dd>
              <dt>{t.started}</dt>
              <dd>{t.dateTime(race.startTime)}</dd>
              <dt>{isFinished(race, now) ? t.ended : t.ends}</dt>
              <dd>{t.dateTime(race.endTime)}</dd>
              <dt>{t.racesRun}</dt>
              <dd>{career.races}</dd>
            </dl>
          ) : (
            <p className="info__empty">{t.noRace}</p>
          )}
        </div>

        <h2 className="more__h2">{t.previewSection}</h2>
        <MenuList
          items={[
            { to: '/welkom', title: t.welcome, hint: t.welcomeHint },
            { to: '/event', title: t.event, hint: t.eventHint },
            { to: '/finish', title: t.finish, hint: t.finishHint },
          ]}
        />

        <h2 className="more__h2">{t.testTools}</h2>
        <div className="card card--wit info">
          <p className="info__hint">{t.testToolsHint}</p>
          <p className="info__clock" role="status">
            {clockText(save.clockOffset)}
          </p>
          <div className="info__buttons">
            <button type="button" className="chip-btn" onClick={() => setClockOffset(save.clockOffset + HOUR)}>
              {t.plusHour}
            </button>
            <button type="button" className="chip-btn" onClick={() => setClockOffset(save.clockOffset + DAY)}>
              {t.plusDay}
            </button>
            <button
              type="button"
              className="chip-btn"
              disabled={save.clockOffset === 0}
              onClick={() => setClockOffset(0)}
            >
              {t.backToNow}
            </button>
          </div>
          <button type="button" className="link-btn" onClick={reset}>
            {t.reset}
          </button>
        </div>

        <p className="more__privacy">{t.privacy}</p>
      </main>
      <BottomNav />
    </div>
  );
}
