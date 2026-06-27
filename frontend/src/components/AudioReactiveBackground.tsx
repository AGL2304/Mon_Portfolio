import { useEffect, useRef } from "react";
import { audioEngine } from "../audio/audioEngine";

/**
 * Fond audio-reactif : 3 "rideaux" d'aurore (bleu / violet / rouge = Purple Team)
 * qui ondulent et s'intensifient avec la musique via l'AnalyserNode partage.
 * A l'arret, derive douce et lente. Respecte prefers-reduced-motion.
 * Fixe, plein ecran, derriere le contenu, sans interaction.
 */
export function AudioReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const freq = new Uint8Array(512);
    // Niveaux lisses (basse / medium / aigu).
    const level = { bass: 0.08, mid: 0.06, high: 0.05 };
    let time = 0;
    let raf = 0;

    const avg = (from: number, to: number) => {
      let s = 0;
      for (let i = from; i < to; i++) s += freq[i];
      return s / (to - from) / 255;
    };

    const curtain = (
      baseFrac: number,
      energy: number,
      color: [number, number, number],
      speed: number,
      phase: number,
    ) => {
      const yBase = H * baseFrac;
      const amp = 26 + energy * 150;
      const alpha = 0.05 + energy * 0.13;
      ctx.beginPath();
      ctx.moveTo(-20, H + 20);
      ctx.lineTo(-20, yBase);
      for (let x = 0; x <= W; x += 16) {
        const w =
          Math.sin(x * 0.006 + time * speed + phase) * 0.6 +
          Math.sin(x * 0.013 + time * speed * 0.7 + phase * 1.7) * 0.4;
        ctx.lineTo(x, yBase - w * amp);
      }
      ctx.lineTo(W + 20, yBase);
      ctx.lineTo(W + 20, H + 20);
      ctx.closePath();

      const [r, g, b] = color;
      const grad = ctx.createLinearGradient(0, yBase - amp, 0, H);
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const draw = () => {
      time += reduced ? 0.0015 : 0.006;
      const analyser = audioEngine.getAnalyser();
      const live = analyser && audioEngine.isPlaying();

      let tBass: number;
      let tMid: number;
      let tHigh: number;
      if (live) {
        analyser.getByteFrequencyData(freq);
        tBass = avg(1, 8);
        tMid = avg(12, 48);
        tHigh = avg(60, 160);
      } else {
        // Idle : respiration lente.
        const s = (Math.sin(time * 0.9) + 1) / 2;
        tBass = 0.06 + s * 0.05;
        tMid = 0.05 + (1 - s) * 0.04;
        tHigh = 0.04 + s * 0.03;
      }
      level.bass += (tBass - level.bass) * 0.12;
      level.mid += (tMid - level.mid) * 0.12;
      level.high += (tHigh - level.high) * 0.12;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      curtain(0.82, level.bass, [37, 99, 235], 0.5, 0); // bleu (Blue Team)
      curtain(0.64, level.mid, [124, 58, 237], 0.42, 2.1); // violet
      curtain(0.46, level.high, [185, 28, 28], 0.36, 4.0); // rouge (Red Team)
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="audio-bg" aria-hidden="true" />;
}
