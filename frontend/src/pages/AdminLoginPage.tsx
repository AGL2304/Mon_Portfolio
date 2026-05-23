import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="ornament-grid" />
      <div className="ornament-glow-1" />
      <div className="ornament-glow-2" />
      <main className="login-page">
        <div className="login-card">
          <h1>🔐 Espace administrateur</h1>
          <p>Édition du contenu du portfolio (profil, projets, expériences, CV, photo).</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {submitting ? "Connexion…" : "Se connecter →"}
            </button>
            {error && <div className="banner err">{error}</div>}
          </form>
          <p style={{ marginTop: 18, textAlign: "center" }}>
            <Link
              to="/"
              style={{ color: "var(--text-mute)", fontSize: 13, textDecoration: "none" }}
            >
              ← Retour au site
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
