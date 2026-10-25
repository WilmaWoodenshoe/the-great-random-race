// De dagelijkse melding op de telefoon (zie server/app/push.py).
import { api } from './api';

/** Kan deze browser meldingen krijgen? */
export function pushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** iPhone/iPad: meldingen werken alleen als de app op het beginscherm staat. */
export function needsHomeScreen(): boolean {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  return (await navigator.serviceWorker.getRegistration()) ?? null;
}

/** Staan meldingen aan op deze telefoon? */
export async function pushIsOn(): Promise<boolean> {
  const reg = await registration();
  return !!(reg && (await reg.pushManager.getSubscription()) && Notification.permission === 'granted');
}

/** Toestemming vragen en de telefoon bij de server aanmelden. Geeft false als de speler 'nee' zegt. */
export async function enablePush(): Promise<boolean> {
  if ((await Notification.requestPermission()) !== 'granted') return false;
  const reg = await navigator.serviceWorker.ready;
  const { key } = await api.pushKey();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  await api.pushSubscribe(sub.toJSON());
  return true;
}

/** Meldingen uitzetten op deze telefoon. */
export async function disablePush(): Promise<void> {
  const reg = await registration();
  const sub = reg && (await reg.pushManager.getSubscription());
  if (!sub) return;
  await api.pushUnsubscribe(sub.endpoint).catch(() => undefined);
  await sub.unsubscribe();
}
