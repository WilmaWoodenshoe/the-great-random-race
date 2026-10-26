import type { PicknickGame } from '../../../models/Picknick';

const bekertjeSchuiven: PicknickGame = {
  id: 'bekertje-schuiven',
  name: 'Bekertje-schuiven',
  intro: 'Steve ligt onder een bekertje. De racer schuift. Waar is Steve?',
  role: 'opponent',
  order: 4,
  remarks: {
    start: [
      'Steve gaat onder een bekertje liggen. Hij vindt het prima.',
      '{naam} gaat schuiven. Let goed op Steve.',
      'Drie bekertjes, één Steve. {naam} doet {zijn} best.',
    ],
    shuffle: [
      '{naam} schuift. En schuift. En schuift.',
      'Hup, hup, hup. {naam} gaat ervoor.',
      '{naam} schuift met grote ernst.',
    ],
    noShuffle: [
      'Steve ligt onder het middelste bekertje. Hij schuift niet. Hij is een steen.',
      'Er wordt niet geschoven. Steve heeft daar geen zin in.',
      'Steve schuift niets. Steve weet precies waar Steve is.',
    ],
    playerWins: [
      'Gevonden! Steve wist niet dat hij zoekgeraakt was.',
      'Daar is Steve. Hij zegt niets, maar hij is blij.',
      'Goed gezien. {naam} schudt verbaasd {zijn} hoofd.',
    ],
    racerWins: [
      'Steve lag daar al de hele tijd. Hij zegt niets.',
      'Mis! Steve lag ergens anders. Hij vond het niet erg.',
      '{naam} heeft je te snel af geweest. Nog een keer?',
    ],
  },
  traitRemarks: {
    lazy: { shuffle: ['{naam} schuift twee keer. Dat is genoeg, vindt {hij}.'] },
    chaotic: { shuffle: ['{naam} schuift alle kanten op. Ook de verkeerde.'] },
    stubborn: { shuffle: ['{naam} schuift steeds dezelfde twee. Steeds dezelfde twee.'] },
    curious: { shuffle: ['{naam} kijkt onder de bekertjes tijdens het schuiven. Dat mag niet.'] },
  },
};

export default bekertjeSchuiven;
