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
  const icon = `events/${e.eventType ?? 'nothing'}.png`;
  switch (e.eventType) {
    case 'flower':
    case 'butterfly':
    case 'worm':
    case 'strange_noise':
    case 'bird':
    case 'rock':
    case 'wrong_turn':
    case 'mud':
    case 'beach_ball':
      return { tone: 'oranje', icon };
    case 'food':
    case 'snack':
    case 'shortcut':
    case 'fountain':
      return { tone: 'groen', icon };
    case 'rain':
    case 'puddle':
    case 'easter_egg':
      return { tone: 'paars', icon };
    default:
      return { tone: 'grijs', icon };
  }
}
