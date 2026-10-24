import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RacerGrid, RacerLine } from '../components/RacerGrid';
import { isFinished } from '../game/engine';
import { defaultRacerId } from '../game/session';
import { useGame } from '../state/GameProvider';
import { accountsEnabled } from '../account/AccountProvider';

/** Kies je racer (KiesRacer.html) voor een race alleen op deze telefoon (testversie). */
export function PickRacer() {
  const t = nl.pick;
  const { loading, save, race, now, startNewRace } = useGame();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="screen" aria-busy="true" />;
  // Op de echte site speel je in gedeelde races.
  if (accountsEnabled) return <Navigate to="/races" replace />;
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
        <RacerGrid racers={racers} selectedId={selected.id} onSelect={setPicked} />
      </main>

      <div className="screen__footer pick__footer">
        <RacerLine racer={selected} />
        <PrimaryButton onClick={start} arrow={!busy}>
          {busy ? t.starting : t.confirm}
        </PrimaryButton>
      </div>
    </div>
  );
}
