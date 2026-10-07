import { nl } from '../content/nl';
import type { EventType } from '../models/Event';
import type { JournalEntry } from '../models/JournalEntry';
import type { Race } from '../models/Race';
import { createRng, deriveSeed } from '../utils/random';
import { effectiveDecisions } from './choices';
import { getRaceRacer, racerMovement } from './engine';

const t = nl.engine;
type EventTextKey = keyof typeof t.events;

/** Kies een tekstvariant; met een vaste index blijft de tekst altijd dezelfde. */
const pickText = <T,>(list: readonly T[], variant: number): T => list[variant % list.length];

/** Variant voor afgeleide regels (aankomst, finish), vast per race. */
const variantFor = (race: Race, label: string) => createRng(deriveSeed(race.seed, label)).int(0, 99);

/**
 * Het journaal op moment `now`: alleen wat al gebeurd is, nieuwste bovenaan.
 * Events van een racer na zijn finish tellen niet meer mee.
 */
export function journalAt(race: Race, now: number): JournalEntry[] {
  const until = Math.min(now, race.endTime);
  const entries: JournalEntry[] = [];
  if (now < race.startTime) return entries;

  entries.push({
    id: 'start',
    time: race.startTime,
    kind: 'start',
    racerId: null,
    text: pickText(t.start, variantFor(race, 'start')),
  });

  const finishTimes = new Map<string, number | null>();
  for (const r of race.racers) {
    const m = racerMovement(race, r.id, until);
    finishTimes.set(r.id, m.finishTime);
    for (const a of m.arrivals) {
      const segment = race.course.segments[a.index];
      entries.push({
        id: `seg-${r.id}-${a.index}`,
        time: a.time,
        kind: 'segment',
        racerId: r.id,
        text: pickText(t.segment, variantFor(race, `seg:${r.id}:${a.index}`))(r.name, segment.withArticle),
      });
    }
    if (m.finishTime !== null) {
      entries.push({
        id: `finish-${r.id}`,
        time: m.finishTime,
        kind: 'finish',
        racerId: r.id,
        text: pickText(t.finish, variantFor(race, `finish:${r.id}`))(r.name),
      });
    }
  }

  for (const e of race.events) {
    if (e.time > until) continue;
    if (e.racerId) {
      const finished = finishTimes.get(e.racerId);
      if (finished != null && e.time >= finished) continue;
    }
    const name = e.racerId ? getRaceRacer(race, e.racerId).name : '';
    const key = (e.textKey ?? e.type) as EventTextKey;
    const texts = t.events[key] as readonly ((n: string) => string)[];
    entries.push({
      id: e.id,
      time: e.time,
      kind: 'event',
      racerId: e.racerId,
      eventType: e.type as EventType,
      text: pickText(texts, e.variant)(name),
    });
  }

  for (const sc of race.choices) {
    if (sc.time > until) continue;
    entries.push({ id: `${sc.id}-gevonden`, time: sc.time, kind: 'choice', racerId: race.playerId, text: sc.choice.announce });
  }
  for (const d of effectiveDecisions(race, until)) {
    const sc = race.choices.find((c) => c.id === d.scheduledId)!;
    const option = sc.choice.options.find((o) => o.id === d.optionId);
    if (!option) continue;
    entries.push({
      id: `${sc.id}-gekozen`,
      time: d.time,
      kind: 'decision',
      racerId: race.playerId,
      text: pickText(option.journal, sc.variant),
    });
  }

  for (const a of race.actions) {
    if (a.time > until) continue;
    entries.push({
      id: `actie-${a.day}`,
      time: a.time,
      kind: 'action',
      racerId: race.playerId,
      text: pickText(t.actions[a.actionId], a.variant),
    });
  }

  if (now >= race.endTime) {
    entries.push({ id: 'einde', time: race.endTime, kind: 'end', racerId: null, text: pickText(t.end, variantFor(race, 'end')) });
  }

  // Nieuwste bovenaan; bij gelijke tijd blijft de logische volgorde staan.
  return entries.map((e, i) => ({ e, i })).sort((a, b) => b.e.time - a.e.time || b.i - a.i).map((x) => x.e);
}
