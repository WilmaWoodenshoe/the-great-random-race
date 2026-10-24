import type { Choice } from '../../models/Choice';

const kevin: Choice = {
  id: 'kevin',
  // Speel je zelf met Kevin, dan komt dit event niet voor.
  aboutRacer: 'kevin',
  heading: 'Er ligt iemand op het pad!',
  title: 'Kevin slaapt',
  text: 'Kevin ligt midden op het pad te slapen. Kevin snurkt een beetje. Wat doet {naam}?',
  announce: '{naam} heeft Kevin gevonden. Kevin slaapt. Dat was te verwachten.',
  image: 'racers/rups.webp',
  imageAlt: 'Kevin de rups',
  options: [
    {
      id: 'wakker',
      label: 'Maak hem wakker',
      color: 'groen',
      prefers: ['chaotic'],
      effects: [{ minutes: 15, speed: 0 }],
      journal: [
        '{naam} heeft Kevin wakker gemaakt. Kevin is meteen weer in slaap gevallen.',
        '{naam} zei: "Kevin." Kevin zei: "Mmm." Daarna ging {naam} verder.',
        '{naam} probeerde Kevin te wekken. Het lukte bijna.',
        'Kevin werd wakker, keek naar {naam} en sliep verder. {naam} begrijpt het wel.',
      ],
    },
    {
      id: 'dutje',
      label: 'Doe ook een dutje',
      color: 'blauw',
      prefers: ['lazy'],
      effects: [{ minutes: 120, speed: 0 }],
      journal: [
        '{naam} heeft twee uur naast Kevin geslapen. Het was het beste dutje van de race.',
        '{naam} en Kevin hebben samen een dutje gedaan. Kenners spreken van teamwork.',
        '{naam} sliep twee uur. Kevin sliep langer. Kevin wint dit onderdeel.',
        'Na een dutje van twee uur is {naam} weer helemaal fris. Kevin nog niet.',
      ],
    },
    {
      id: 'sluipen',
      label: 'Sluip voorbij',
      color: 'oranje',
      prefers: ['stubborn', 'curious'],
      effects: [{ minutes: 30, speed: 0.6 }],
      journal: [
        '{naam} is heel zachtjes langs Kevin geslopen. Voor {naam} is dat erg zachtjes.',
        '{naam} sloop voorbij. Kevin heeft niets gemerkt. Kevin merkt zelden iets.',
        '{naam} heeft Kevin ingehaald zonder hem te wekken. Tactisch.',
        'Op {zijn} tenen, voor zover {hij} die heeft, sloop {naam} langs Kevin.',
      ],
    },
  ],
};

export default kevin;
