import type { Racer } from '../../models/Racer';

const kevin: Racer = {
  id: 'kevin',
  name: 'Kevin',
  species: 'Rups',
  speed: 1.0,
  traits: { curious: 70, stubborn: 20, chaotic: 60, lazy: 80 },
  title: 'Professional Napper',
  tagline: 'Slaapt vooral.',
  image: 'racers/rups.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 479,
    head: { x: 77, y: 27, w: 42, angle: 5 },
    eyes: { x: 86, y: 40, w: 32, angle: -3 },
    neck: { x: 70, y: 66, w: 30 },
  },
  wornImages: {
    pet: { image: 'racers/worn/rups-pet.webp', left: 1.0, top: -3.1, width: 98.0 },
    hoed: { image: 'racers/worn/rups-hoed.webp', left: 1.0, top: -3.1, width: 98.0 },
    boerenhoed: { image: 'racers/worn/rups-boerenhoed.webp', left: 2.9, top: 0.0, width: 96.2 },
    feesthoed: { image: 'racers/worn/rups-feesthoed.webp', left: 1.0, top: -8.6, width: 100.0 },
    kroon: { image: 'racers/worn/rups-kroon.webp', left: -1.0, top: -1.0, width: 98.0 },
    helm: { image: 'racers/worn/rups-helm.webp', left: 1.9, top: -1.0, width: 96.2 },
    zonnebril: { image: 'racers/worn/rups-zonnebril.webp', left: 1.0, top: 0.0, width: 100.0, overlay: 'racers/worn/rups-zonnebril-los.webp' },
    sjaal: { image: 'racers/worn/rups-sjaal.webp', left: 1.9, top: 1.0, width: 96.2, overlay: 'racers/worn/rups-sjaal-los.webp' },
  },
  facts: {
    favoriteFood: 'Bladeren',
    dislikes: 'Wekkers',
    favoriteActivity: 'Dutjes',
    secretTalent: 'Slaapt overal',
  },
};

export default kevin;
