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
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 441 / 512,
    head: { x: 54, y: 3, w: 50, angle: 6 },
    eyes: { x: 69, y: 35, w: 28, angle: -6 },
    neck: { x: 60, y: 52, w: 58, angle: -4 },
  },
  facts: {
    favoriteFood: 'Liever niet over praten',
    dislikes: 'Frituurpannen',
    favoriteActivity: 'Op de bank liggen',
    secretTalent: 'Rolt heuvelaf verrassend snel',
  },
};

export default bintje;
