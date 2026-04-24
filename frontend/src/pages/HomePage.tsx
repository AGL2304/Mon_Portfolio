import { useEffect, useMemo, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { fetchPublicContent } from "../services/api";
import type { PortfolioContent } from "../types/portfolio";

const categoryLabels: Record<string, string> = {
  all: "Tous",
  devops: "DevOps",
  security: "Securite",
  web: "Web",
  ai: "IA",
};

export function HomePage() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchPublicContent()
      .then((data) => {
        if (mounted) {
          setContent(data);
        }
      })
      .catch((err: Error) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!content) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-scroll]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  const categories = useMemo(() => {
    if (!content) {
      return ["all"];
    }
    const fromProjects = new Set(content.projects.flatMap((project) => project.categories));
    return ["all", ...Array.from(fromProjects)];
  }, [content]);

  const visibleProjects = useMemo(() => {
    if (!content) {
      return [];
    }
    if (activeCategory === "all") {
      return content.projects;
    }
    return content.projects.filter((project) => project.categories.includes(activeCategory));
  }, [activeCategory, content]);

  if (loading) {
    return <main className="page-state">Chargement du portfolio...</main>;
  }

  if (error || !content) {
    return (
      <main className="page-state error">
        Impossible de charger le portfolio.
        <span>{error}</span>
      </main>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container row-between">
          <a href="#" className="logo">{"</dev>"}</a>
          <nav>
            <a href="#apropos">A propos</a>
            <a href="#experience">Experiences</a>
            <a href="#projets">Projets</a>
            <a href="#competences">Competences</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            {content.profile.profile_image && (
              <div className="hero-image">
                <img src={content.profile.profile_image} alt="Profile" />
              </div>
            )}
            <p className="eyebrow">Portfolio</p>
            <h1>{content.profile.full_name}</h1>
            <h2>{content.profile.headline}</h2>
            <p className="hero-text">{content.profile.short_bio}</p>
            <div className="tag-list">
              {content.hero_tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            {content.profile.cv_url && content.profile.cv_url !== "#" && (
              <a
                href={content.profile.cv_url}
                className="cv-download"
                target="_blank"
                rel="noreferrer"
                download
              >
                ↓ Télécharger le CV
              </a>
            )}
          </div>
        </section>

        <section id="apropos" className="section">
          <div className="container">
            <h3 className="section-title">A propos</h3>
            <p className="section-text">{content.profile.about}</p>
            <p className="section-subtext">
              {content.profile.location} | {content.profile.email}
            </p>
          </div>
        </section>

        <section id="experience" className="section section-alt">
          <div className="container">
            <h3 className="section-title">Experiences</h3>
            <div className="card-grid">
              {content.experiences.map((experience, idx) => (
                <article
                  key={experience.id}
                  className="panel"
                  data-scroll=""
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="row-between">
                    <h4>{experience.title}</h4>
                    <span className="muted">{experience.period}</span>
                  </div>
                  <p className="accent">{experience.company}</p>
                  <ul className="clean-list">
                    {experience.highlights.map((point) => (
                      <li key={`${experience.id}-${point}`}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projets" className="section">
          <div className="container">
            <h3 className="section-title">Projets</h3>
            <div className="filter-row">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "filter active" : "filter"}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category] ?? category}
                </button>
              ))}
            </div>
            <div className="card-grid projects">
              {visibleProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  data-scroll=""
                  style={{ transitionDelay: `${idx * 0.08}s` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="competences" className="section section-alt">
          <div className="container">
            <h3 className="section-title">Competences</h3>
            <div className="card-grid skills">
              {content.skill_categories.map((category, idx) => (
                <article
                  key={category.id}
                  className="panel"
                  data-scroll=""
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <h4>{category.title}</h4>
                  <ul className="clean-list">
                    {category.items.map((item) => (
                      <li key={`${category.id}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h3 className="section-title">Certifications</h3>
            <div className="card-grid">
              {content.certifications.map((certification, idx) => (
                <article
                  key={certification.id}
                  className="panel"
                  data-scroll=""
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <h4>{certification.title}</h4>
                  <p className="accent">{certification.subtitle}</p>
                  <p>{certification.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section section-alt">
          <div className="container">
            <h3 className="section-title">Contact</h3>
            <div className="card-grid">
              <article className="panel" data-scroll="">
                <h4>Email</h4>
                <a href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
              </article>
              <article className="panel" data-scroll="" style={{ transitionDelay: "0.1s" }}>
                <h4>GitHub</h4>
                <a href={content.profile.github_url} target="_blank" rel="noreferrer">
                  {content.profile.github_url}
                </a>
              </article>
              <article className="panel" data-scroll="" style={{ transitionDelay: "0.2s" }}>
                <h4>LinkedIn</h4>
                <a href={content.profile.linkedin_url} target="_blank" rel="noreferrer">
                  {content.profile.linkedin_url}
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h3 className="section-title">Centres d'interet</h3>
            <div className="card-grid interests">
              {content.interests.map((interest, idx) => (
                <article
                  key={interest.id}
                  className="panel"
                  data-scroll=""
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <h4>{interest.title}</h4>
                  <p>{interest.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <button
        className={`scroll-to-top${scrolled ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut"
      >
        ↑
      </button>

      <footer className="site-footer">
        <div className="container row-between">
          <p>© 2026 {content.profile.full_name}</p>
          <a href="/admin/login" className="admin-link">
            Zone privee
          </a>
        </div>
      </footer>
    </>
  );
}

