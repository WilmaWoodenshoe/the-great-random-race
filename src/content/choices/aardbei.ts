import type { Choice } from '../../models/Choice';

const aardbei: Choice = {
  id: 'aardbei',
  heading: 'Gerard heeft iets gevonden!',
  title: 'Een gigantische aardbei',
  text: 'Gerard heeft nog nooit zo’n grote aardbei gezien. Wat moet hij doen?',
  announce: 'Gerard heeft een gigantische aardbei gevonden. Hij kijkt ernaar. De aardbei kijkt niet terug.',
  image: 'ui/event-aardbei.png',
  imageAlt: 'Gerard naast een gigantische aardbei',
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
        'Gerard heeft de aardbei gegeten. Het duurde een uur. Hij heeft er geen spijt van.',
        'Gerard at de aardbei. Kenners noemen het een verantwoorde investering.',
        'De aardbei is op. Gerard is voller en, verrassend genoeg, sneller.',
        'Gerard heeft de aardbei verorberd. Er bleef niets over behalve tevredenheid.',
      ],
    },
    {
      id: 'negeren',
      label: 'Negeer hem',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [],
      journal: [
        'Gerard negeerde de aardbei. De aardbei negeerde Gerard ook.',
        'Gerard liep door. Hij keek niet om. Nou ja, één keer.',
        'Gerard liet de aardbei liggen. Een moedige keuze, volgens niemand.',
        'De aardbei blijft achter. Gerard denkt er nog steeds aan.',
      ],
    },
    {
      id: 'zitten',
      label: 'Ga erop zitten',
      color: 'oranje',
      prefers: ['chaotic'],
      effects: [{ minutes: 30, speed: 0 }],
      journal: [
        'Gerard is op de aardbei gaan zitten. Niemand weet waarom. Gerard ook niet.',
        'Gerard zit op de aardbei. Hij lijkt het een prima plek te vinden.',
        'Gerard heeft een half uur op een aardbei gezeten. Het was plakkerig.',
        'Gerard nam plaats op de aardbei. Commentatoren zijn sprakeloos.',
      ],
    },
  ],
};

export default aardbei;
