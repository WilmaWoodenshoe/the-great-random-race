// Praten met de server op /api (alleen op thegreatrandomrace.nl).
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import type { SaveData } from '../models/Save';

import type { Choice } from '../models/Choice';
import type { Course } from '../models/Course';
import type { Racer } from '../models/Racer';

export interface Me {
  id: number;
  nickname: string;
  createdAt: number;
  /** 'pending' = wacht op goedkeuring door de beheerder. */
  status: 'pending' | 'approved';
  isAdmin: boolean;
}

export interface Participant {
  racerId: string;
  /** Leeg als het account inmiddels verwijderd is. */
  nickname: string;
  userId: number | null;
  joinedAt: number;
}

/** Een gedeelde race zoals in de lijst. */
export interface RaceSummary {
  id: number;
  name: string;
  courseId: string;
  days: number;
  startTime: number;
  endTime: number;
  status: 'open' | 'running' | 'finished';
  createdBy: string | null;
  participants: Participant[];
}

/** Racers, route en keuze-events zoals bij het aanmaken van de race. */
export interface RaceSnapshot {
  course: Course;
  racers: Racer[];
  choices: Choice[];
}

export interface Move {
  racerId: string;
  kind: 'decision' | 'action';
  key: string;
  value: string;
  time: number;
}

/** Alles om een gedeelde race op de telefoon na te rekenen. */
export interface RaceDetail extends RaceSummary {
  seed: number;
  snapshot: RaceSnapshot;
  moves: Move[];
  now: number;
}

export interface NewRace {
  name: string;
  courseId: string;
  days: number;
  startTime: number;
  racerId: string;
  snapshot: RaceSnapshot;
}

export interface AdminUser {
  id: number;
  nickname: string;
  status: 'pending' | 'approved';
  isAdmin: boolean;
  createdAt: number;
  lastLogin: number | null;
}

/** Een fout van de server, met een Nederlandse uitleg erbij. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Geen verbinding met de server.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data?.detail === 'string' ? data.detail : 'Er ging iets mis op de server.';
    throw new ApiError(res.status, detail);
  }
  return data as T;
}

interface Flow {
  flowId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
}

export const api = {
  me: () => call<Me>('GET', '/me'),

  /** Nieuw account: de telefoon maakt een passkey aan. */
  async register(nickname: string): Promise<Me> {
    const flow = await call<Flow>('POST', '/register/start', { nickname });
    const credential = await startRegistration({ optionsJSON: flow.options });
    return call<Me>('POST', '/register/finish', { flowId: flow.flowId, credential });
  },

  /** Inloggen: de telefoon laat zien welke passkeys er zijn. */
  async login(): Promise<Me> {
    const flow = await call<Flow>('POST', '/login/start');
    const credential = await startAuthentication({ optionsJSON: flow.options });
    return call<Me>('POST', '/login/finish', { flowId: flow.flowId, credential });
  },

  logout: () => call<{ ok: true }>('POST', '/logout'),
  deleteAccount: () => call<{ ok: true }>('DELETE', '/me'),

  getSave: () => call<{ save: unknown; updatedAt: number | null }>('GET', '/save'),
  putSave: (save: SaveData) => call<{ updatedAt: number }>('PUT', '/save', { save }),

  // Gedeelde races
  races: () => call<{ races: RaceSummary[]; now: number }>('GET', '/races'),
  race: (id: number) => call<RaceDetail>('GET', `/races/${id}`),
  myRace: () => call<{ raceId: number | null }>('GET', '/my-race'),
  createRace: (race: NewRace) => call<RaceSummary>('POST', '/races', race),
  joinRace: (id: number, racerId: string) => call<RaceSummary>('POST', `/races/${id}/join`, { racerId }),
  leaveRace: (id: number) => call<{ ok: true }>('POST', `/races/${id}/leave`),
  cancelRace: (id: number) => call<{ ok: true }>('DELETE', `/races/${id}`),
  move: (id: number, kind: 'decision' | 'action', value: string, key = '') =>
    call<{ time: number; key: string }>('POST', `/races/${id}/moves`, { kind, key, value }),

  // Beheer
  adminUsers: () => call<{ users: AdminUser[] }>('GET', '/admin/users'),
  approveUser: (id: number) => call<{ ok: true }>('POST', `/admin/users/${id}/approve`),
  deleteUser: (id: number) => call<{ ok: true }>('DELETE', `/admin/users/${id}`),
};

/** Is de passkey-vraag door de speler weggetikt? Dan geen foutmelding tonen. */
export function isCancelled(err: unknown): boolean {
  return err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'AbortError');
}
