import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Fond animé "node network" derrière le hero.
 * - réagit à la souris (les noeuds proches sont repoussés en douceur)
 * - relie les noeuds proches par des segments dont l'opacité dépend de la distance
 * - purement décoratif : pointer-events none + aria-hidden
 * - respecte prefers-reduced-motion (rendu statique, aucune boucle rAF)
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    const PURPLE = "139, 92, 246";
    const CYAN = "34, 211, 238";

    function spawn() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.round((width * height) / 16000);
      const count = Math.max(28, Math.min(96, density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0.001) {
          const force = (130 - dist) / 130;
          n.x += (dx / dist) * force * 1.6;
          n.y += (dy / dist) * force * 1.6;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 128) {
            const alpha = (1 - dist / 128) * 0.34;
            ctx!.strokeStyle = `rgba(${PURPLE}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 130;
        ctx!.fillStyle = near ? `rgba(${CYAN}, 0.9)` : `rgba(${PURPLE}, 0.7)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, near ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      draw();
      raf = window.requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    spawn();
    if (reduced) {
      draw();
    } else {
      loop();
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseout", onMouseLeave);
    }
    window.addEventListener("resize", spawn);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
      window.removeEventListener("resize", spawn);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
