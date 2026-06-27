import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AudioReactiveBackground } from "../components/AudioReactiveBackground";
import { CountUp } from "../components/CountUp";
import { CustomCursor } from "../components/CustomCursor";
import { HeroCanvas } from "../components/HeroCanvas";
import { InteractiveCards } from "../components/InteractiveCards";
import { MusicPlayer } from "../components/MusicPlayer";
import { ProjectCard } from "../components/ProjectCard";
import { ScrollProgress } from "../components/ScrollProgress";
import { TechMarquee } from "../components/TechMarquee";
import { Terminal } from "../components/Terminal";
import { useLanguage, useT } from "../context/LanguageContext";
import type { TranslationDict } from "../i18n/translations";
import { fetchPublicContent } from "../services/api";
import type { Experience, PortfolioContent } from "../types/portfolio";

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
            d="M5 2a1 1 0 0 1 1 1v1h11.5a1 1 0 0 1 .8 1.6L16 9l2.3 3.4a1 1 0 0 1-.8 1.6H6v8a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1z"
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
