import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AudioReactiveBackground } from "../components/AudioReactiveBackground";
import { CountUp } from "../components/CountUp";
import { CustomCursor } from "../components/CustomCursor";
import { HeroCanvas } from "../components/HeroCanvas";
import { InteractiveCards } from "../components/InteractiveCards";
import { MusicPlayer } from "../components/MusicPlayer";
import { ScrollProgress } from "../components/ScrollProgress";
import { TechMarquee } from "../components/TechMarquee";
import { Terminal } from "../components/Terminal";
import { useLanguage, useT } from "../context/LanguageContext";
import type { TranslationDict } from "../i18n/translations";
import { fetchPublicContent } from "../services/api";
import type { Experience, PortfolioContent, Project } from "../types/portfolio";

const SKILL_ICONS: Record<string, string> = {
  "normes-reglementations": "📜",
  "analyse-risques": "🎯",
  "audit-controle": "🔍",
  "securite-applicative": "🛡️",
  "pentest-cti": "⚔️",
  "devsecops-cloud": "🚀",
  "langages-sgbd": "⌨️",
  "reseaux-langues": "🌐",
  "soft-skills": "🤝",
};

const CERT_ICONS = ["🎓", "💻", "📐", "🧮", "🚩", "🎯", "📘", "🌐"];

