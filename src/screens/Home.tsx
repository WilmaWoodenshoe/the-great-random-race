import { Link, Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BottomNav } from '../components/BottomNav';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { LivingRacer, moodFor } from '../components/Gerard';
import { Gear } from '../components/Icons';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { formatClock } from '../utils/dates';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';

/** Klein plaatje bij "Gerard is momenteel…", passend bij wat hij doet. */
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
  // Net afgelopen en de uitslag nog niet gezien: meteen naar de finish.
  if (view.finished && save.finishSeenRaceId !== view.race.id) return <Navigate to="/finish" replace />;

  const { race, player: me, me: standing, journal } = view;
  const t = nl.home;
  const latest = journal[0];
  const change = view.positionChange;

  return (
    <div className="screen screen--nav">
      <img className="home__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
      <div className="home__fade" />

      <header className="home__header">
        <img className="logo" src={img('ui/logo.png')} alt={nl.app.logoAlt} />
        <Link to="/meer" className="icon-btn icon-btn--rond home__settings" aria-label={t.settings}>
          <Gear />
        </Link>
      </header>

      <main className="screen__main home__main">
        <section className="card hero-card">
          <LivingRacer
            image={me.image}
            alt={t.racerAlt(me.name, me.species)}
            wobble
            mood={moodFor(view.activity)}
            hat={view.hat}
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
              <span className="event-teaser__title">{view.openChoice.choice.heading}</span>
              <span className="event-teaser__text">{t.eventDeadline(formatClock(view.openChoice.deadline))}</span>
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

        {view.canAct && (
          <Link to="/actie" className="card card--wit action-teaser">
            <span className="action-teaser__icon" aria-hidden="true">
              <img src={img('ui/t-sla.png')} alt="" />
            </span>
            <span className="action-teaser__body">
              <span className="action-teaser__title">{nl.action.title}</span>
              <span className="action-teaser__text">{t.actionOpen}</span>
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
            <img src={img('ui/icon-flower.png')} alt="" className="stat__icon" />
            <div className="stat__strong">{nl.common.raceNumber(race.number)}</div>
            <div className="stat__small">{race.course.name}</div>
            <div className="stat__small stat__small--gap">
              {view.finished ? t.raceOver : nl.common.daysLeft(view.daysLeft)}
            </div>
          </Link>
          <Link to="/tussenstand" className="stat">
            <img src={img('ui/icon-people.png')} alt="" className="stat__icon" />
            <div className="stat__big">{race.racers.length}</div>
            <div className="stat__label">{nl.common.racers}</div>
          </Link>
          <Link to="/tussenstand" className="stat">
            <img src={img('ui/icon-flower2.png')} alt="" className="stat__icon" />
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
