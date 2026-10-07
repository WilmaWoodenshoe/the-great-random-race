import { Link } from 'react-router-dom';
import { nl } from '../content/nl';
import { BottomNav } from '../components/BottomNav';
import { ChevronRight } from '../components/Icons';

interface Item {
  to: string;
  title: string;
  hint: string;
}

function MenuList({ items }: { items: Item[] }) {
  return (
    <ul className="card card--wit menu">
      {items.map((i) => (
        <li key={i.to}>
          <Link to={i.to} className="menu__item">
            <span>
              <span className="menu__title">{i.title}</span>
              <span className="menu__hint">{i.hint}</span>
            </span>
            <ChevronRight />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Meer: toegang tot de overige schermen. */
export function More() {
  const t = nl.more;
  return (
    <div className="screen screen--nav">
      <header className="board__header">
        <h1 className="kop kop--32 center">{t.title}</h1>
      </header>
      <main className="screen__main more">
        <h2 className="more__h2">{t.raceSection}</h2>
        <MenuList
          items={[
            { to: '/tussenstand', title: t.leaderboard, hint: t.leaderboardHint },
            { to: '/journaal', title: t.journal, hint: t.journalHint },
            { to: '/actie', title: t.action, hint: t.actionHint },
          ]}
        />
        <h2 className="more__h2">{t.previewSection}</h2>
        <MenuList
          items={[
            { to: '/', title: t.welcome, hint: t.welcomeHint },
            { to: '/event', title: t.event, hint: t.eventHint },
            { to: '/finish', title: t.finish, hint: t.finishHint },
          ]}
        />
        <p className="more__privacy">{t.privacy}</p>
      </main>
      <BottomNav />
    </div>
  );
}
