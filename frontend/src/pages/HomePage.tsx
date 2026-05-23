import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { Terminal } from "../components/Terminal";
import { fetchPublicContent } from "../services/api";
import type { PortfolioContent } from "../types/portfolio";

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "grc", label: "GRC / Conformité" },
  { id: "security", label: "Sécurité / Pentest" },
  { id: "devops", label: "DevOps" },
  { id: "web", label: "Web" },
  { id: "game", label: "Labs" },
];

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

function buildTerminalLines(content: PortfolioContent): string[] {
  const role = content.profile.headline || "Cybersécurité";
  return [
    '<span class="t-prompt">georges@grc-lab</span>:<span class="t-key">~</span>$ <span class="t-cmd">whoami</span>',
    `<span class="t-out">→ ${escapeHtml(content.profile.full_name)} · ${escapeHtml(content.profile.tagline || role)}</span>`,
    "",
    '<span class="t-prompt">georges@grc-lab</span>:<span class="t-key">~</span>$ <span class="t-cmd">cat profile.json | jq</span>',
    '<span class="t-out">{</span>',
    `<span class="t-out">  "target":   "<span class="t-key">${escapeHtml(role)}</span>",</span>`,
    `<span class="t-out">  "status":   "${escapeHtml(content.profile.availability || "")}",</span>`,
    `<span class="t-out">  "english":  "${escapeHtml(content.profile.english_level || "")}",</span>`,
    '<span class="t-out">  "normes":   ["ISO 27001", "HDS", "DORA", "NIS 2", "RGPD"],</span>',
    '<span class="t-out">  "tryhackme":"<span class="t-key">Top 1%</span> · agl23"</span>',
    '<span class="t-out">}</span>',
    "",
    '<span class="t-prompt">georges@grc-lab</span>:<span class="t-key">~</span>$ <span class="t-cmd">./status.sh</span>',
    ...(content.experiences.find((e) => e.current)
      ? [
          `<span class="t-ok">✓</span> <span class="t-out">Stage en cours · ${escapeHtml(
            content.experiences.find((e) => e.current)?.company || "",
          )}</span>`,
        ]
      : []),
    '<span class="t-ok">✓</span> <span class="t-out">EBIOS Risk Manager · ISO 27001 Lead Implementer (en cours)</span>',
    '<span class="t-warn">!</span> <span class="t-out">Ouvert aux entretiens — réponse sous 24h</span>',
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
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [navOpen, setNavOpen] = useState(false);

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
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity .7s ease, transform .7s ease";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [content]);

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
    return <main className="page-state">Chargement du portfolio…</main>;
  }
  if (error || !content) {
    return (
      <main className="page-state error">
        Impossible de charger le portfolio.
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

  return (
    <>
      <div className="ornament-grid" />
      <div className="ornament-glow-1" />
      <div className="ornament-glow-2" />

      <nav className="site-nav">
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
              aria-label="Menu"
            >
              ☰
            </button>
            <div className={`nav-links ${navOpen ? "open" : ""}`}>
              <a href="#about" onClick={() => setNavOpen(false)}>
                À propos
              </a>
              <a href="#projects" onClick={() => setNavOpen(false)}>
                Projets
              </a>
              <a href="#experience" onClick={() => setNavOpen(false)}>
                Expérience
              </a>
              <a href="#skills" onClick={() => setNavOpen(false)}>
                Stack
              </a>
              <a href="#certifications" onClick={() => setNavOpen(false)}>
                Formation
              </a>
              <a href="#contact" className="nav-cta" onClick={() => setNavOpen(false)}>
                Me contacter
              </a>
            </div>
            <Link to="/admin/login" className="nav-admin" title="Espace admin">
              ⚙
            </Link>
          </div>
        </div>
      </nav>

      {/* ============= HERO ============= */}
      <section className="hero" id="top">
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
                  title={profile.availability || "Disponible"}
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
              Alternant <span className="grad">GRC.</span>
              <br />
              Cybersécurité · Conformité · Risques.
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
              <a href="#projects" className="btn btn-primary">
                Voir mes projets →
              </a>
              {cvUrl && (
                <a href={cvUrl} download className="btn btn-ghost">
                  📄 Télécharger mon CV
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  ⌗ GitHub
                </a>
              )}
            </div>

            <div className="hero-metrics">
              <div className="metric">
                <div className="metric-num">{content.projects.length}+</div>
                <div className="metric-label">Projets</div>
              </div>
              <div className="metric">
                <div className="metric-num">{content.experiences.length}</div>
                <div className="metric-label">Stages cyber/DevOps</div>
              </div>
              <div className="metric">
                <div className="metric-num">185</div>
                <div className="metric-label">Salles TryHackMe</div>
              </div>
              <div className="metric">
                <div className="metric-num">C1</div>
                <div className="metric-label">Anglais · Gymglish</div>
              </div>
            </div>
          </div>

          <Terminal lines={buildTerminalLines(content)} title="~/grc-profile.sh — zsh" />
        </div>
      </section>

      {/* ============= ABOUT ============= */}
      <section id="about">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">// 01. À propos</span>
            <h2 className="section-title">
              Audit, risques, automatisation — <span className="grad">le triangle de la sécu durable.</span>
            </h2>
            <p className="section-sub">
              Mon objectif : structurer la gouvernance, traduire la réglementation en contrôles concrets,
              et automatiser leur vérification — pour que la sécurité tienne dans le temps, pas seulement
              le jour de l'audit.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-text" data-reveal>
              {profile.about.split(/\n+/).filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {currentExp && (
                <p>
                  <strong>Stage en cours :</strong> {currentExp.title} chez{" "}
                  <strong>{currentExp.company}</strong> ({currentExp.period}).
                </p>
              )}
            </div>

            <div className="focus-grid" data-reveal>
              <div className="focus">
                <span className="focus-icon">📋</span>
                <div className="focus-title">Audit &amp; Compliance</div>
                <div className="focus-desc">
                  ISO 27001 (SMSI), HDS, DORA, NIS 2, RGPD, CRA, NIST CSF.
                </div>
              </div>
              <div className="focus">
                <span className="focus-icon">🎯</span>
                <div className="focus-title">Risques</div>
                <div className="focus-desc">
                  EBIOS RM, AIPD, TPRM, PCA/PRA, comitologie, KPI/KRI.
                </div>
              </div>
              <div className="focus">
                <span className="focus-icon">⚙️</span>
                <div className="focus-title">DevSecOps</div>
                <div className="focus-desc">
                  Docker, K8s (GKE), GitHub Actions, Ansible, scanners.
                </div>
              </div>
              <div className="focus">
                <span className="focus-icon">🛡️</span>
                <div className="focus-title">Pentest &amp; CTI</div>
                <div className="focus-desc">
                  Burp, Nmap, sqlmap, Metasploit, OpenVAS, Nessus, MITRE ATT&amp;CK.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= PROJECTS ============= */}
      <section id="projects">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">// 02. Projets</span>
            <h2 className="section-title">Projets publiés.</h2>
            <p className="section-sub">
              Projets en environnement régulé (HDS / RGPD), CTI maison et travaux de pentest — filtrables
              par domaine.
            </p>
          </div>

          <div className="filters" data-reveal>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`filter-btn ${filter === f.id ? "active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}{" "}
                <span className="filter-count">
                  ({filterCounts[f.id] ?? 0})
                </span>
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

      {/* ============= EXPERIENCE ============= */}
      <section id="experience">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="section-eyebrow">// 03. Expérience</span>
            <h2 className="section-title">Parcours pro.</h2>
            <p className="section-sub">
              Trois stages complémentaires : audit M365 / RGPD, DevSecOps Kubernetes, audit pentest.
            </p>
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
                      {exp.location && <span className="tl-loc">— {exp.location}</span>}
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
            <span className="section-eyebrow">// 04. Stack technique</span>
            <h2 className="section-title">Compétences techniques.</h2>
            <p className="section-sub">
              Normes, analyse de risques, audit, sécurité applicative, outils de pentest et DevSecOps.
            </p>
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
            <span className="section-eyebrow">// 05. Formation &amp; certifications</span>
            <h2 className="section-title">Parcours académique &amp; certifs.</h2>
            <p className="section-sub">
              Cursus diplômant en France et au Maroc + certifications cyber en cours.
            </p>
          </div>

          <div className="certs">
            {content.certifications.map((c, i) => (
              <div key={c.id} className="cert" data-reveal>
                <div className="cert-icon">{CERT_ICONS[i % CERT_ICONS.length]}</div>
                <div>
                  <div className="cert-title">
                    {c.title}
                    {c.in_progress && <span className="cert-badge">En cours</span>}
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
            <span className="section-eyebrow">// 06. Centres d'intérêt</span>
            <h2 className="section-title">Hors clavier.</h2>
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
            <h2 className="contact-title">On échange ?</h2>
            <p className="contact-sub">
              Alternance Cybersécurité GRC dès septembre 2026 · rythme 3 sem. entreprise / 1 sem. école.
              Disponible pour des entretiens en visio ou sur Paris.
            </p>
            <div className="contact-actions">
              <a
                href={`mailto:${profile.email}?subject=Alternance%20Cybers%C3%A9curit%C3%A9%20GRC`}
                className="btn btn-primary"
              >
                ✉ {profile.email}
              </a>
              {cvUrl && (
                <a href={cvUrl} download className="btn btn-ghost">
                  📄 Télécharger mon CV
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  in · LinkedIn
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
              {profile.phone && <span>📞 {profile.phone}</span>}
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
                CV (PDF)
              </a>
            )}
          </div>
          <div>
            © {new Date().getFullYear()} {profile.full_name} · {profile.headline} ·{" "}
            {profile.location.split("·")[0]?.trim() || profile.location}
          </div>
        </div>
      </footer>
    </>
  );
}

function enrichBio(text: string): string {
  // met en gras quelques mots clés régulations pour aérer la lecture
  const KEY = [
    "ISO 27001",
    "HDS",
    "DORA",
    "NIS 2",
    "RGPD",
    "EBIOS",
    "GRC",
    "PSSI",
    "OWASP",
    "TPRM",
    "Cyber Resilience Act",
    "Mastère Architectures Systèmes, Réseaux & Sécurité",
    "Architectures Systèmes",
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
