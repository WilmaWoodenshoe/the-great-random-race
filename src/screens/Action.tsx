import { useState, type ReactNode } from 'react';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { LeafIcon, MegaphoneIcon, ZzzIcon } from '../components/Icons';
import { img } from '../utils/images';

type ActionId = keyof typeof nl.action.options;

const ACTIONS: { id: ActionId; bg: string; icon: ReactNode }[] = [
  { id: 'voeren', bg: '#DCEFD9', icon: <LeafIcon /> },
  { id: 'aanmoedigen', bg: '#FCEFC7', icon: <MegaphoneIcon /> },
  { id: 'hoed', bg: '#F3EAD8', icon: <img src={img('accessories/hoed.png')} alt="" className="action__hat" /> },
  { id: 'niets', bg: '#D5E8F7', icon: <ZzzIcon /> },
];

/**
 * Actie van vandaag (Action.html).
 * In fase 1 wordt de keuze nog niet bewaard; dat komt in fase 8.
 */
export function Action() {
  const t = nl.action;
  const [picked, setPicked] = useState<ActionId>('voeren');
  const [done, setDone] = useState(false);

  return (
    <div className="screen">
      <BackHeader title={t.title}>
        <p className="back-header__intro">{t.intro}</p>
      </BackHeader>

      <main className="screen__main action">
        {ACTIONS.map((a) => {
          const on = a.id === picked;
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={on}
              disabled={done && !on}
              className={`action__option${on ? ' action__option--on' : ''}${done && !on ? ' action__option--off' : ''}`}
              onClick={() => !done && setPicked(a.id)}
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
            <b>{t.done}</b> {t.options[picked].after}
          </div>
        )}
      </main>

      <div className="screen__footer action__footer">
        {done ? (
          <div className="btn btn--groot btn--uit">{t.tomorrow}</div>
        ) : (
          <PrimaryButton onClick={() => setDone(true)}>{t.confirm}</PrimaryButton>
        )}
        <div className="action__note">{t.footer}</div>
      </div>
    </div>
  );
}
