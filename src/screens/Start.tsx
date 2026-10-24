import { Navigate } from 'react-router-dom';
import { useGame } from '../state/GameProvider';
import { accountsEnabled, useAccount } from '../account/AccountProvider';
import { Welcome } from './Welcome';
import { peekInvite } from '../account/invite';

/**
 * Eerste scherm. Loopt er al een race, dan meteen naar Home. Op de echte
 * site heb je eerst een (goedgekeurd) account nodig; daarna kies je een
 * race in de lijst.
 */
export function Start() {
  const { loading, race } = useGame();
  const { status, me } = useAccount();
  if (loading || (accountsEnabled && status === 'checking')) return <div className="screen" aria-busy="true" />;
  if (!accountsEnabled || status === 'unavailable') return race ? <Navigate to="/home" replace /> : <Welcome />;
  // Geen verbinding: dan in elk geval de bewaarde race laten zien.
  if (status === 'offline') return race?.serverId ? <Navigate to="/home" replace /> : <Welcome />;
  if (!me) return <Welcome />;
  if (me.status !== 'approved') return <Navigate to="/account" replace />;
  // Uitgenodigd voor een race (en net goedgekeurd)? Dan meteen daarheen.
  const invite = peekInvite();
  if (invite) return <Navigate to={`/races/${invite}/meedoen`} replace />;
  return <Navigate to={race?.serverId ? '/home' : '/races'} replace />;
}
