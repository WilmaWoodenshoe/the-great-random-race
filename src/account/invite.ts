// Uitnodigen: een link naar een race delen, en onthouden voor wie nog
// een account moet maken of op goedkeuring wacht.
import { nl } from '../content/nl';
import type { RaceSummary } from './api';

const KEY = 'grr-uitnodiging';

/** De link naar 'meedoen' met deze race. */
export function inviteUrl(raceId: number): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}#/races/${raceId}/meedoen`;
}

/**
 * Deel de uitnodiging via WhatsApp, berichten of mail (het deelmenu van
 * de telefoon). Zonder deelmenu: de link naar het klembord.
 */
export async function shareInvite(race: RaceSummary): Promise<'shared' | 'copied' | 'cancelled'> {
  const url = inviteUrl(race.id);
  const text = nl.invite.text(nl.races.name(race.id, race.name), race.startTime, race.days);
  if (navigator.share) {
    try {
      await navigator.share({ title: nl.app.name, text, url });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return 'copied';
  } catch {
    window.prompt(nl.invite.copyPrompt, url);
    return 'copied';
  }
}

export function rememberInvite(raceId: number): void {
  try {
    localStorage.setItem(KEY, String(raceId));
  } catch {
    // Niet erg: dan zoekt de speler de race zelf op in de lijst.
  }
}

/** De race waarvoor iemand is uitgenodigd (en wis die daarna). */
export function takeInvite(): number | null {
  try {
    const id = Number(localStorage.getItem(KEY));
    localStorage.removeItem(KEY);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export function peekInvite(): number | null {
  try {
    const id = Number(localStorage.getItem(KEY));
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
