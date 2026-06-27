import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  suffix?: string;
  duration?: number;
};

/**
 * Compteur animé de 0 -> end, déclenché à l'entrée dans le viewport.
 * Respecte prefers-reduced-motion (affiche directement la valeur finale).
 */
export function CountUp({ end, suffix = "", duration = 1300 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(end);
      return;
    }

    let raf = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(end * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(node);

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
