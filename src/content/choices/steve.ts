import type { Choice } from '../../models/Choice';

const steve: Choice = {
  id: 'steve',
  // Speel je zelf met Steve, dan komt dit event niet voor.
  aboutRacer: 'steve',
  heading: '{naam} komt iemand tegen!',
  title: 'Steve ligt in de weg',
  text: '{naam} staat oog in oog met Steve. Steve zegt niets. Wat doet {naam}?',
  announce: '{naam} is Steve tegengekomen. Of Steve {naam} is tegengekomen, is onduidelijk.',
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
        '{naam} groette Steve. Steve groette niet terug, maar {naam} voelt zich gesterkt.',
        '{naam} heeft Steve een kwartier gezelschap gehouden. Het was een goed gesprek.',
        '{naam} zei hallo. Steve zei niets. {naam} vond het een fijne ontmoeting.',
        '{naam} en Steve hebben elkaar ontmoet. Steve leek het te waarderen. Waarschijnlijk.',
      ],
    },
    {
      id: 'omheen',
      label: 'Ga eromheen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [{ minutes: 30, speed: 0.7 }],
      journal: [
        '{naam} is om Steve heen gegaan. Het was een omweg van ongeveer één Steve.',
        '{naam} ging om Steve heen. Steve heeft het niet gemerkt.',
        '{naam} nam de lange weg om Steve heen. Veiligheid voorop.',
        '{naam} heeft Steve gerond. Commentatoren noemen het een nette manoeuvre.',
      ],
    },
    {
      id: 'eroverheen',
      label: 'Klim eroverheen',
      color: 'oranje',
      prefers: ['chaotic'],
      effects: [{ minutes: 60, speed: 0.4 }],
      journal: [
        '{naam} is over Steve heen geklommen. Het duurde een uur. Steve vond het prima.',
        '{naam} heeft Steve beklommen. Het uitzicht vanaf Steve was teleurstellend.',
        '{naam} stond even bovenop Steve. Een historisch moment, al zag niemand het.',
        '{naam} klom over Steve. Dat was niet sneller. Wel spannender.',
      ],
    },
  ],
};

export default steve;
