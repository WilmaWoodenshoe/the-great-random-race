import type { PicknickRacer } from '../../../models/Picknick';

const turbo: PicknickRacer = {
  id: 'turbo',
  remarks: {
    'boter-kaas-en-eieren': {
      opening: ['Turbo begint linksboven. Turbo begint altijd linksboven.'],
      start: ['Turbo kijkt alvast naar linksboven.', 'Turbo heeft een strategie. Die heeft hij al jaren.'],
    },
    'steen-papier-schaar': {
      hint: ['Turbo kiest wat hij vorige keer koos. Dat ging toen ook goed.', 'Turbo verandert nooit van keuze. Behalve soms.'],
      playerWins: ['Jij wint. Turbo gaat er rustig over nadenken.'],
    },
    memory: {
      pointSame: ['Turbo wijst weer linksboven aan. Turbo begint altijd linksboven.'],
      start: ['Turbo onthoudt alles. Langzaam, maar alles.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Turbo schuift steeds dezelfde twee bekertjes. Zoals altijd.'],
      racerWins: ['Turbo wint. Met zijn vaste truc.'],
    },
    'mini-sudoku': {
      tip: ['Turbo zegt {plaatje}. Turbo vergist zich zelden.'],
      checkGood: ['Alles klopt. Turbo had niets anders verwacht.'],
    },
  },
};

export default turbo;
