// Account (bijnaam + passkey), gedeelde races en het bewaren van je spel
// op de server. Alleen op thegreatrandomrace.nl; in de testversie staat
// dit uit en speel je alleen, op de telefoon.
//
// Gedeelde race: de server bewaart wie meedoet en de keuzes en acties; de
// app rekent de race na (buildRace) en ververst die regelmatig.
//
// Je eigen spelgegevens (uitslagen, wat je al gezien hebt) bewaren gaat zo:
// - na elke wijziging in je spel stuurt de app (na een tel) een kopie naar de server;
// - opent de app op een andere telefoon, dan haalt hij de nieuwste kopie op;
// - lukt versturen niet (geen internet), dan probeert de app het later opnieuw.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { nl } from '../content/nl';
import type { Race } from '../models/Race';
import type { SaveData } from '../models/Save';
import { useGame } from '../state/GameProvider';
import { parseSave } from '../storage/storage';
import { isTestVersion } from '../utils/env';
import { api, ApiError, type Me, type RaceSummary } from './api';
import { buildRace } from './buildRace';

export type AccountStatus = 'unavailable' | 'checking' | 'offline' | 'out' | 'in';

interface AccountContextValue {
  status: AccountStatus;
  me: Me | null;
  /** Wanneer het spel voor het laatst op de server is bewaard (ms). */
  lastSaved: number | null;
  register(nickname: string): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  deleteAccount(): Promise<void>;
  /** Opnieuw kijken bij de server (bijv. of je al goedgekeurd bent). */
  refresh(): Promise<void>;
  /** Je gedeelde race opnieuw ophalen (na aanmaken, meedoen of afmelden). */
  reloadRace(): Promise<void>;
  /** Alle races waar je aan meedoet (nog niet voorbij, of net afgelopen). */
  myRaces: RaceSummary[];
  /** Een andere van je races bekijken. */
  selectRace(id: number): Promise<void>;
}

/** Mag dit account races maken en meedoen? */
export const isApproved = (me: Me | null) => me?.status === 'approved';

/** Accounts werken alleen op de echte site, en alleen als de browser passkeys kent. */
export const accountsEnabled: boolean =
  !isTestVersion && typeof window !== 'undefined' && typeof window.PublicKeyCredential === 'function';

const META_KEY = 'grr-account-sync';
/** Welke van je races je het laatst bekeek. */
const CURRENT_KEY = 'grr-huidige-race';

function readCurrent(): number | null {
  try {
    const id = Number(localStorage.getItem(CURRENT_KEY));
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

function writeCurrent(id: number | null): void {
  try {
    if (id === null) localStorage.removeItem(CURRENT_KEY);
    else localStorage.setItem(CURRENT_KEY, String(id));
  } catch {
    // Niet erg: dan kiest de app zelf een race.
  }
}

/** Welke race laten we zien? Je laatste keuze, anders een lopende, dan een open, dan de laatste. */
function pickCurrent(races: RaceSummary[], preferred: number | null): RaceSummary | null {
  return (
    races.find((r) => r.id === preferred) ??
    races.filter((r) => r.status === 'running').sort((a, b) => b.startTime - a.startTime)[0] ??
    races.filter((r) => r.status === 'open').sort((a, b) => a.startTime - b.startTime)[0] ??
    [...races].sort((a, b) => b.endTime - a.endTime)[0] ??
    null
  );
}
/** Bij terugkomen in de app hoogstens eens per minuut bij de server kijken. */
const PULL_EVERY_MS = 60_000;
/** Zolang de app open is: zo vaak de gedeelde race verversen (zetten van anderen). */
const RACE_REFRESH_MS = 2 * 60_000;
const UPLOAD_DELAY_MS = 1500;

interface SyncMeta {
  /** Tijdstempel (seconden) van de server bij de laatste geslaagde uitwisseling. */
  syncedAt: number | null;
  /** Er is iets veranderd dat nog niet op de server staat. */
  dirty: boolean;
}

function readMeta(): SyncMeta {
  try {
    const raw = JSON.parse(localStorage.getItem(META_KEY) ?? 'null');
    if (raw && typeof raw === 'object') return { syncedAt: raw.syncedAt ?? null, dirty: !!raw.dirty };
  } catch {
    // Geen opslag beschikbaar: dan beginnen we gewoon leeg.
  }
  return { syncedAt: null, dirty: false };
}

function writeMeta(meta: SyncMeta): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // Niet erg: dan wordt er bij de volgende start opnieuw vergeleken.
  }
}

