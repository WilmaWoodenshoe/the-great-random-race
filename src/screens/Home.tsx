import { Link, Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BottomNav } from '../components/BottomNav';
import { RaceSwitcher } from '../components/RaceSwitcher';
import { PushInvite } from '../components/PushInvite';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { LivingRacer, moodFor } from '../components/Gerard';
import { Gear, TrophyIcon } from '../components/Icons';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { formatClock } from '../utils/dates';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';
import { newlyUnlocked } from '../game/collection';
import { backgroundOf } from '../game/course';

/** Klein plaatje bij "… is momenteel", passend bij wat de racer doet. */
function statusIcon(activity: string): string {
  switch (activity) {
    case 'flower':
    case 'butterfly':
      return 'ui/icon-flower.png';
    case 'nap':
    case 'raceOver':
      return 'ui/t-zzz.png';
    case 'food':
    case 'snack':
      return 'ui/t-sla.png';
    case 'rock':
      return 'ui/t-steen.png';
    case 'finished':
      return 'ui/t-ster.png';
    default:
      return 'ui/status-icon.png';
  }
}

/** Home (Main.html). */
export function Home() {
  const { loading, save } = useGame();
  const view = useRaceView();
  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;
  // Gedeelde race die nog niet begonnen is: naar de wachtruimte.
  if (view.race.serverId && view.now < view.race.startTime) return <Navigate to="/wachtruimte" replace />;
  // Net afgelopen en de uitslag nog niet gezien: meteen naar de finish.
  if (view.finished && save.finishSeenRaceId !== view.race.id) return <Navigate to="/finish" replace />;

  const { race, player: me, me: standing, journal } = view;
  const t = nl.home;
  const latest = journal[0];
  const fresh = newlyUnlocked(save, view.now);
  const change = view.positionChange;

  return (
    <div className="screen screen--nav">
      {race.course.backgroundTall ? (
        // Staande achtergrond: vult het hele scherm.
        <img className="home__bg home__bg--staand" src={img(race.course.backgroundTall)} alt="" />
      ) : (
        <>
          <img className="home__bg" src={img(backgroundOf(race.course))} alt="" />
          <div className="home__fade" />
        </>
      )}

      <header className="home__header">
        <img className="logo" src={img('ui/logo.png')} alt={nl.app.logoAlt} />
        <Link to="/meer" className="icon-btn icon-btn--rond home__settings" aria-label={t.settings}>
          <Gear />
        </Link>
      </header>

      <main className="screen__main home__main">
        <RaceSwitcher />
        <section className="card hero-card">
          <LivingRacer
            image={me.image}
            alt={t.racerAlt(me.name, me.species)}
            wobble
            mood={moodFor(view.activity)}
            wear={view.wear}
            className="hero-card__img"
          />
          <div className="hero-card__info">
            <h1 className="kop kop--30">{me.name}</h1>
            <div className="hero-card__title">{me.title}</div>
            <div className="hero-card__pos">
              #{standing.position} <span>{nl.common.of} {race.racers.length}</span>
            </div>
            <ProgressBar value={view.progress} label={race.course.name} />
            <div className="hero-card__km">
              {formatKm(standing.km)} / {formatKm(race.course.lengthKm)}
            </div>
          </div>
        </section>

        {view.openChoice && (
          <Link to="/event" className="event-teaser grr-pop">
            <span className="badge event-teaser__badge">{t.eventBadge}</span>
            <span className="event-teaser__body">
              <span className="event-teaser__title">{view.say(view.openChoice.choice.heading)}</span>
              <span className="event-teaser__text">{view.say(t.eventDeadline(formatClock(view.openChoice.deadline)))}</span>
            </span>
            <span className="event-teaser__cta">{t.eventCta}</span>
          </Link>
        )}

        <section className="card card--wit status-card" aria-live="polite">
          <img src={img(statusIcon(view.activity))} alt="" className="status-card__icon" />
          <div>
            <div className="status-card__lead">{t.currently(me.name)}</div>
            <div className="status-card__now">{view.status}</div>
          </div>
        </section>

        {view.finished ? (
          <PrimaryButton to="/finish" arrow>
            {t.raceOverCta}
          </PrimaryButton>
        ) : (
          <PrimaryButton to="/race" arrow>
            {t.viewRace}
          </PrimaryButton>
        )}

        {race.serverId && !view.finished && <PushInvite />}

        {fresh.length > 0 && (
          <Link to="/collectie" className="card card--wit action-teaser grr-pop">
            <span className="action-teaser__icon" aria-hidden="true">
              <img src={img(fresh[0].image)} alt="" />
            </span>
            <span className="action-teaser__body">
              <span className="action-teaser__title">{nl.collection.homeNew(fresh[0].name)}</span>
            </span>
            <span className="action-teaser__arrow" aria-hidden="true">→</span>
          </Link>
        )}

        {view.canAct && (
          <Link to="/actie" className="card card--wit action-teaser">
            <span className="action-teaser__icon" aria-hidden="true">
              <img src={img('ui/t-sla.png')} alt="" />
            </span>
            <span className="action-teaser__body">
              <span className="action-teaser__title">{nl.action.title}</span>
              <span className="action-teaser__text">{view.say(t.actionOpen)}</span>
            </span>
            <span className="action-teaser__arrow" aria-hidden="true">→</span>
          </Link>
        )}

        {latest && (
          <Link to="/journaal" className="card card--wit news-card grr-slide-in" key={latest.id}>
            <span className="news-card__label">
              {t.lastNews} · {formatClock(latest.time)}
            </span>
            <span className="news-card__text">{latest.text}</span>
            <span className="news-card__more">{t.allNews} →</span>
          </Link>
        )}

        <div className="stat-grid">
          <Link to="/race" className="stat">
            <img src={img(race.course.map.image)} alt="" className="stat__map" />
            <div className="stat__strong">{nl.common.raceNumber(race.number)}</div>
            <div className="stat__small">{race.course.name}</div>
            <div className="stat__small stat__small--gap">
              {view.finished ? t.raceOver : nl.common.daysLeft(view.daysLeft)}
            </div>
          </Link>
          <Link to="/tussenstand" className="stat stat--midden">
            <div className="stat__big stat__big--groot">{race.racers.length}</div>
            <div className="stat__label">{nl.common.racers}</div>
          </Link>
          <Link to="/tussenstand" className="stat">
            <span className="stat__trophy">
              <TrophyIcon size={30} />
            </span>
            <div className="stat__label stat__label--strong">{t.yourPosition}</div>
            <div className={`stat__big ${change > 0 ? 'stat__big--groen' : change < 0 ? 'stat__big--oranje' : 'stat__big--grijs'}`}>
              {change > 0 ? '↑' : change < 0 ? '↓' : '='} {change !== 0 && Math.abs(change)}
            </div>
            <div className="stat__small">{t.now(standing.position)}</div>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
