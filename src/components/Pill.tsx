import type { ReactNode } from 'react';

/** Lichtblauw label, bijv. "Nog 4 dagen". */
export function Pill({ children }: { children: ReactNode }) {
  return <span className="pill">{children}</span>;
}
