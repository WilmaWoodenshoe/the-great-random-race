import type { Course } from '../../models/Course';

// Posities (bordjes en pad) zijn in pixels op de originele kaart (987 × 1517).
const groteBosrace: Course = {
  id: 'grote-bosrace',
  name: 'De Grote Bosrace',
  lengthKm: 42.7,
  days: 7,
  map: {
    image: 'courses/grote-bosrace-kaart.webp',
    width: 987,
    height: 1517,
    finish: { x: 553, y: 151 },
  },
  segments: [
    {
      id: 'startweide',
      name: 'Startweide',
      withArticle: 'de Startweide',
      share: 0.1,
      terrain: 1.0,
      sign: { x: 717, y: 1316 },
      path: [{ x: 360, y: 1290 }, { x: 300, y: 1215 }, { x: 240, y: 1160 }, { x: 212, y: 1105 }],
    },
    {
      id: 'bos',
      name: 'Bos',
      withArticle: 'het Bos',
      share: 0.2,
      terrain: 0.95,
      sign: { x: 394, y: 1022 },
      path: [{ x: 212, y: 1105 }, { x: 222, y: 1030 }, { x: 245, y: 965 }, { x: 268, y: 942 }, { x: 310, y: 885 }, { x: 370, y: 852 }, { x: 452, y: 845 }],
    },
    {
      id: 'modderveld',
      name: 'Modderveld',
      withArticle: 'het Modderveld',
      share: 0.1,
      terrain: 0.7,
      sign: { x: 787, y: 860 },
      path: [{ x: 452, y: 845 }, { x: 515, y: 805 }, { x: 548, y: 745 }, { x: 555, y: 705 }],
    },
    {
      id: 'beekje',
      name: 'Beekje',
      withArticle: 'het Beekje',
      share: 0.1,
      terrain: 0.85,
      sign: { x: 302, y: 526 },
      path: [{ x: 555, y: 705 }, { x: 572, y: 650 }, { x: 630, y: 615 }, { x: 725, y: 598 }],
    },
    {
      id: 'vreemde-open-plek',
      name: 'Vreemde Open Plek',
      withArticle: 'de Vreemde Open Plek',
      share: 0.15,
      terrain: 1.05,
      sign: { x: 758, y: 378 },
      path: [{ x: 725, y: 598 }, { x: 762, y: 555 }, { x: 745, y: 510 }, { x: 680, y: 485 }, { x: 600, y: 455 }, { x: 487, y: 422 }],
    },
    {
      id: 'heuvel',
      name: 'Heuvel',
      withArticle: 'de Heuvel',
      share: 0.15,
      terrain: 0.75,
      sign: { x: 229, y: 251 },
      path: [{ x: 487, y: 422 }, { x: 410, y: 408 }, { x: 330, y: 405 }, { x: 290, y: 375 }, { x: 300, y: 345 }, { x: 332, y: 332 }],
    },
    {
      id: 'kasteeltuin',
      name: 'Kasteeltuin',
      withArticle: 'de Kasteeltuin',
      share: 0.2,
      terrain: 1.0,
      sign: { x: 553, y: 151 },
      path: [{ x: 332, y: 332 }, { x: 390, y: 310 }, { x: 440, y: 295 }, { x: 470, y: 282 }],
    },
  ],
};

export default groteBosrace;
