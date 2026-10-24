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
  hatSpot: { left: 46, top: -12, width: 28, rotate: 5, aspect: 512 / 469 },
  facts: {
    favoriteFood: 'Wortels, zoals vroeger',
    dislikes: 'Jonge honden',
    favoriteActivity: 'Vertellen over 1987',
    secretTalent: 'Sprint als niemand kijkt',
  },
};

export default charles;
