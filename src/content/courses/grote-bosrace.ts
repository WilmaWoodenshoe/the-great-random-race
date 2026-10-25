import type { Course } from '../../models/Course';

// Posities (bordjes en pad) zijn in pixels op de originele kaart (1024 × 1536).
const groteBosrace: Course = {
  id: 'grote-bosrace',
  name: 'De Grote Bosrace',
  lengthKm: 42.7,
  days: 7,
  map: {
    image: 'courses/grote-bosrace-kaart.webp',
    width: 1024,
    height: 1536,
    finish: { x: 590, y: 100 },
  },
  background: 'backgrounds/bg-landschap.webp',
  segments: [
    {
      id: 'startweide',
      name: 'Zenuwweide',
      withArticle: 'de Zenuwweide',
      share: 0.1,
      terrain: 1.0,
      sign: { x: 760, y: 1340 },
      path: [{ x: 580, y: 1528 }, { x: 520, y: 1400 }, { x: 480, y: 1275 }, { x: 560, y: 1195 }],
    },
    {
      id: 'bos',
      name: 'Fluisterbos',
      withArticle: 'het Fluisterbos',
      share: 0.2,
      terrain: 0.95,
      sign: { x: 290, y: 1060 },
      path: [{ x: 560, y: 1195 }, { x: 627, y: 1115 }, { x: 587, y: 1055 }, { x: 467, y: 995 }, { x: 440, y: 941 }],
    },
    {
      id: 'modderveld',
      name: 'Plakveld',
      withArticle: 'het Plakveld',
      share: 0.1,
      terrain: 0.7,
      sign: { x: 730, y: 880 },
      path: [{ x: 440, y: 941 }, { x: 533, y: 901 }, { x: 547, y: 835 }, { x: 490, y: 790 }, { x: 507, y: 747 }],
    },
    {
      id: 'beekje',
      name: 'Natte Voetenbeek',
      withArticle: 'de Natte Voetenbeek',
      share: 0.1,
      terrain: 0.85,
      sign: { x: 760, y: 700 },
      path: [{ x: 507, y: 747 }, { x: 520, y: 687 }, { x: 453, y: 627 }],
    },
    {
      id: 'vreemde-open-plek',
      name: 'Paddenstoelenkring',
      withArticle: 'de Paddenstoelenkring',
      share: 0.15,
      terrain: 1.05,
      sign: { x: 250, y: 520 },
      path: [{ x: 453, y: 627 }, { x: 440, y: 587 }, { x: 560, y: 547 }, { x: 667, y: 520 }, { x: 693, y: 467 }, { x: 667, y: 427 }],
    },
    {
      id: 'heuvel',
      name: 'Hijgheuvel',
      withArticle: 'de Hijgheuvel',
      share: 0.15,
      terrain: 0.75,
      sign: { x: 820, y: 360 },
      path: [{ x: 667, y: 427 }, { x: 587, y: 393 }, { x: 533, y: 353 }, { x: 560, y: 307 }, { x: 640, y: 267 }],
    },
    {
      id: 'kasteeltuin',
      name: 'Kasteeltuin',
      withArticle: 'de Kasteeltuin',
      share: 0.2,
      terrain: 1.0,
      sign: { x: 300, y: 230 },
      path: [{ x: 640, y: 267 }, { x: 627, y: 220 }, { x: 560, y: 187 }, { x: 507, y: 160 }, { x: 480, y: 133 }],
    },
  ],
};

export default groteBosrace;
