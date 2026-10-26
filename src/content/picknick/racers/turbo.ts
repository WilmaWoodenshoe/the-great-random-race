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
  },
};

export default turbo;
