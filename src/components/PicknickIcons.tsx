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
