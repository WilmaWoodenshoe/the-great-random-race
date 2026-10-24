import type { Choice } from '../../models/Choice';

// Invulplekken: {naam}, {hij}/{Hij}, {zijn}/{Zijn}, {hem}. Zie de README.
const aardbei: Choice = {
  id: 'aardbei',
  heading: '{naam} heeft iets gevonden!',
  title: 'Een gigantische aardbei',
  text: '{naam} heeft nog nooit zo’n grote aardbei gezien. Wat moet {hij} doen?',
  announce: '{naam} heeft een gigantische aardbei gevonden. {Hij} kijkt ernaar. De aardbei kijkt niet terug.',
  image: 'ui/event-aardbei.webp',
  imageAlt: 'Een gigantische aardbei',
  options: [
    {
      id: 'eten',
      label: 'Eet hem',
      color: 'groen',
      prefers: ['curious', 'lazy'],
      effects: [
        { minutes: 60, speed: 0 },
        { minutes: 180, speed: 1.15 },
      ],
      journal: [
        '{naam} heeft de aardbei gegeten. Het duurde een uur. {Hij} heeft er geen spijt van.',
        '{naam} at de aardbei. Kenners noemen het een verantwoorde investering.',
        'De aardbei is op. {naam} is voller en, verrassend genoeg, sneller.',
        '{naam} heeft de aardbei verorberd. Er bleef niets over behalve tevredenheid.',
      ],
    },
    {
      id: 'negeren',
      label: 'Negeer hem',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [],
      journal: [
        '{naam} negeerde de aardbei. De aardbei negeerde {naam} ook.',
        '{naam} ging door. {Hij} keek niet om. Nou ja, één keer.',
        '{naam} liet de aardbei liggen. Een moedige keuze, volgens niemand.',
        'De aardbei blijft achter. {naam} denkt er nog steeds aan.',
      ],
    },
    {
      id: 'zitten',
      label: 'Ga erop zitten',
      color: 'oranje',
      prefers: ['chaotic'],
      effects: [{ minutes: 30, speed: 0 }],
      journal: [
        '{naam} is op de aardbei gaan zitten. Niemand weet waarom. {naam} ook niet.',
        '{naam} zit op de aardbei. {Hij} lijkt het een prima plek te vinden.',
        '{naam} heeft een half uur op een aardbei gezeten. Het was plakkerig.',
        '{naam} nam plaats op de aardbei. Commentatoren zijn sprakeloos.',
      ],
    },
  ],
};

export default aardbei;
