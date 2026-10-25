import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { GameProvider } from './state/GameProvider';
import { AccountProvider } from './account/AccountProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Start } from './screens/Start';
import { Welcome } from './screens/Welcome';
import { PickRacer } from './screens/PickRacer';
import { Home } from './screens/Home';
import { Race } from './screens/Race';
import { Racer } from './screens/Racer';
import { Leaderboard } from './screens/Leaderboard';
import { Journal } from './screens/Journal';
import { Action } from './screens/Action';
import { Event } from './screens/Event';
import { Finish } from './screens/Finish';
import { More } from './screens/More';
import { Account } from './screens/Account';
import { Races } from './screens/Races';
import { NewRace } from './screens/NewRace';
import { JoinRace } from './screens/JoinRace';
import { Lobby } from './screens/Lobby';
import { Admin } from './screens/Admin';
import { Inventory } from './screens/Inventory';
import { Collection } from './screens/Collection';
import { NotFound } from './screens/NotFound';

/** Bij elk nieuw scherm bovenaan beginnen. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Met accolades: nieuwere Chrome-versies geven bij scrollTo iets terug,
    // en React zou dat anders als 'opruimfunctie' proberen uit te voeren.
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// HashRouter: de adressen zien eruit als …/#/race. Dat werkt op elke
// eenvoudige webserver (ook GitHub Pages) zonder extra instellingen.
export function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <AccountProvider>
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/welkom" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/race" element={<Race />} />
              <Route path="/kies" element={<PickRacer />} />
              <Route path="/mijn-racer" element={<Racer />} />
              {/* Oud adres uit v0.1, voor wie het nog als bladwijzer heeft. */}
              <Route path="/gerard" element={<Racer />} />
              <Route path="/racer/:id" element={<Racer />} />
              <Route path="/tussenstand" element={<Leaderboard />} />
              <Route path="/journaal" element={<Journal />} />
              <Route path="/actie" element={<Action />} />
              <Route path="/event" element={<Event />} />
              <Route path="/finish" element={<Finish />} />
              <Route path="/meer" element={<More />} />
              <Route path="/account" element={<Account />} />
              <Route path="/races" element={<Races />} />
              <Route path="/races/nieuw" element={<NewRace />} />
              <Route path="/races/:id/meedoen" element={<JoinRace />} />
              <Route path="/races/:id/andere-racer" element={<JoinRace switching />} />
              <Route path="/wachtruimte" element={<Lobby />} />
              <Route path="/beheer" element={<Admin />} />
              <Route path="/inventaris" element={<Inventory />} />
              <Route path="/collectie" element={<Collection />} />
              <Route path="/spelers" element={<Navigate to="/races" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </AccountProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}
