import { useState } from 'react';
import { nl } from '../content/nl';
import { PrimaryButton } from './PrimaryButton';
import { accountsEnabled, useAccount } from '../account/AccountProvider';
import { enablePush, needsHomeScreen, pushSupported } from '../account/push';
import { ApiError } from '../account/api';

const SEEN_KEY = 'grr-push-invite';

function seen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Geen opslag: dan zie je de vraag de volgende keer gewoon weer.
  }
}

/**
 * Eenmalige vraag of je de dagelijkse melding wilt. Aanzetten zonder vragen
 * kan niet: de telefoon wil dat de speler zelf 'Toestaan' kiest.
 */
export function PushInvite() {
  const t = nl.account;
  const { status, me } = useAccount();
  const [state, setState] = useState<'ask' | 'busy' | 'done' | 'hidden'>(() => (seen() ? 'hidden' : 'ask'));
  const [note, setNote] = useState<string | null>(null);

  const homeScreen = needsHomeScreen();
  const canAsk = homeScreen || (pushSupported() && Notification.permission === 'default');
  if (!accountsEnabled || status !== 'in' || me?.status !== 'approved' || state === 'hidden') return null;
  if (!canAsk && state !== 'done') return null;

  const close = () => {
    markSeen();
    setState('hidden');
  };

  const yes = async () => {
    setState('busy');
    setNote(null);
    try {
      const ok = await enablePush();
      markSeen();
      if (ok) setState('done');
      else setState('hidden');
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : nl.error.text);
      setState('ask');
    }
  };

  return (
    <section className="card card--wit account__card push-invite grr-pop">
      <h2 className="account__h2">{state === 'done' ? t.inviteDone : t.inviteTitle}</h2>
      {state !== 'done' &&
        (homeScreen ? (
          <>
            <p className="account__small">{t.inviteHomeScreen}</p>
            <PrimaryButton color="blauw" onClick={close}>
              {t.inviteOk}
            </PrimaryButton>
          </>
        ) : (
          <>
            <p className="account__small">{t.inviteText}</p>
            <PrimaryButton onClick={yes}>{state === 'busy' ? t.busy : t.inviteYes}</PrimaryButton>
            <button type="button" className="link-btn" onClick={close}>
              {t.inviteNo}
            </button>
            <p className="account__small">{t.inviteLater}</p>
          </>
        ))}
      {note && (
        <p className="account__error" role="alert">
          {note}
        </p>
      )}
    </section>
  );
}
