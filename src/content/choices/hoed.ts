import type { Choice } from '../../models/Choice';

const hoed: Choice = {
  id: 'hoed',
  heading: 'Gerard heeft iets gevonden!',
  title: 'Een verloren hoed',
  text: 'Midden op het pad ligt een hoed. Hij is van niemand. Wat moet Gerard ermee?',
  announce: 'Gerard heeft een hoed gevonden. Niemand weet van wie hij is.',
  image: 'accessories/hoed.png',
  imageAlt: 'Een zwarte hoge hoed',
  options: [
    {
      id: 'erin',
      label: 'Kruip erin',
      color: 'groen',
      prefers: ['curious', 'lazy'],
      effects: [{ minutes: 45, speed: 0 }],
      journal: [
        'Gerard is in de hoed gekropen. Hij kwam er drie kwartier later weer uit.',
        'Gerard heeft de hoed van binnen bekeken. Het was donker en gezellig.',
        'Gerard zat drie kwartier in een hoed. Hij zegt dat het onderzoek was.',
        'Gerard verdween in de hoed. Even later kwam hij er weer uit. Geen konijn.',
      ],
    },
    {
      id: 'liggen',
      label: 'Laat hem liggen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [],
      journal: [
        'Gerard liet de hoed liggen. Misschien komt de eigenaar nog terug.',
        'Gerard is langs de hoed gekropen. Hij keek niet om. Nou ja, één keer.',
        'De hoed blijft achter. Gerard heeft belangrijkere dingen te doen.',
        'Gerard heeft de hoed met rust gelaten. Een gentleman.',
      ],
    },
    {
      id: 'duwen',
      label: 'Duw hem opzij',
      color: 'oranje',
      prefers: ['chaotic'],
      effects: [{ minutes: 20, speed: 0.5 }],
      journal: [
        'Gerard heeft de hoed opzij geduwd. De hoed ligt nu een beetje anders.',
        'Gerard duwde de hoed van het pad. Het kostte hem twintig minuten en wat waardigheid.',
        'De hoed ligt niet meer in de weg. Gerard is tevreden.',
        'Gerard heeft het pad vrijgemaakt. Toekomstige racers zijn hem dankbaar.',
      ],
    },
  ],
};

export default hoed;
