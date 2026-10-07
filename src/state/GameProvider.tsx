import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ActionId, Race } from '../models/Race';
import { EMPTY_SAVE, type SaveData } from '../models/Save';
import { decideChoice, doAction } from '../game/engine';
import { archiveIfFinished, startRace } from '../game/session';
import { createIndexedDbStorage, requestPersistentStorage, type GameStorage } from '../storage/storage';

interface GameContextValue {
  /** True zolang de opgeslagen gegevens nog geladen worden. */
  loading: boolean;
  save: SaveData;
  race: Race | null;
  /** De tijd volgens de app (echte tijd + eventueel vooruitgespoeld). */
  now: number;
  startNewRace(): Promise<void>;
  decide(scheduledId: string, optionId: string): Promise<void>;
  act(actionId: ActionId): Promise<void>;
  /** Testversie: klok vooruit of terug zetten. */
  setClockOffset(ms: number): Promise<void>;
  /** Testversie: alles wissen. */
  resetAll(): Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Hoe vaak de klok in de app ververst wordt. */
const TICK_MS = 30_000;

export function GameProvider({ children, storage }: { children: ReactNode; storage?: GameStorage }) {
  const store = useRef(storage ?? createIndexedDbStorage()).current;
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveData>(EMPTY_SAVE);
  const [realNow, setRealNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    store.load().then((data) => {
      if (cancelled) return;
      setSave(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

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

  // Afgelopen races komen vanzelf in de geschiedenis.
  useEffect(() => {
    if (loading) return;
    const archived = archiveIfFinished(save, now);
    if (archived !== save) {
      setSave(archived);
      void store.save(archived);
    }
  }, [loading, save, now, store]);

  const update = useCallback(
    async (change: (current: SaveData, at: number) => SaveData) => {
      const at = Date.now() + save.clockOffset;
      const next = change(save, at);
      setSave(next);
      setRealNow(Date.now());
      await store.save(next);
    },
    [save, store],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      loading,
      save,
      race: save.race,
      now,
      startNewRace: async () => {
        await update((s, at) => startRace(s, at));
        void requestPersistentStorage();
      },
      decide: (scheduledId, optionId) =>
        update((s, at) => ({ ...s, race: s.race && decideChoice(s.race, scheduledId, optionId, at) })),
      act: (actionId) => update((s, at) => ({ ...s, race: s.race && doAction(s.race, actionId, at) })),
      setClockOffset: (ms) => update((s) => ({ ...s, clockOffset: ms })),
      resetAll: async () => {
        await store.clear();
        setSave({ ...EMPTY_SAVE });
      },
    }),
    [loading, save, now, update, store],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame moet binnen <GameProvider> gebruikt worden');
  return ctx;
}
