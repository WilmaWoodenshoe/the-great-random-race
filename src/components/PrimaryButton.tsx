import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from './Icons';

type Color = 'groen' | 'blauw' | 'oranje';

interface Props {
  children: ReactNode;
  /** Link naar een ander scherm. Zonder `to` wordt het een gewone knop. */
  to?: string;
  onClick?: () => void;
  color?: Color;
  /** 'groot' = ronde hoofdknop (60 px), 'keuze' = keuzeknop (52 px). */
  size?: 'groot' | 'keuze';
  arrow?: boolean;
  icon?: ReactNode;
  /** Knop in een formulier: 'submit' verstuurt het formulier. */
  type?: 'button' | 'submit';
}

export function PrimaryButton({ children, to, onClick, color = 'groen', size = 'groot', arrow, icon, type = 'button' }: Props) {
  const className = `btn btn--${color} btn--${size}`;
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={className} onClick={onClick}>
      {content}
    </button>
  );
}
