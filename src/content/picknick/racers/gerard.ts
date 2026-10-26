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
    memory: {
      point: ['Gerard wijst een kaart aan. Tegen de tijd dat zijn voelspriet er is, ben je al verder.'],
      finished: ['Klaar in {beurten} beurten. Gerard had er {beurten} dagen over gedaan.'],
    },
    'bekertje-schuiven': {
      shuffle: ['Gerard schuift. Heel langzaam. Je kunt alles volgen.'],
      racerWins: ['Gerard schoof zo langzaam dat je in slaap viel. Mis!'],
    },
    'mini-sudoku': {
      tipDoubt: ['Gerard zag een bloem in het rooster. Hij zegt {plaatje}.'],
      tip: ['Gerard heeft lang nagedacht: {plaatje}.'],
    },
  },
};

export default gerard;
