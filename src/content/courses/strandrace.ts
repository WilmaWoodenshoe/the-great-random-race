import type { Course } from '../../models/Course';

// Over het strand: van het duinpad naar de top van het duin.
// Posities (bordjes en pad) zijn in pixels op de originele kaart (1024 × 1536).
// De lengte is zo gekozen dat de race even lang duurt als De Grote Bosrace.
const strandrace: Course = {
  id: 'strandrace',
  name: 'De Strandrace',
  lengthKm: 41.1,
  days: 7,
  map: {
    image: 'courses/strandrace-kaart.webp',
    width: 1024,
    height: 1536,
    finish: { x: 590, y: 95 },
    // Paasei: soms scheurt er een motorcrosser over het duin (#84, The King of Sand).
    easterEgg: { image: 'courses/strandrace-kaart-84.webp', chance: 0.25, journalKey: 'kingOfSand' },
  },
  background: 'backgrounds/bg-strand.webp',
  extraEvents: ['beach_ball'],
  segments: [
    {
      id: 'prikgraspad',
      name: 'Prikgraspad',
      withArticle: 'het Prikgraspad',
      share: 0.14,
      terrain: 0.85,
      sign: { x: 810, y: 1375 },
      path: [{ x: 560, y: 1530 }, { x: 555, y: 1420 }, { x: 580, y: 1300 }, { x: 600, y: 1200 }],
    },
    {
      id: 'smashstrand',
      name: 'Smashstrand',
      withArticle: 'het Smashstrand',
      share: 0.14,
      terrain: 0.95,
      sign: { x: 853, y: 1025 },
      path: [{ x: 600, y: 1200 }, { x: 580, y: 1120 }, { x: 570, y: 1050 }, { x: 610, y: 970 }],
    },
    {
      id: 'zandburcht',
      name: 'Zandburcht',
      withArticle: 'de Zandburcht',
      share: 0.14,
      terrain: 0.8,
      sign: { x: 828, y: 830 },
      path: [{ x: 610, y: 970 }, { x: 680, y: 900 }, { x: 720, y: 820 }, { x: 720, y: 740 }],
    },
    {
      id: 'handdoekenstrand',
      name: 'Handdoekenstrand',
      withArticle: 'het Handdoekenstrand',
      share: 0.15,
      terrain: 1.0,
      sign: { x: 845, y: 572 },
      path: [{ x: 720, y: 740 }, { x: 690, y: 660 }, { x: 640, y: 600 }, { x: 620, y: 540 }],
    },
    {
      id: 'schelpenkust',
      name: 'Schelpenkust',
      withArticle: 'de Schelpenkust',
      share: 0.14,
      terrain: 0.9,
      sign: { x: 798, y: 392 },
      path: [{ x: 620, y: 540 }, { x: 600, y: 470 }, { x: 640, y: 410 }, { x: 680, y: 360 }],
    },
    {
      id: 'wrakkenhoek',
      name: 'Wrakkenhoek',
      withArticle: 'de Wrakkenhoek',
      share: 0.14,
      terrain: 0.85,
      sign: { x: 628, y: 262 },
      path: [{ x: 680, y: 360 }, { x: 740, y: 300 }, { x: 800, y: 250 }],
    },
    {
      id: 'duintop',
      name: 'Duintop',
      withArticle: 'de Duintop',
      share: 0.15,
      terrain: 0.75,
      sign: { x: 723, y: 128 },
      path: [{ x: 800, y: 250 }, { x: 760, y: 180 }, { x: 660, y: 110 }, { x: 590, y: 60 }],
    },
  ],
};

export default strandrace;
