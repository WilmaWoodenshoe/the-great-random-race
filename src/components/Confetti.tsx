import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const COLORS = ['#F0573E', '#F2B71F', '#3FA34D', '#2E8AD8', '#7B4FC4', '#F7893A'];

interface Props {
  /** 'groot' bij winst, 'klein' (een regentje) bij een podiumplaats. */
  amount: 'groot' | 'klein';
}

/** Confetti over het hele scherm. Staat uit bij 'minder beweging'. */
export function Confetti({ amount }: Props) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const end = Date.now() + (amount === 'groot' ? 2500 : 1200);
    let frame = 0;
    const tick = () => {
      confetti({
        particleCount: amount === 'groot' ? 4 : 2,
        startVelocity: 25,
        spread: 70,
        angle: 270,
        origin: { x: Math.random(), y: -0.05 },
        colors: COLORS,
        gravity: 0.7,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
      if (Date.now() < end) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      confetti.reset();
    };
  }, [amount]);
  return null;
}
