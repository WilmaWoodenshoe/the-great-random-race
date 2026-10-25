import { useEffect, useState } from 'react';
import { nl } from '../content/nl';
import { PrimaryButton } from './PrimaryButton';
import { disablePush, enablePush, needsHomeScreen, pushIsOn, pushSupported } from '../account/push';
import { ApiError } from '../account/api';

/** Account: de dagelijkse melding aan- of uitzetten. */
export function PushCard() {
  const t = nl.account;
  const [on, setOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const supported = pushSupported();
  const homeScreen = needsHomeScreen();

  useEffect(() => {
    if (supported) void pushIsOn().then(setOn);
  }, [supported]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      if (on) {
        await disablePush();
        setOn(false);
      } else if (await enablePush()) {
        setOn(true);
      } else {
        setNote(Notification.permission === 'denied' ? t.pushDenied : t.pushRefused);
      }
    } catch (err) {
      setNote(err instanceof ApiError ? err.message : nl.error.text);
    } finally {
      setBusy(false);
    }
  };

  let body: JSX.Element;
  if (homeScreen) body = <p className="account__small">{t.pushHomeScreen}</p>;
  else if (!supported) body = <p className="account__small">{t.pushUnsupported}</p>;
  else if (on === null) body = <></>;
  else
    body = (
      <>
        {on && <p className="account__who">✓ {t.pushOn}</p>}
        <PrimaryButton color={on ? 'blauw' : undefined} onClick={toggle}>
          {busy ? t.busy : on ? t.pushDisable : t.pushEnable}
        </PrimaryButton>
      </>
    );

  return (
    <section className="card card--wit account__card">
      <h2 className="account__h2">{t.pushTitle}</h2>
      <p className="account__small">{t.pushIntro}</p>
      {body}
      {note && (
        <p className="account__error" role="alert">
          {note}
        </p>
      )}
    </section>
  );
}
