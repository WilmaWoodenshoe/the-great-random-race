import { useEffect, useRef, useState } from 'react';
import { nl } from '../content/nl';
import { accessories, racers } from '../content';
import { BottomNav } from '../components/BottomNav';
import { LivingRacer } from '../components/Gerard';
import { PrimaryButton } from '../components/PrimaryButton';
import { isUnlocked, newlyUnlocked, progressOf, wearOn, worn } from '../game/collection';
import { defaultRacerId } from '../game/session';
import type { Accessory, AccessorySlot, Unlock } from '../models/Accessory';
import { useGame } from '../state/GameProvider';
import { img } from '../utils/images';
import { backgroundOf } from '../game/course';
import { fill, who } from '../utils/text';

type Tab = 'alle' | AccessorySlot;
const TABS: Tab[] = ['alle', 'hoofd', 'ogen', 'nek'];
/** Een gekozen tegeltje: een accessoire, of 'niets' op een plek. */
type Pick = { kind: 'acc'; acc: Accessory } | { kind: 'none'; slot: AccessorySlot };

function howTo(u: Unlock): string {
  const h = nl.collection.how;
  switch (u.type) {
    case 'start':
      return h.start;
    case 'raceStarted':
      return h.raceStarted;
    case 'finished':
      return h.finished(u.count);
    case 'podium':
      return h.podium;
    case 'win':
      return h.win;
    case 'races':
      return h.races(u.count);
    case 'daysOpened':
      return h.daysOpened(u.count);
    case 'longRace':
      return h.longRace(u.days);
  }
}

/** Collectie (Accessoires.html): verdiende accessoires bekijken, passen en dragen. */
export function Collection() {
  const t = nl.collection;
  const { save, race, now, loading, wearAccessory, markCollectionSeen } = useGame();
  const [tab, setTab] = useState<Tab>('alle');
  const [pick, setPick] = useState<Pick | null>(null);
  // 'Nieuw' blijft staan zolang je op dit scherm bent; daarna is het gezien.
  const fresh = useRef<string[] | null>(null);
  if (fresh.current === null && !loading) fresh.current = newlyUnlocked(save, now).map((a) => a.id);
  useEffect(() => {
    if (fresh.current?.length) void markCollectionSeen(fresh.current);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="screen" aria-busy="true" />;

  const racer =
    (race && race.racers.find((r) => r.id === race.playerId)) ??
    racers.find((r) => r.id === defaultRacerId(save)) ??
    racers[0];
  const words = who(racer);
  const wearing = worn(save, now);
  const list = accessories.filter((a) => tab === 'alle' || a.slot === tab);
  const slots: AccessorySlot[] = tab === 'alle' ? [] : [tab];

  // Passen: het gekozen accessoire vervangt even wat er op die plek zit.
  const tryOn =
    pick?.kind === 'acc'
      ? [pick.acc, ...wearing.filter((a) => a.slot !== pick.acc.slot)]
      : pick?.kind === 'none'
        ? wearing.filter((a) => a.slot !== pick.slot)
        : wearing;

  let line: string;
  let action: JSX.Element | null = null;
  if (!pick) {
    line = fill(t.intro, words);
  } else if (pick.kind === 'none') {
    line = fill(t.nothingLine(pick.slot), words);
    if (wearing.some((a) => a.slot === pick.slot)) {
      action = (
        <PrimaryButton color="blauw" onClick={() => void wearAccessory(pick.slot, null)}>
          {t.takeOff}
        </PrimaryButton>
      );
    }
  } else {
    const acc = pick.acc;
    const unlocked = isUnlocked(acc, save, now);
    const p = progressOf(acc.unlock, save, now);
    const isWorn = wearing.some((a) => a.id === acc.id);
    line = unlocked
      ? fill(acc.tagline, words)
      : `${t.locked}: ${howTo(acc.unlock)}${p.need > 1 ? ` (${t.progress(p.have, p.need)})` : ''}`;
    if (unlocked && !wearOn(racer, [acc])?.items.length) line = fill(t.cantWear, words);
    else if (unlocked) {
      action = isWorn ? (
        <PrimaryButton color="blauw" onClick={() => void wearAccessory(acc.slot, null)}>
          {t.takeOff}
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={() => void wearAccessory(acc.slot, acc.id)}>{t.wear}</PrimaryButton>
      );
    }
  }

  const isOn = (p: Pick) =>
    pick !== null &&
    ((p.kind === 'acc' && pick.kind === 'acc' && p.acc.id === pick.acc.id) ||
      (p.kind === 'none' && pick.kind === 'none' && p.slot === pick.slot));

  return (
    <div className="screen screen--nav">
      <header className="back-header">
        <h1 className="back-header__title">{t.title}</h1>
      </header>
      <main className="screen__main collection">
        <div className="collection__hero">
          <img className="collection__bg" src={img(backgroundOf(race?.course))} alt="" />
          <LivingRacer image={racer.image} alt={racer.name} wear={wearOn(racer, tryOn)} wobble className="collection__racer" />
        </div>

        <div className="collection__tabs" role="tablist">
          {TABS.map((x) => (
            <button
              key={x}
              type="button"
              role="tab"
              aria-selected={tab === x}
              className={`collection__tab${tab === x ? ' collection__tab--on' : ''}`}
              onClick={() => {
                setTab(x);
                setPick(null);
              }}
            >
              {t.tabs[x]}
            </button>
          ))}
        </div>

        <div className="pick__grid collection__grid">
          {slots.map((slot) => {
            const p: Pick = { kind: 'none', slot };
            return (
              <button
                key={`geen-${slot}`}
                type="button"
                aria-pressed={isOn(p)}
                className={`pick__tile${isOn(p) ? ' pick__tile--on' : ''}`}
                onClick={() => setPick(p)}
              >
                <img src={img('accessories/geen.png')} alt="" className="collection__img" />
                <span className="pick__name">{t.nothing}</span>
              </button>
            );
          })}
          {list.map((acc) => {
            const p: Pick = { kind: 'acc', acc };
            const unlocked = isUnlocked(acc, save, now);
            const isWorn = wearing.some((a) => a.id === acc.id);
            return (
              <button
                key={acc.id}
                type="button"
                aria-pressed={isOn(p)}
                className={`pick__tile collection__tile${isOn(p) ? ' pick__tile--on' : ''}${unlocked ? '' : ' collection__tile--locked'}`}
                onClick={() => setPick(p)}
              >
                {fresh.current?.includes(acc.id) && <span className="badge collection__new">{t.isNew}</span>}
                {isWorn && <span className="collection__check" aria-label={fill(t.wearing, words)}>✓</span>}
                <img src={img(acc.image)} alt="" className="collection__img" />
                <span className="pick__name">{acc.name}</span>
                {!unlocked && (
                  <span className="collection__lock" aria-label={t.locked}>
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="pick__line collection__line" aria-live="polite">
          {pick?.kind === 'acc' && <b>{pick.acc.name} · </b>}
          {line}
        </p>
        {action}
      </main>
      <BottomNav />
    </div>
  );
}
