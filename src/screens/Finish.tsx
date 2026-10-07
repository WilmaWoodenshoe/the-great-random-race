import { nl } from '../content/nl';
import { getCourse, getRacer, playerRacer } from '../content';
import { demoFinish, demoRace } from '../demo/voorbeeld';
import { Confetti } from '../components/Confetti';
import { LivingRacer } from '../components/Gerard';
import { PrimaryButton } from '../components/PrimaryButton';
import { formatDaysHours, formatKm } from '../utils/format';
import { img } from '../utils/images';

/** Uitslag met confetti (Finish.html). */
export function Finish() {
  const t = nl.finish;
  const course = getCourse(demoRace.courseId);
  const me = playerRacer;
  const myPlace = demoFinish.podium.findIndex((p) => p.racerId === me.id) + 1;
  const won = myPlace === 1;

  return (
    <div className="screen finish">
      {myPlace >= 1 && myPlace <= 3 && <Confetti amount={won ? 'groot' : 'klein'} />}

      <header className="finish__header">
        <div className="badge badge--finish">{t.badge}</div>
        <h1 className="kop kop--38 finish__title">{won ? t.winner(me.name) : t.place(me.name, myPlace)}</h1>
        <div className="finish__sub">
          {nl.common.raceNumber(demoRace.number)} · {course.name}
        </div>
      </header>

      <main className="screen__main finish__main">
        <div className="finish__hero">
          <img className="finish__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
          <LivingRacer
            image={won ? 'racers/gerard-kroon.webp' : me.image}
            alt={won ? t.winnerAlt(me.name) : me.name}
            className="finish__gerard"
          />
        </div>

        <section aria-label={t.podium} className="card card--wit finish__podium">
          {demoFinish.podium.map((p, i) => {
            const racer = getRacer(p.racerId);
            return (
              <div className="finish__row" key={p.racerId}>
                <img className="finish__medal" src={img(`ui/medal${i + 1}.png`)} alt={nl.leaderboard.place(i + 1)} />
                <img className="finish__racer" src={img(racer.image)} alt="" />
                <div className="finish__name">{racer.name}</div>
                <div className="finish__value">
                  {p.hours !== undefined ? formatDaysHours(p.hours) : formatKm(p.km ?? 0)}
                </div>
              </div>
            );
          })}
        </section>

        <section className="finish__stats">
          <div className="finish__stats-title">{t.statsTitle}</div>
          {demoFinish.stats.map((s) => (
            <div className="finish__stat" key={s.label}>
              <span>{s.label}</span>
              <b>{s.value}</b>
            </div>
          ))}
        </section>
      </main>

      <div className="screen__footer">
        <PrimaryButton to="/" arrow>
          {t.newRace}
        </PrimaryButton>
      </div>
    </div>
  );
}
