// Kleine lijn-iconen, overgenomen uit de schermontwerpen.
type P = { size?: number };

export const ArrowRight = ({ size = 24 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeft = ({ size = 26 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const Gear = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

export const JournalIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export const BookIcon = ({ size = 28 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 5c3-1 6-1 9 1v14c-3-2-6-2-9-1z" fill="#2E8AD8" stroke="#1E2A36" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M21 5c-3-1-6-1-9 1v14c3-2 6-2 9-1z" fill="#4FA2EA" stroke="#1E2A36" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const TrophyIcon = ({ size = 30 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#F2B71F" stroke="#B07B0A" strokeWidth="1.4" />
    <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" fill="none" stroke="#B07B0A" strokeWidth="1.6" />
    <path d="M10 13h4v4h-4z" fill="#F2B71F" />
    <rect x="7" y="17" width="10" height="4" rx="1" fill="#B07B0A" />
  </svg>
);

export const PhoneDownload = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M12 7v7M9 11l3 3 3-3" />
  </svg>
);

export const CloseIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const AppleIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 7c-3-2-8-1-8 5s4 10 6 10c1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 6-4 6-10s-5-7-8-5z" />
    <path d="M12 7c0-2 1-4 3-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SkipIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 5l9 7-9 7zM12 5l9 7-9 7z" />
  </svg>
);

export const SitIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 4v9h12M6 13v7M18 13v7M9 4h6v9" />
  </svg>
);

export const LeafIcon = ({ size = 30 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 14c0-6 6-10 16-10 0 10-4 16-10 16-3 0-6-2-6-6z" fill="#5DBB63" stroke="#1F5E24" strokeWidth="1.4" />
    <path d="M6 18c4-4 8-8 12-12" stroke="#1F5E24" strokeWidth="1.4" fill="none" />
  </svg>
);

export const MegaphoneIcon = ({ size = 30 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 10v4h3l6 5V5L6 10z" fill="#F2B71F" stroke="#9A6A06" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 6c3 3 3 9 0 12" fill="none" stroke="#9A6A06" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ZzzIcon = ({ size = 30 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h6l-6 7h6M13 4h5l-5 6h5M15 14h4l-4 5h4" fill="none" stroke="#2E8AD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Iconen voor het racerprofiel */
export const PlusCircle = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);
export const NoCircle = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M6 6l12 12" />
  </svg>
);
export const StarOutline = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M12 3l2.6 5.6 6 .7-4.5 4 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.5-4 6-.7z" />
  </svg>
);
export const ClockCircle = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/* Menubalk */
export const NavHome = ({ active }: { active: boolean }) =>
  active ? (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />
    </svg>
  ) : (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );

export const NavRace = ({ active }: { active: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 21V4" fill="none" />
    <path d="M5 4h12l-2 4 2 4H5" />
  </svg>
);

export const NavRacer = ({ active }: { active: boolean }) => {
  const r = active ? 2.2 : 2;
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke={active ? 'none' : 'currentColor'} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="15" r={active ? 4.5 : 4} />
      <circle cx="5.5" cy="10" r={r} />
      <circle cx="9.5" cy="5.5" r={r} />
      <circle cx="14.5" cy="5.5" r={r} />
      <circle cx="18.5" cy="10" r={r} />
    </svg>
  );
};

export const NavCollection = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="3" />
    <path d="M9 3v4M15 3v4" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const NavMore = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
