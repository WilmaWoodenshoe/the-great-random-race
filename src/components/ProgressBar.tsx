interface Props {
  /** Tussen 0 en 1. */
  value: number;
  height?: number;
  label: string;
}

export function ProgressBar({ value, height = 12, label }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className="progress"
      style={{ height }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
