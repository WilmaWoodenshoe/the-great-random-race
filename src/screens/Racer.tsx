import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { BottomNav } from '../components/BottomNav';
import { LivingRacer, moodFor } from '../components/Gerard';
import { TraitBar } from '../components/TraitBar';
import { JournalEntry } from '../components/JournalEntry';
import { journalLook } from '../components/journalLook';
import { ClockCircle, NoCircle, PlusCircle, StarOutline } from '../components/Icons';
import { activityAt } from '../game/status';
import { careerStats } from '../game/session';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { formatClock } from '../utils/dates';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';

/**
 * Racerprofiel (Racer.html). Zonder id: de racer van de speler (Gerard),
 * met zijn loopbaan. Met id (/racer/ducky): een tegenstander in deze race.
 */
export function Racer() {
  const { id } = useParams();
  const { loading, save } = useGame();
  const view = useRaceView();
  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const { race, now } = view;
  const t = nl.racer;
  const racerId = id ?? race.playerId;
  const r = race.racers.find((x) => x.id === racerId);
  if (!r) return <Navigate to="/tussenstand" replace />;
  const isPlayer = r.id === race.playerId;
  const standing = view.standings.find((s) => s.racerId === r.id)!;

  // Snelheid: Gerard (1,00) is half vol; de snelste racers bijna vol.
  const speedScore = Math.min(100, r.speed * 50);

  const stats: { label: string; value: ReactNode }[] = isPlayer
    ? (() => {
        const c = careerStats(save, now);
        return [
          { label: t.races, value: c.races },
          { label: t.wins, value: c.wins },
          { label: t.bestPosition, value: c.best ? `#${c.best}` : t.none },
        ];
      })()
    : [
        { label: t.species, value: r.species },
        { label: t.position, value: `#${standing.position}` },
        { label: t.distance, value: formatKm(standing.km) },
      ];

  // De plaatjes naast de weetjes horen bij Gerard; bij anderen alleen tekst.
  const facts: { icon: ReactNode; label: string; value?: string; image: string }[] = [
    { icon: <PlusCircle />, label: t.favoriteFood, value: r.facts?.favoriteFood, image: 'ui/t-sla.png' },
    { icon: <NoCircle />, label: t.dislikes, value: r.facts?.dislikes, image: 'ui/t-steen.png' },
    { icon: <StarOutline />, label: t.favoriteActivity, value: r.facts?.favoriteActivity, image: 'ui/t-zzz.png' },
    { icon: <ClockCircle />, label: t.secretTalent, value: r.facts?.secretTalent, image: 'ui/t-ster.png' },
  ];

  const recent = view.journal.filter((e) => e.racerId === r.id).slice(0, 4);

  return (
    <div className="screen screen--nav">
      <BackHeader title={r.name} subtitle={r.title} fallback={isPlayer ? '/home' : '/tussenstand'} />

      <div className="racer__hero">
        <img className="racer__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
        <LivingRacer
          image={r.image}
          alt={t.inLandscape(r.name)}
          mood={moodFor(activityAt(race, r.id, now))}
          wobble
          className="racer__gerard"
        />
      </div>

      <main className="screen__main racer__main">
        <div className="racer__stats">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="racer__stat-label">{s.label}</div>
              <div className="racer__stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        <section className="racer__traits">
          <h2 className="racer__h2">{t.traitsTitle}</h2>
          <TraitBar label={t.speed} value={speedScore} color="#3FA34D" />
          <TraitBar label={t.curious} value={r.traits.curious} color="#2E8AD8" />
          <TraitBar label={t.stubborn} value={r.traits.stubborn} color="#F2B71F" />
          <TraitBar label={t.chaotic} value={r.traits.chaotic} color="#F06A2A" />
          <TraitBar label={t.lazy} value={r.traits.lazy} color="#7B4FC4" />
        </section>

        <section className="racer__facts">
          {facts
            .filter((f) => f.value)
            .map((f) => (
              <div className="racer__fact-row" key={f.label}>
                <div className="racer__fact">
                  {f.icon}
                  {f.label}
                </div>
                <div className="racer__fact">
                  {isPlayer && <img src={img(f.image)} alt="" />}
                  {f.value}
                </div>
              </div>
            ))}
        </section>

        <section className="racer__recent">
          <h2 className="racer__h2">{t.recent}</h2>
          {recent.length === 0 ? (
            <p className="racer__empty">{t.nothingYet(r.name)}</p>
          ) : (
            <ol className="journal__list">
              {recent.map((e) => {
                const look = journalLook(e);
                return <JournalEntry key={e.id} time={formatClock(e.time)} tone={look.tone} icon={look.icon} text={e.text} />;
              })}
            </ol>
          )}
          <Link to="/journaal" className="racer__more">
            {t.toJournal} →
          </Link>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
