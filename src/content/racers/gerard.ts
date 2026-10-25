import type { Racer } from '../../models/Racer';

const gerard: Racer = {
  id: 'gerard',
  name: 'Gerard',
  species: 'Slak',
  speed: 1.0,
  traits: { curious: 85, stubborn: 75, chaotic: 20, lazy: 60 },
  title: 'The Determined',
  tagline: 'Langzaam, maar met overtuiging.',
  image: 'racers/gerard.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 720 / 519,
    head: { x: 45, y: 14, w: 30, angle: -10 },
    eyes: { x: 84.5, y: 13, w: 27, angle: 8 },
    neck: { x: 84, y: 66, w: 22 },
  },
  // Getekende plaatjes van deze racer mét accessoire (Collectie). Plek in procenten
  // van de gewone afbeelding. Zonder plaatje wordt het accessoire erop gelegd.
  wornImages: {
    pet: { image: 'racers/worn/gerard-pet.webp', left: 2.9, top: -1.3, width: 96.2 },
    hoed: { image: 'racers/worn/gerard-hoed.webp', left: 0.0, top: -20.8, width: 100.0 },
    boerenhoed: { image: 'racers/worn/gerard-boerenhoed.webp', left: 0.0, top: -13.9, width: 100.0 },
    feesthoed: { image: 'racers/worn/gerard-feesthoed.webp', left: -4.2, top: -33.3, width: 104.2 },
    kroon: { image: 'racers/worn/gerard-kroon.webp', left: -2.0, top: -27.0, width: 102.0 },
    helm: { image: 'racers/worn/gerard-helm.webp', left: 0.0, top: -16.7, width: 100.0 },
    zonnebril: { image: 'racers/worn/gerard-zonnebril.webp', left: 3.8, top: -6.7, width: 96.2 },
    sjaal: { image: 'racers/worn/gerard-sjaal.webp', left: 2.9, top: -4.0, width: 96.2 },
  },
  playable: true,
  facts: {
    favoriteFood: 'Sla',
    dislikes: 'Kiezelstenen',
    favoriteActivity: 'Stilstaan',
    secretTalent: 'Verdwijnt soms',
  },
};

export default gerard;
