import type { Course } from '../../models/Course';

// Posities van de bordjes zijn in pixels op de originele kaart (987 × 1517).
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
    { id: 'startweide', name: 'Startweide', share: 0.1, terrain: 1.0, sign: { x: 717, y: 1316 } },
    { id: 'bos', name: 'Bos', share: 0.2, terrain: 0.95, sign: { x: 394, y: 1022 } },
    { id: 'modderveld', name: 'Modderveld', share: 0.1, terrain: 0.7, sign: { x: 787, y: 860 } },
    { id: 'beekje', name: 'Beekje', share: 0.1, terrain: 0.85, sign: { x: 302, y: 526 } },
    { id: 'vreemde-open-plek', name: 'Vreemde Open Plek', share: 0.15, terrain: 1.05, sign: { x: 758, y: 378 } },
    { id: 'heuvel', name: 'Heuvel', share: 0.15, terrain: 0.75, sign: { x: 229, y: 251 } },
    { id: 'kasteeltuin', name: 'Kasteeltuin', share: 0.2, terrain: 1.0, sign: { x: 553, y: 151 } },
  ],
};

export default groteBosrace;
