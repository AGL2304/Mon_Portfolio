import { addProject, removeProject, updateProject } from "./projectUtils";
import { emptyPortfolioContent, type Project } from "../types/portfolio";

const sampleProject: Project = {
  id: "sample",
  title: "Sample",
  date: "2026",
  categories: ["web"],
  description: "Sample project",
  technologies: ["React"],
  repository_url: "https://example.com",
  private_note: null,
};

describe("projectUtils", () => {
  it("adds a project", () => {
    const next = addProject(emptyPortfolioContent, sampleProject);
    expect(next.projects).toHaveLength(1);
    expect(next.projects[0].id).toBe("sample");
  });

  it("updates an existing project", () => {
    const initial = addProject(emptyPortfolioContent, sampleProject);
    const changed = {
      ...sampleProject,
      title: "Updated sample",
    };
    const next = updateProject(initial, changed);
    expect(next.projects[0].title).toBe("Updated sample");
  });

  it("removes a project", () => {
    const initial = addProject(emptyPortfolioContent, sampleProject);
    const next = removeProject(initial, "sample");
    expect(next.projects).toHaveLength(0);
  });
});

