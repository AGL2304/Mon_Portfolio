import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Toast, useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import {
  bustCache,
  deleteCV,
  deletePhoto,
  fetchAdminContent,
  saveAdminContent,
  uploadCV,
  uploadPhoto,
} from "../services/api";
import type {
  Certification,
  Experience,
  Interest,
  PortfolioContent,
  Project,
  SkillCategory,
} from "../types/portfolio";

type Tab =
  | "profile"
  | "media"
  | "experiences"
  | "projects"
  | "skills"
  | "certifications"
  | "interests"
  | "json";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profil", icon: "👤" },
  { id: "media", label: "Photo & CV", icon: "📎" },
  { id: "experiences", label: "Expériences", icon: "💼" },
  { id: "projects", label: "Projets", icon: "🚀" },
  { id: "skills", label: "Compétences", icon: "🧰" },
  { id: "certifications", label: "Formation", icon: "🎓" },
  { id: "interests", label: "Intérêts", icon: "✨" },
  { id: "json", label: "JSON brut", icon: "{}" },
];

export function AdminDashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast, show } = useToast();

  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [jsonDraft, setJsonDraft] = useState("");

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    fetchAdminContent(token)
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Erreur de chargement.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (content) setJsonDraft(JSON.stringify(content, null, 2));
  }, [content]);

  // Avertit l'utilisateur s'il essaie de fermer avec des changements non sauvegardés
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!token) return <Navigate to="/admin/login" replace />;

  function updateContent(patch: Partial<PortfolioContent>) {
    setContent((cur) => (cur ? { ...cur, ...patch } : cur));
    setDirty(true);
  }

  async function handleSave() {
    if (!content) return;
    try {
      const saved = await saveAdminContent(token, content);
      setContent(saved);
      setDirty(false);
      show("Modifications enregistrées ✓");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la sauvegarde.";
      setError(msg);
      show(msg, "err");
    }
  }

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  if (loading) return <main className="page-state">Chargement…</main>;
  if (error && !content)
    return (
      <main className="page-state error">
        Impossible de charger l'admin.
        <span>{error}</span>
      </main>
    );
  if (!content) return null;

  return (
    <>
      <div className="ornament-grid" />
      <div className="admin-shell">
        <header className="admin-topbar">
          <div>
            <h1>Administration Portfolio</h1>
            <small>
              {content.profile.full_name} · {content.profile.email}
            </small>
          </div>
          <div className="admin-actions">
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Voir le site
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={!dirty}
            >
              💾 Enregistrer{dirty ? " *" : ""}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </header>

        <div className="admin-container">
          {error && <div className="banner err">{error}</div>}

          <div className="admin-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`admin-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <ProfileTab content={content} onChange={(p) => updateContent({ profile: p })} />
          )}
          {tab === "media" && (
            <MediaTab
              content={content}
              token={token}
              onContent={(c) => {
                setContent(c);
                setDirty(false);
                show("Média mis à jour ✓");
              }}
              onError={(m) => show(m, "err")}
            />
          )}
          {tab === "experiences" && (
            <ExperiencesTab
              experiences={content.experiences}
              onChange={(experiences) => updateContent({ experiences })}
            />
          )}
          {tab === "projects" && (
            <ProjectsTab
              projects={content.projects}
              onChange={(projects) => updateContent({ projects })}
            />
          )}
          {tab === "skills" && (
            <SkillsTab
              skills={content.skill_categories}
              onChange={(skill_categories) => updateContent({ skill_categories })}
            />
          )}
          {tab === "certifications" && (
            <CertificationsTab
              certifications={content.certifications}
              onChange={(certifications) => updateContent({ certifications })}
            />
          )}
          {tab === "interests" && (
            <InterestsTab
              interests={content.interests}
              heroTags={content.hero_tags}
              onInterests={(interests) => updateContent({ interests })}
              onHeroTags={(hero_tags) => updateContent({ hero_tags })}
            />
          )}
          {tab === "json" && (
            <JsonTab
              draft={jsonDraft}
              onDraft={setJsonDraft}
              onApply={() => {
                try {
                  const parsed = JSON.parse(jsonDraft) as PortfolioContent;
                  setContent(parsed);
                  setDirty(true);
                  show("JSON appliqué — clique Enregistrer pour persister");
                } catch (err) {
                  show(err instanceof Error ? err.message : "JSON invalide", "err");
                }
              }}
            />
          )}
        </div>
      </div>
      <Toast toast={toast} />
    </>
  );
}

