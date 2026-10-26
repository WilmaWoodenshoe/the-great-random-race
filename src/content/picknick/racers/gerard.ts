import type { PicknickRacer } from '../../../models/Picknick';

const gerard: PicknickRacer = {
  id: 'gerard',
  // Gerard is een slak: hij denkt wat langer na.
  thinkSeconds: 3,
  remarks: {
    'boter-kaas-en-eieren': {
      think: ['Gerard denkt na. Dit kan even duren.', 'Gerard schuift richting een vakje. Langzaam.'],
      distracted: ['Gerard zette zijn teken naast een bloem. De bloem staat er nog.'],
      racerWins: ['Gerard wint. Langzaam, maar met overtuiging.'],
    },
    'steen-papier-schaar': {
      hint: ['Gerard denkt na over zijn keuze. Morgen weet hij het.', 'Gerard kiest iets. Het duurt even voor zijn hand er is.'],
      playerWins: ['Jij wint. Gerard zag onderweg een mooie steen.'],
    },
  },
};

export default gerard;
