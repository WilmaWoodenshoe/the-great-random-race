import { useState } from 'react';
import { nl } from '../content/nl';
import type { RaceSummary } from '../account/api';
import { shareInvite } from '../account/invite';

/** "Nodig iemand uit": deelt een link naar de race. */
export function ShareButton({ race, className = '' }: { race: RaceSummary; className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const result = await shareInvite(race);
    if (result === 'copied') {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };
  return (
    <button type="button" className={`chip-btn chip-btn--keuze share-btn ${className}`} onClick={share}>
      {copied ? nl.invite.copied : nl.invite.button}
    </button>
  );
}
