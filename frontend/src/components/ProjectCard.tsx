import type { HTMLAttributes } from "react";
import type { Project } from "../types/portfolio";

type ProjectCardProps = HTMLAttributes<HTMLElement> & {
  project: Project;
};

export function ProjectCard({ project, ...rest }: ProjectCardProps) {
  return (
    <article className="project-card" {...rest}>
      <div className="project-header">
        <h3>{project.title}</h3>
        <span>{project.date}</span>
      </div>
      <p>{project.description}</p>
      <div className="tag-list">
        {project.technologies.map((tech) => (
          <span key={`${project.id}-${tech}`} className="chip">
            {tech}
          </span>
        ))}
      </div>
      {project.repository_url ? (
        <a href={project.repository_url} target="_blank" rel="noreferrer" className="project-link">
          Voir le repo
        </a>
      ) : null}
    </article>
  );
}

