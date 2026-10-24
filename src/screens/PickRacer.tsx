import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { isFinished } from '../game/engine';
import { defaultRacerId } from '../game/session';
import { useGame } from '../state/GameProvider';
import { img } from '../utils/images';

/** Kies je racer (KiesRacer.html): daarna begint de race meteen. */
export function PickRacer() {
  const t = nl.pick;
  const { loading, save, race, now, startNewRace } = useGame();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="screen" aria-busy="true" />;
  // Er loopt al een race: eerst die uitkijken.
  if (race && !isFinished(race, now)) return <Navigate to="/home" replace />;

  const selectedId = picked ?? defaultRacerId(save);
  const selected = racers.find((r) => r.id === selectedId) ?? racers[0];

  const start = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await startNewRace(selected.id);
      navigate('/home', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback={race ? '/finish' : '/'} />

      <main className="screen__main pick">
        <div className="pick__grid" role="group" aria-label={t.listLabel}>
          {racers.map((r) => {
            const on = r.id === selected.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                className={`pick__tile${on ? ' pick__tile--on' : ''}`}
                onClick={() => setPicked(r.id)}
              >
                <img src={img(r.image)} alt="" className="pick__img" />
                <span className="pick__name">{r.name}</span>
              </button>
            );
          })}
        </div>
      </main>

      <div className="screen__footer pick__footer">
        <p className="pick__line" aria-live="polite">
          <b>{selected.name}</b> · {selected.title}
          <br />
          {t.line(selected.species, selected.tagline ?? '')}
        </p>
        <PrimaryButton onClick={start} arrow={!busy}>
          {busy ? t.starting : t.confirm}
        </PrimaryButton>
      </div>
    </div>
  );
}
