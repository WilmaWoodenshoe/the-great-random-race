import type { Choice } from '../../models/Choice';

const steve: Choice = {
  id: 'steve',
  heading: 'Gerard komt iemand tegen!',
  title: 'Steve ligt in de weg',
  text: 'Gerard staat oog in oog met Steve. Steve zegt niets. Wat doet Gerard?',
  announce: 'Gerard is Steve tegengekomen. Of Steve Gerard is tegengekomen, is onduidelijk.',
  image: 'racers/steen.webp',
  imageAlt: 'Steve de steen',
  options: [
    {
      id: 'groeten',
      label: 'Groet hem',
      color: 'groen',
      prefers: ['curious'],
      effects: [
        { minutes: 15, speed: 0 },
        { minutes: 120, speed: 1.1 },
      ],
      journal: [
        'Gerard groette Steve. Steve groette niet terug, maar Gerard voelt zich gesterkt.',
        'Gerard heeft Steve een kwartier gezelschap gehouden. Het was een goed gesprek.',
        'Gerard zei hallo. Steve zei niets. Gerard vond het een fijne ontmoeting.',
        'Gerard en Steve hebben elkaar ontmoet. Steve leek het te waarderen. Waarschijnlijk.',
      ],
    },
    {
      id: 'omheen',
      label: 'Ga eromheen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [{ minutes: 30, speed: 0.7 }],
      journal: [
        'Gerard is om Steve heen gekropen. Het was een omweg van ongeveer één Steve.',
        'Gerard ging om Steve heen. Steve heeft het niet gemerkt.',
        'Gerard nam de lange weg om Steve heen. Veiligheid voorop.',
        'Gerard heeft Steve gerond. Commentatoren noemen het een nette manoeuvre.',
      ],
    },
    {
      id: 'eroverheen',
      label: 'Klim eroverheen',
      color: 'oranje',
      prefers: ['chaotic'],
      effects: [{ minutes: 60, speed: 0.4 }],
      journal: [
        'Gerard is over Steve heen geklommen. Het duurde een uur. Steve vond het prima.',
        'Gerard heeft Steve beklommen. Het uitzicht vanaf Steve was teleurstellend.',
        'Gerard stond even bovenop Steve. Een historisch moment, al zag niemand het.',
        'Gerard klom over Steve. Dat was niet sneller. Wel spannender.',
      ],
    },
  ],
};

export default steve;
