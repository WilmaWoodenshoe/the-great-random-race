import { useState, type FormEvent } from 'react';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { accountsEnabled, useAccount } from '../account/AccountProvider';
import { ApiError, isCancelled } from '../account/api';
import { isTestVersion } from '../utils/env';

/** Account: aanmaken, inloggen met een passkey, uitloggen en verwijderen. */
export function Account() {
  const t = nl.account;
  const { status, me, lastSaved, register, login, logout, deleteAccount } = useAccount();
  const [nickname, setNickname] = useState('');
  const [busy, setBusy] = useState<'create' | 'login' | 'other' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = async (kind: 'create' | 'login' | 'other', job: () => Promise<void>) => {
    if (busy) return;
    setBusy(kind);
    setMessage(null);
    try {
      await job();
    } catch (err) {
      if (!isCancelled(err)) setMessage(err instanceof ApiError ? err.message : nl.error.text);
    } finally {
      setBusy(null);
    }
  };

  const create = (e: FormEvent) => {
    e.preventDefault();
    void run('create', () => register(nickname));
  };

  const remove = () => {
    if (!window.confirm(t.deleteConfirm)) return;
    void run('other', async () => {
      await deleteAccount();
      setMessage(t.deleted);
    });
  };

  let body: JSX.Element;
  if (!accountsEnabled || status === 'unavailable') {
    body = <p className="card card--wit info account__note">{isTestVersion ? t.unavailableTest : t.unavailable}</p>;
  } else if (status === 'checking') {
    body = <p className="account__note">{t.checking}</p>;
  } else if (status === 'in' && me) {
    body = (
      <>
        <section className="card card--wit account__card">
          <div className="account__who">
            {t.loggedInAs} <b>{me.nickname}</b>
          </div>
          <p className="account__small">
            {lastSaved
              ? t.savedAt(new Date(lastSaved).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }))
              : t.notSavedYet}
          </p>
        </section>
        <PrimaryButton color="blauw" onClick={() => run('other', logout)}>
          {t.logout}
        </PrimaryButton>
        <p className="account__small center">{t.logoutNote}</p>
        <button type="button" className="link-btn account__delete" onClick={remove}>
          {t.delete}
        </button>
      </>
    );
  } else {
    body = (
      <>
        <p className="account__intro">{t.intro}</p>
        {status === 'offline' && <p className="account__error">{t.offline}</p>}

        <form className="card card--wit account__card" onSubmit={create}>
          <h2 className="account__h2">{t.newTitle}</h2>
          <label className="field">
            <span className="field__label">{t.nicknameLabel}</span>
            <input
              className="field__input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t.nicknamePlaceholder}
              maxLength={20}
              autoComplete="nickname"
              autoCapitalize="words"
              required
              minLength={2}
            />
          </label>
          <p className="account__small">{t.nicknameHint}</p>
          <PrimaryButton type="submit" arrow={busy !== 'create'}>
            {busy === 'create' ? t.busy : t.create}
          </PrimaryButton>
        </form>

        <section className="card card--wit account__card">
          <h2 className="account__h2">{t.haveTitle}</h2>
          <PrimaryButton color="blauw" onClick={() => run('login', login)}>
            {busy === 'login' ? t.busy : t.login}
          </PrimaryButton>
        </section>

        <p className="account__small">{t.passkeyExplain}</p>
      </>
    );
  }

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback="/meer" />
      <main className="screen__main account">
        {message && (
          <p className="account__error" role="alert">
            {message}
          </p>
        )}
        {body}
      </main>
    </div>
  );
}
