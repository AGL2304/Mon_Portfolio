import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAdminContent, saveAdminContent } from "../services/api";
import { addProject, removeProject } from "../services/projectUtils";
import type { PortfolioContent, Project } from "../types/portfolio";

export function AdminDashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("");
  const [jsonDraft, setJsonDraft] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    fetchAdminContent(token)
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
  }, [token]);

  useEffect(() => {
    if (content) {
      setJsonDraft(JSON.stringify(content, null, 2));
    }
  }, [content]);

  if (!token) {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  async function handleSave() {
    if (!content) {
      return;
    }
    setSaveState("Enregistrement en cours...");
    setError("");
    try {
      const saved = await saveAdminContent(token, content);
      setContent(saved);
      setSaveState("Sauvegarde effectuee.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur pendant la sauvegarde.";
      setError(message);
      setSaveState("");
    }
  }

  function updateProfileField(field: keyof PortfolioContent["profile"], value: string) {
    if (!content) {
      return;
    }
    setContent({
      ...content,
      profile: {
        ...content.profile,
        [field]: value,
      },
    });
  }

  function handleProjectField(projectId: string, field: keyof Project, value: string) {
    if (!content) {
      return;
    }
    setContent({
      ...content,
      projects: content.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        if (field === "categories") {
          return {
            ...project,
            categories: value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          };
        }
        if (field === "technologies") {
          return {
            ...project,
            technologies: value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          };
        }
        if (field === "repository_url") {
          return {
            ...project,
            repository_url: value,
          };
        }
        if (field === "title") {
          return { ...project, title: value };
        }
        if (field === "id") {
          return { ...project, id: value };
        }
        if (field === "date") {
          return { ...project, date: value };
        }
        if (field === "description") {
          return { ...project, description: value };
        }
        return project;
      }),
    });
  }

  function handleAddProject() {
    if (!content) {
      return;
    }
    const project: Project = {
      id: `project-${Date.now()}`,
      title: "Nouveau projet",
      date: "2026",
      categories: ["web"],
      description: "Description du projet",
      technologies: ["React", "FastAPI"],
      repository_url: "",
    };
    setContent(addProject(content, project));
  }

  function handleDeleteProject(projectId: string) {
    if (!content) {
      return;
    }
    setContent(removeProject(content, projectId));
  }

  function handleApplyJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as PortfolioContent;
      setContent(parsed);
      setSaveState("JSON applique. Clique sur Sauvegarder pour persister.");
      setError("");
    } catch {
      setError("JSON invalide. Verifie la syntaxe.");
    }
  }

  if (loading) {
    return <main className="page-state">Chargement de l'espace admin...</main>;
  }

  if (!content) {
    return (
      <main className="page-state error">
        Impossible de charger les donnees admin.
        <span>{error}</span>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <h1>Administration Portfolio</h1>
        <div className="admin-topbar-actions">
          <button onClick={handleSave}>Sauvegarder</button>
          <button className="ghost" onClick={handleLogout}>
            Deconnexion
          </button>
        </div>
      </header>

      {saveState ? <p className="success-text">{saveState}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <section className="admin-section">
        <h2>Profil</h2>
        <div className="admin-grid two-columns">
          <label>
            Nom complet
            <input
              value={content.profile.full_name}
              onChange={(event) => updateProfileField("full_name", event.target.value)}
            />
          </label>
          <label>
            Titre
            <input
              value={content.profile.headline}
              onChange={(event) => updateProfileField("headline", event.target.value)}
            />
          </label>
          <label className="full-width">
            URL Image Profil
            <input
              value={content.profile.profile_image}
              onChange={(event) => updateProfileField("profile_image", event.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <label className="full-width">
            Bio courte
            <textarea
              value={content.profile.short_bio}
              onChange={(event) => updateProfileField("short_bio", event.target.value)}
            />
          </label>
          <label className="full-width">
            A propos
            <textarea
              value={content.profile.about}
              onChange={(event) => updateProfileField("about", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              value={content.profile.email}
              onChange={(event) => updateProfileField("email", event.target.value)}
            />
          </label>
          <label>
            Localisation
            <input
              value={content.profile.location}
              onChange={(event) => updateProfileField("location", event.target.value)}
            />
          </label>
          <label>
            URL GitHub
            <input
              value={content.profile.github_url}
              onChange={(event) => updateProfileField("github_url", event.target.value)}
            />
          </label>
          <label>
            URL LinkedIn
            <input
              value={content.profile.linkedin_url}
              onChange={(event) => updateProfileField("linkedin_url", event.target.value)}
            />
          </label>
          <label>
            URL CV
            <input
              value={content.profile.cv_url}
              onChange={(event) => updateProfileField("cv_url", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <div className="row-between">
          <h2>Projets</h2>
          <button onClick={handleAddProject}>Ajouter un projet</button>
        </div>
        <div className="admin-card-list">
          {content.projects.map((project) => (
            <article key={project.id} className="admin-card">
              <div className="row-between">
                <h3>{project.title}</h3>
                <button className="danger" onClick={() => handleDeleteProject(project.id)}>
                  Supprimer
                </button>
              </div>
              <div className="admin-grid two-columns">
                <label>
                  ID
                  <input
                    value={project.id}
                    onChange={(event) => handleProjectField(project.id, "id", event.target.value)}
                  />
                </label>
                <label>
                  Titre
                  <input
                    value={project.title}
                    onChange={(event) => handleProjectField(project.id, "title", event.target.value)}
                  />
                </label>
                <label>
                  Date
                  <input
                    value={project.date}
                    onChange={(event) => handleProjectField(project.id, "date", event.target.value)}
                  />
                </label>
                <label>
                  Categories (comma-separated)
                  <input
                    value={project.categories.join(", ")}
                    onChange={(event) =>
                      handleProjectField(project.id, "categories", event.target.value)
                    }
                  />
                </label>
                <label className="full-width">
                  Description
                  <textarea
                    value={project.description}
                    onChange={(event) =>
                      handleProjectField(project.id, "description", event.target.value)
                    }
                  />
                </label>
                <label className="full-width">
                  Technologies (comma-separated)
                  <input
                    value={project.technologies.join(", ")}
                    onChange={(event) =>
                      handleProjectField(project.id, "technologies", event.target.value)
                    }
                  />
                </label>
                <label className="full-width">
                  URL repo
                  <input
                    value={project.repository_url ?? ""}
                    onChange={(event) =>
                      handleProjectField(project.id, "repository_url", event.target.value)
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Edition JSON complete</h2>
        <p>
          Cette zone permet de modifier aussi les experiences, competences, certifications et centres
          d'interet.
        </p>
        <textarea
          className="json-editor"
          value={jsonDraft}
          onChange={(event) => setJsonDraft(event.target.value)}
        />
        <div className="row-between">
          <button onClick={handleApplyJson}>Appliquer JSON</button>
          <button onClick={handleSave}>Sauvegarder</button>
        </div>
      </section>
    </main>
  );
}
