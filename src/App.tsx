import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { GameProvider } from './state/GameProvider';
import { Start } from './screens/Start';
import { Welcome } from './screens/Welcome';
import { Home } from './screens/Home';
import { Race } from './screens/Race';
import { Racer } from './screens/Racer';
import { Leaderboard } from './screens/Leaderboard';
import { Journal } from './screens/Journal';
import { Action } from './screens/Action';
import { Event } from './screens/Event';
import { Finish } from './screens/Finish';
import { More } from './screens/More';
import { NotFound } from './screens/NotFound';

/** Bij elk nieuw scherm bovenaan beginnen. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

// HashRouter: de adressen zien eruit als …/#/race. Dat werkt op elke
// eenvoudige webserver (ook GitHub Pages) zonder extra instellingen.
export function App() {
  return (
    <GameProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/welkom" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/race" element={<Race />} />
          <Route path="/gerard" element={<Racer />} />
          <Route path="/racer/:id" element={<Racer />} />
          <Route path="/tussenstand" element={<Leaderboard />} />
          <Route path="/journaal" element={<Journal />} />
          <Route path="/actie" element={<Action />} />
          <Route path="/event" element={<Event />} />
          <Route path="/finish" element={<Finish />} />
          <Route path="/meer" element={<More />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}