// ============================================================
//  TAB: PROFIL
// ============================================================
function ProfileTab({
  content,
  onChange,
}: {
  content: PortfolioContent;
  onChange: (p: PortfolioContent["profile"]) => void;
}) {
  const p = content.profile;
  function set<K extends keyof typeof p>(key: K, value: (typeof p)[K]) {
    onChange({ ...p, [key]: value });
  }

  return (
    <div className="admin-section">
      <h2>Informations personnelles</h2>
      <p className="section-help">
        Toutes ces données apparaissent dans le hero, le footer et la section contact. Le CV et la photo
        s'éditent dans l'onglet « Photo &amp; CV ».
      </p>
      <div className="admin-grid">
        <Field label="Nom complet" value={p.full_name} onChange={(v) => set("full_name", v)} />
        <Field label="Headline (rôle)" value={p.headline} onChange={(v) => set("headline", v)} />
        <Field
          label="Tagline (sous-titre nav)"
          value={p.tagline}
          onChange={(v) => set("tagline", v)}
        />
        <Field
          label="Disponibilité (eyebrow hero)"
          value={p.availability}
          onChange={(v) => set("availability", v)}
        />
        <Field
          label="Bio courte (hero)"
          value={p.short_bio}
          onChange={(v) => set("short_bio", v)}
          textarea
          full
        />
        <Field label="À propos (long)" value={p.about} onChange={(v) => set("about", v)} textarea full />
        <Field label="Email" value={p.email} onChange={(v) => set("email", v)} />
        <Field label="Téléphone" value={p.phone} onChange={(v) => set("phone", v)} />
        <Field label="Adresse" value={p.address} onChange={(v) => set("address", v)} full />
        <Field label="Localisation (résumée)" value={p.location} onChange={(v) => set("location", v)} />
        <Field
          label="Niveau d'anglais"
          value={p.english_level}
          onChange={(v) => set("english_level", v)}
        />
        <Field label="URL GitHub" value={p.github_url} onChange={(v) => set("github_url", v)} />
        <Field label="URL LinkedIn" value={p.linkedin_url} onChange={(v) => set("linkedin_url", v)} />
        <Field
          label="URL TryHackMe"
          value={p.tryhackme_url}
          onChange={(v) => set("tryhackme_url", v)}
          full
        />
      </div>
    </div>
  );
}

