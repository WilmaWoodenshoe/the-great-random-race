import type { Choice } from '../../models/Choice';

const krab: Choice = {
  id: 'krab',
  // Alleen op het strand.
  courses: ['strandrace'],
  heading: '{naam} komt iemand tegen!',
  title: 'Een reuzenkrab',
  text: 'Midden op het strand staat een reuzenkrab. Hij klikt met zijn scharen. Wat doet {naam}?',
  announce: '{naam} staat oog in oog met een reuzenkrab. De krab kijkt vriendelijk. Denkt {naam}.',
  image: 'ui/event-krab.webp',
  imageAlt: 'Een reuzenkrab op het strand',
  options: [
    {
      id: 'zijwaarts',
      label: 'Loop zijwaarts mee',
      color: 'groen',
      prefers: ['curious', 'chaotic'],
      effects: [
        { minutes: 30, speed: 0.5 },
        { minutes: 120, speed: 1.15 },
      ],
      journal: [
        '{naam} is een half uur zijwaarts met de krab meegelopen. Daarna ging het opvallend snel.',
        '{naam} heeft van de krab geleerd hoe je zijwaarts loopt. Vooruit gaat nu ook beter.',
        '{naam} en de krab liepen samen zijwaarts. Kenners spreken van een nieuwe techniek.',
        'Zijwaarts, zijwaarts, en toen weer vooruit. {naam} heeft er zin in.',
      ],
    },
    {
      id: 'omheen',
      label: 'Ga er met een boog omheen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [{ minutes: 40, speed: 0.75 }],
      journal: [
        '{naam} ging met een grote boog om de krab heen. Een heel grote boog.',
        '{naam} heeft de krab ontweken. De krab klikte nog even na.',
        'Veiligheid voorop: {naam} nam de lange weg om de krab heen.',
        '{naam} hield afstand van de krab. Verstandig, zeggen de meeuwen.',
      ],
    },
    {
      id: 'wedstrijd',
      label: 'Daag hem uit voor een wedstrijdje',
      color: 'oranje',
      prefers: ['lazy', 'chaotic'],
      effects: [{ minutes: 60, speed: 0 }],
      journal: [
        '{naam} daagde de krab uit voor een wedstrijdje. Ze staan na een uur nog steeds aan de start.',
        '{naam} en de krab hielden een wedstrijdje. Niemand weet wie er won. De krab zegt zichzelf.',
        'Het wedstrijdje tegen de krab duurde een uur. {naam} vindt het een gelijkspel.',
        '{naam} verloor een wedstrijdje van een krab. Over de afstand wordt nog gediscussieerd.',
      ],
    },
  ],
};

export default krab;
