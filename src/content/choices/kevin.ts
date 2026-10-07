import type { Choice } from '../../models/Choice';

const kevin: Choice = {
  id: 'kevin',
  heading: 'Er ligt iemand op het pad!',
  title: 'Kevin slaapt',
  text: 'Kevin ligt midden op het pad te slapen. Hij snurkt een beetje. Wat doet Gerard?',
  announce: 'Gerard heeft Kevin gevonden. Kevin slaapt. Dat was te verwachten.',
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
        'Gerard heeft Kevin wakker gemaakt. Kevin is meteen weer in slaap gevallen.',
        'Gerard zei: "Kevin." Kevin zei: "Mmm." Daarna ging Gerard verder.',
        'Gerard probeerde Kevin te wekken. Het lukte bijna.',
        'Kevin werd wakker, keek naar Gerard en sliep verder. Gerard begrijpt het wel.',
      ],
    },
    {
      id: 'dutje',
      label: 'Doe ook een dutje',
      color: 'blauw',
      prefers: ['lazy'],
      effects: [{ minutes: 120, speed: 0 }],
      journal: [
        'Gerard heeft twee uur naast Kevin geslapen. Het was het beste dutje van de race.',
        'Gerard en Kevin hebben samen een dutje gedaan. Kenners spreken van teamwork.',
        'Gerard sliep twee uur. Kevin sliep langer. Kevin wint dit onderdeel.',
        'Na een dutje van twee uur is Gerard weer helemaal fris. Kevin nog niet.',
      ],
    },
    {
      id: 'sluipen',
      label: 'Sluip voorbij',
      color: 'oranje',
      prefers: ['stubborn', 'curious'],
      effects: [{ minutes: 30, speed: 0.6 }],
      journal: [
        'Gerard is heel zachtjes langs Kevin geslopen. Voor een slak is dat erg zachtjes.',
        'Gerard sloop voorbij. Kevin heeft niets gemerkt. Kevin merkt zelden iets.',
        'Gerard heeft Kevin ingehaald zonder hem te wekken. Tactisch.',
        'Op zijn tenen, voor zover hij die heeft, sloop Gerard langs Kevin.',
      ],
    },
  ],
};

export default kevin;
