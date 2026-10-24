import type { Choice } from '../../models/Choice';

const uitzicht: Choice = {
  id: 'uitzicht',
  heading: '{naam} staat stil!',
  title: 'Een prachtig uitzicht',
  text: '{naam} heeft een uitzicht gevonden. Het is erg mooi. Hoe lang mag {hij} kijken?',
  announce: '{naam} staat stil bij een prachtig uitzicht. {Hij} is er zichtbaar door geraakt.',
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
        '{naam} heeft een half uur van het uitzicht genoten. {Hij} gaat verder met hernieuwde moed.',
        '{naam} keek. {naam} zuchtte. {naam} ging verder, iets sneller dan eerst.',
        'Na een half uur uitzicht voelt {naam} zich herboren. Ongeveer.',
        '{naam} heeft het uitzicht bekeken. Het uitzicht was het ermee eens.',
      ],
    },
    {
      id: 'doorlopen',
      label: 'Doorlopen',
      color: 'blauw',
      prefers: ['stubborn'],
      effects: [],
      journal: [
        '{naam} ging door. Uitzichten zijn er later ook nog.',
        '{naam} heeft het uitzicht genegeerd. Het uitzicht is daar niet kapot van.',
        'Geen tijd voor schoonheid. {naam} heeft een race te lopen.',
        '{naam} wierp één blik op het uitzicht en ging verder. Professioneel.',
      ],
    },
    {
      id: 'gedicht',
      label: 'Schrijf een gedicht',
      color: 'oranje',
      prefers: ['chaotic', 'lazy'],
      effects: [{ minutes: 90, speed: 0 }],
      journal: [
        '{naam} schreef anderhalf uur aan een gedicht. Het rijmt niet. Het gaat over sla.',
        '{naam} heeft een gedicht geschreven. Het heeft één regel. {Hij} is er trots op.',
        'Na anderhalf uur dichten is {naam} tevreden. Niemand heeft het gelezen.',
        '{naam} dichtte. Kenners spreken van een moedig, traag werk.',
      ],
    },
  ],
};

export default uitzicht;
