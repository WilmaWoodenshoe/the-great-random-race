import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActionId, Race } from '../models/Race';
import { EMPTY_SAVE, type SaveData } from '../models/Save';
import { decideChoice, doAction } from '../game/engine';
import { archiveIfFinished, startRace } from '../game/session';
import { markOpened, wear } from '../game/collection';
import type { AccessorySlot } from '../models/Accessory';
import { localDateKey } from '../utils/dates';
import { createIndexedDbStorage, requestPersistentStorage, type GameStorage } from '../storage/storage';

interface GameContextValue {
  /** True zolang de opgeslagen gegevens nog geladen worden. */
  loading: boolean;
  save: SaveData;
  race: Race | null;
  /** De tijd volgens de app (echte tijd + eventueel vooruitgespoeld). */
  now: number;
  /** Start een nieuwe race met deze racer. */
  startNewRace(racerId: string): Promise<void>;
  decide(scheduledId: string, optionId: string): Promise<void>;
  act(actionId: ActionId): Promise<void>;
  /** Onthoud dat de speler de uitslag van deze race heeft gezien. */
  markFinishSeen(raceId: string): Promise<void>;
  /** Onthoud dat de speler het journaal tot nu heeft gezien. */
  markJournalSeen(time: number): Promise<void>;
  /** Testversie: klok vooruit of terug zetten. */
  setClockOffset(ms: number): Promise<void>;
  /** Testversie: alles wissen. */
  resetAll(): Promise<void>;
  /** Het hele spel vervangen, bijv. door de kopie uit je account. */
  replaceSave(data: SaveData): Promise<void>;
  /**
   * De race vervangen door de nieuwste versie van de server (gedeelde race).
   * Een afgelopen vorige race gaat eerst naar de geschiedenis.
   */
  setRace(race: Race | null): Promise<void>;
  /** Voor gedeelde races: keuzes en acties gaan via de server. */
  setRemote(remote: RemoteMoves | null): void;
  /** Collectie: een accessoire aandoen (of met null de plek leeg maken). */
  wearAccessory(slot: AccessorySlot, id: string | null): Promise<void>;
  /** Collectie: onthoud dat de speler deze verdiende accessoires gezien heeft. */
  markCollectionSeen(ids: string[]): Promise<void>;
}

