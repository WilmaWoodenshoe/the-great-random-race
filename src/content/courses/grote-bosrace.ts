import type { Course } from '../../models/Course';

// Posities (bordjes en pad) zijn in pixels op de staande kaart (853 × 1843).
// Lopende races met de oude kaart houden die: de route zit in de race zelf opgeslagen.
const groteBosrace: Course = {
  id: 'grote-bosrace',
  name: 'De Grote Bosrace',
  lengthKm: 42.7,
  days: 7,
  map: {
    image: 'courses/grote-bosrace-kaart-staand.webp',
    width: 853,
    height: 1843,
    finish: { x: 500, y: 352 },
  },
  background: 'backgrounds/bg-landschap.webp',
  backgroundTall: 'backgrounds/bg-bos-staand.webp',
  segments: [
    {
      id: 'startweide',
      name: 'Zenuwweide',
      withArticle: 'de Zenuwweide',
      share: 0.1,
      terrain: 1.0,
      sign: { x: 650, y: 1500 },
      path: [{ x: 437, y: 1548 }, { x: 442, y: 1480 }, { x: 479, y: 1440 }, { x: 421, y: 1400 }],
    },
    {
      id: 'bos',
      name: 'Fluisterbos',
      withArticle: 'het Fluisterbos',
      share: 0.2,
      terrain: 0.95,
      sign: { x: 170, y: 1400 },
      path: [{ x: 421, y: 1400 }, { x: 378, y: 1380 }, { x: 345, y: 1340 }, { x: 368, y: 1300 }, { x: 399, y: 1280 }],
    },
    {
      id: 'modderveld',
      name: 'Plakveld',
      withArticle: 'het Plakveld',
      share: 0.1,
      terrain: 0.7,
      sign: { x: 680, y: 1260 },
      path: [{ x: 399, y: 1280 }, { x: 462, y: 1260 }, { x: 515, y: 1220 }, { x: 501, y: 1180 }, { x: 458, y: 1160 }, { x: 346, y: 1120 }, { x: 300, y: 1090 }, { x: 326, y: 1060 }, { x: 369, y: 1040 }],
    },
    {
      id: 'beekje',
      name: 'Natte Voetenbeek',
      withArticle: 'de Natte Voetenbeek',
      share: 0.1,
      terrain: 0.85,
      sign: { x: 150, y: 1005 },
      path: [{ x: 369, y: 1040 }, { x: 420, y: 995 }, { x: 442, y: 960 }, { x: 402, y: 940 }, { x: 371, y: 920 }],
    },
    {
      id: 'vreemde-open-plek',
      name: 'Paddenstoelenkring',
      withArticle: 'de Paddenstoelenkring',
      share: 0.15,
      terrain: 1.05,
      sign: { x: 170, y: 640 },
      path: [{ x: 371, y: 920 }, { x: 353, y: 900 }, { x: 380, y: 880 }, { x: 427, y: 860 }, { x: 492, y: 840 }, { x: 557, y: 820 }, { x: 592, y: 800 }, { x: 616, y: 760 }, { x: 598, y: 720 }, { x: 566, y: 700 }, { x: 495, y: 660 }],
    },
    {
      id: 'heuvel',
      name: 'Hijgheuvel',
      withArticle: 'de Hijgheuvel',
      share: 0.15,
      terrain: 0.75,
      sign: { x: 720, y: 600 },
      path: [{ x: 495, y: 660 }, { x: 452, y: 640 }, { x: 469, y: 620 }, { x: 501, y: 600 }, { x: 545, y: 580 }, { x: 567, y: 560 }, { x: 556, y: 540 }, { x: 489, y: 500 }],
    },
    {
      id: 'kasteeltuin',
      name: 'Kasteeltuin',
      withArticle: 'de Kasteeltuin',
      share: 0.2,
      terrain: 1.0,
      sign: { x: 210, y: 470 },
      path: [{ x: 489, y: 500 }, { x: 417, y: 480 }, { x: 399, y: 460 }, { x: 395, y: 415 }],
    },
  ],
};

export default groteBosrace;
