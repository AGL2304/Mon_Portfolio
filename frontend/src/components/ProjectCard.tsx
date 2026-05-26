import type { Project } from "../types/portfolio";

const CAT_LABEL: Record<string, string> = {
  grc: "GRC",
  security: "Sécurité",
  devops: "DevOps",
  web: "Web",
  game: "Lab",
};

function catClass(cats: string[]): string {
  if (cats.includes("grc")) return "cat-grc";
  if (cats.includes("security")) return "cat-security";
  if (cats.includes("devops")) return "cat-devops";
  if (cats.includes("game")) return "cat-game";
  return "cat-web";
}

function primaryCat(cats: string[]): string {
  if (cats.includes("grc")) return CAT_LABEL.grc;
  if (cats.includes("security")) return CAT_LABEL.security;
  if (cats.includes("devops")) return CAT_LABEL.devops;
  if (cats.includes("game")) return CAT_LABEL.game;
  return CAT_LABEL.web;
}

interface ProjectCardProps {
  project: Project;
  delayMs?: number;
}

export function ProjectCard({ project, delayMs = 0 }: ProjectCardProps) {
  return (
    <article
      className={`project ${catClass(project.categories)}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="project-head">
        <div>
          <div className="project-cat">
            <span className="project-cat-dot" />
            {primaryCat(project.categories)}
          </div>
          <h3 className="project-title" style={{ marginTop: 6 }}>
            {project.title}
          </h3>
        </div>
        <span className="project-date">{project.date}</span>
      </div>

      <p className="project-desc">{project.description}</p>

      <div className="tech-row">
        {project.technologies.map((tech) => (
          <span key={`${project.id}-${tech}`} className="tech">
            {tech}
          </span>
        ))}
      </div>

      <div className="project-foot">
        {project.repository_url ? (
          <>
            <a
              className="project-link"
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur GitHub →
            </a>
            <span className="project-stars">open source</span>
          </>
        ) : (
          <>
            <span className="project-private">🔒 {project.private_note || "Projet privé"}</span>
            <span className="project-stars">privé</span>
          </>
        )}
      </div>
    </article>
  );
}
