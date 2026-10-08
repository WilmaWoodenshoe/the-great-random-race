import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { BookIcon } from '../components/Icons';
import { JournalEntry } from '../components/JournalEntry';
import { journalLook } from '../components/journalLook';
import type { JournalEntry as Entry } from '../models/JournalEntry';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { DAY, formatClock, localDateKey } from '../utils/dates';

/** Kop boven elke dag: "Vandaag", "Gisteren" of "woensdag 7 oktober". */
function dayLabel(time: number, now: number): string {
  const key = localDateKey(time);
  if (key === localDateKey(now)) return nl.journal.today;
  if (key === localDateKey(now - DAY)) return nl.journal.yesterday;
  return nl.journal.day(time);
}

/** Journaal (Journal.html): alles wat er gebeurd is, nieuwste bovenaan, per dag. */
export function Journal() {
  const { loading, save, markJournalSeen } = useGame();
  const view = useRaceView();
  const [onlyPlayer, setOnlyPlayer] = useState(false);

  // Wat er sinds de vorige keer kijken bij is gekomen, telt als 'nieuw'.
  const seenBefore = useRef<number | null>(null);
  if (seenBefore.current === null && !loading) seenBefore.current = save.journalSeenAt;
  const now = view?.now;
  useEffect(() => {
    if (!loading && now !== undefined) void markJournalSeen(now);
    // Alleen bij openen van het scherm, niet bij elke tik van de klok.
  }, [loading]);

  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const { race, player } = view;
  const t = nl.journal;
  const entries = onlyPlayer ? view.journal.filter((e) => e.racerId === race.playerId) : view.journal;
  const seen = seenBefore.current ?? 0;
  const newCount = view.journal.filter((e) => e.time > seen).length;

  // Per kalenderdag groeperen (de lijst is al nieuwste-eerst).
  const days: { key: string; label: string; items: Entry[] }[] = [];
  for (const e of entries) {
    const key = localDateKey(e.time);
    if (days.at(-1)?.key !== key) days.push({ key, label: dayLabel(e.time, view.now), items: [] });
    days.at(-1)!.items.push(e);
  }

  return (
    <div className="screen">
      <BackHeader
        title={
          <span className="kop--met-icoon">
            <BookIcon />
            {t.title(player.name)}
          </span>
        }
      >
        <div className="journal__bar">
          <div className="tabs" role="group" aria-label={t.filterLabel}>
            <button type="button" className={`tab${!onlyPlayer ? ' tab--on' : ''}`} aria-pressed={!onlyPlayer} onClick={() => setOnlyPlayer(false)}>
              {t.all}
            </button>
            <button type="button" className={`tab${onlyPlayer ? ' tab--on' : ''}`} aria-pressed={onlyPlayer} onClick={() => setOnlyPlayer(true)}>
              {t.onlyPlayer(player.name)}
            </button>
          </div>
          <span className="journal__race-label">{nl.common.raceNumber(race.number)}</span>
        </div>
        {newCount > 0 && seen > 0 && <div className="journal__new">{t.newCount(newCount)}</div>}
      </BackHeader>

      <main className="screen__main journal">
        {days.length === 0 && <p className="journal__empty">{t.empty}</p>}
        {days.map((d) => (
          <section key={d.key} className="journal__day">
            <h2 className="journal__day-label">{d.label}</h2>
            <ol className="journal__list">
              {d.items.map((e) => {
                const look = journalLook(e);
                return (
                  <JournalEntry
                    key={e.id}
                    time={formatClock(e.time)}
                    tone={look.tone}
                    icon={look.icon}
                    text={e.text}
                    isNew={seen > 0 && e.time > seen}
                    isPlayer={e.racerId === race.playerId}
                  />
                );
              })}
            </ol>
          </section>
        ))}
      </main>
    </div>
  );
}