/** Keuzes en acties in een gedeelde race: de server bewaart ze, en geeft de nieuwe race terug. */
export interface RemoteMoves {
  decide(race: Race, scheduledId: string, optionId: string): Promise<Race>;
  act(race: Race, actionId: ActionId): Promise<Race>;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Hoe vaak de klok in de app ververst wordt. */
const TICK_MS = 30_000;

export function GameProvider({ children, storage }: { children: ReactNode; storage?: GameStorage }) {
  const store = useRef(storage ?? createIndexedDbStorage()).current;
  const [loading, setLoading] = useState(true);
  const [save, setSaveState] = useState<SaveData>(EMPTY_SAVE);
  const [realNow, setRealNow] = useState(() => Date.now());
  // Altijd de nieuwste stand, ook als er snel na elkaar iets verandert.
  const latest = useRef<SaveData>(EMPTY_SAVE);
  const remote = useRef<RemoteMoves | null>(null);
  const setSave = useCallback((data: SaveData) => {
    latest.current = data;
    setSaveState(data);
  }, []);

  /** Opslaan; lukt het niet (bijv. privévenster), dan speelt de app gewoon door. */
  const persist = useCallback(
    async (data: SaveData) => {
      try {
        await store.save(data);
      } catch (err) {
        console.warn('Opslaan op dit toestel lukte niet', err);
      }
    },
    [store],
  );

  useEffect(() => {
    let cancelled = false;
    store
      .load()
      .catch(() => ({ ...EMPTY_SAVE }))
      .then((data) => {
        if (cancelled) return;
        setSave(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [store, setSave]);

  // De klok loopt door, en springt bij terugkomen in de app meteen bij.
  useEffect(() => {
    const tick = () => setRealNow(Date.now());
    const id = window.setInterval(tick, TICK_MS);
    const onVisible = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const now = realNow + save.clockOffset;

  // Onthoud op welke dagen de app open was (voor de Collectie).
  const today = localDateKey(now);
  useEffect(() => {
    if (loading) return;
    const next = markOpened(latest.current, today);
    if (next !== latest.current) {
      setSave(next);
      void persist(next);
    }
  }, [loading, today, persist, setSave]);

  // Afgelopen races komen vanzelf in de geschiedenis.
  useEffect(() => {
    if (loading) return;
    const archived = archiveIfFinished(latest.current, now);
    if (archived !== latest.current) {
      setSave(archived);
      void persist(archived);
    }
  }, [loading, save, now, persist, setSave]);

  const update = useCallback(
    async (change: (current: SaveData, at: number) => SaveData) => {
      const current = latest.current;
      const at = Date.now() + current.clockOffset;
      let next: SaveData;
      try {
        next = change(current, at);
      } catch (err) {
        // Bijv. een keuze die net verlopen is: niets doen, het scherm toont de echte stand.
        console.warn(err);
        setRealNow(Date.now());
        return;
      }
      if (next === current) return;
      setSave(next);
      setRealNow(Date.now());
      await persist(next);
    },
    [persist, setSave],
  );

  const setRaceFromServer = useCallback(
    async (race: Race | null) => {
      let current = latest.current;
      // Een andere race dan de vorige: die vorige eerst in de geschiedenis (als hij klaar is).
      if (current.race && current.race.id !== race?.id) current = archiveIfFinished(current, Date.now() + current.clockOffset);
      const next = { ...current, race, raceCounter: Math.max(current.raceCounter, race?.number ?? 0) };
      setSave(next);
      setRealNow(Date.now());
      await persist(next);
    },
    [persist, setSave],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      loading,
      save,
      race: save.race,
      now,
      startNewRace: async (racerId) => {
        await update((s, at) => startRace(s, at, racerId));
        void requestPersistentStorage();
      },
      decide: async (scheduledId, optionId) => {
        const race = latest.current.race;
        if (race?.serverId && remote.current) return setRaceFromServer(await remote.current.decide(race, scheduledId, optionId));
        await update((s, at) => ({ ...s, race: s.race && decideChoice(s.race, scheduledId, optionId, at) }));
      },
      act: async (actionId) => {
        const race = latest.current.race;
        if (race?.serverId && remote.current) return setRaceFromServer(await remote.current.act(race, actionId));
        await update((s, at) => ({ ...s, race: s.race && doAction(s.race, actionId, at) }));
      },
      markFinishSeen: (raceId) => update((s) => (s.finishSeenRaceId === raceId ? s : { ...s, finishSeenRaceId: raceId })),
      markJournalSeen: (time) => update((s) => (time <= s.journalSeenAt ? s : { ...s, journalSeenAt: time })),
      setClockOffset: (ms) => update((s) => ({ ...s, clockOffset: ms })),
      resetAll: async () => {
        try {
          await store.clear();
        } catch {
          // Niet erg: we beginnen hoe dan ook opnieuw.
        }
        setSave({ ...EMPTY_SAVE });
      },
      replaceSave: async (data) => {
        setSave(data);
        setRealNow(Date.now());
        await persist(data);
      },
      setRace: setRaceFromServer,
      wearAccessory: (slot, id) => update((s) => wear(s, slot, id)),
      markCollectionSeen: (ids) =>
        update((s) => {
          const seen = s.collectionSeen ?? [];
          const extra = ids.filter((id) => !seen.includes(id));
          return extra.length ? { ...s, collectionSeen: [...seen, ...extra] } : s;
        }),
      setRemote: (r) => {
        remote.current = r;
      },
    }),
    [loading, save, now, update, store, setSave, persist, setRaceFromServer],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame moet binnen <GameProvider> gebruikt worden');
  return ctx;
}
