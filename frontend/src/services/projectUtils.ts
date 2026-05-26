import type { PortfolioContent, Project } from "../types/portfolio";

export function addProject(content: PortfolioContent, project: Project): PortfolioContent {
  return {
    ...content,
    projects: [...content.projects, project],
  };
}

export function updateProject(content: PortfolioContent, project: Project): PortfolioContent {
  return {
    ...content,
    projects: content.projects.map((item) => (item.id === project.id ? project : item)),
  };
}

export function removeProject(content: PortfolioContent, projectId: string): PortfolioContent {
  return {
    ...content,
    projects: content.projects.filter((project) => project.id !== projectId),
  };
}
