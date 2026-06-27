import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  lines: string[];
  delayMs?: number;
  title?: string;
}

/**
 * Affiche un terminal animé qui se "tape" tout seul une fois visible.
 * Les lignes peuvent contenir du HTML (utilisé pour la coloration syntaxique).
 */
export function Terminal({ lines, delayMs = 220, title = "~/profile.sh - zsh" }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Démarre l'animation quand le terminal entre dans le viewport.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let idx = 0;
    let cancelled = false;
    function tick() {
      if (cancelled) return;
      if (idx >= lines.length) return;
      const line = lines[idx];
      setVisibleLines((cur) => [...cur, line]);
      idx += 1;
      setTimeout(tick, line === "" ? 80 : delayMs);
    }
    const start = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [started, lines, delayMs]);

  return (
    <div className="terminal" ref={rootRef}>
      <div className="terminal-head">
        <span className="dot red" />
        <span className="dot amber" />
        <span className="dot green" />
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">
        {visibleLines.map((line, i) =>
          line === "" ? (
            <br key={i} />
          ) : (
            <span key={i} dangerouslySetInnerHTML={{ __html: line + "<br>" }} />
          ),
        )}
        {started && visibleLines.length >= lines.length && <span className="cursor" />}
      </div>
    </div>
  );
}
