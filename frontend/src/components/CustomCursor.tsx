import { useEffect, useRef } from "react";

/**
 * Curseur personnalisé (point + anneau qui suit en douceur).
 * - l'anneau grossit au survol des éléments interactifs
 * - effet magnétique sur les éléments [data-magnetic]
 * - desktop uniquement (pointer fin + hover), désactivé si prefers-reduced-motion
 * - décoratif : pointer-events none, ne capture jamais les clics
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-magnetic]';

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot!.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE);
      ring!.classList.toggle("is-active", Boolean(target));

      const mag = (e.target as HTMLElement)?.closest?.("[data-magnetic]") as HTMLElement | null;
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        if (el === mag) {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
        } else {
          el.style.transform = "";
        }
      });
    }

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring!.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = window.requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove);
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
