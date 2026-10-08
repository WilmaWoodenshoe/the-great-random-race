import type { JournalEntry } from '../models/JournalEntry';

export type JournalTone = 'groen' | 'oranje' | 'paars' | 'grijs';

/** Kleur van het bolletje en het icoontje bij een journaalregel. */
export function journalLook(e: JournalEntry): { tone: JournalTone; icon: string } {
  switch (e.kind) {
    case 'start':
    case 'finish':
      return { tone: 'groen', icon: 'journal/j00.png' };
    case 'end':
      return { tone: 'grijs', icon: 'journal/j00.png' };
    case 'segment':
      return { tone: 'groen', icon: 'journal/j10.png' };
    case 'choice':
      return { tone: 'paars', icon: 'ui/t-ster.png' };
    case 'decision':
      return { tone: 'paars', icon: 'ui/t-ster.png' };
    case 'action':
      return { tone: 'groen', icon: 'ui/t-sla.png' };
    case 'event':
      break;
  }
  switch (e.eventType) {
    case 'flower':
      return { tone: 'oranje', icon: 'journal/j01.png' };
    case 'butterfly':
    case 'worm':
    case 'strange_noise':
      return { tone: 'oranje', icon: 'journal/j02.png' };
    case 'bird':
      return { tone: 'oranje', icon: 'journal/j08.png' };
    case 'nap':
      return { tone: 'grijs', icon: 'ui/t-zzz.png' };
    case 'rock':
      return { tone: 'oranje', icon: 'journal/j07.png' };
    case 'food':
    case 'snack':
      return { tone: 'groen', icon: 'journal/j06.png' };
    case 'shortcut':
      return { tone: 'groen', icon: 'journal/j04.png' };
    case 'wrong_turn':
      return { tone: 'oranje', icon: 'journal/j03.png' };
    case 'mud':
      return { tone: 'oranje', icon: 'journal/j05.png' };
    case 'rain':
    case 'puddle':
      return { tone: 'paars', icon: 'journal/j09.png' };
    default:
      return { tone: 'grijs', icon: 'journal/j05.png' };
  }
}
