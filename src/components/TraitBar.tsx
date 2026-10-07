import { traitToBlocks } from '../utils/format';

interface Props {
  label: string;
  /** 0 tot 100. */
  value: number;
  color: string;
}

/** Eigenschap als 8 blokjes, zoals in Racer.html. */
export function TraitBar({ label, value, color }: Props) {
  const filled = traitToBlocks(value);
  return (
    <div className="trait">
      <div className="trait__label">{label}</div>
      <div className="trait__blocks" role="img" aria-label={`${label}: ${value} van 100`}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="trait__block" style={i < filled ? { background: color } : undefined} />
        ))}
      </div>
    </div>
  );
}
