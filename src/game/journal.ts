import { nl } from '../content/nl';
import type { Accessory } from '../models/Accessory';
import type { EventType } from '../models/Event';
import type { JournalEntry } from '../models/JournalEntry';
import type { Race } from '../models/Race';
import { createRng, deriveSeed } from '../utils/random';
import { DAY } from '../utils/dates';
import { hasEasterEgg } from './course';
import { fill, who } from '../utils/text';
import { hasHat } from './actions';
import { effectiveDecisions, humansOf, ownerOf } from './choices';
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
export function journalAt(race: Race, now: number, wearing: Accessory[] = []): JournalEntry[] {
  const until = Math.min(now, race.endTime);
  const entries: JournalEntry[] = [];
  if (now < race.startTime) return entries;
  const player = who(getRaceRacer(race, race.playerId));
  const humans = humansOf(race);
  // Naam van de route en van de finishplek, voor start-, finish- en slotregels.
  const segments = race.course.segments;
  const route = { route: race.course.name, finish: segments[segments.length - 1]?.withArticle ?? '' };
  // De woorden voor de racer van wie een keuze of actie is.
  const ownerWords = (item: { racerId?: string }) => who(getRaceRacer(race, ownerOf(race, item)));

  entries.push({
    id: 'start',
    time: race.startTime,
    kind: 'start',
    racerId: null,
    text: fill(pickText(t.start, variantFor(race, 'start')), { ...player, ...route }),
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
        text: fill(pickText(t.segment, variantFor(race, `seg:${r.id}:${a.index}`)), { ...who(r), plek: segment.withArticle }),
      });
    }
    if (m.finishTime !== null) {
      entries.push({
        id: `finish-${r.id}`,
        time: m.finishTime,
        kind: 'finish',
        racerId: r.id,
        text: fill(pickText(t.finish, variantFor(race, `finish:${r.id}`)), { ...who(r), ...route }),
      });
    }
  }

  for (const e of race.events) {
    if (e.time > until) continue;
    if (e.racerId) {
      const finished = finishTimes.get(e.racerId);
      if (finished != null && e.time >= finished) continue;
    }
    const racer = e.racerId ? who(getRaceRacer(race, e.racerId)) : {};
    const key = (e.textKey ?? e.type) as EventTextKey;
    let text = fill(pickText(t.events[key], e.variant), racer);
    // Met hoed op reageert het journaal er af en toe op.
    if (e.racerId && humans.includes(e.racerId) && e.variant % 2 === 0 && hasHat(race, e.time, e.racerId)) {
      text += ` ${pickText(t.hatRemarks, e.variant >> 1)}`;
    }
    // En soms op wat de racer van de speler uit de Collectie draagt.
    if (e.racerId === race.playerId && wearing.length && e.variant % 3 === 1) {
      const item = wearing[e.variant % wearing.length];
      text += ` ${fill(pickText(t.wearRemarks, e.variant >> 2), { ...player, ding: item.withArticle })}`;
    }
    entries.push({
      id: e.id,
      time: e.time,
      kind: 'event',
      racerId: e.racerId,
      eventType: e.type as EventType,
      text,
    });
  }

  // Paasei van de route: één keer langs, in de eerste dagen.
  const egg = race.course.map.easterEgg;
  if (egg && hasEasterEgg(race)) {
    const rng = createRng(deriveSeed(race.seed, 'paasei-tijd'));
    const time = Math.round(race.startTime + rng.range(0.3, Math.min(3, race.course.days - 1)) * DAY);
    const texts = t.easterEggs[egg.journalKey] ?? [];
    if (time <= until && texts.length) {
      entries.push({
        id: 'paasei',
        time,
        kind: 'event',
        racerId: null,
        eventType: 'easter_egg',
        text: fill(pickText(texts, rng.int(0, 99)), player),
      });
    }
  }

  for (const sc of race.choices) {
    if (sc.time > until) continue;
    entries.push({
      id: `${sc.id}-gevonden`,
      time: sc.time,
      kind: 'choice',
      racerId: ownerOf(race, sc),
      text: fill(sc.choice.announce, ownerWords(sc)),
    });
  }
  for (const d of effectiveDecisions(race, until)) {
    const sc = race.choices.find((c) => c.id === d.scheduledId)!;
    const option = sc.choice.options.find((o) => o.id === d.optionId);
    if (!option) continue;
    entries.push({
      id: `${sc.id}-gekozen`,
      time: d.time,
      kind: 'decision',
      racerId: ownerOf(race, sc),
      text: fill(pickText(option.journal, sc.variant), ownerWords(sc)),
    });
  }

  for (const a of race.actions) {
    if (a.time > until) continue;
    entries.push({
      id: `actie-${ownerOf(race, a)}-${a.day}`,
      time: a.time,
      kind: 'action',
      racerId: ownerOf(race, a),
      text: fill(pickText(t.actions[a.actionId], a.variant), ownerWords(a)),
    });
  }

  if (now >= race.endTime) {
    entries.push({ id: 'einde', time: race.endTime, kind: 'end', racerId: null, text: fill(pickText(t.end, variantFor(race, 'end')), { ...player, ...route }) });
  }

  // Nieuwste bovenaan; bij gelijke tijd blijft de logische volgorde staan.
  return entries.map((e, i) => ({ e, i })).sort((a, b) => b.e.time - a.e.time || b.i - a.i).map((x) => x.e);
}
