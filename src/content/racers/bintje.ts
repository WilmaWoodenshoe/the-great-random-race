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
  wornImages: {
    pet: { image: 'racers/worn/aardappel-pet.webp', left: 1.0, top: -4.2, width: 98.0 },
    hoed: { image: 'racers/worn/aardappel-hoed.webp', left: -3.9, top: -26.5, width: 104.3 },
    boerenhoed: { image: 'racers/worn/aardappel-boerenhoed.webp', left: -7.8, top: -21.1, width: 111.1 },
    feesthoed: { image: 'racers/worn/aardappel-feesthoed.webp', left: 0.0, top: -40.4, width: 102.0 },
    kroon: { image: 'racers/worn/aardappel-kroon.webp', left: -3.1, top: -26.9, width: 104.2 },
    helm: { image: 'racers/worn/aardappel-helm.webp', left: 4.7, top: -0.8, width: 94.3 },
    zonnebril: { image: 'racers/worn/aardappel-zonnebril.webp', left: 0.0, top: 0.0, width: 100.0 },
    sjaal: { image: 'racers/worn/aardappel-sjaal.webp', left: 1.1, top: 0.0, width: 108.7 },
  },
  facts: {
    favoriteFood: 'Liever niet over praten',
    dislikes: 'Frituurpannen',
    favoriteActivity: 'Op de bank liggen',
    secretTalent: 'Rolt heuvelaf verrassend snel',
  },
};

export default bintje;
