import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { getCourse, playerRacer, racers } from '../content';
import { demoRace } from '../demo/voorbeeld';
import { BottomNav } from '../components/BottomNav';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { LivingRacer } from '../components/Gerard';
import { Gear } from '../components/Icons';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';
import { standings } from './standings';

/** Home (Main.html). */
export function Home() {
  const course = getCourse(demoRace.courseId);
  const me = playerRacer;
  const km = demoRace.distances[me.id] ?? 0;
  const position = standings().findIndex((s) => s.racer.id === me.id) + 1;

  return (
    <div className="screen screen--nav">
      <img className="home__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
      <div className="home__fade" />

      <header className="home__header">
        <img className="logo" src={img('ui/logo.png')} alt={nl.app.logoAlt} />
        <Link to="/meer" className="icon-btn icon-btn--rond home__settings" aria-label={nl.home.settings}>
          <Gear />
        </Link>
      </header>

      <main className="screen__main home__main">
        <section className="card hero-card">
          <LivingRacer image={me.image} alt={`${me.name} de ${me.species.toLowerCase()}`} wobble className="hero-card__img" />
          <div className="hero-card__info">
            <h1 className="kop kop--30">{me.name}</h1>
            <div className="hero-card__title">{me.title}</div>
            <div className="hero-card__pos">
              #{position} <span>{nl.common.of} {racers.length}</span>
            </div>
            <ProgressBar value={km / course.lengthKm} label={course.name} />
            <div className="hero-card__km">
              {formatKm(km)} / {formatKm(course.lengthKm)}
            </div>
          </div>
        </section>

        <section className="card card--wit status-card">
          <img src={img(demoRace.statusIcon)} alt="" className="status-card__icon" />
          <div>
            <div className="status-card__lead">{nl.home.currently(me.name)}</div>
            <div className="status-card__now">{demoRace.status}</div>
          </div>
        </section>

        <PrimaryButton to="/race" arrow>
          {nl.home.viewRace}
        </PrimaryButton>

        <div className="stat-grid">
          <Link to="/race" className="stat">
            <img src={img('ui/icon-flower.png')} alt="" className="stat__icon" />
            <div className="stat__strong">{nl.common.raceNumber(demoRace.number)}</div>
            <div className="stat__small">{course.name}</div>
            <div className="stat__small stat__small--gap">{nl.common.daysLeft(demoRace.daysLeft)}</div>
          </Link>
          <Link to="/tussenstand" className="stat">
            <img src={img('ui/icon-people.png')} alt="" className="stat__icon" />
            <div className="stat__big">{racers.length}</div>
            <div className="stat__label">{nl.common.racers}</div>
          </Link>
          <Link to="/tussenstand" className="stat">
            <img src={img('ui/icon-flower2.png')} alt="" className="stat__icon" />
            <div className="stat__label stat__label--strong">{nl.home.yourPosition}</div>
            <div className="stat__big stat__big--groen">
              {demoRace.positionChange > 0 ? '↑' : demoRace.positionChange < 0 ? '↓' : '='} {Math.abs(demoRace.positionChange)}
            </div>
            <div className="stat__small">{nl.home.now(position)}</div>
          </Link>
        </div>

        <p className="sample-notice">{nl.common.sampleNotice}</p>
      </main>

      <BottomNav />
    </div>
  );
}
