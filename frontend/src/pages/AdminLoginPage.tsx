import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage, useT } from "../context/LanguageContext";

export function AdminLoginPage() {
  const t = useT();
  const { lang, toggleLang } = useLanguage();
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
      setError(err instanceof Error ? err.message : t.adminLogin.fallbackError);
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={toggleLang}
              title={lang === "fr" ? t.common.switchToEN : t.common.switchToFR}
              style={{
                background: "transparent",
                border: "1px solid var(--border-strong)",
                color: "var(--text-soft)",
                padding: "4px 10px",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </div>
          <h1>{t.adminLogin.heading}</h1>
          <p>{t.adminLogin.sub}</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="email">
                {t.adminLogin.labelEmail}
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
                {t.adminLogin.labelPassword}
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
              {submitting ? t.adminLogin.submitting : t.adminLogin.submit}
            </button>
            {error && <div className="banner err">{error}</div>}
          </form>
          <p style={{ marginTop: 18, textAlign: "center" }}>
            <Link
              to="/"
              style={{ color: "var(--text-mute)", fontSize: 13, textDecoration: "none" }}
            >
              {t.adminLogin.backToSite}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
