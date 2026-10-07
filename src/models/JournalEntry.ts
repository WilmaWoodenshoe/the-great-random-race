import type { EventType } from './Event';

export type JournalKind =
  | 'start'
  | 'event'
  | 'segment'
  | 'finish'
  | 'choice'
  | 'decision'
  | 'action'
  | 'end';

/** Eén regel in het journaal. */
export interface JournalEntry {
  id: string;
  time: number;
  kind: JournalKind;
  /** Over wie het gaat; null bij iets dat iedereen treft (start, regen, einde). */
  racerId: string | null;
  eventType?: EventType;
  text: string;
}