// ============================================================
//  TAB: PHOTO + CV
// ============================================================
function MediaTab({
  content,
  token,
  onContent,
  onError,
}: {
  content: PortfolioContent;
  token: string | null;
  onContent: (c: PortfolioContent) => void;
  onError: (msg: string) => void;
}) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [cvBusy, setCvBusy] = useState(false);

  const photoPreview = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile);
    return content.profile.profile_image ? bustCache(content.profile.profile_image) : "";
  }, [photoFile, content.profile.profile_image]);

  async function handlePhotoUpload() {
    if (!photoFile) return;
    setPhotoBusy(true);
    try {
      const res = await uploadPhoto(token, photoFile);
      onContent({
        ...content,
        profile: { ...content.profile, profile_image: bustCache(res.url) },
      });
      setPhotoFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erreur upload photo");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handlePhotoDelete() {
    if (!confirm("Supprimer la photo de profil actuelle ?")) return;
    setPhotoBusy(true);
    try {
      await deletePhoto(token);
      onContent({ ...content, profile: { ...content.profile, profile_image: "" } });
      setPhotoFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erreur suppression photo");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleCvUpload() {
    if (!cvFile) return;
    setCvBusy(true);
    try {
      const res = await uploadCV(token, cvFile);
      onContent({
        ...content,
        profile: { ...content.profile, cv_url: bustCache(res.url) },
      });
      setCvFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erreur upload CV");
    } finally {
      setCvBusy(false);
    }
  }

  async function handleCvDelete() {
    if (!confirm("Supprimer le CV actuel ?")) return;
    setCvBusy(true);
    try {
      await deleteCV(token);
      onContent({ ...content, profile: { ...content.profile, cv_url: "" } });
      setCvFile(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erreur suppression CV");
    } finally {
      setCvBusy(false);
    }
  }

  return (
    <>
      <div className="admin-section">
        <h2>Photo de profil</h2>
        <p className="section-help">
          JPG, PNG ou WEBP (max 5 MB). Sera affichée dans la navbar et dans le hero.
        </p>
        <div className="uploader-row">
          <div className="upload-preview-photo">
            {photoPreview ? (
              <img src={photoPreview} alt="Aperçu" />
            ) : (
              <span className="placeholder">Aucune photo</span>
            )}
          </div>
          <div>
            <input
              className="field-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handlePhotoUpload}
                disabled={!photoFile || photoBusy}
              >
                {photoBusy ? "Envoi…" : "📤 Uploader la photo"}
              </button>
              {content.profile.profile_image && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handlePhotoDelete}
                  disabled={photoBusy}
                >
                  🗑 Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>CV (PDF)</h2>
        <p className="section-help">
          Fichier PDF (max 10 MB). Le bouton « Télécharger mon CV » du site pointera vers ce fichier.
        </p>

        <div className={`cv-status ${content.profile.cv_url ? "" : "empty"}`}>
          {content.profile.cv_url ? (
            <>
              <span>
                ✅ CV actuel disponible :{" "}
                <a
                  href={content.profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  voir
                </a>
              </span>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCvDelete}
                disabled={cvBusy}
              >
                🗑 Supprimer
              </button>
            </>
          ) : (
            <span>Aucun CV publié pour le moment.</span>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <input
            className="field-input"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCvUpload}
              disabled={!cvFile || cvBusy}
            >
              {cvBusy ? "Envoi…" : "📤 Uploader le CV"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  TAB: EXPERIENCES (CRUD)
// ============================================================
function ExperiencesTab({
  experiences,
  onChange,
}: {
  experiences: Experience[];
  onChange: (xs: Experience[]) => void;
}) {
  function patch(id: string, p: Partial<Experience>) {
    onChange(experiences.map((e) => (e.id === id ? { ...e, ...p } : e)));
  }
  function remove(id: string) {
    if (!confirm("Supprimer cette expérience ?")) return;
    onChange(experiences.filter((e) => e.id !== id));
  }
  function add() {
    const id = `exp-${Date.now()}`;
    onChange([
      {
        id,
        title: "Nouveau poste",
        company: "Entreprise",
        location: "",
        period: "Mois Année — Mois Année",
        current: false,
        highlights: ["Réalisation 1"],
      },
      ...experiences,
    ]);
  }

  return (
    <div className="admin-section">
      <h2>Expériences professionnelles</h2>
      <p className="section-help">
        Les expériences marquées « En cours » affichent un point vert pulsant sur le site public.
      </p>
      <div className="add-item-row">
        <button className="btn btn-primary btn-sm" onClick={add}>
          ＋ Ajouter une expérience
        </button>
      </div>
      {experiences.map((exp) => (
        <div key={exp.id} className="list-item-card">
          <div className="list-item-head">
            <h3>
              {exp.title} · {exp.company}
              {exp.current && <span className="cert-badge">En cours</span>}
            </h3>
            <button className="btn btn-danger btn-sm" onClick={() => remove(exp.id)}>
              Supprimer
            </button>
          </div>
          <div className="admin-grid">
            <Field label="ID" value={exp.id} onChange={(v) => patch(exp.id, { id: v })} />
            <Field label="Titre" value={exp.title} onChange={(v) => patch(exp.id, { title: v })} />
            <Field
              label="Entreprise"
              value={exp.company}
              onChange={(v) => patch(exp.id, { company: v })}
            />
            <Field label="Ville" value={exp.location} onChange={(v) => patch(exp.id, { location: v })} />
            <Field label="Période" value={exp.period} onChange={(v) => patch(exp.id, { period: v })} />
            <div>
              <label className="field-label">En cours ?</label>
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => patch(exp.id, { current: e.target.checked })}
                />
                <span style={{ fontSize: 14, color: "var(--text-soft)" }}>
                  Affiche le badge vert pulse
                </span>
              </label>
            </div>
            <div className="full-width">
              <label className="field-label">Points clés</label>
              <BulletsEditor
                bullets={exp.highlights}
                onChange={(highlights) => patch(exp.id, { highlights })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BulletsEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (b: string[]) => void;
}) {
  function update(i: number, v: string) {
    onChange(bullets.map((b, idx) => (idx === i ? v : b)));
  }
  function remove(i: number) {
    onChange(bullets.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...bullets, ""]);
  }
  return (
    <div className="bullets-editor">
      {bullets.map((b, i) => (
        <div key={i} className="bullet-row">
          <textarea
            className="field-textarea"
            value={b}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            className="btn btn-danger btn-sm"
            onClick={() => remove(i)}
            style={{ alignSelf: "flex-start" }}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={add} style={{ alignSelf: "flex-start" }}>
        ＋ Ajouter un point
      </button>
    </div>
  );
}

// ============================================================
//  TAB: PROJECTS (CRUD)
// ============================================================
function ProjectsTab({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (p: Project[]) => void;
}) {
  function patch(id: string, p: Partial<Project>) {
    onChange(projects.map((x) => (x.id === id ? { ...x, ...p } : x)));
  }
  function remove(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    onChange(projects.filter((x) => x.id !== id));
  }
  function add() {
    onChange([
      {
        id: `project-${Date.now()}`,
        title: "Nouveau projet",
        date: String(new Date().getFullYear()),
        categories: ["web"],
        description: "Description du projet.",
        technologies: ["TypeScript"],
        repository_url: null,
        private_note: null,
      },
      ...projects,
    ]);
  }

  return (
    <div className="admin-section">
      <h2>Projets</h2>
      <p className="section-help">
        Catégories possibles : <code>grc</code>, <code>security</code>, <code>devops</code>,{" "}
        <code>web</code>, <code>game</code>. Séparer par des virgules. Si <em>URL du repo</em> est vide, le
        projet apparaîtra comme « privé » avec la note privée.
      </p>
      <div className="add-item-row">
        <button className="btn btn-primary btn-sm" onClick={add}>
          ＋ Ajouter un projet
        </button>
      </div>
      {projects.map((p) => (
        <div key={p.id} className="list-item-card">
          <div className="list-item-head">
            <h3>{p.title}</h3>
            <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>
              Supprimer
            </button>
          </div>
          <div className="admin-grid">
            <Field label="ID" value={p.id} onChange={(v) => patch(p.id, { id: v })} />
            <Field label="Titre" value={p.title} onChange={(v) => patch(p.id, { title: v })} />
            <Field label="Date" value={p.date} onChange={(v) => patch(p.id, { date: v })} />
            <Field
              label="Catégories (csv)"
              value={p.categories.join(", ")}
              onChange={(v) =>
                patch(p.id, {
                  categories: v.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Field
              label="Description"
              value={p.description}
              onChange={(v) => patch(p.id, { description: v })}
              textarea
              full
            />
            <Field
              label="Technologies (csv)"
              value={p.technologies.join(", ")}
              onChange={(v) =>
                patch(p.id, {
                  technologies: v.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              full
            />
            <Field
              label="URL du repo (vide si privé)"
              value={p.repository_url || ""}
              onChange={(v) => patch(p.id, { repository_url: v || null })}
            />
            <Field
              label="Note privée (si pas de repo)"
              value={p.private_note || ""}
              onChange={(v) => patch(p.id, { private_note: v || null })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
//  TAB: SKILLS / CERTIFS / INTERESTS
// ============================================================
function SkillsTab({
  skills,
  onChange,
}: {
  skills: SkillCategory[];
  onChange: (s: SkillCategory[]) => void;
}) {
  function patch(id: string, p: Partial<SkillCategory>) {
    onChange(skills.map((s) => (s.id === id ? { ...s, ...p } : s)));
  }
  function remove(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    onChange(skills.filter((s) => s.id !== id));
  }
  function add() {
    onChange([
      ...skills,
      { id: `skill-${Date.now()}`, title: "Nouvelle catégorie", items: ["Compétence"] },
    ]);
  }
  return (
    <div className="admin-section">
      <h2>Catégories de compétences</h2>
      <div className="add-item-row">
        <button className="btn btn-primary btn-sm" onClick={add}>
          ＋ Ajouter une catégorie
        </button>
      </div>
      {skills.map((s) => (
        <div key={s.id} className="list-item-card">
          <div className="list-item-head">
            <h3>{s.title}</h3>
            <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>
              Supprimer
            </button>
          </div>
          <div className="admin-grid">
            <Field label="ID" value={s.id} onChange={(v) => patch(s.id, { id: v })} />
            <Field label="Titre" value={s.title} onChange={(v) => patch(s.id, { title: v })} />
            <div className="full-width">
              <label className="field-label">Items (un par ligne)</label>
              <textarea
                className="field-textarea"
                value={s.items.join("\n")}
                onChange={(e) =>
                  patch(s.id, { items: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificationsTab({
  certifications,
  onChange,
}: {
  certifications: Certification[];
  onChange: (c: Certification[]) => void;
}) {
  function patch(id: string, p: Partial<Certification>) {
    onChange(certifications.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }
  function remove(id: string) {
    if (!confirm("Supprimer cette certification/formation ?")) return;
    onChange(certifications.filter((c) => c.id !== id));
  }
  function add() {
    onChange([
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        title: "Nouvelle certification",
        subtitle: "Organisme",
        description: "Description",
        in_progress: false,
      },
    ]);
  }
  return (
    <div className="admin-section">
      <h2>Formations &amp; certifications</h2>
      <div className="add-item-row">
        <button className="btn btn-primary btn-sm" onClick={add}>
          ＋ Ajouter
        </button>
      </div>
      {certifications.map((c) => (
        <div key={c.id} className="list-item-card">
          <div className="list-item-head">
            <h3>{c.title}</h3>
            <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
              Supprimer
            </button>
          </div>
          <div className="admin-grid">
            <Field label="ID" value={c.id} onChange={(v) => patch(c.id, { id: v })} />
            <Field label="Titre" value={c.title} onChange={(v) => patch(c.id, { title: v })} />
            <Field label="Sous-titre" value={c.subtitle} onChange={(v) => patch(c.id, { subtitle: v })} full />
            <Field
              label="Description"
              value={c.description}
              onChange={(v) => patch(c.id, { description: v })}
              textarea
              full
            />
            <div>
              <label className="field-label">En cours ?</label>
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={c.in_progress}
                  onChange={(e) => patch(c.id, { in_progress: e.target.checked })}
                />
                <span style={{ fontSize: 14, color: "var(--text-soft)" }}>
                  Affiche le badge « En cours »
                </span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InterestsTab({
  interests,
  heroTags,
  onInterests,
  onHeroTags,
}: {
  interests: Interest[];
  heroTags: string[];
  onInterests: (i: Interest[]) => void;
  onHeroTags: (t: string[]) => void;
}) {
  function patch(id: string, p: Partial<Interest>) {
    onInterests(interests.map((x) => (x.id === id ? { ...x, ...p } : x)));
  }
  function remove(id: string) {
    if (!confirm("Supprimer ce centre d'intérêt ?")) return;
    onInterests(interests.filter((x) => x.id !== id));
  }
  function add() {
    onInterests([
      ...interests,
      { id: `interest-${Date.now()}`, title: "Nouvel intérêt", description: "", emoji: "✨" },
    ]);
  }
  return (
    <>
      <div className="admin-section">
        <h2>Hero tags</h2>
        <p className="section-help">Tags affichés sous le titre du hero — un par ligne.</p>
        <textarea
          className="field-textarea"
          style={{ minHeight: 160 }}
          value={heroTags.join("\n")}
          onChange={(e) =>
            onHeroTags(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))
          }
        />
      </div>

      <div className="admin-section">
        <h2>Centres d'intérêt</h2>
        <div className="add-item-row">
          <button className="btn btn-primary btn-sm" onClick={add}>
            ＋ Ajouter
          </button>
        </div>
        {interests.map((it) => (
          <div key={it.id} className="list-item-card">
            <div className="list-item-head">
              <h3>
                {it.emoji} {it.title}
              </h3>
              <button className="btn btn-danger btn-sm" onClick={() => remove(it.id)}>
                Supprimer
              </button>
            </div>
            <div className="admin-grid">
              <Field label="ID" value={it.id} onChange={(v) => patch(it.id, { id: v })} />
              <Field label="Emoji" value={it.emoji} onChange={(v) => patch(it.id, { emoji: v })} />
              <Field label="Titre" value={it.title} onChange={(v) => patch(it.id, { title: v })} />
              <Field
                label="Description"
                value={it.description}
                onChange={(v) => patch(it.id, { description: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================================
//  TAB: JSON
// ============================================================
function JsonTab({
  draft,
  onDraft,
  onApply,
}: {
  draft: string;
  onDraft: (s: string) => void;
  onApply: () => void;
}) {
  return (
    <div className="admin-section">
      <h2>Édition JSON brute</h2>
      <p className="section-help">
        Édite directement le JSON complet du portfolio. Utile pour imports/exports massifs. Pense à
        cliquer <strong>Appliquer</strong> puis <strong>Enregistrer</strong>.
      </p>
      <textarea
        className="json-editor"
        spellCheck={false}
        value={draft}
        onChange={(e) => onDraft(e.target.value)}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" onClick={onApply}>
          ✓ Appliquer le JSON
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            const blob = new Blob([draft], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "portfolio-content.json";
            a.click();
            URL.revokeObjectURL(a.href);
          }}
        >
          ⬇ Exporter
        </button>
      </div>
    </div>
  );
}

// ============================================================
//  GENERIC FIELD
// ============================================================
function Field({
  label,
  value,
  onChange,
  textarea,
  full,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  full?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={full ? "full-width" : undefined}>
      <label className="field-label">{label}</label>
      {textarea ? (
        <textarea
          className="field-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="field-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

