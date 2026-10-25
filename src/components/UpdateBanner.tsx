import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { nl } from '../content/nl';

// Zo vaak kijkt een geopende app of er een nieuwe versie is.
const CHECK_MS = 30 * 60 * 1000;

/** Balk bovenaan als er een nieuwe versie van de app klaarstaat. */
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) void registration.update().catch(() => undefined);
      };
      setInterval(check, CHECK_MS);
      // Ook kijken als je de app weer naar voren haalt.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });

  // Nieuwe versie gevonden terwijl de app net opstart: dan meteen vernieuwen,
  // er is nog niets om kwijt te raken.
  useEffect(() => {
    if (needRefresh && performance.now() < 4000) void updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);

  if (!needRefresh) return null;
  return (
    <div className="update-banner" role="status">
      <span>{nl.update.text}</span>
      <button type="button" className="update-banner__btn" onClick={() => void updateServiceWorker(true)}>
        {nl.update.button}
      </button>
    </div>
  );
}
