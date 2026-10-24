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
    finish: { x: 720, y: 55 },
  },
  segments: [
    {
      id: 'startweide',
      name: 'Zenuwweide',
      withArticle: 'de Zenuwweide',
      share: 0.1,
      terrain: 1.0,
      sign: { x: 705, y: 1340 },
      path: [{ x: 500, y: 1440 }, { x: 470, y: 1340 }, { x: 472, y: 1290 }, { x: 520, y: 1225 }],
    },
    {
      id: 'bos',
      name: 'Fluisterbos',
      withArticle: 'het Fluisterbos',
      share: 0.2,
      terrain: 0.95,
      sign: { x: 757, y: 1108 },
      path: [{ x: 520, y: 1225 }, { x: 600, y: 1165 }, { x: 625, y: 1115 }, { x: 570, y: 1065 }, { x: 480, y: 1015 }, { x: 440, y: 966 }],
    },
    {
      id: 'modderveld',
      name: 'Plakveld',
      withArticle: 'het Plakveld',
      share: 0.1,
      terrain: 0.7,
      sign: { x: 762, y: 858 },
      path: [{ x: 440, y: 966 }, { x: 560, y: 936 }, { x: 610, y: 886 }, { x: 580, y: 836 }, { x: 470, y: 796 }, { x: 430, y: 756 }],
    },
    {
      id: 'beekje',
      name: 'Natte Voetenbeek',
      withArticle: 'de Natte Voetenbeek',
      share: 0.1,
      terrain: 0.85,
      sign: { x: 747, y: 580 },
      path: [{ x: 430, y: 756 }, { x: 470, y: 725 }, { x: 520, y: 690 }, { x: 560, y: 640 }, { x: 610, y: 580 }],
    },
    {
      id: 'vreemde-open-plek',
      name: 'Paddenstoelenkring',
      withArticle: 'de Paddenstoelenkring',
      share: 0.15,
      terrain: 1.05,
      sign: { x: 730, y: 352 },
      path: [{ x: 610, y: 580 }, { x: 680, y: 530 }, { x: 700, y: 470 }, { x: 680, y: 415 }, { x: 640, y: 375 }],
    },
    {
      id: 'heuvel',
      name: 'Hijgheuvel',
      withArticle: 'de Hijgheuvel',
      share: 0.15,
      terrain: 0.75,
      sign: { x: 682, y: 148 },
      path: [{ x: 640, y: 375 }, { x: 570, y: 335 }, { x: 580, y: 295 }, { x: 635, y: 255 }],
    },
    {
      id: 'kasteeltuin',
      name: 'Kasteeltuin',
      withArticle: 'de Kasteeltuin',
      share: 0.2,
      terrain: 1.0,
      sign: { x: 480, y: 120 },
      path: [{ x: 635, y: 255 }, { x: 600, y: 215 }, { x: 520, y: 180 }, { x: 480, y: 145 }],
    },
  ],
};

export default groteBosrace;