function buildTerminalLines(content: PortfolioContent, t: TranslationDict): string[] {
  const role = content.profile.headline || "Cybersécurité";
  const tt = t.terminal;
  const current = content.experiences.find((e) => e.current);
  return [
    `<span class="t-prompt">${tt.promptHost}</span>:<span class="t-key">~</span>$ <span class="t-cmd">${tt.cmdWhoami}</span>`,
    `<span class="t-out">${escapeHtml(tt.whoamiOut(content.profile.full_name, content.profile.tagline || role))}</span>`,
    "",
    `<span class="t-prompt">${tt.promptHost}</span>:<span class="t-key">~</span>$ <span class="t-cmd">${tt.cmdProfile}</span>`,
    '<span class="t-out">{</span>',
    `<span class="t-out">  "target":   "<span class="t-key">${escapeHtml(tt.targetLabel)}</span> | ${escapeHtml(tt.targetSuffix)}",</span>`,
    `<span class="t-out">  "rhythm":   "${escapeHtml(tt.rhythm)}",</span>`,
    `<span class="t-out">  "status":   "${escapeHtml(content.profile.availability || "")}",</span>`,
    `<span class="t-out">  "english":  "${escapeHtml(content.profile.english_level || "")}",</span>`,
    '<span class="t-out">  "norms":    ["ISO 27001", "HDS", "DORA", "NIS 2", "RGPD"],</span>',
    '<span class="t-out">  "tryhackme":"<span class="t-key">Top 1%</span> | agl23"</span>',
    '<span class="t-out">}</span>',
    "",
    `<span class="t-prompt">${tt.promptHost}</span>:<span class="t-key">~</span>$ <span class="t-cmd">${tt.cmdStatus}</span>`,
    ...(current
      ? [
          `<span class="t-ok">✓</span> <span class="t-out">${escapeHtml(tt.currentInternship(current.company))}</span>`,
        ]
      : []),
    `<span class="t-ok">✓</span> <span class="t-out">${escapeHtml(tt.cert)}</span>`,
    `<span class="t-warn">!</span> <span class="t-out">${escapeHtml(tt.openToInterviews)}</span>`,
    "",
  ];
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
//  WORK LIST - projets en liste accordeon (titres XXL + panneau)
//  Au survol / clic, la ligne se deploie : visuel accent + desc + tags.
// ============================================================
const WORK_CAT_TOKEN: Record<string, string> = {
  grc: "GRC",
  security: "SECURITY",
  devops: "DEVSECOPS",
  web: "WEB",
  game: "LAB",
};
const WORK_ACCENT: Record<string, string> = {
  security: "v-purple",
  devops: "v-red",
  grc: "v-blue",
  web: "v-blue",
  game: "v-green",
};
const WORK_PRIORITY = ["grc", "security", "devops", "game", "web"];
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

function workPrimaryCat(cats: string[]): string {
  for (const c of WORK_PRIORITY) if (cats.includes(c)) return c;
  return cats[0] ?? "web";
}
function workAccent(cats: string[]): string {
  return WORK_ACCENT[workPrimaryCat(cats)] ?? "v-blue";
}
function workLabel(p: Project): string {
  const token = WORK_CAT_TOKEN[workPrimaryCat(p.categories)] ?? "PROJECT";
  return `${token} // ${p.technologies.slice(0, 4).join(" ")}`.toUpperCase();
}

function WorkList({ projects }: { projects: Project[] }) {
  const t = useT();
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  // Ouvre la premiere ligne par defaut (apercu immediat) et re-ouvre la
  // premiere a chaque changement de filtre (la liste filtree change de reference).
  useEffect(() => {
    setOpenId(projects[0]?.id ?? null);
  }, [projects]);

  return (
    <ul className="work__list">
      {projects.map((p, i) => {
        const open = openId === p.id;
        const cats = p.categories.map((c) => WORK_CAT_TOKEN[c] ?? c.toUpperCase()).join(", ");
        const meta = `${p.date} | ${cats} | ${p.repository_url ? t.projects.openSource : t.projects.privateLabel}`;
        return (
          <li key={p.id} className={`work__row ${open ? "is-open" : ""}`} data-reveal>
            <button
              type="button"
              className="work__head"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : p.id)}
            >
              <span className="work__num">{CIRCLED[i] ?? `${i + 1}`}</span>
              <span className="work__name">{p.title}</span>
              <span className="work__arrow" aria-hidden="true">
                ↗
              </span>
            </button>
            <div className="work__body">
              <div className="work__body-inner">
                <div className="work__grid">
                  <div className={`work__visual ${workAccent(p.categories)}`}>
                    <span className="work__visual-grid" aria-hidden="true" />
                    <span className="work__visual-scan" aria-hidden="true" />
                    <span className="work__visual-label">{workLabel(p)}</span>
                  </div>
                  <div className="work__info">
                    <p className="work__desc">{p.description}</p>
                    {p.technologies.length > 0 && (
                      <ul className="work__tags">
                        {p.technologies.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    )}
                    <p className="work__metaline">{meta}</p>
                    {p.repository_url ? (
                      <a
                        className="work__cta"
                        href={p.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.projects.viewRepo} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="work__cta is-private">
                        🔒 {p.private_note || t.projects.privateLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ============================================================
//  PURPLE TEAM - spotlight + terminal scripte (attaque -> defense)
//  Le terminal se tape tout seul a l'entree dans le viewport, en boucle.
// ============================================================
function termLineHtml(kind: string, text: string): string {
  const safe = escapeHtml(text);
  if (kind === "prompt") {
    return `<span class="t-prompt">$</span> <span class="t-cmd">${safe}</span>`;
  }
  return `<span class="t-${kind}">${safe}</span>`;
}

type TermScenario = { title: string; script: { k: string; c: string }[] };

function PurpleTerminal({ scenarios }: { scenarios: TermScenario[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body || scenarios.length === 0) return;

    const setTitle = (txt: string) => {
      if (titleRef.current) titleRef.current.textContent = txt;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Repli : affiche le premier scenario en entier, sans animation.
      setTitle(scenarios[0].title);
      body.innerHTML = scenarios[0].script
        .map((s) => `<div class="t-line">${termLineHtml(s.k, s.c)}</div>`)
        .join("");
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const wait = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    let si = 0; // index scenario courant
    let li = 0; // index ligne dans le scenario
    let script = scenarios[0].script;

    const typeLine = () => {
      if (cancelled) return;
      if (li >= script.length) {
        // Fin du scenario : pause, puis on enchaine sur le suivant (boucle).
        wait(() => {
          if (cancelled) return;
          si = (si + 1) % scenarios.length;
          script = scenarios[si].script;
          setTitle(scenarios[si].title);
          body.innerHTML = "";
          li = 0;
          typeLine();
        }, 3200);
        return;
      }
      const item = script[li];
      const line = document.createElement("div");
      line.className = "t-line";
      body.appendChild(line);
      let i = 0;
      const ch = () => {
        if (cancelled) return;
        line.innerHTML =
          termLineHtml(item.k, item.c.slice(0, i)) + '<span class="t-cursor"></span>';
        if (i < item.c.length) {
          i += 1;
          wait(ch, item.k === "prompt" ? 34 : 14);
        } else {
          line.innerHTML = termLineHtml(item.k, item.c);
          li += 1;
          body.scrollTop = body.scrollHeight;
          wait(typeLine, item.k === "prompt" ? 360 : 180);
        }
      };
      ch();
    };

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            typeLine();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(root);

    return () => {
      cancelled = true;
      timers.forEach((tmr) => window.clearTimeout(tmr));
      io.disconnect();
    };
  }, [scenarios]);

  return (
    <div className="spot-term" ref={rootRef}>
      <div className="spot-term__bar">
        <span className="spot-term__dot r" />
        <span className="spot-term__dot y" />
        <span className="spot-term__dot g" />
        <span className="spot-term__title" ref={titleRef}>
          {scenarios[0]?.title}
        </span>
      </div>
      <div className="spot-term__body" ref={bodyRef} aria-hidden="true" />
    </div>
  );
}

function PurpleTeamSection() {
  const t = useT();
  // Deux scenarios joues en boucle : pentest (attaque -> defense) puis
  // threat-hunting / CTI. Memoise pour ne pas relancer le moteur a chaque rendu.
  const scenarios = useMemo<TermScenario[]>(
    () => [
      { title: t.spot.termTitle, script: t.spot.script },
      { title: t.spot.termTitle2, script: t.spot.script2 },
    ],
    [t],
  );
  return (
    <section id="spot" className="spot">
      <div className="spot__glow" aria-hidden="true" />
      <div className="container spot__stage" data-reveal>
        <p className="spot__coming">{t.spot.eyebrow}</p>
        <h2 className="spot__wordmark">{t.spot.title}</h2>
        <PurpleTerminal scenarios={scenarios} />
        <p className="spot__pitch" dangerouslySetInnerHTML={{ __html: t.spot.pitch }} />
      </div>
    </section>
  );
}

export function HomePage() {
  const t = useT();
  const { lang, toggleLang } = useLanguage();
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchPublicContent()
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!content) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = el.dataset.revealDelay ?? "0";
            el.style.transitionDelay = `${delay}ms`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.filter = "blur(0)";
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
      if (reduced) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.filter = "blur(8px)";
      el.style.transition = "opacity .8s ease, transform .8s ease, filter .8s ease";
      if (!el.dataset.revealDelay) el.dataset.revealDelay = String((i % 4) * 60);
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [content]);

  const FILTERS = useMemo(
    () => [
      { id: "all", label: t.projects.filterAll },
      { id: "grc", label: t.projects.filterGrc },
      { id: "security", label: t.projects.filterSecurity },
      { id: "devops", label: t.projects.filterDevops },
      { id: "web", label: t.projects.filterWeb },
      { id: "game", label: t.projects.filterLabs },
    ],
    [t],
  );

  const filteredProjects = useMemo(() => {
    if (!content) return [];
    if (filter === "all") return content.projects;
    return content.projects.filter((p) => p.categories.includes(filter));
  }, [filter, content]);

  const filterCounts = useMemo(() => {
    if (!content) return {} as Record<string, number>;
    const counts: Record<string, number> = { all: content.projects.length };
    content.projects.forEach((p) =>
      p.categories.forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      }),
    );
    return counts;
  }, [content]);

  if (loading) {
    return <main className="page-state">{t.common.loading}</main>;
  }
  if (error || !content) {
    return (
      <main className="page-state error">
        {t.common.loadError}
        <span>{error}</span>
      </main>
    );
  }

  const { profile } = content;
  const photoUrl = profile.profile_image;
  const cvUrl = profile.cv_url;
  const initials = profile.full_name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const currentExp = content.experiences.find((e) => e.current);

  const langButtonLabel = lang === "fr" ? "EN" : "FR";
  const langButtonTitle = lang === "fr" ? t.common.switchToEN : t.common.switchToFR;

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <InteractiveCards />
      <AudioReactiveBackground />
      <div className="ornament-grid" />
      <div className="ornament-glow-1" />
      <div className="ornament-glow-2" />
      <MusicPlayer />

      <nav className={`site-nav ${navScrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#top" className="brand">
            {photoUrl ? (
              <img src={photoUrl} alt={profile.full_name} className="brand-avatar" />
            ) : (
              <span
                className="brand-avatar"
                style={{
                  display: "grid",
                  placeItems: "center",
                  color: "#0a0a12",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                }}
              >
                {initials}
              </span>
            )}
            <span>
              {profile.full_name}
              <small>{profile.headline}</small>
            </span>
          </a>
          <div className="nav-actions">
            <button
              className="nav-toggle"
              onClick={() => setNavOpen((v) => !v)}
              aria-label={t.nav.menu}
            >
              ☰
            </button>
            <div className={`nav-links ${navOpen ? "open" : ""}`}>
              <a href="#about" onClick={() => setNavOpen(false)}>
                {t.nav.about}
              </a>
              <a href="#projects" onClick={() => setNavOpen(false)}>
                {t.nav.projects}
              </a>
              <a href="#experience" onClick={() => setNavOpen(false)}>
                {t.nav.experience}
              </a>
              <a href="#skills" onClick={() => setNavOpen(false)}>
                {t.nav.skills}
              </a>
              <a href="#certifications" onClick={() => setNavOpen(false)}>
                {t.nav.certifications}
              </a>
              <a href="#grc" onClick={() => setNavOpen(false)}>
                {t.nav.grc}
              </a>
              <a href="#contact" className="nav-cta" onClick={() => setNavOpen(false)}>
                {t.nav.contact}
              </a>
            </div>
            <button
              type="button"
              className="nav-admin"
              onClick={toggleLang}
              title={langButtonTitle}
              aria-label={langButtonTitle}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {langButtonLabel}
            </button>
            <Link to="/admin/login" className="nav-admin" title={t.nav.adminPanel}>
              ⚙
            </Link>
          </div>
        </div>
      </nav>

      {/* ============= HERO ============= */}
      <section className="hero" id="top">
        <HeroCanvas />
        <div className="container hero-grid">
          <div>
            <div className="hero-id">
              <div className="hero-avatar-wrap">
                {photoUrl ? (
                  <img src={photoUrl} alt={profile.full_name} className="hero-avatar" />
                ) : (
                  <div className="hero-avatar-placeholder">{initials}</div>
                )}
                <span
                  className="hero-avatar-online"
                  title={profile.availability || t.hero.availableTitle}
                />
              </div>
              <div className="hero-id-meta">
                <span className="hero-name">{profile.full_name}</span>
                <span className="hero-name-tag">{profile.tagline}</span>
              </div>
            </div>

            <div className="hero-eyebrow">
              <span className="pulse" />
              <span>{profile.availability}</span>
            </div>

            <h1 className="hero-title">
              {t.hero.titleLine1 && <>{t.hero.titleLine1} </>}
              <span className="grad">{t.hero.titleLine1Tag}</span>
              <br />
              {t.hero.titleLine2}
            </h1>

            <p
              className="hero-sub"
              dangerouslySetInnerHTML={{ __html: enrichBio(profile.short_bio) }}
            />

            <div className="hero-tags">
              {content.hero_tags.map((tag, i) => (
                <span key={tag} className={`chip ${i < 3 ? "chip-hot" : ""}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary" data-magnetic>
                {t.hero.ctaProjects}
              </a>
              {cvUrl && (
                <a href={cvUrl} download className="btn btn-ghost" data-magnetic>
                  {t.hero.ctaCV}
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  ⌗ GitHub
                </a>
              )}
            </div>

            <div className="hero-metrics">
              <div className="metric">
                <div className="metric-num">
                  <CountUp end={content.projects.length} suffix="+" />
                </div>
                <div className="metric-label">{t.hero.metricProjects}</div>
              </div>
              <div className="metric">
                <div className="metric-num">
                  <CountUp end={content.experiences.length} />
                </div>
                <div className="metric-label">{t.hero.metricInternships}</div>
              </div>
              <div className="metric">
                <div className="metric-num">
                  <CountUp end={185} />
                </div>
                <div className="metric-label">{t.hero.metricThm}</div>
              </div>
              <div className="metric">
                <div className="metric-num">C1</div>
                <div className="metric-label">{t.hero.metricEnglish}</div>
              </div>
            </div>
          </div>

          <Terminal lines={buildTerminalLines(content, t)} title="~/grc-profile.sh - zsh" />
        </div>
      </section>

      {/* ============= TECH MARQUEE ============= */}
      <TechMarquee />

      {/* ============= ABOUT ============= */}
      <section id="about">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.about.eyebrow}</span>
            <h2 className="section-title">
              {t.about.titleStart} <span className="grad">{t.about.titleEnd}</span>
            </h2>
            <p className="section-sub">{t.about.sub}</p>
          </div>

          <div className="about-grid">
            <div className="about-text" data-reveal>
              {profile.about
                .split(/\n+/)
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              {currentExp && (
                <p>
                  <strong>{t.about.currentLabel}</strong> {currentExp.title} {t.about.currentMiddle}{" "}
                  <strong>{currentExp.company}</strong> ({currentExp.period}).
                </p>
              )}
            </div>

            <div className="focus-grid" data-reveal>
              <div className="focus">
                <span className="focus-icon">📋</span>
                <div className="focus-title">{t.about.focus.auditTitle}</div>
                <div className="focus-desc">{t.about.focus.auditDesc}</div>
              </div>
              <div className="focus">
                <span className="focus-icon">🎯</span>
                <div className="focus-title">{t.about.focus.riskTitle}</div>
                <div className="focus-desc">{t.about.focus.riskDesc}</div>
              </div>
              <div className="focus">
                <span className="focus-icon">⚙️</span>
                <div className="focus-title">{t.about.focus.devsecopsTitle}</div>
                <div className="focus-desc">{t.about.focus.devsecopsDesc}</div>
              </div>
              <div className="focus">
                <span className="focus-icon">🛡️</span>
                <div className="focus-title">{t.about.focus.pentestTitle}</div>
                <div className="focus-desc">{t.about.focus.pentestDesc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= PROJECTS ============= */}
      <section id="projects">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title">{t.projects.title}</h2>
            <p className="section-sub">{t.projects.sub}</p>
          </div>

          <div className="filters" data-reveal>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`filter-btn ${filter === f.id ? "active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label} <span className="filter-count">({filterCounts[f.id] ?? 0})</span>
              </button>
            ))}
          </div>

          <WorkList projects={filteredProjects} />
        </div>
      </section>

      {/* ============= PURPLE TEAM (spotlight + terminal scripte) ============= */}
      <PurpleTeamSection />

      {/* ============= GRC DELIVERABLES ============= */}
      <GrcSection />

      {/* ============= EXPERIENCE ============= */}
      <section id="experience">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.experience.eyebrow}</span>
            <h2 className="section-title">{t.experience.title}</h2>
            <p className="section-sub">{t.experience.sub}</p>
          </div>

          <ExperienceTimeline experiences={content.experiences} />
        </div>
      </section>

      {/* ============= SKILLS ============= */}
      <section id="skills">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.skills.eyebrow}</span>
            <h2 className="section-title">{t.skills.title}</h2>
            <p className="section-sub">{t.skills.sub}</p>
          </div>

          <div className="skills-grid">
            {content.skill_categories.map((cat) => (
              <div key={cat.id} className="skill-card" data-reveal>
                <div className="skill-head">
                  <div className="skill-icon">{SKILL_ICONS[cat.id] || "🔧"}</div>
                  <div className="skill-title">{cat.title}</div>
                </div>
                <ul className="skill-items">
                  {cat.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CERTIFICATIONS ============= */}
      <section id="certifications">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.certs.eyebrow}</span>
            <h2 className="section-title">{t.certs.title}</h2>
            <p className="section-sub">{t.certs.sub}</p>
          </div>

          <div className="certs">
            {content.certifications.map((c, i) => (
              <div key={c.id} className="cert" data-reveal>
                <div className="cert-icon">{CERT_ICONS[i % CERT_ICONS.length]}</div>
                <div>
                  <div className="cert-title">
                    {c.title}
                    {c.in_progress && <span className="cert-badge">{t.certs.inProgress}</span>}
                  </div>
                  <div className="cert-sub">{c.subtitle}</div>
                  <div className="cert-desc">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= INTERESTS ============= */}
      <section id="interests">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">{t.interests.eyebrow}</span>
            <h2 className="section-title">{t.interests.title}</h2>
          </div>

          <div className="interests">
            {content.interests.map((it) => (
              <div key={it.id} className="interest" data-reveal>
                <span className="interest-emoji">{it.emoji || "✨"}</span>
                <div className="interest-title">{it.title}</div>
                <div className="interest-desc">{it.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CONTACT ============= */}
      <section id="contact">
        <div className="container">
          <div className="contact-card" data-reveal>
            <h2 className="contact-title">{t.contact.title}</h2>
            <p className="contact-sub">{t.contact.sub}</p>

            <ContactForm email={profile.email} subject={t.contact.mailSubject} />

            <div className="contact-or">{t.contact.form.orDirect}</div>

            <div className="contact-actions">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(t.contact.mailSubject)}`}
                className="btn btn-primary"
                data-magnetic
              >
                ✉ {profile.email}
              </a>
              {cvUrl && (
                <a href={cvUrl} download className="btn btn-ghost">
                  {t.contact.ctaCV}
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  in | LinkedIn
                </a>
              )}
              {profile.tryhackme_url && (
                <a
                  href={profile.tryhackme_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  🚩 TryHackMe
                </a>
              )}
            </div>
            <div className="contact-meta">
              {profile.address && <span>📍 {profile.address}</span>}
              {profile.location && <span>🎓 {profile.location}</span>}
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="socials">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="s-github"
                title="GitHub"
                aria-label="GitHub"
              >
                <SocialIcon name="github" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="s-linkedin"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <SocialIcon name="linkedin" />
              </a>
            )}
            {profile.tryhackme_url && (
              <a
                href={profile.tryhackme_url}
                target="_blank"
                rel="noopener noreferrer"
                className="s-thm"
                title="TryHackMe"
                aria-label="TryHackMe"
              >
                <SocialIcon name="tryhackme" />
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="s-email"
              title="Email"
              aria-label="Email"
            >
              <SocialIcon name="email" />
            </a>
            {cvUrl && (
              <a
                href={cvUrl}
                download
                className="s-cv"
                title={t.footer.cv}
                aria-label={t.footer.cv}
              >
                <SocialIcon name="cv" />
              </a>
            )}
          </div>
          <div>
            © {new Date().getFullYear()} {profile.full_name} | {profile.headline} |{" "}
            {profile.location.split("·")[0]?.trim() || profile.location}
          </div>
        </div>
      </footer>
    </>
  );
}

// ============================================================
//  GRC SECTION - composant interne, traduit via useT()
// ============================================================
function GrcSection() {
  const t = useT();
  const c = t.grc.cards;
  return (
    <section id="grc">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="section-eyebrow">{t.grc.eyebrow}</span>
          <h2 className="section-title">
            {t.grc.titleStart} <span className="grad">{t.grc.titleEnd}</span>
          </h2>
          <p className="section-sub">{t.grc.sub}</p>
        </div>

        <div className="certs">
          <a
            className="cert"
            href="/grc/iso-27001-control-matrix.md"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="cert-icon">📋</div>
            <div>
              <div className="cert-title">
                {c.isoTitle} <span className="cert-badge">{c.isoBadge}</span>
              </div>
              <div className="cert-sub">{c.isoSub}</div>
              <div className="cert-desc">
                {c.isoDesc}{" "}
                <span style={{ display: "inline-block", marginTop: 4 }}>
                  <a
                    href="/grc/iso-27001-control-matrix.md"
                    style={{ color: "var(--accent)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.isoLinkMd}
                  </a>
                  {" | "}
                  <a
                    href="/grc/iso-27001-control-matrix.csv"
                    style={{ color: "var(--accent)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.isoLinkCsv}
                  </a>
                </span>
              </div>
            </div>
          </a>

          <a
            className="cert"
            href="/grc/ebios-rm-template.md"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="cert-icon">🎯</div>
            <div>
              <div className="cert-title">
                {c.ebiosTitle} <span className="cert-badge">{c.ebiosBadge}</span>
              </div>
              <div className="cert-sub">{c.ebiosSub}</div>
              <div className="cert-desc">{c.ebiosDesc}</div>
            </div>
          </a>

          <a
            className="cert"
            href="/grc/registre-traitements-rgpd.csv"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="cert-icon">🔐</div>
            <div>
              <div className="cert-title">
                {c.rgpdTitle} <span className="cert-badge">{c.rgpdBadge}</span>
              </div>
              <div className="cert-sub">{c.rgpdSub}</div>
              <div className="cert-desc">{c.rgpdDesc}</div>
            </div>
          </a>

          <a
            className="cert"
            href="/grc/pssi-modele.md"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="cert-icon">🛡️</div>
            <div>
              <div className="cert-title">
                {c.pssiTitle} <span className="cert-badge">{c.pssiBadge}</span>
              </div>
              <div className="cert-sub">{c.pssiSub}</div>
              <div className="cert-desc">{c.pssiDesc}</div>
            </div>
          </a>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            color: "var(--text-mute)",
            fontSize: 13,
          }}
        >
          📂 {t.grc.browseAll} :{" "}
          <a
            href="/grc/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            grc/
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/AGL2304/Mon_Portfolio/tree/main/grc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {t.grc.alsoOnGithub}
          </a>
        </p>
      </div>
    </section>
  );
}

function enrichBio(text: string): string {
  // met en gras quelques mots cles regulations pour aerer la lecture
  const KEY = [
    "ISO 27001",
    "ISO/IEC 27001",
    "HDS",
    "DORA",
    "NIS 2",
    "RGPD",
    "GDPR",
    "EBIOS",
    "GRC",
    "PSSI",
    "ISSP",
    "OWASP",
    "TPRM",
    "Cyber Resilience Act",
    "Mastère Architectures Systèmes, Réseaux & Sécurité",
    "Architectures Systèmes",
    "Systems, Networks & Security Architecture",
    "IRFA-APISUP",
    "TryHackMe",
  ];
  let html = escapeHtml(text);
  for (const k of KEY) {
    const re = new RegExp(`(${escapeRegex(k)})`, "g");
    html = html.replace(re, "<strong>$1</strong>");
  }
  return html;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================================
//  SOCIAL ICONS - logos inline (aucune dependance externe)
// ============================================================
function SocialIcon({ name }: { name: "github" | "linkedin" | "tryhackme" | "email" | "cv" }) {
  switch (name) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.61 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.71.08-.71 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.21.96-.26 1.98-.39 3-.4 1.02 0 2.04.14 3 .4 2.29-1.53 3.29-1.21 3.29-1.21.66 1.64.24 2.86.12 3.16.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.36.81 1.09.81 2.19 0 1.58-.01 2.86-.01 3.25 0 .31.21.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
          />
        </svg>
      );
    case "tryhackme":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 0 0-4.107 4.5 4.525 4.525 0 0 0 4.52 4.52h6.761a.625.625 0 1 0 0-1.25H4.761a3.273 3.273 0 0 1-3.27-3.27A3.273 3.273 0 0 1 6.59 7.08a.625.625 0 0 0 .7-1.035 4.488 4.488 0 0 0-1.68-.69 5.223 5.223 0 0 1 5.096-4.104 5.221 5.221 0 0 1 5.174 4.57 4.489 4.489 0 0 0-.488.305.625.625 0 1 0 .731 1.013 3.245 3.245 0 0 1 1.912-.616 3.278 3.278 0 0 1 3.203 2.61.625.625 0 0 0 1.225-.251 4.533 4.533 0 0 0-4.428-3.61 4.54 4.54 0 0 0-.958.105C16.556 2.328 13.9 0 10.705 0zm5.192 10.64a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.054.514c0 .181.018.353.054.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .309-.296c.08-.124.137-.267.173-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.309-.291.917.917 0 0 0-.46-.108zm6.486 0a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.053.514c0 .181.017.353.053.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .31-.296c.078-.124.136-.267.172-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.308-.291.916.916 0 0 0-.461-.108zm-8.537.068l-.84.618.313.43.476-.368v1.877h.603v-2.557zm6.486 0l-.841.618.314.43.477-.368v1.877h.603v-2.557zm-4.435.445c.08 0 .143.028.193.084.05.057.087.127.114.21.026.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.028.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.248.248 0 0 1-.195-.086.584.584 0 0 1-.118-.209 1.245 1.245 0 0 1-.056-.27 2.645 2.645 0 0 1 0-.533c.01-.096.029-.186.056-.27a.583.583 0 0 1 .118-.209.25.25 0 0 1 .195-.084zm6.486 0c.08 0 .144.028.193.084.05.057.087.127.114.21.027.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.027.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.249.249 0 0 1-.195-.086.581.581 0 0 1-.117-.209 1.245 1.245 0 0 1-.056-.27 2.642 2.642 0 0 1 0-.533c.01-.096.028-.186.056-.27a.58.58 0 0 1 .117-.209.25.25 0 0 1 .195-.084zm-2.191 3.51a.93.93 0 0 0-.463.109.908.908 0 0 0-.312.291c-.08.122-.139.263-.175.426a2.383 2.383 0 0 0-.054.514c0 .18.018.353.054.516.036.164.094.308.175.432a.91.91 0 0 0 .312.296.92.92 0 0 0 .463.11c.18 0 .333-.037.46-.11a.892.892 0 0 0 .308-.296 1.32 1.32 0 0 0 .174-.432c.036-.163.054-.335.054-.516 0-.18-.018-.352-.054-.514a1.274 1.274 0 0 0-.174-.426.89.89 0 0 0-.309-.291.918.918 0 0 0-.46-.108zm-6.402.07l-.841.617.314.43.476-.369v1.878h.604v-2.557zm2.125 0l-.841.617.314.43.477-.369v1.878h.603v-2.557zm2.116 0l-.84.617.313.43.477-.369v1.878h.603v-2.557zm2.16.443c.08 0 .144.028.194.085a.605.605 0 0 1 .114.21c.026.083.044.172.053.269a2.639 2.639 0 0 1 0 .532 1.28 1.28 0 0 1-.053.27.585.585 0 0 1-.114.21.244.244 0 0 1-.193.085.25.25 0 0 1-.196-.085.589.589 0 0 1-.117-.21 1.245 1.245 0 0 1-.056-.27 2.597 2.597 0 0 1 0-.532c.01-.097.028-.186.056-.27a.589.589 0 0 1 .117-.209.249.249 0 0 1 .196-.085zm-6.729 3.073a.676.676 0 0 0-.335.078.661.661 0 0 0-.227.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.93.93 0 0 0 .127.313.65.65 0 0 0 .227.215c.092.053.204.08.335.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .225-.215c.057-.09.1-.194.125-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.931.931 0 0 0-.125-.31.658.658 0 0 0-.225-.21.667.667 0 0 0-.334-.08zm3.086 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.907.907 0 0 0-.127.31 1.69 1.69 0 0 0-.04.373c0 .131.013.256.04.375a.928.928 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.752 1.752 0 0 0 0-.748.94.94 0 0 0-.126-.31.657.657 0 0 0-.224-.21.667.667 0 0 0-.334-.08zm5.108 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.931.931 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08.13 0 .243-.027.334-.08a.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.943.943 0 0 0-.126-.31.657.657 0 0 0-.224-.21.668.668 0 0 0-.334-.08zm-6.658.05l-.61.448.227.311.346-.266v1.362h.438v-1.856zm3.068 0l-.61.448.227.311.346-.266v1.362h.438v-1.856zm5.108 0l-.611.448.228.311.346-.266v1.362h.438v-1.856zm-9.712.322c.058 0 .105.02.14.062a.421.421 0 0 1 .083.151.96.96 0 0 1 .04.196 1.932 1.932 0 0 1 0 .386.954.954 0 0 1-.04.197.421.421 0 0 1-.083.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.427.427 0 0 1-.085-.153.887.887 0 0 1-.041-.197 1.96 1.96 0 0 1 0-.386.893.893 0 0 1 .04-.196.42.42 0 0 1 .086-.151.181.181 0 0 1 .141-.062zm3.086 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.94.94 0 0 1 .04.196 1.906 1.906 0 0 1 0 .386.93.93 0 0 1-.04.197.421.421 0 0 1-.082.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.42.42 0 0 1-.086-.153.846.846 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.849.849 0 0 1 .041-.196.42.42 0 0 1 .086-.151.182.182 0 0 1 .141-.062zm5.108 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.92.92 0 0 1 .04.196 1.963 1.963 0 0 1 0 .386.943.943 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.061.18.18 0 0 1-.142-.06.437.437 0 0 1-.085-.153.95.95 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.959.959 0 0 1 .04-.196.47.47 0 0 1 .086-.151.181.181 0 0 1 .142-.062zm-1.684 1.814a.675.675 0 0 0-.336.079.66.66 0 0 0-.227.21.91.91 0 0 0-.127.31 1.731 1.731 0 0 0 0 .748.939.939 0 0 0 .127.314c.059.09.134.162.227.215.093.053.205.08.336.08a.66.66 0 0 0 .334-.08.648.648 0 0 0 .224-.215c.058-.09.1-.195.126-.314a1.737 1.737 0 0 0-.001-.747.928.928 0 0 0-.125-.31.65.65 0 0 0-.224-.211.668.668 0 0 0-.334-.079zm3.063 0a.676.676 0 0 0-.336.079.664.664 0 0 0-.227.21.906.906 0 0 0-.127.31 1.74 1.74 0 0 0 0 .748.936.936 0 0 0 .127.314.66.66 0 0 0 .227.215c.092.053.204.08.336.08a.654.654 0 0 0 .334-.08.648.648 0 0 0 .223-.215c.058-.09.1-.195.126-.314a1.74 1.74 0 0 0 0-.747.928.928 0 0 0-.126-.31.65.65 0 0 0-.223-.211.666.666 0 0 0-.334-.079zm-1.545.05l-.611.448.228.312.346-.267v1.363h.438v-1.856zm-1.518.323c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.91.91 0 0 1 .04.195 1.966 1.966 0 0 1 0 .387.951.951 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.06.18.18 0 0 1-.142-.06.428.428 0 0 1-.085-.152.914.914 0 0 1-.04-.197 1.96 1.96 0 0 1-.011-.195c0-.058.003-.122.01-.192a.923.923 0 0 1 .041-.195c.02-.06.048-.11.085-.152a.181.181 0 0 1 .142-.061zm3.063 0c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.94.94 0 0 1 .04.195 1.91 1.91 0 0 1 0 .387.93.93 0 0 1-.04.197.422.422 0 0 1-.083.152.175.175 0 0 1-.14.06.18.18 0 0 1-.141-.06.423.423 0 0 1-.085-.152.907.907 0 0 1-.04-.197 1.95 1.95 0 0 1 0-.387.915.915 0 0 1 .04-.195c.02-.06.048-.11.085-.152a.182.182 0 0 1 .142-.061zm-9.713.185a.465.465 0 0 0-.232.055.456.456 0 0 0-.157.146.627.627 0 0 0-.089.215 1.168 1.168 0 0 0-.027.259c0 .09.009.177.027.26a.648.648 0 0 0 .089.216c.04.063.093.112.157.149a.459.459 0 0 0 .232.056c.09 0 .168-.02.231-.056a.45.45 0 0 0 .156-.149.67.67 0 0 0 .087-.217 1.218 1.218 0 0 0 0-.518.647.647 0 0 0-.087-.215.448.448 0 0 0-.156-.146.458.458 0 0 0-.23-.055zm1.052.035l-.423.31.158.217.24-.185v.944h.303v-1.286zm-1.052.224c.04 0 .073.014.097.042a.284.284 0 0 1 .057.105.69.69 0 0 1 .028.136c.004.049.007.092.007.133 0 .04-.003.086-.007.135a.684.684 0 0 1-.028.136.285.285 0 0 1-.057.105.123.123 0 0 1-.097.043.125.125 0 0 1-.098-.043.298.298 0 0 1-.059-.105.612.612 0 0 1-.028-.136 1.39 1.39 0 0 1 0-.268.62.62 0 0 1 .028-.136.297.297 0 0 1 .06-.105.125.125 0 0 1 .097-.042zm3.775 1.394a.463.463 0 0 0-.232.054.452.452 0 0 0-.157.146.621.621 0 0 0-.088.214 1.19 1.19 0 0 0 0 .519.641.641 0 0 0 .088.217.46.46 0 0 0 .157.15.458.458 0 0 0 .232.054.454.454 0 0 0 .232-.055.45.45 0 0 0 .155-.149.664.664 0 0 0 .087-.217 1.189 1.189 0 0 0 0-.519.642.642 0 0 0-.087-.214.446.446 0 0 0-.155-.146.459.459 0 0 0-.232-.054zm1.052.034l-.423.31.158.216.24-.185v.945h.303V22.68zm-1.052.223c.04 0 .073.014.098.043a.3.3 0 0 1 .057.105.643.643 0 0 1 .027.135 1.31 1.31 0 0 1 0 .268.654.654 0 0 1-.027.137.307.307 0 0 1-.057.105.124.124 0 0 1-.098.042.125.125 0 0 1-.098-.042.293.293 0 0 1-.059-.105.618.618 0 0 1-.028-.137 1.364 1.364 0 0 1 0-.268.612.612 0 0 1 .028-.135.287.287 0 0 1 .06-.105.123.123 0 0 1 .097-.043z"
          />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
          />
        </svg>
      );
    case "cv":
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 1.5L18.5 8H14V3.5zM8 13h8v1.6H8V13zm0 3.2h8v1.6H8v-1.6zM8 9.8h3v1.6H8V9.8z"
          />
        </svg>
      );
  }
}

// ============================================================
//  TIMELINE HELPERS - derive type / year / mots-cles depuis les data
// ============================================================
function xpKind(title: string): "stage" | "emploi" {
  return /stagiaire|\bstage\b/i.test(title) ? "stage" : "emploi";
}

function xpYear(period: string): string {
  const m = period.match(/\b(?:19|20)\d{2}\b/);
  return m ? m[0] : "";
}

// Dictionnaire de mots-cles : on extrait des chips depuis le texte des highlights.
const XP_KEYWORDS: { label: string; re: RegExp }[] = [
  { label: "Microsoft 365", re: /microsoft\s*365|\bM365\b/i },
  { label: "SharePoint", re: /sharepoint/i },
  { label: "Power BI", re: /power\s*bi/i },
  { label: "RGPD", re: /\bRGPD\b/i },
  { label: "PSSI", re: /\bPSSI\b/i },
  { label: "KPI / KRI", re: /\bKPI\b|\bKRI\b/i },
  { label: "Audit", re: /audit/i },
  { label: "Laravel", re: /laravel/i },
  { label: "Docker", re: /docker/i },
  { label: "Kubernetes", re: /kubernetes|\bGKE\b/i },
  { label: "CI/CD", re: /ci\s*\/\s*cd|github\s*actions/i },
  { label: "Ansible", re: /ansible/i },
  { label: "OWASP", re: /owasp/i },
  { label: "JWT", re: /\bJWT\b/i },
  { label: "RBAC", re: /\bRBAC\b/i },
  { label: "Pentest", re: /pentest|exploit/i },
  { label: "CVSS", re: /\bCVSS\b/i },
  { label: "sqlmap", re: /sqlmap/i },
  { label: "CVE / CTI", re: /\bCVE\b|\bCTI\b/i },
];

function xpTags(highlights: string[], max = 6): string[] {
  const text = highlights.join(" ");
  const out: string[] = [];
  for (const k of XP_KEYWORDS) {
    if (k.re.test(text)) out.push(k.label);
    if (out.length >= max) break;
  }
  return out;
}

// Spline Catmull-Rom -> courbes de Bezier : trace doux qui PASSE par chaque
// point, ce qui donne l'allure d'un fil souple pose sur la table.
function catmullRom(p: { x: number; y: number }[]): string {
  if (p.length < 2) return "";
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d +=
      ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)},` +
      ` ${c2x.toFixed(1)} ${c2y.toFixed(1)},` +
      ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// ============================================================
//  EXPERIENCE TIMELINE - fil sinueux qui serpente entre les noeuds
//  Le trace SVG est recalcule depuis la position reelle des noeuds,
//  ce qui donne une courbe organique "comme un fil pose sur la table".
// ============================================================
function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const [wave, setWave] = useState<{ d: string; w: number; h: number }>({
    d: "",
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const build = () => {
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (!W || !H) return;
      const wrapBox = wrap.getBoundingClientRect();
      const pts: { x: number; y: number }[] = [];
      nodeRefs.current.forEach((el) => {
        if (!el) return;
        const b = el.getBoundingClientRect();
        pts.push({
          x: b.left - wrapBox.left + b.width / 2,
          y: b.top - wrapBox.top + b.height / 2,
        });
      });
      if (pts.length === 0) return;

      // Ancres haut/bas : le fil entre par le haut et ressort par le bas.
      const base = [{ x: pts[0].x, y: 0 }, ...pts, { x: pts[pts.length - 1].x, y: H }];

      // Entre chaque noeud on glisse un point de balancement decale en
      // alternance : le fil deborde puis revient -> vrais "vas-et-viens".
      const path: { x: number; y: number }[] = [base[0]];
      for (let i = 1; i < base.length; i++) {
        const a = base[i - 1];
        const b = base[i];
        const dir = i % 2 === 0 ? 1 : -1;
        const sway = Math.min(72, Math.abs(b.y - a.y) * 0.22);
        path.push({ x: (a.x + b.x) / 2 + dir * sway, y: (a.y + b.y) / 2 });
        path.push(b);
      }

      setWave({ d: catmullRom(path), w: W, h: H });
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);
    window.addEventListener("resize", build);
    const raf = requestAnimationFrame(build);
    const tm = window.setTimeout(build, 400);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", build);
      cancelAnimationFrame(raf);
      window.clearTimeout(tm);
    };
  }, [experiences]);

  return (
    <div className="xp-timeline" ref={wrapRef}>
      {wave.d && (
        <svg
          className="xp-wave"
          viewBox={`0 0 ${wave.w} ${wave.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="xpWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          <path className="xp-wave-glow" d={wave.d} />
          <path className="xp-wave-line" d={wave.d} pathLength={1} />
        </svg>
      )}

      {experiences.map((exp, idx) => {
        const kind = xpKind(exp.title);
        const year = xpYear(exp.period);
        const tags = xpTags(exp.highlights);
        const side = idx % 2 === 0 ? "left" : "right";
        return (
          <div key={exp.id} className={`xp-row ${side} ${exp.current ? "is-current" : ""}`}>
            <span
              className="xp-node"
              ref={(el) => {
                nodeRefs.current[idx] = el;
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm0 3h6V6H9v1z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {year && <span className="xp-year">{year}</span>}
            <div className="xp-card">
              <div className="xp-card-head">
                <span className={`xp-kind ${kind}`}>
                  {kind === "stage" ? t.experience.kindStage : t.experience.kindJob}
                </span>
                <span className="xp-period">
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 7v5l3 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  {exp.period}
                </span>
              </div>
              <div className="xp-role">{exp.title}</div>
              <div className="xp-org">
                {exp.company}
                {exp.location && <span className="xp-loc"> | {exp.location}</span>}
              </div>
              {exp.highlights.length > 0 && (
                <ul className="xp-points">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {tags.length > 0 && (
                <div className="xp-tags">
                  {tags.map((tag) => (
                    <span key={tag} className="xp-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
//  CONTACT FORM - formulaire ouvert a tout visiteur (mailto)
// ============================================================
function ContactForm({ email, subject }: { email: string; subject: string }) {
  const t = useT();
  const f = t.contact.form;
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = `${f.bodyName}: ${name}\n${f.bodyEmail}: ${from}\n\n${message}`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">{f.name}</span>
          <input
            className="cf-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePh}
            autoComplete="name"
          />
        </label>
        <label className="cf-field">
          <span className="cf-label">{f.email}</span>
          <input
            className="cf-input"
            type="email"
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder={f.emailPh}
            autoComplete="email"
          />
        </label>
      </div>
      <label className="cf-field">
        <span className="cf-label">{f.message}</span>
        <textarea
          className="cf-input cf-textarea"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={f.messagePh}
        />
      </label>
      <div className="cf-actions">
        <button type="submit" className="btn btn-primary cf-send" data-magnetic>
          ✈ {f.send}
        </button>
        {sent && (
          <span className="cf-sent" role="status">
            {f.sent}
          </span>
        )}
      </div>
    </form>
  );
}
