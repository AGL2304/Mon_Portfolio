import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "../components/CountUp";
import { CustomCursor } from "../components/CustomCursor";
import { HeroCanvas } from "../components/HeroCanvas";
import { InteractiveCards } from "../components/InteractiveCards";
import { ProjectCard } from "../components/ProjectCard";
import { ScrollProgress } from "../components/ScrollProgress";
import { TechMarquee } from "../components/TechMarquee";
import { Terminal } from "../components/Terminal";
import { useLanguage, useT } from "../context/LanguageContext";
import type { TranslationDict } from "../i18n/translations";
import { fetchPublicContent } from "../services/api";
import type { PortfolioContent } from "../types/portfolio";

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
      <div className="ornament-grid" />
      <div className="ornament-glow-1" />
      <div className="ornament-glow-2" />

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

          <div className="projects">
            {filteredProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} delayMs={i * 40} />
            ))}
          </div>
        </div>
      </section>

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

          <div className="timeline">
            {content.experiences.map((exp) => (
              <div
                key={exp.id}
                className={`tl-item ${exp.current ? "is-current" : ""}`}
                data-reveal
              >
                <div className="tl-head">
                  <div>
                    <div className="tl-title">{exp.title}</div>
                    <div className="tl-company">
                      {exp.company}
                      {exp.location && <span className="tl-loc">- {exp.location}</span>}
                    </div>
                  </div>
                  <div className={`tl-period ${exp.current ? "current" : ""}`}>{exp.period}</div>
                </div>
                <ul className="tl-list">
                  {exp.highlights.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {profile.tryhackme_url && (
              <a href={profile.tryhackme_url} target="_blank" rel="noopener noreferrer">
                TryHackMe
              </a>
            )}
            <a href={`mailto:${profile.email}`}>Email</a>
            {cvUrl && (
              <a href={cvUrl} download>
                {t.footer.cv}
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
