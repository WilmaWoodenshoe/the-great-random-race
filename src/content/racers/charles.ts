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
  // Getekende plaatjes van deze racer mét accessoire (Collectie). Plek in procenten
  // van de gewone afbeelding. Zonder plaatje wordt het accessoire erop gelegd.
  wornImages: {
    pet: { image: 'racers/worn/konijn-pet.webp', left: 0.0, top: -2.1, width: 98.0 },
    hoed: { image: 'racers/worn/konijn-hoed.webp', left: 2.0, top: -15.0, width: 98.0 },
    boerenhoed: { image: 'racers/worn/konijn-boerenhoed.webp', left: 0.0, top: -5.5, width: 100.0 },
    feesthoed: { image: 'racers/worn/konijn-feesthoed.webp', left: 1.0, top: -18.6, width: 100.0 },
    kroon: { image: 'racers/worn/konijn-kroon.webp', left: -2.0, top: -11.1, width: 102.0 },
    helm: { image: 'racers/worn/konijn-helm.webp', left: -1.0, top: -4.4, width: 100.0 },
    zonnebril: { image: 'racers/worn/konijn-zonnebril.webp', left: 3.8, top: 0.0, width: 96.2, overlay: 'racers/worn/konijn-zonnebril-los.webp' },
    sjaal: { image: 'racers/worn/konijn-sjaal.webp', left: 4.8, top: 0.0, width: 96.2, overlay: 'racers/worn/konijn-sjaal-los.webp' },
  },
  facts: {
    favoriteFood: 'Wortels, zoals vroeger',
    dislikes: 'Jonge honden',
    favoriteActivity: 'Vertellen over 1987',
    secretTalent: 'Sprint als niemand kijkt',
  },
};

export default charles;
