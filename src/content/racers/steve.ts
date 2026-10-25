import type { Racer } from '../../models/Racer';

const steve: Racer = {
  id: 'steve',
  name: 'Steve',
  species: 'Steen',
  speed: 0.15,
  traits: { curious: 5, stubborn: 100, chaotic: 1, lazy: 100 },
  title: 'Still Going',
  tagline: 'Still going.',
  image: 'racers/steen.webp',
  // Waar hoed, bril en sjaal zitten (Collectie): punt boven op het hoofd,
  // midden tussen de ogen en de nek, in procenten van de afbeelding.
  wear: {
    aspect: 512 / 433,
    head: { x: 48, y: 3, w: 38 },
    eyes: { x: 56, y: 48, w: 36, angle: -6 },
    neck: { x: 58, y: 73, w: 40 },
  },
  wornImages: {
    pet: { image: 'racers/worn/steen-pet.webp', left: 2.8, top: -2.2, width: 94.3 },
    hoed: { image: 'racers/worn/steen-hoed.webp', left: 0.0, top: -33.1, width: 100.0 },
    boerenhoed: { image: 'racers/worn/steen-boerenhoed.webp', left: 0.0, top: -16.6, width: 100.0 },
    feesthoed: { image: 'racers/worn/steen-feesthoed.webp', left: 0.0, top: -35.5, width: 100.0 },
    kroon: { image: 'racers/worn/steen-kroon.webp', left: 0.0, top: -26.0, width: 100.0 },
    helm: { image: 'racers/worn/steen-helm.webp', left: 0.0, top: -20.7, width: 100.0 },
    zonnebril: { image: 'racers/worn/steen-zonnebril.webp', left: 0.0, top: 0.0, width: 100.0 },
    sjaal: { image: 'racers/worn/steen-sjaal.webp', left: 0.0, top: 0.0, width: 102.0 },
  },
  facts: {
    favoriteFood: 'Onbekend',
    dislikes: 'Niets',
    favoriteActivity: 'Liggen',
    secretTalent: 'Wordt aangezien voor decor',
  },
};

export default steve;
