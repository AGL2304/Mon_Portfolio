# Mon_Portfolio — Georges Lionel ANANI

> **Monorepo** organisé en 3 services indépendants (`db/`, `backend/`, `frontend/`),
> chacun deployable séparément. Cible : pouvoir splitter en 3 repos d'une
> **GitHub organization** sans refactor — chaque dossier est self-contained.

[![CI](https://github.com/AGL2304/Mon_Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/AGL2304/Mon_Portfolio/actions/workflows/ci.yml)
[![Made with](https://img.shields.io/badge/stack-React%20%2B%20FastAPI%20%2B%20Postgres-8B5CF6)](#-architecture)
[![License](https://img.shields.io/badge/license-MIT-10B981)](LICENSE)
[![Security](https://img.shields.io/badge/security-policy-EF4444)](SECURITY.md)

---

## 🌐 Démo en ligne

- 🌍 **Site** (FR/EN switch dans la nav) — _déploiement à venir_ → `https://portfolio.agl-anani.dev/`
- 🧪 **Admin** — _déploiement à venir_ → `https://portfolio.agl-anani.dev/admin/login`
- 📂 **Livrables GRC** — _déploiement à venir_ → `https://portfolio.agl-anani.dev/grc/`

| Hero français | Hero anglais |
|---|---|
| ![Hero FR](frontend/public/screenshots/portfolio-hero-fr.png) | ![Hero EN](frontend/public/screenshots/portfolio-hero-en.png) |

---

## 🏗️ Architecture multi-déploiement

```
Mon_Portfolio/                      ← monorepo orchestrateur
├── docker-compose.yml              ← lance les 3 services ensemble
├── .env.example                    ← env partagé pour run all-in-one
│
├── db/                             ✨ Service 1 — PostgreSQL 16
│   ├── Dockerfile                  → extends postgres:16-alpine
│   ├── docker-compose.yml          → standalone
│   ├── init/                       → scripts SQL d'init
│   └── README.md
│
├── backend/                        ✨ Service 2 — FastAPI + GRC
│   ├── app/                        → API REST
│   ├── grc/                        → livrables Markdown/CSV servis sur /grc/
│   ├── seed/                       → CV PDFs + photo de demarrage
│   ├── Dockerfile
│   ├── docker-compose.yml          → standalone (DB externe)
│   └── README.md
│
└── frontend/                       ✨ Service 3 — React + nginx
    ├── src/                        → app React (bilingue FR/EN)
    ├── public/                     → favicon, screenshots
    ├── e2e/                        → tests Playwright
    ├── Dockerfile
    ├── docker-compose.yml          → standalone (backend externe)
    ├── nginx.conf                  → proxy /api/ et /grc/ vers backend
    └── README.md
```

**Communication entre services** : 100 % via API REST.
- `frontend` → `backend` : `/api/*` (CRUD contenu) et `/grc/*` (livrables)
- `backend` → `db` : `DATABASE_URL` (PostgreSQL)
- Aucun couplage de fichier entre les 3 dossiers (sauf le compose racine qui les orchestre)

---

## ⚡ Démarrage rapide

### Option A — Tout-en-un (recommandé pour démo)

```bash
cp .env.example .env
# Editer ADMIN_PASSWORD, JWT_SECRET, POSTGRES_PASSWORD
docker compose up --build
```

- 🌐 **Site** : http://localhost:3000
- 🔌 **API** : http://localhost:8000/api (`/docs` pour Swagger)
- 📂 **GRC** : http://localhost:3000/grc/
- 🔐 **Admin** : http://localhost:3000/admin/login
- 🗄️ **DB** : `psql -h localhost -p 5432 -U portfolio -d portfolio`

### Option B — Service par service (pour deploy séparé)

Chaque dossier a son propre `docker-compose.yml` autonome :

```bash
# Lancer juste la DB
cd db && docker compose up --build

# Dans un autre terminal, le backend (pointe vers la DB locale)
cd backend && cp .env.example .env && docker compose up --build

# Dans un autre terminal, le frontend (pointe vers le backend)
cd frontend && cp .env.example .env && docker compose up --build
```

Voir le README de chaque dossier pour les détails et options de déploiement.

---

## 🚀 Déploiement séparé (3 repos GitHub)

L'architecture est conçue pour passer facilement à **3 repos distincts**
dans une **GitHub organization** (`portfolio-org/db`, `portfolio-org/backend`,
`portfolio-org/frontend`).

### Splitter chaque dossier en repo dédié

```bash
# Backend
git clone <monorepo-url> /tmp/portfolio-backend-extract
cd /tmp/portfolio-backend-extract
git filter-repo --subdirectory-filter backend/
git remote add origin git@github.com:portfolio-org/backend.git
git push -u origin main

# Idem pour frontend/ et db/
```

`git filter-repo` réécrit l'historique pour ne garder que les commits qui
ont touché ce dossier, et déplace tous les fichiers à la racine du nouveau
repo. Le Dockerfile et les CI continuent de marcher tels quels.

### Matrice de déploiement recommandée

| Service | Provider recommandé | Coût | Alternative |
|---|---|---|---|
| **db** | Supabase / Neon | Free tier | Railway DB · Render DB · self-hosted |
| **backend** | Railway · Render · Fly.io | ~5$/mo | Self-hosted Docker |
| **frontend** | Vercel · Cloudflare Pages | Free tier | Self-hosted nginx |

---

## 🧱 Stack par service

| Service | Technologies |
|---|---|
| **db** | PostgreSQL 16 alpine · init SQL scripts |
| **backend** | Python 3.12 · FastAPI 0.115 · SQLAlchemy 2 · JWT · pytest · ruff |
| **frontend** | React 18 · TypeScript 5.7 · Vite 5 · nginx 1.27 · Playwright · ESLint + Prettier |
| **CI/CD** | GitHub Actions (path filters par service) · GitLab CI miroir |
| **SEO** | JSON-LD `Person` + `ProfilePage` · OG + Twitter Cards · favicon SVG · meta lang dynamique |

---

## 🌍 Internationalisation (FR / EN)

Frontend React expose un **toggle FR ↔ EN** :
- Bascule **instantanément** toute l'UI sans rechargement
- Met à jour `<html lang="…">` (SEO)
- Persiste dans `localStorage`
- Détection auto navigateur au premier visit (fallback FR)

Voir [`frontend/README.md`](frontend/README.md#internationalisation-fr--en) pour les détails.

---

## 🔐 Espace admin

L'interface `/admin/login` permet (après authentification JWT) de modifier
en direct profil, projets, expériences, compétences, certifications, CV, photo.

> ⚠️ Change `ADMIN_PASSWORD` et `JWT_SECRET` **avant** tout déploiement.
> Générer un secret fort : `python -c "import secrets; print(secrets.token_urlsafe(64))"`

---

## 📂 Livrables GRC

Templates open-source MIT pour missions Gouvernance Risques & Conformité :
matrice ISO 27001:2022 (93 contrôles), template EBIOS Risk Manager,
registre RGPD, modèle PSSI.

Accessibles depuis :
- la section GRC native dans le portfolio (`/#grc`)
- l'URL `/grc/` (listée par `GET /api/grc/files`)
- directement sur [GitHub](https://github.com/AGL2304/Mon_Portfolio/tree/main/backend/grc)

Voir [`backend/grc/README.md`](backend/grc/README.md).

---

## 🧪 Tests & qualité

```bash
# Backend
cd backend
ruff check . && ruff format --check . && pytest -q

# Frontend
cd frontend
npm run lint && npm run format:check && npm test && npm run build
npm run e2e            # Playwright
```

---

## 📖 À propos

Réalisé par **Georges Lionel ANANI** — Étudiant M1 Architecte des SI à
l'École-IT (option DevOps & Cybersécurité).

- 🐙 GitHub : [@AGL2304](https://github.com/AGL2304)
- 💼 LinkedIn : [Georges Lionel ANANI](https://www.linkedin.com/in/georges-lionel-c-a-anani-35256618b)
- ✉️ Email : [charbelazon23@gmail.com](mailto:charbelazon23@gmail.com)
- 📍 Île-de-France · École à Amiens

---

<div align="center">
  <sub>Construit avec ♥ et un peu de café · MIT License</sub>
</div>
