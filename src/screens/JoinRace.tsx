import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rememberInvite, takeInvite } from '../account/invite';
import { nl } from '../content/nl';
import { racers } from '../content';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RacerGrid, RacerLine } from '../components/RacerGrid';
import { api, ApiError, type RaceSummary } from '../account/api';
import { isApproved, useAccount } from '../account/AccountProvider';
import { defaultRacerId } from '../game/session';
import { useGame } from '../state/GameProvider';

/**
 * Meedoen met een open race: kies een racer die nog vrij is.
 * Met `switching`: je doet al mee en kiest voor de start een andere racer.
 */
export function JoinRace({ switching = false }: { switching?: boolean }) {
  const { id } = useParams();
  const raceId = Number(id);
  const { me, selectRace } = useAccount();
  const { save } = useGame();
  const navigate = useNavigate();
  const [race, setRace] = useState<RaceSummary | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Aangekomen via een uitnodiging: die is nu gebruikt.
  const approved = isApproved(me);
  useEffect(() => {
    if (approved) takeInvite();
  }, [approved]);

  useEffect(() => {
    api
      .race(raceId)
      .then(setRace)
      .catch((err) => setMessage(err instanceof ApiError ? err.message : nl.races.error));
  }, [raceId]);

  // Uitgenodigd, maar (nog) geen goedgekeurd account: eerst dat regelen.
  if (!isApproved(me)) {
    if (Number.isInteger(raceId) && raceId > 0) rememberInvite(raceId);
    return (
      <div className="screen">
        <BackHeader title={nl.join.title} fallback="/" />
        <main className="screen__main account">
          {race && <p className="account__intro">{nl.invite.invited(nl.races.name(race.id, race.name))}</p>}
          {race && (
            <p className="account__small center">
              {nl.races.startsAt(race.startTime)} · {nl.races.days(race.days)}
            </p>
          )}
          <section className="card card--wit account__card">
            <p>{me ? nl.invite.afterApproval : nl.invite.afterAccount}</p>
            {!me && (
              <PrimaryButton to="/account" arrow>
                {nl.account.welcomeCreate}
              </PrimaryButton>
            )}
          </section>
        </main>
      </div>
    );
  }

  const mine = race?.participants.find((p) => p.userId === me?.id)?.racerId;
  const others = (race?.participants ?? []).filter((p) => p.racerId !== mine);
  const taken = Object.fromEntries(others.map((p) => [p.racerId, p.nickname || nl.races.removed]));
  const free = racers.filter((r) => !(r.id in taken));
  const preferred = picked ?? (switching && mine ? mine : defaultRacerId(save));
  const selected = free.find((r) => r.id === preferred) ?? free[0];

  const join = async () => {
    if (busy || !selected) return;
    setBusy(true);
    setMessage(null);
    try {
      if (switching) await api.switchRacer(raceId, selected.id);
      else await api.joinRace(raceId, selected.id);
      await selectRace(raceId);
      navigate('/wachtruimte', { replace: true });
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : nl.error.text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <BackHeader
        title={switching ? nl.join.switchTitle : race ? nl.races.name(race.id, race.name) : nl.join.title}
        fallback={switching ? '/wachtruimte' : '/races'}
      />
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
            {busy ? nl.newRace.busy : switching ? nl.join.switchConfirm : nl.join.confirm}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
