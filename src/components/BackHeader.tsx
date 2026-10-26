import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { ChevronLeft, NavHome } from './Icons';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Extra inhoud onder de titel (bijv. een label). */
  children?: ReactNode;
  /** Knop rechtsboven. */
  right?: ReactNode;
  /** Waar de terugknop heen gaat als er geen vorige pagina is. */
  fallback?: string;
  /** Altijd naar deze pagina (in plaats van terug in de geschiedenis). */
  to?: string;
  /** Een Home-knop in plaats van de terugknop. */
  home?: boolean;
}

/** Kop met terugknop links en titel in het midden. */
export function BackHeader({ title, subtitle, children, right, fallback = '/home', to, home = false }: Props) {
  const navigate = useNavigate();
  const goBack = () => {
    if (home) navigate('/home');
    else if (to) navigate(to);
    else if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(fallback);
  };
  return (
    <header className="back-header">
      <button type="button" className="back-header__back" aria-label={home ? nl.nav.home : nl.common.back} onClick={goBack}>
        {home ? <NavHome active={false} /> : <ChevronLeft />}
      </button>
      {right && <div className="back-header__right">{right}</div>}
      <h1 className="back-header__title">{title}</h1>
      {subtitle && <div className="back-header__subtitle">{subtitle}</div>}
      {children}
    </header>
  );
}
