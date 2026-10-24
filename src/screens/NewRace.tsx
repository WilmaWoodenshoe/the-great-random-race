import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { getCourse, racers } from '../content';
import { courseForDays } from '../game/course';
import { formatKm } from '../utils/format';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { RacerGrid, RacerLine } from '../components/RacerGrid';
import { api, ApiError } from '../account/api';
import { isApproved, useAccount } from '../account/AccountProvider';
import { contentSnapshot } from '../account/buildRace';
import { defaultRacerId } from '../game/session';
import { useGame } from '../state/GameProvider';
import { HOUR, MINUTE } from '../utils/dates';

type StartChoice = 'hour' | 'tomorrow' | 'custom' | 'now';
const DAY_OPTIONS = [7, 14, 21];

/** 'Morgen 9:00' in de tijd van de telefoon. */
function tomorrowNine(): number {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

/** Waarde voor een datum-tijdveld (lokale tijd, zonder seconden). */
function toInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Nieuwe gedeelde race: eerst je racer, dan naam, duur en starttijd. */
export function NewRace() {
  const t = nl.newRace;
  const { me, reloadRace } = useAccount();
  const { save } = useGame();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [racerId, setRacerId] = useState(() => defaultRacerId(save));
  const [name, setName] = useState('');
  const [days, setDays] = useState(7);
  const [startChoice, setStartChoice] = useState<StartChoice>('tomorrow');
  const [custom, setCustom] = useState(() => toInput(tomorrowNine() + HOUR));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isApproved(me)) return <Navigate to="/races" replace />;
  const racer = racers.find((r) => r.id === racerId) ?? racers[0];

  const startTime = (): number => {
    switch (startChoice) {
      case 'now':
        return Date.now();
      case 'hour':
        return Date.now() + HOUR;
      case 'tomorrow':
        return tomorrowNine();
      case 'custom':
        return new Date(custom).getTime();
    }
  };

  const create = async () => {
    if (busy) return;
    const start = startTime();
    if (!Number.isFinite(start) || (startChoice === 'custom' && start < Date.now() + MINUTE)) {
      setMessage(t.tooEarly);
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await api.createRace({ name, courseId: 'grote-bosrace', days, startTime: start, racerId: racer.id, snapshot: contentSnapshot() });
      await reloadRace();
      navigate(startChoice === 'now' ? '/home' : '/wachtruimte', { replace: true });
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : nl.error.text);
    } finally {
      setBusy(false);
    }
  };

  if (step === 1) {
    return (
      <div className="screen">
        <BackHeader title={t.stepRacer} fallback="/races" />
        <main className="screen__main pick">
          <RacerGrid racers={racers} selectedId={racer.id} onSelect={setRacerId} />
        </main>
        <div className="screen__footer pick__footer">
          <RacerLine racer={racer} />
          <PrimaryButton onClick={() => setStep(2)} arrow>
            {t.next}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const chip = (value: StartChoice, label: string) => (
    <button
      type="button"
      className={`chip-btn chip-btn--keuze${startChoice === value ? ' chip-btn--on' : ''}`}
      aria-pressed={startChoice === value}
      onClick={() => setStartChoice(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback="/races" />
      <main className="screen__main account">
        {message && (
          <p className="account__error" role="alert">
            {message}
          </p>
        )}
        <section className="card card--wit account__card">
          <label className="field">
            <span className="field__label">{t.name}</span>
            <input
              className="field__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={40}
            />
          </label>

          <div className="field">
            <span className="field__label">{t.length}</span>
            <div className="info__buttons">
              {DAY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`chip-btn chip-btn--keuze${days === d ? ' chip-btn--on' : ''}`}
                  aria-pressed={days === d}
                  onClick={() => setDays(d)}
                >
                  {nl.races.days(d)} · {formatKm(courseForDays(getCourse('grote-bosrace'), d).lengthKm)}
                </button>
              ))}
            </div>
            <span className="account__small">{t.lengthHint}</span>
          </div>

          <div className="field">
            <span className="field__label">{t.start}</span>
            <div className="info__buttons">
              {chip('hour', t.inOneHour)}
              {chip('tomorrow', t.tomorrow)}
              {chip('custom', t.custom)}
              {chip('now', t.now)}
            </div>
            {startChoice === 'custom' && (
              <input
                type="datetime-local"
                className="field__input"
                value={custom}
                min={toInput(Date.now())}
                onChange={(e) => setCustom(e.target.value)}
              />
            )}
            <span className="account__small">{startChoice === 'now' ? t.nowHint : t.startHint}</span>
          </div>
        </section>

        <div className="new-race__racer">
          <RacerLine racer={racer} />
          <button type="button" className="link-btn" onClick={() => setStep(1)}>
            {nl.pick.title}
          </button>
        </div>

        <PrimaryButton onClick={create} arrow={!busy}>
          {busy ? t.busy : t.create}
        </PrimaryButton>
      </main>
    </div>
  );
}
