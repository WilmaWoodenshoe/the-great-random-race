import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { journalLook } from '../src/components/journalLook';
import { EVENT_TYPES } from '../src/models/Event';
import type { JournalKind } from '../src/models/JournalEntry';

const kinds: JournalKind[] = ['start', 'event', 'segment', 'finish', 'choice', 'decision', 'action', 'end'];

describe('journaal: icoontjes en kleuren', () => {
  it('elke soort bericht heeft een bestaand icoontje', () => {
    for (const kind of kinds) {
      const types = kind === 'event' ? EVENT_TYPES : [undefined];
      for (const eventType of types) {
        const look = journalLook({ id: 'x', time: 0, kind, racerId: null, eventType, text: '' });
        expect(existsSync(resolve(process.cwd(), 'public/images', look.icon)), look.icon).toBe(true);
        expect(['groen', 'oranje', 'paars', 'grijs']).toContain(look.tone);
      }
    }
  });
});