const isEmpty = (s: SaveData) => !s.race && s.history.length === 0;

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { loading, save, replaceSave, setRace, setRemote } = useGame();
  const [status, setStatus] = useState<AccountStatus>(accountsEnabled ? 'checking' : 'unavailable');
  const [me, setMe] = useState<Me | null>(null);
  const [myRaces, setMyRaces] = useState<RaceSummary[]>([]);
  const [lastSaved, setLastSaved] = useState<number | null>(() => {
    const at = readMeta().syncedAt;
    return at ? at * 1000 : null;
  });

  const latestSave = useRef(save);
  latestSave.current = save;
  // Wat er van de server kwam of er al naartoe ging: dat hoeft niet (nog eens) verstuurd.
  const inSync = useRef<SaveData | null>(null);
  const lastPull = useRef(0);

  const setMeta = useCallback((meta: SyncMeta) => {
    writeMeta(meta);
    if (meta.syncedAt) setLastSaved(meta.syncedAt * 1000);
  }, []);

  const signedOut = useCallback(() => {
    setMe(null);
    setMyRaces([]);
    setStatus('out');
    writeMeta({ syncedAt: null, dirty: false });
    setLastSaved(null);
  }, []);

  const upload = useCallback(
    async (data: SaveData) => {
      writeMeta({ ...readMeta(), dirty: true });
      try {
        const res = await api.putSave(data);
        inSync.current = data;
        setMeta({ syncedAt: res.updatedAt, dirty: false });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) signedOut();
        else console.warn('Bewaren op de server lukte niet; later opnieuw', err);
      }
    },
    [setMeta, signedOut],
  );

  const adopt = useCallback(
    async (data: SaveData, updatedAt: number) => {
      inSync.current = data;
      await replaceSave(data);
      setMeta({ syncedAt: updatedAt, dirty: false });
    },
    [replaceSave, setMeta],
  );

  /**
   * Vergelijk met de server. `justLoggedIn`: net ingelogd op deze telefoon;
   * staan er dan op beide plekken verschillende spellen, dan kiest de speler.
   */
  const syncWithServer = useCallback(
    async (justLoggedIn: boolean) => {
      lastPull.current = Date.now();
      const local = latestSave.current;
      const meta = readMeta();
      const server = await api.getSave();
      if (!server.save || server.updatedAt === null) return upload(local);
      const remote = parseSave(server.save);

      if (justLoggedIn) {
        if (isEmpty(local)) return adopt(remote, server.updatedAt);
        if (isEmpty(remote)) return upload(local);
        if (local.race?.id === remote.race?.id && local.raceCounter === remote.raceCounter) {
          return adopt(remote, server.updatedAt);
        }
        const useRemote = window.confirm(nl.account.chooseRemote(remote.raceCounter, local.raceCounter));
        return useRemote ? adopt(remote, server.updatedAt) : upload(local);
      }

      if (meta.dirty) return upload(local);
      if (server.updatedAt > (meta.syncedAt ?? 0)) return adopt(remote, server.updatedAt);
    },
    [adopt, upload],
  );

  const meRef = useRef<Me | null>(null);
  meRef.current = me;

  /** Je gedeelde races ophalen en de gekozen race narekenen; zonder race: geen race. */
  const loadRaces = useCallback(
    async (preferred: number | null) => {
      const who = meRef.current;
      if (!who) return;
      const { races } = await api.myRaces();
      setMyRaces(races);
      const current = pickCurrent(races, preferred);
      writeCurrent(current?.id ?? null);
      if (!current) {
        // Een oude race van alleen deze telefoon telt niet meer mee.
        if (latestSave.current.race) await setRace(null);
        return;
      }
      await setRace(buildRace(await api.race(current.id), who.id));
    },
    [setRace],
  );
  const reloadRace = useCallback(() => loadRaces(readCurrent()), [loadRaces]);

  const check = useCallback(async () => {
    try {
      const who = await api.me();
      meRef.current = who;
      setMe(who);
      setStatus('in');
      await syncWithServer(false);
      await reloadRace();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) signedOut();
      else if (err instanceof ApiError && err.status === 404) setStatus('unavailable');
      else setStatus((s) => (s === 'in' ? s : 'offline'));
    }
  }, [signedOut, syncWithServer, reloadRace]);

  // Keuzes en acties in een gedeelde race gaan via de server.
  useEffect(() => {
    if (!accountsEnabled) return;
    const refetch = async (race: Race) => buildRace(await api.race(race.serverId!), meRef.current?.id ?? null);
    setRemote({
      decide: async (race, scheduledId, optionId) => {
        await api.move(race.serverId!, 'decision', optionId, scheduledId);
        return refetch(race);
      },
      act: async (race, actionId) => {
        await api.move(race.serverId!, 'action', actionId);
        return refetch(race);
      },
    });
    return () => setRemote(null);
  }, [setRemote]);

  // Zolang de app open is: af en toe de gedeelde race verversen.
  useEffect(() => {
    if (status !== 'in') return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') void reloadRace().catch(() => undefined);
    }, RACE_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [status, reloadRace]);

  // Bij het opstarten: ben ik ingelogd? Dan meteen vergelijken met de server.
  useEffect(() => {
    if (!accountsEnabled || loading) return;
    void check();
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Terug in de app: kijken of er op een andere telefoon iets veranderd is.
  useEffect(() => {
    if (!accountsEnabled) return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastPull.current < PULL_EVERY_MS) return;
      if (status === 'in' || status === 'offline') void check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [status, check]);

  // Na elke wijziging in het spel: na een tel een kopie naar de server.
  useEffect(() => {
    if (status !== 'in' || loading || save === inSync.current) return;
    writeMeta({ ...readMeta(), dirty: true });
    const id = window.setTimeout(() => void upload(save), UPLOAD_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [save, status, loading, upload]);

  const value = useMemo<AccountContextValue>(
    () => ({
      status,
      me,
      lastSaved,
      register: async (nickname) => {
        const who = await api.register(nickname);
        meRef.current = who;
        setMe(who);
        setStatus('in');
        await upload(latestSave.current);
        await reloadRace();
      },
      login: async () => {
        const who = await api.login();
        meRef.current = who;
        setMe(who);
        setStatus('in');
        await syncWithServer(true);
        await reloadRace();
      },
      refresh: check,
      reloadRace,
      myRaces,
      selectRace: (id) => loadRaces(id),
      logout: async () => {
        await api.logout().catch(() => undefined);
        signedOut();
      },
      deleteAccount: async () => {
        await api.deleteAccount();
        signedOut();
      },
    }),
    [status, me, lastSaved, upload, syncWithServer, signedOut, check, reloadRace, myRaces, loadRaces],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount moet binnen <AccountProvider> gebruikt worden');
  return ctx;
}
