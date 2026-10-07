import type { ReactNode } from 'react';
import { nl } from '../content/nl';
import { playerRacer } from '../content';
import { demoRace } from '../demo/voorbeeld';
import { BackHeader } from '../components/BackHeader';
import { BottomNav } from '../components/BottomNav';
import { LivingRacer } from '../components/Gerard';
import { TraitBar } from '../components/TraitBar';
import { ClockCircle, NoCircle, PlusCircle, StarOutline } from '../components/Icons';
import { img } from '../utils/images';

/** Racerprofiel (Racer.html). */
export function Racer() {
  const r = playerRacer;
  const t = nl.racer;
  const h = demoRace.history;
  // Snelheid: Gerard (1,00) = half vol; de snelste racer (1,30) bijna vol.
  const speedScore = Math.min(100, r.speed * 50);

  const facts: { icon: ReactNode; label: string; value?: string; image: string }[] = [
    { icon: <PlusCircle />, label: t.favoriteFood, value: r.facts?.favoriteFood, image: 'ui/t-sla.png' },
    { icon: <NoCircle />, label: t.dislikes, value: r.facts?.dislikes, image: 'ui/t-steen.png' },
    { icon: <StarOutline />, label: t.favoriteActivity, value: r.facts?.favoriteActivity, image: 'ui/t-zzz.png' },
    { icon: <ClockCircle />, label: t.secretTalent, value: r.facts?.secretTalent, image: 'ui/t-ster.png' },
  ];

  return (
    <div className="screen screen--nav">
      <BackHeader title={r.name} subtitle={r.title} />

      <div className="racer__hero">
        <img className="racer__bg" src={img('backgrounds/bg-landschap.webp')} alt="" />
        <LivingRacer image={r.image} alt={t.inLandscape(r.name)} className="racer__gerard" />
      </div>

      <main className="screen__main racer__main">
        <div className="racer__stats">
          <div>
            <div className="racer__stat-label">{t.races}</div>
            <div className="racer__stat-value">{h.races}</div>
          </div>
          <div>
            <div className="racer__stat-label">{t.wins}</div>
            <div className="racer__stat-value">{h.wins}</div>
          </div>
          <div>
            <div className="racer__stat-label">{t.bestPosition}</div>
            <div className="racer__stat-value">#{h.best}</div>
          </div>
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
                  <img src={img(f.image)} alt="" />
                  {f.value}
                </div>
              </div>
            ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
