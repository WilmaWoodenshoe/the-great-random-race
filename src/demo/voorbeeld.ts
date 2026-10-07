// VOORBEELDGEGEVENS voor de testversie van fase 1.
// Vanaf fase 2–3 komen deze getallen uit de echte race-engine en
// verdwijnt dit bestand.

export type JournalTone = 'groen' | 'oranje' | 'paars' | 'grijs';

export interface DemoJournalEntry {
  time: string;
  tone: JournalTone;
  icon: string;
  text: string;
}

export const demoRace = {
  number: 1,
  courseId: 'grote-bosrace',
  daysLeft: 4,
  status: 'naar een bloem aan het kijken.',
  statusIcon: 'ui/status-icon.png',
  positionChange: 1,
  /** Afgelegde afstand per racer, in km. */
  distances: {
    ducky: 40.1,
    turbo: 39.4,
    gerard: 38.7,
    kevin: 21.3,
    steve: 0.4,
  } as Record<string, number>,
  /** Waar Gerard nu op de kaart staat (pixels op de originele kaart). */
  gerardOnMap: { x: 491, y: 415 },
  leaderboardComment: {
    bold: 'Gerard staat 0,7 km achter Turbo.',
    rest: 'Turbo weet het nog niet. Steve heeft zich sinds dinsdag niet verplaatst.',
  },
  history: { races: 3, wins: 0, best: 2 },
};

export const demoJournal: DemoJournalEntry[] = [
  { time: '16:44', tone: 'oranje', icon: 'journal/j10.png', text: 'Aangekomen bij het modderveld.' },
  { time: '15:18', tone: 'groen', icon: 'journal/j09.png', text: 'Verder gegaan.' },
  { time: '15:02', tone: 'oranje', icon: 'journal/j08.png', text: 'Werd afgeleid door een vogel.' },
  { time: '13:21', tone: 'grijs', icon: 'journal/j07.png', text: 'Slaap.' },
  { time: '13:20', tone: 'groen', icon: 'journal/j06.png', text: 'Sla gegeten.' },
  { time: '11:43', tone: 'oranje', icon: 'journal/j05.png', text: 'Gestopt voor onbekende reden.' },
  { time: '10:02', tone: 'groen', icon: 'journal/j04.png', text: 'Verder gegaan.' },
  { time: '09:48', tone: 'oranje', icon: 'journal/j03.png', text: 'Nog steeds bloem bekeken.' },
  { time: '09:17', tone: 'paars', icon: 'journal/j02.png', text: 'Bloem bekeken.' },
  { time: '09:14', tone: 'oranje', icon: 'journal/j01.png', text: 'Bloem gevonden.' },
  { time: '08:31', tone: 'groen', icon: 'journal/j00.png', text: 'Vertrokken.' },
];

export const demoFinish = {
  /** Uitslag: finishtijd in uren, of afgelegde km als de finish niet gehaald is. */
  podium: [
    { racerId: 'gerard', hours: 166 },
    { racerId: 'ducky', hours: 167 },
    { racerId: 'turbo', km: 42.6 },
  ] as { racerId: string; hours?: number; km?: number }[],
  stats: [
    { label: 'Tijd naar één bloem gekeken', value: '4 u 12 min' },
    { label: 'Verloren aan ‘kortere wegen’ (Ducky)', value: '31 meter' },
    { label: 'Steve aangezien voor decor', value: '14 keer' },
  ],
};
