import { useEffect, useRef, useState } from "react";
import { audioEngine } from "../audio/audioEngine";

/**
 * Lecteur flottant : permet de lancer une ambiance generative pendant la navigation.
 * Play/pause, volume, et un mini-egaliseur live alimente par l'AnalyserNode partage.
 * Aucun fichier audio : tout est synthetise (cf. audioEngine.ts).
 */
export function MusicPlayer() {
  const [supported] = useState(() => audioEngine.isSupported());
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(audioEngine.getVolume());
  const [hint, setHint] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronise l'UI avec l'etat du moteur.
  useEffect(
    () =>
      audioEngine.subscribe((s) => {
        setPlaying(s.playing);
        setVolume(s.volume);
      }),
    [],
  );

  // Mini-egaliseur : barres pilotees par l'analyser (ou idle doux a l'arret).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BARS = 18;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = 88;
    const cssH = 22;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let t = 0;
    const data = new Uint8Array(512);

    const draw = () => {
      t += 0.05;
      ctx.clearRect(0, 0, cssW, cssH);
      const analyser = audioEngine.getAnalyser();
      const live = analyser && audioEngine.isPlaying();
      if (live) analyser.getByteFrequencyData(data);

      const gap = 2;
      const bw = (cssW - gap * (BARS - 1)) / BARS;
      for (let i = 0; i < BARS; i++) {
        let level: number;
        if (live) {
          const idx = Math.floor(((i + 1) / BARS) * 90);
          level = data[idx] / 255;
        } else if (reduced) {
          level = 0.12;
        } else {
          level = 0.1 + 0.08 * (0.5 + 0.5 * Math.sin(t + i * 0.5));
        }
        const h = Math.max(2, level * cssH);
        const x = i * (bw + gap);
        const y = cssH - h;
        // Degrade Purple Team : bleu (bas) -> violet -> rouge (haut).
        const g = ctx.createLinearGradient(0, cssH, 0, 0);
        g.addColorStop(0, "#2563eb");
        g.addColorStop(0.5, "#a855f7");
        g.addColorStop(1, "#ef4444");
        ctx.fillStyle = g;
        ctx.globalAlpha = live ? 0.95 : 0.5;
        ctx.fillRect(x, y, bw, h);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!supported) return null;

  const onToggle = () => {
    setHint(false);
    void audioEngine.toggle();
  };

  return (
    <aside
      className={`player-dock ${playing ? "is-playing" : ""}`}
      aria-label="Lecteur de musique d'ambiance"
    >
      <button
        type="button"
        className={`player-dock__play ${hint && !playing ? "hint" : ""}`}
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? "Mettre l'ambiance en pause" : "Lancer l'ambiance sonore"}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="player-dock__mid">
        <span className="player-dock__label">
          {playing ? "Ambiance // live" : "Écouter en naviguant"}
        </span>
        <canvas ref={canvasRef} className="player-dock__eq" aria-hidden="true" />
      </div>

      <label className="player-dock__vol" title="Volume">
        <span className="player-dock__vol-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path
              d="M16 9a4 4 0 010 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => audioEngine.setVolume(Number(e.target.value) / 100)}
          aria-label="Volume de l'ambiance"
        />
      </label>
    </aside>
  );
}
