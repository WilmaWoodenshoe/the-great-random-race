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
  hatSpot: { left: 36, top: -22, width: 38, rotate: 8, aspect: 441 / 512 },
  eyeSpot: { left: 52, top: 28, width: 34 },
  neckSpot: { left: 22, top: 44, width: 60 },
  facts: {
    favoriteFood: 'Liever niet over praten',
    dislikes: 'Frituurpannen',
    favoriteActivity: 'Op de bank liggen',
    secretTalent: 'Rolt heuvelaf verrassend snel',
  },
};

export default bintje;
