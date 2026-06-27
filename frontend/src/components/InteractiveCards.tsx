import { useEffect } from "react";

const SELECTOR = ".project, .skill-card, .focus, .cert, .interest, .contact-card";

/**
 * Donne "vie" aux cartes : inclinaison 3D + halo lumineux qui suit le curseur.
 * Délégation d'un seul listener pointermove (perf). Sans DOM injecté.
 * Désactivé si pointeur grossier (tactile) ou prefers-reduced-motion.
 */
export function InteractiveCards() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let current: HTMLElement | null = null;
    let raf = 0;
    let pending: { el: HTMLElement; rx: number; ry: number; px: number; py: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { el, rx, ry, px, py } = pending;
      el.style.transform = `perspective(820px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.012)`;
      el.style.setProperty("--mx", `${px}%`);
      el.style.setProperty("--my", `${py}%`);
    };

    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.transform = "";
      el.style.transition = "";
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = (target?.closest(SELECTOR) ?? null) as HTMLElement | null;
      if (el !== current) {
        reset(current);
        current = el;
        if (el) el.style.transition = "transform .12s ease-out, box-shadow .3s ease";
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      pending = {
        el,
        rx: (0.5 - py) * 9,
        ry: (px - 0.5) * 9,
        px: px * 100,
        py: py * 100,
      };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const clearAll = () => {
      reset(current);
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", clearAll);
    document.addEventListener("pointerleave", clearAll);

    return () => {
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", clearAll);
      document.removeEventListener("pointerleave", clearAll);
      if (raf) cancelAnimationFrame(raf);
      reset(current);
    };
  }, []);

  return null;
}
