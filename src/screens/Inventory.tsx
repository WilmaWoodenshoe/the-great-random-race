import { Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { accessories, choices, courses, racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { TraitBar } from '../components/TraitBar';
import { journalLook } from '../components/journalLook';
import { useAccount } from '../account/AccountProvider';
import { ACTION_IDS } from '../game/actions';
import { courseForDays } from '../game/course';
import { BASE_WEIGHTS } from '../game/events';
import type { SpeedEffect } from '../models/Choice';
import type { EventType } from '../models/Event';
import { isTestVersion } from '../utils/env';
import { formatKm } from '../utils/format';
import { img } from '../utils/images';
import { fill, who } from '../utils/text';

const t = nl.inventory;
const gerard = who(racers.find((r) => r.id === 'gerard') ?? racers[0]);
const sample = (s: string) => fill(s, { ...gerard, plek: 'de Walszaal', route: 'De Kasteelrace', finish: 'het Rozenhof' });
const comma = (n: number) => n.toFixed(2).replace('.', ',');
const TRAIT_COLORS = { curious: '#2E8AD8', stubborn: '#F2B71F', chaotic: '#F06A2A', lazy: '#7B4FC4' } as const;
const COLORS = { groen: '#2e7d32', blauw: '#1e63b5', oranje: '#e0601a' } as const;
const ACTION_ICONS: Record<string, string> = {
  voeren: 'ui/t-sla.png',
  aanmoedigen: 'ui/t-ster.png',
  hoed: 'accessories/hoed.png',
  niets: 'ui/t-zzz.png',
};

function duration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  return minutes % 60 === 0 ? `${minutes / 60} uur` : `${comma(Math.round((minutes / 60) * 10) / 10)} uur`;
}

function effectText(effects: SpeedEffect[]): string {
  if (effects.length === 0) return t.noEffect;
  return effects
    .map((e) =>
      e.speed === 0
        ? t.stop(duration(e.minutes))
        : e.speed > 1
          ? t.faster(duration(e.minutes), Math.round((e.speed - 1) * 100))
          : t.slower(duration(e.minutes), Math.round(e.speed * 100)),
    )
    .join(t.then);
}

/** Inventaris (alleen voor de beheerder en in de testversie): alles wat in de race zit. */
export function Inventory() {
  const { me } = useAccount();
  if (!isTestVersion && !me?.isAdmin) return <Navigate to="/meer" replace />;

  const totalWeight = Object.values(BASE_WEIGHTS).reduce((a, b) => a + b, 0);
  const eventTypes = [
    ...(Object.entries(BASE_WEIGHTS) as [EventType, number][]).sort((a, b) => b[1] - a[1]),
    ['rain', 0] as [EventType, number],
  ];
  const texts = nl.engine.events as Record<string, string[]>;

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback="/meer">
        <p className="back-header__intro">{t.intro}</p>
      </BackHeader>
      <main className="screen__main inv">
        <h2 className="more__h2">
          {t.racers} ({racers.length})
        </h2>
        <p className="inv__intro">{t.racersIntro}</p>
        {racers.map((r) => (
          <article key={r.id} className="card card--wit inv__card">
            <div className="inv__head">
              <img src={img(r.image)} alt="" className="inv__racer" />
              <div>
                <h3 className="inv__h3">{r.name}</h3>
                <div className="account__small">
                  {r.species} · {r.title}
                </div>
                <div className="inv__tagline">{r.tagline}</div>
              </div>
            </div>
            <div className="inv__chips">
              <span>{t.speed(comma(r.speed))}</span>
              <span>{r.pronoun ?? 'hij'}</span>
              {r.hatSpot && <span>{t.hat}</span>}
              {t.special[r.species] && <span>{t.special[r.species]}</span>}
            </div>
            {(Object.keys(TRAIT_COLORS) as (keyof typeof TRAIT_COLORS)[]).map((k) => (
              <TraitBar key={k} label={t.traits[k]} value={r.traits[k]} color={TRAIT_COLORS[k]} />
            ))}
          </article>
        ))}

        <h2 className="more__h2">
          {t.events} ({eventTypes.length})
        </h2>
        <p className="inv__intro">{t.eventsIntro}</p>
        {eventTypes.map(([type, weight]) => {
          const info = t.eventInfo[type];
          const look = journalLook({ id: '', time: 0, kind: 'event', racerId: null, eventType: type, text: '' });
          const list = [
            ...(texts[type] ?? []),
            ...(type === 'rock' ? texts.rock_family : []),
            ...(type === 'puddle' ? texts.puddle_duck : []),
          ];
          return (
            <article key={type} className={`card card--wit inv__card inv__event inv__event--${look.tone}`}>
              <div className="inv__head">
                <img src={img(look.icon)} alt="" className="inv__icon" />
                <div>
                  <h3 className="inv__h3">{info?.name ?? type}</h3>
                  <div className="account__small">
                    {weight ? t.share(Math.round((weight / totalWeight) * 100)) : ''}
                    {info?.trait ? `${weight ? ' · ' : ''}${t.moreWith(info.trait)}` : ''}
                  </div>
                </div>
              </div>
              <p className="inv__effect">{info?.effect}</p>
              <details>
                <summary>{t.texts(list.length)}</summary>
                <ul>
                  {list.map((x) => (
                    <li key={x}>{sample(x)}</li>
                  ))}
                </ul>
              </details>
            </article>
          );
        })}

        <h2 className="more__h2">
          {t.choices} ({choices.length})
        </h2>
        <p className="inv__intro">{t.choicesIntro}</p>
        {choices.map((c) => (
          <article key={c.id} className="card card--wit inv__card">
            <div className="inv__head">
              <img src={img(c.image)} alt="" className="inv__choice" />
              <div>
                <h3 className="inv__h3">{c.title}</h3>
                {c.aboutRacer && <div className="account__small">{t.onlyWhen(c.aboutRacer)}</div>}
              </div>
            </div>
            <p className="inv__effect">{sample(c.text)}</p>
            <ul className="inv__opts">
              {c.options.map((o) => (
                <li key={o.id}>
                  <span className="inv__dot" style={{ background: COLORS[o.color] }} />
                  <div>
                    <b>{o.label}</b> · <span className="account__small">{effectText(o.effects)}</span>
                    <div className="inv__quote">“{sample(o.journal[0])}”</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}

        <h2 className="more__h2">{t.actions}</h2>
        {ACTION_IDS.map((id) => (
          <div key={id} className="card card--wit inv__card">
            <div className="inv__head">
              <img src={img(ACTION_ICONS[id])} alt="" className="inv__icon" />
              <div>
                <b>{sample(nl.action.options[id].title)}</b>
                <div className="account__small">{sample(nl.action.options[id].effect)}</div>
              </div>
            </div>
          </div>
        ))}

        <h2 className="more__h2">
          {t.routes} ({courses.length})
        </h2>
        {courses.map((c) => (
          <article key={c.id} className="card card--wit inv__card">
            <div className="inv__head inv__head--top">
              <img src={img(c.map.image)} alt="" className="inv__map" />
              <div>
                <h3 className="inv__h3">{c.name}</h3>
                <div className="account__small">
                  {t.lengths(
                    formatKm(courseForDays(c, 7).lengthKm),
                    formatKm(courseForDays(c, 14).lengthKm),
                    formatKm(courseForDays(c, 21).lengthKm),
                  )}
                </div>
                <ol className="inv__segments">
                  {c.segments.map((s) => (
                    <li key={s.id}>
                      {s.name} <span className="account__small">· {t.terrain(s.terrain)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}

        <h2 className="more__h2">
          {t.accessories} ({accessories.length})
        </h2>
        <div className="inv__acc">
          {accessories.map((a) => (
            <figure key={a.id} className="card card--wit">
              <img src={img(a.image)} alt="" />
              <figcaption>
                {a.name}
                <span className="account__small">{a.id === 'hoed' ? t.accessoryUsed : t.accessoryUnused}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </div>
  );
}
