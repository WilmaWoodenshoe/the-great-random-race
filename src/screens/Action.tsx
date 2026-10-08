import { useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import type { ActionId } from '../models/Race';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { LeafIcon, MegaphoneIcon, ZzzIcon } from '../components/Icons';
import { useGame } from '../state/GameProvider';
import { useRaceView } from '../state/useRaceView';
import { img } from '../utils/images';

const ACTIONS: { id: ActionId; bg: string; icon: ReactNode }[] = [
  { id: 'voeren', bg: '#DCEFD9', icon: <LeafIcon /> },
  { id: 'aanmoedigen', bg: '#FCEFC7', icon: <MegaphoneIcon /> },
  { id: 'hoed', bg: '#F3EAD8', icon: <img src={img('accessories/hoed.png')} alt="" className="action__hat" /> },
  { id: 'niets', bg: '#D5E8F7', icon: <ZzzIcon /> },
];

/** Actie van vandaag (Action.html): één keer per kalenderdag iets doen voor Gerard. */
export function Action() {
  const { loading, act } = useGame();
  const view = useRaceView();
  const [picked, setPicked] = useState<ActionId>('voeren');
  const [busy, setBusy] = useState(false);
  if (loading) return <div className="screen" aria-busy="true" />;
  if (!view) return <Navigate to="/" replace />;

  const t = nl.action;
  const done = view.todaysAction;
  const selected = done?.actionId ?? picked;
  // Geen actie mogelijk en ook niet al gedaan: race voorbij of Gerard al binnen.
  const closed = !view.canAct && !done;
  const closedText = view.finished ? t.raceOver : t.finished;

  const confirm = async () => {
    if (busy || !view.canAct) return;
    setBusy(true);
    try {
      await act(picked);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <BackHeader title={t.title}>
        <p className="back-header__intro">{t.intro}</p>
      </BackHeader>

      <main className="screen__main action">
        {ACTIONS.map((a) => {
          const on = a.id === selected && !closed;
          const locked = !!done || closed;
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={on}
              disabled={locked && !on}
              className={`action__option${on ? ' action__option--on' : ''}${locked && !on ? ' action__option--off' : ''}`}
              onClick={() => !locked && setPicked(a.id)}
            >
              <span className="action__icon" style={{ background: a.bg }}>
                {a.icon}
              </span>
              <span className="action__text">
                <span className="action__title">{t.options[a.id].title}</span>
                <span className="action__effect">{t.options[a.id].effect}</span>
              </span>
            </button>
          );
        })}

        {done && (
          <div className="action__done grr-slide-in" role="status">
            <b>{t.done}</b> {nl.engine.actions[done.actionId][done.variant % nl.engine.actions[done.actionId].length]}
          </div>
        )}
        {closed && (
          <div className="action__done action__done--closed" role="status">
            {closedText}
          </div>
        )}
      </main>

      <div className="screen__footer action__footer">
        {done || closed ? (
          <div className="btn btn--groot btn--uit">{t.tomorrow}</div>
        ) : (
          <PrimaryButton onClick={confirm}>{busy ? nl.welcome.starting : t.confirm}</PrimaryButton>
        )}
        <div className="action__note">{t.footer}</div>
      </div>
    </div>
  );
}
