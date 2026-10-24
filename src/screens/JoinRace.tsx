import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RacerGrid, RacerLine } from '../components/RacerGrid';
import { api, ApiError, type RaceSummary } from '../account/api';
import { isApproved, useAccount } from '../account/AccountProvider';
import { defaultRacerId } from '../game/session';
import { useGame } from '../state/GameProvider';

/** Meedoen met een open race: kies een racer die nog vrij is. */
export function JoinRace() {
  const { id } = useParams();
  const raceId = Number(id);
  const { me, reloadRace } = useAccount();
  const { save } = useGame();
  const navigate = useNavigate();
  const [race, setRace] = useState<RaceSummary | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .race(raceId)
      .then(setRace)
      .catch((err) => setMessage(err instanceof ApiError ? err.message : nl.races.error));
  }, [raceId]);

  if (!isApproved(me)) return <Navigate to="/races" replace />;

  const taken = Object.fromEntries((race?.participants ?? []).map((p) => [p.racerId, p.nickname || nl.races.removed]));
  const free = racers.filter((r) => !(r.id in taken));
  const preferred = picked ?? defaultRacerId(save);
  const selected = free.find((r) => r.id === preferred) ?? free[0];

  const join = async () => {
    if (busy || !selected) return;
    setBusy(true);
    setMessage(null);
    try {
      await api.joinRace(raceId, selected.id);
      await reloadRace();
      navigate('/wachtruimte', { replace: true });
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : nl.error.text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <BackHeader title={race ? nl.races.name(race.id, race.name) : nl.join.title} fallback="/races" />
      <main className="screen__main pick">
        {message && (
          <p className="account__error" role="alert">
            {message}
          </p>
        )}
        {race && race.status !== 'open' && <p className="account__note">{nl.join.started}</p>}
        {race && <RacerGrid racers={racers} selectedId={selected?.id ?? ''} onSelect={setPicked} taken={taken} />}
      </main>
      {race?.status === 'open' && selected && (
        <div className="screen__footer pick__footer">
          <RacerLine racer={selected} />
          <PrimaryButton onClick={join} arrow={!busy}>
            {busy ? nl.newRace.busy : nl.join.confirm}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
