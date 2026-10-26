// Tijdelijke tekeningetjes voor het Picknickkleed, tot de echte plaatjes er zijn.

/** Groen blaadje: het teken van de speler bij boter-kaas-en-eieren. */
export const Leaf = ({ size = 48, title }: { size?: number; title?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    <path d="M8 40C8 20 20 8 42 6c0 22-12 34-32 34z" fill="#5DBB63" stroke="#2E7D32" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M10 38C18 28 26 20 36 12" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Icoon per spelletje op de tegels (als er nog geen plaatje is). */
export function GameIcon({ id }: { id: string }) {
  if (id === 'boter-kaas-en-eieren')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <rect x="2" y="2" width="48" height="48" rx="10" fill="#FFF8EC" stroke="#E2D6BE" strokeWidth="2" />
        <path d="M19 8v36M33 8v36M8 19h36M8 33h36" stroke="#C9A877" strokeWidth="3" strokeLinecap="round" />
        <path d="M9 17c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#5DBB63" />
        <circle cx="26" cy="26" r="4.5" fill="#E0601A" />
        <path d="M37 44c0-5 3-8 8-8 0 5-3 8-8 8z" fill="#5DBB63" />
      </svg>
    );
  if (id === 'memory')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <rect x="2" y="2" width="48" height="48" rx="10" fill="#FFF8EC" stroke="#E2D6BE" strokeWidth="2" />
        <rect x="8" y="10" width="16" height="22" rx="3" fill="#2E8AD8" stroke="#1E63B5" strokeWidth="2" transform="rotate(-8 16 21)" />
        <rect x="26" y="12" width="16" height="22" rx="3" fill="#FFFFFF" stroke="#C9A877" strokeWidth="2" transform="rotate(7 34 23)" />
        <circle cx="34" cy="23" r="4" fill="#F2B71F" />
        <rect x="16" y="26" width="16" height="20" rx="3" fill="#2E8AD8" stroke="#1E63B5" strokeWidth="2" />
      </svg>
    );
  if (id === 'bekertje-schuiven')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <rect x="2" y="2" width="48" height="48" rx="10" fill="#FFF8EC" stroke="#E2D6BE" strokeWidth="2" />
        {[8, 20, 32].map((x) => (
          <path key={x} d={`M${x} 40l3-22h7l3 22z`} fill="#E0601A" stroke="#9A3D0C" strokeWidth="1.6" strokeLinejoin="round" />
        ))}
        <path d="M14 46h24" stroke="#C9A877" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (id === 'mini-sudoku')
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <rect x="2" y="2" width="48" height="48" rx="10" fill="#FFF8EC" stroke="#E2D6BE" strokeWidth="2" />
        <path d="M10 10h32v32H10zM26 10v32M10 26h32" fill="none" stroke="#1E2A36" strokeWidth="2.5" />
        <path d="M18 10v32M34 10v32M10 18h32M10 34h32" fill="none" stroke="#C9A877" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="2.6" fill="#E0601A" />
        <circle cx="30" cy="22" r="2.6" fill="#2E8AD8" />
        <circle cx="22" cy="30" r="2.6" fill="#5DBB63" />
        <circle cx="38" cy="38" r="2.6" fill="#F2B71F" />
      </svg>
    );
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <rect x="2" y="2" width="48" height="48" rx="10" fill="#FFF8EC" stroke="#E2D6BE" strokeWidth="2" />
      <ellipse cx="17" cy="31" rx="10" ry="8" fill="#A8A29A" stroke="#6B6560" strokeWidth="2" />
      <rect x="27" y="10" width="15" height="19" rx="2" fill="#FFFFFF" stroke="#8C99A6" strokeWidth="2" />
      <path d="M30 37l10 7M40 37l-10 7" stroke="#E0601A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Steen, papier of schaar (tijdelijk als tekening). */
export function HandIcon({ hand, size = 56 }: { hand: string; size?: number }) {
  if (hand === 'steen')
    return (
      <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
        <path d="M10 36c-2-10 6-20 18-20s20 6 19 16-8 14-20 14S12 44 10 36z" fill="#A8A29A" stroke="#6B6560" strokeWidth="2.5" />
        <path d="M20 26c3-2 6-2 9 0M33 33c2-1 4-1 6 1" stroke="#6B6560" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  if (hand === 'papier')
    return (
      <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
        <path d="M14 6h20l9 9v35H14z" fill="#FFFFFF" stroke="#8C99A6" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M34 6v9h9M20 24h17M20 31h17M20 38h11" stroke="#8C99A6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="16" cy="42" r="7" fill="none" stroke="#E0601A" strokeWidth="3.5" />
      <circle cx="36" cy="42" r="7" fill="none" stroke="#E0601A" strokeWidth="3.5" />
      <path d="M20 37L42 8M32 37L14 8" stroke="#6B7280" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Omgekeerd bekertje (tijdelijk). */
export const Cup = () => (
  <svg viewBox="0 0 100 110" width="100%" height="100%" aria-hidden="true">
    <path d="M18 100 30 12h40l12 88z" fill="#E0601A" stroke="#9A3D0C" strokeWidth="4" strokeLinejoin="round" />
    <rect x="12" y="94" width="76" height="12" rx="6" fill="#C24F12" stroke="#9A3D0C" strokeWidth="4" />
    <path d="M38 22 32 86" stroke="#F6A06A" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="50" cy="12" rx="20" ry="5" fill="#F07E3A" stroke="#9A3D0C" strokeWidth="4" />
  </svg>
);
