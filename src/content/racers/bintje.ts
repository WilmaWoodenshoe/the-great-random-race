import type { Racer } from '../../models/Racer';

// Een aardappel. Niemand weet hoe hij beweegt, maar hij komt vooruit.
const bintje: Racer = {
  id: 'bintje',
  name: 'Bintje',
  species: 'Aardappel',
  speed: 1.0,
  traits: { curious: 15, stubborn: 70, chaotic: 25, lazy: 85 },
  title: 'The Couch Potato',
  tagline: 'Niemand weet hoe hij beweegt.',
  image: 'racers/aardappel.webp',
  hatSpot: { left: 32, top: -19, width: 36, rotate: -5, aspect: 434 / 512 },
  facts: {
    favoriteFood: 'Liever niet over praten',
    dislikes: 'Frituurpannen',
    favoriteActivity: 'Op de bank liggen',
    secretTalent: 'Rolt heuvelaf verrassend snel',
  },
};

export default bintje;
