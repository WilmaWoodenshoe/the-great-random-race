import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { BackHeader } from '../components/BackHeader';
import { api, ApiError, type AdminUser, type RaceSummary } from '../account/api';
import { useAccount } from '../account/AccountProvider';

/** Beheer (alleen de beheerder): nieuwe accounts goedkeuren of weigeren, accounts verwijderen. */
export function Admin() {
  const t = nl.admin;
  const { me, reloadRace } = useAccount();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [races, setRaces] = useState<RaceSummary[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .adminUsers()
      .then((res) => setUsers(res.users))
      .catch(() => setMessage(t.error));
    api
      .races()
      .then((res) => setRaces(res.races.filter((r) => r.status !== 'finished')))
      .catch(() => setMessage(t.error));
  }, [t.error]);

  useEffect(() => {
    if (me?.isAdmin) load();
  }, [me, load]);

  if (!me?.isAdmin) return <Navigate to="/meer" replace />;

  const act = async (job: () => Promise<unknown>, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setMessage(null);
    try {
      await job();
      load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : nl.error.text);
    }
  };

  const pending = (users ?? []).filter((u) => u.status === 'pending');
  const approved = (users ?? []).filter((u) => u.status === 'approved');

  const row = (u: AdminUser, buttons: JSX.Element) => (
    <li key={u.id} className="card card--wit admin__row">
      <div className="admin__who">
        <b>{u.nickname}</b>
        <div className="account__small">
          {t.created(u.createdAt)}
          {u.lastLogin ? ` · ${t.lastLogin(u.lastLogin)}` : ''}
        </div>
      </div>
      <div className="admin__buttons">{buttons}</div>
    </li>
  );

  return (
    <div className="screen">
      <BackHeader title={t.title} fallback="/meer" />
      <main className="screen__main account">
        {message && <p className="account__error">{message}</p>}
        <Link to="/inventaris" className="players__join">
          {t.inventoryLink}
        </Link>

        <h2 className="more__h2">{t.races}</h2>
        {races && races.length === 0 && <p className="account__note">{t.racesEmpty}</p>}
        <ul className="admin__list">
          {(races ?? []).map((r) => {
            const name = nl.races.name(r.id, r.name);
            const fill = r.computerFill !== false;
            return (
              <li key={r.id} className="card card--wit admin__row">
                <div className="admin__who">
                  <b>{name}</b>
                  <div className="account__small">
                    {t.raceInfo(r.status === 'running' ? t.running : t.open, r.participants.length)} ·{' '}
                    {fill ? t.withComputer : t.withoutComputer}
                  </div>
                </div>
                <div className="admin__buttons">
                  <button
                    type="button"
                    className={`chip-btn ${fill ? 'chip-btn--rood' : 'chip-btn--groen'}`}
                    onClick={() =>
                      act(async () => {
                        await api.setComputerFill(r.id, !fill);
                        await reloadRace();
                      }, fill ? t.removeComputerConfirm(name) : t.addComputerConfirm(name))
                    }
                  >
                    {fill ? t.removeComputer : t.addComputer}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <h2 className="more__h2">{t.pending}</h2>
        {users && pending.length === 0 && <p className="account__note">{t.pendingEmpty}</p>}
        <ul className="admin__list">
          {pending.map((u) =>
            row(
              u,
              <>
                <button type="button" className="chip-btn chip-btn--groen" onClick={() => act(() => api.approveUser(u.id))}>
                  {t.approve}
                </button>
                <button
                  type="button"
                  className="chip-btn chip-btn--rood"
                  onClick={() => act(() => api.deleteUser(u.id), t.rejectConfirm(u.nickname))}
                >
                  {t.reject}
                </button>
              </>,
            ),
          )}
        </ul>

        <h2 className="more__h2">{t.approved}</h2>
        <ul className="admin__list">
          {approved.map((u) =>
            row(
              u,
              u.isAdmin ? (
                <span className="account__small">{t.you}</span>
              ) : (
                <button
                  type="button"
                  className="chip-btn chip-btn--rood"
                  onClick={() => act(() => api.deleteUser(u.id), t.removeConfirm(u.nickname))}
                >
                  {t.remove}
                </button>
              ),
            ),
          )}
        </ul>
      </main>
    </div>
  );
}
