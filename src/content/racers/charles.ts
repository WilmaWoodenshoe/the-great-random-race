import type { Racer } from '../../models/Racer';

// Het oude konijn: vroeger snel, nu vooral moe. Hoge basissnelheid, maar
// chaotisch (kortere wegen én verdwalen) en lui (lange dutjes).
const charles: Racer = {
  id: 'charles',
  name: 'Charles',
  species: 'Konijn',
  speed: 1.05,
  traits: { curious: 40, stubborn: 35, chaotic: 80, lazy: 85 },
  title: 'The Retired Champion',
  tagline: 'Was ooit kampioen. Nu vooral moe.',
  image: 'racers/konijn.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 469,
    head: { x: 69, y: 13, w: 38, angle: 5 },
    eyes: { x: 71, y: 28, w: 23, angle: -3 },
    neck: { x: 66, y: 55, w: 34 },
  },
  facts: {
    favoriteFood: 'Wortels, zoals vroeger',
    dislikes: 'Jonge honden',
    favoriteActivity: 'Vertellen over 1987',
    secretTalent: 'Sprint als niemand kijkt',
  },
};

export default charles;
