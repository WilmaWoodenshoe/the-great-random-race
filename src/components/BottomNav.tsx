import { NavLink } from 'react-router-dom';
import { nl } from '../content/nl';
import { getRacer } from '../content';
import { useGame } from '../state/GameProvider';
import { NavCollection, NavHome, NavMore, NavRace, NavRacer } from './Icons';

/** De menubalk onderaan, zoals in Main.html. */
export function BottomNav() {
  const { race } = useGame();
  // Het tabblad heet naar de racer van de speler.
  const name = race ? (race.racers.find((r) => r.id === race.playerId)?.name ?? '') : getRacer('gerard').name;
  const item = (to: string, label: string, icon: (active: boolean) => JSX.Element) => (
    <NavLink to={to} end className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
      {({ isActive }) => (
        <>
          {icon(isActive)}
          {label}
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="nav" aria-label={nl.nav.label}>
      {item('/home', nl.nav.home, (a) => <NavHome active={a} />)}
      {item('/race', nl.nav.race, (a) => <NavRace active={a} />)}
      {item('/mijn-racer', name, (a) => <NavRacer active={a} />)}
      <span className="nav__item nav__item--disabled" aria-disabled="true">
        <NavCollection />
        {nl.nav.collection}
        <small className="nav__soon">{nl.nav.soon}</small>
      </span>
      {item('/meer', nl.nav.more, () => <NavMore />)}
    </nav>
  );
}
