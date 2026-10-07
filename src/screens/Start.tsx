import { Navigate } from 'react-router-dom';
import { useGame } from '../state/GameProvider';
import { Welcome } from './Welcome';

/** Eerste scherm: loopt er al een race, dan meteen naar Home; anders het welkom. */
export function Start() {
  const { loading, race } = useGame();
  if (loading) return <div className="screen" aria-busy="true" />;
  if (race) return <Navigate to="/home" replace />;
  return <Welcome />;
}
