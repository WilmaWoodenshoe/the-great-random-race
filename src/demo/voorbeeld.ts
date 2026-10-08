// VOORBEELDGEGEVENS voor de testversie van fase 1.
// Vanaf fase 2–3 komen deze getallen uit de echte race-engine en
// verdwijnt dit bestand.

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
