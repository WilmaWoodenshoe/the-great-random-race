// Praten met de server op /api (alleen op thegreatrandomrace.nl).
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import type { SaveData } from '../models/Save';

export interface Me {
  nickname: string;
  createdAt: number;
}

export interface Summary {
  racerId: string;
  raceNumber: number;
  position: number;
  racersCount: number;
  km: number;
  finished: boolean;
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

export interface Player extends Summary {
  nickname: string;
  /** Laatst bijgewerkt (seconden). */
  updatedAt: number;
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

  players: () => call<{ players: Player[] }>('GET', '/players'),

  getSave: () => call<{ save: unknown; updatedAt: number | null }>('GET', '/save'),
  putSave: (save: SaveData, summary: Summary | null) =>
    call<{ updatedAt: number }>('PUT', '/save', { save, summary }),
};

/** Is de passkey-vraag door de speler weggetikt? Dan geen foutmelding tonen. */
export function isCancelled(err: unknown): boolean {
  return err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'AbortError');
}
