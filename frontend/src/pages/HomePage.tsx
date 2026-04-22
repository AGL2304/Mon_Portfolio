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
          <div className="logo">{"</dev>"}</div>
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
              {content.experiences.map((experience) => (
                <article key={experience.id} className="panel">
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
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section id="competences" className="section section-alt">
          <div className="container">
            <h3 className="section-title">Competences</h3>
            <div className="card-grid skills">
              {content.skill_categories.map((category) => (
                <article key={category.id} className="panel">
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
              {content.certifications.map((certification) => (
                <article key={certification.id} className="panel">
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
              <article className="panel">
                <h4>Email</h4>
                <a href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
              </article>
              <article className="panel">
                <h4>GitHub</h4>
                <a href={content.profile.github_url} target="_blank" rel="noreferrer">
                  {content.profile.github_url}
                </a>
              </article>
              <article className="panel">
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
              {content.interests.map((interest) => (
                <article key={interest.id} className="panel">
                  <h4>{interest.title}</h4>
                  <p>{interest.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

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

