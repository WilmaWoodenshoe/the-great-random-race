import { useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { useAccount } from '../account/AccountProvider';
import { useGame } from '../state/GameProvider';

/** Doe je aan meer races mee? Dan kies je hier welke je bekijkt. */
export function RaceSwitcher() {
  const { myRaces, selectRace } = useAccount();
  const { race } = useGame();
  const navigate = useNavigate();
  if (myRaces.length < 2) return null;

  const pick = async (id: number) => {
    if (id === race?.serverId) return;
    await selectRace(id);
    const chosen = myRaces.find((r) => r.id === id);
    navigate(chosen?.status === 'open' ? '/wachtruimte' : '/home', { replace: true });
  };

  return (
    <nav className="switcher" aria-label={nl.switcher.label}>
      {myRaces.map((r) => (
        <button
          key={r.id}
          type="button"
          aria-pressed={r.id === race?.serverId}
          className={`switcher__chip${r.id === race?.serverId ? ' switcher__chip--on' : ''}`}
          onClick={() => void pick(r.id)}
        >
          <span className="switcher__name">{nl.races.name(r.id, r.name)}</span>
          <span className="switcher__state">{nl.switcher[r.status]}</span>
        </button>
      ))}
    </nav>
  );
}
