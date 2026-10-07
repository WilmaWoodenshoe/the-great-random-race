import type { Choice } from '../../models/Choice';

const uitzicht: Choice = {
  id: 'uitzicht',
  heading: 'Gerard staat stil!',
  title: 'Een prachtig uitzicht',
  text: 'Gerard heeft een uitzicht gevonden. Het is erg mooi. Hoe lang mag hij kijken?',
  announce: 'Gerard staat stil bij een prachtig uitzicht. Hij is er zichtbaar door geraakt.',
  image: 'backgrounds/bg-landschap.webp',
  imageAlt: 'Een zonnig landschap met bomen, een kasteel en een vulkaan',
  options: [
    {
      id: 'genieten',
      label: 'Even genieten',
      color: 'groen',
      prefers: ['curious'],
      effects: [
        { minutes: 30, speed: 0 },
        { minutes: 120, speed: 1.1 },
      ],
      journal: [
        'Gerard heeft een half uur van het uitzicht genoten. Hij gaat verder met hernieuwde moed.',
        'Gerard keek. Gerard zuchtte. Gerard ging verder, iets sneller dan eerst.',
        'Na een half uur uitzicht voelt Gerard zich een nieuwe slak. Ongeveer.',
        'Gerard heeft het uitzicht bekeken. Het uitzicht was het ermee eens.',
      ],
    },
    {
      id: 'doorlopen',
      label: 'Doorlopen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [],
      journal: [
        'Gerard liep door. Uitzichten zijn er later ook nog.',
        'Gerard heeft het uitzicht genegeerd. Het uitzicht is daar niet kapot van.',
        'Geen tijd voor schoonheid. Gerard heeft een race te lopen.',
        'Gerard wierp één blik op het uitzicht en kroop verder. Professioneel.',
      ],
    },
    {
      id: 'gedicht',
      label: 'Schrijf een gedicht',
      color: 'oranje',
      prefers: ['chaotic', 'lazy'],
      effects: [{ minutes: 90, speed: 0 }],
      journal: [
        'Gerard schreef anderhalf uur aan een gedicht. Het rijmt niet. Het gaat over sla.',
        'Gerard heeft een gedicht geschreven. Het heeft één regel. Hij is er trots op.',
        'Na anderhalf uur dichten is Gerard tevreden. Niemand heeft het gelezen.',
        'Gerard dichtte. Kenners spreken van een moedig, traag werk.',
      ],
    },
  ],
};

export default uitzicht;
