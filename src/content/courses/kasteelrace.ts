import type { Course } from '../../models/Course';

// Door het kasteel: van de ophaalbrug naar de rozentuin.
// Posities (bordjes en pad) zijn in pixels op de originele kaart (1024 × 1536).
// De lengte is zo gekozen dat de race even lang duurt als De Grote Bosrace.
const kasteelrace: Course = {
  id: 'kasteelrace',
  name: 'De Kasteelrace',
  lengthKm: 42.3,
  days: 7,
  map: {
    image: 'courses/kasteelrace-kaart.webp',
    width: 1024,
    height: 1536,
    finish: { x: 300, y: 40 },
  },
  segments: [
    {
      id: 'ophaalbrug',
      name: 'Ophaalbrug',
      withArticle: 'de Ophaalbrug',
      share: 0.12,
      terrain: 0.85,
      sign: { x: 720, y: 1308 },
      path: [{ x: 512, y: 1525 }, { x: 512, y: 1440 }, { x: 510, y: 1330 }, { x: 512, y: 1230 }, { x: 515, y: 1150 }],
    },
    {
      id: 'grote-hal',
      name: 'Grote Hal',
      withArticle: 'de Grote Hal',
      share: 0.15,
      terrain: 1.0,
      sign: { x: 762, y: 1038 },
      path: [{ x: 515, y: 1150 }, { x: 518, y: 1060 }, { x: 520, y: 990 }, { x: 520, y: 900 }, { x: 515, y: 850 }],
    },
    {
      id: 'eetzaal',
      name: 'Eetzaal',
      withArticle: 'de Eetzaal',
      share: 0.12,
      terrain: 0.8,
      sign: { x: 795, y: 808 },
      path: [{ x: 515, y: 850 }, { x: 505, y: 800 }, { x: 512, y: 740 }, { x: 512, y: 710 }],
    },
    {
      id: 'balzaal',
      name: 'Balzaal',
      withArticle: 'de Balzaal',
      share: 0.13,
      terrain: 1.1,
      sign: { x: 778, y: 633 },
      path: [{ x: 512, y: 710 }, { x: 530, y: 670 }, { x: 512, y: 620 }, { x: 512, y: 560 }],
    },
    {
      id: 'fonteintuin',
      name: 'Fonteintuin',
      withArticle: 'de Fonteintuin',
      share: 0.15,
      terrain: 0.95,
      sign: { x: 748, y: 410 },
      path: [{ x: 512, y: 560 }, { x: 512, y: 500 }, { x: 512, y: 450 }, { x: 500, y: 390 }, { x: 495, y: 330 }, { x: 492, y: 290 }],
    },
    {
      id: 'doolhof',
      name: 'Doolhof',
      withArticle: 'het Doolhof',
      share: 0.18,
      terrain: 0.7,
      sign: { x: 760, y: 225 },
      path: [{ x: 492, y: 290 }, { x: 470, y: 250 }, { x: 520, y: 265 }, { x: 500, y: 205 }, { x: 530, y: 185 }, { x: 525, y: 150 }],
    },
    {
      id: 'rozentuin',
      name: 'Rozentuin',
      withArticle: 'de Rozentuin',
      share: 0.15,
      terrain: 1.0,
      sign: { x: 685, y: 105 },
      path: [{ x: 525, y: 150 }, { x: 520, y: 120 }, { x: 540, y: 95 }],
    },
  ],
};

export default kasteelrace;
