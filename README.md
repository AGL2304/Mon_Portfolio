# Mon_Portfolio - Georges Lionel ANANI

> Portfolio full-stack **React + FastAPI** pour un **Alternant Cybersécurité GRC** (Gouvernance, Risques & Conformité).
> Page publique bilingue FR/EN + back-office d'administration JWT. CV PDF téléchargeable, design premium dark-tech, livrables GRC open-source.
> Expérience immersive maison : ambiance audio générative, fond audio-réactif, timeline d'expériences en fil sinueux et formulaire de contact.

[![CI](https://github.com/AGL2304/Mon_Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/AGL2304/Mon_Portfolio/actions/workflows/ci.yml)
[![Made with](https://img.shields.io/badge/stack-React%20%2B%20FastAPI-8B5CF6)](#-stack)
[![License](https://img.shields.io/badge/license-MIT-10B981)](frontend/LICENSE)

---

## 🌐 Démo en ligne (LIVE 🟢)

- 🌍 **Site** (FR/EN switch dans la nav) → **https://mon-portfolio-mocha-ten.vercel.app/**
- 🧪 **Admin** → https://mon-portfolio-mocha-ten.vercel.app/admin/login
- 📂 **Livrables GRC** → https://mon-portfolio-mocha-ten.vercel.app/grc/
- 🔌 **API backend** (Render) → https://mon-portfolio-5ati.onrender.com/docs

### Architecture 3 tiers en production

```
Navigateur
    │
    ▼
Vercel (frontend React) ──rewrites /api/* + /grc/*──▶ Render (FastAPI) ──▶ Neon.tech (Postgres serverless)
```

![Screenshot prod live](frontend/public/screenshots/prod-vercel-home.png)

> ℹ️ Capture du site en production le `2026-05-29` | bascule FR↔EN native sans rechargement, section GRC, terminal animé.

---

## 🎯 Aperçu

Ce repo héberge **deux livrables complémentaires** :

1. **Une stack React + FastAPI complète** (dossiers `frontend/` et `backend/`) avec :
   - Site public **bilingue FR / EN** (toggle sans rechargement, persisté en `localStorage`)
   - Interface d'administration **JWT** pour éditer profil / projets / expériences / compétences à chaud
   - Section **GRC** intégrée pointant vers les livrables `/grc/`
   - **Expérience UI immersive** : ambiance audio générative (Web Audio), fond audio-réactif, timeline en fil sinueux, formulaire de contact mailto
2. **Dossier [`frontend/grc/`](frontend/grc/)** : livrables types Gouvernance Risques & Conformité (matrice ISO 27001 Annexe A, template EBIOS RM, registre RGPD, modèle PSSI), open-source, MIT.

| Composant | Cible | Quand l'utiliser |
|---|---|---|
| App React + FastAPI | Visiteurs / recruteurs / édition à chaud | Production |
| Livrables GRC (`frontend/grc/`) | Recruteurs, étudiants, PME sans RSSI | Réutiliser comme socle de mission |

---

## 🧱 Stack

- **Frontend** : React 18 + TypeScript + Vite + CSS modulaire | **i18n maison** (FR/EN, sans dépendance externe) | **UI immersive maison** (Web Audio API, Canvas 2D, SVG inline)
- **Backend** : FastAPI + SQLAlchemy + PostgreSQL (SQLite en tests) + JWT
- **Conteneurisation** : Docker + Docker Compose par tier | nginx sert React + `/grc/` + `/assets/` + proxy `/api/`
- **CI/CD** : GitHub Actions (`.github/workflows/ci.yml`)
- **Tests** : `pytest` (backend) | `vitest` (frontend unitaire) | **Playwright** (E2E)
- **Qualité** : `ruff` (Python) | `eslint` + `prettier` (TS/JS)
- **SEO** : JSON-LD `Person` + `ProfilePage` | OpenGraph + Twitter Cards | favicon SVG dégradé | meta `lang` dynamique
- **Déploiement** : Vercel (frontend | `frontend/vercel.json`)

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI GitHub Actions
├── backend/                        # FastAPI + SQLAlchemy + JWT
│   ├── app/
│   │   ├── main.py                 # routes API (auth, content, uploads, health)
│   │   ├── config.py               # Pydantic settings
│   │   ├── models.py               # SQLAlchemy
│   │   ├── schemas.py              # Pydantic
│   │   ├── database.py             # moteur SQLAlchemy, session
│   │   ├── security.py             # JWT, hashing
│   │   ├── crud.py                 # opérations CRUD
│   │   └── seed_data.py            # données par défaut
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   └── test_content.py
│   ├── grc/                        # livrables GRC (miroir de frontend/grc/)
│   ├── pyproject.toml              # ruff + pytest config
│   ├── compose.yml
│   ├── Dockerfile
│   └── requirements.txt
├── db/                             # PostgreSQL 15 + Adminer
│   └── compose.yml
├── frontend/                       # React 18 + TS + Vite + Nginx
│   ├── src/
│   │   ├── pages/                  # HomePage, AdminDashboardPage, AdminLoginPage
│   │   ├── components/             # ProjectCard, Terminal, MusicPlayer, AudioReactiveBackground, HeroCanvas, CustomCursor, ScrollProgress, TechMarquee, CountUp, InteractiveCards
│   │   ├── audio/                  # audioEngine.ts (Web Audio génératif, AnalyserNode partagé)
│   │   ├── context/                # AuthContext, LanguageContext
│   │   ├── i18n/                   # translations.ts (dictionnaire FR + EN typé)
│   │   ├── services/               # api.ts, utilitaires
│   │   ├── types/                  # Interfaces TypeScript
│   │   └── styles/                 # global.css
│   ├── e2e/                        # tests Playwright
│   ├── assets/                     # photo, CV PDF, favicon, screenshots
│   │   ├── profile.jpg
│   │   ├── favicon.svg             # logo dégradé violet→cyan
│   │   ├── screenshots/            # captures pour README
│   │   ├── CV_Georges_Lionel_ANANI_GRC.pdf
│   │   └── CV_Georges_Lionel_ANANI_GRC_complet.pdf
│   ├── grc/                        # livrables GRC publics (ISO 27001, EBIOS RM, RGPD, PSSI)
│   │   ├── README.md
│   │   ├── iso-27001-control-matrix.{md,csv}
│   │   ├── ebios-rm-template.md
│   │   ├── registre-traitements-rgpd.csv
│   │   └── pssi-modele.md
│   ├── Dockerfile                  # build multi-stage Node → Nginx
│   ├── compose.yml
│   ├── nginx.conf
│   └── vercel.json
└── README.md
```

---

## ⚡ Démarrage rapide

### Option A : Stack par tier avec Docker Compose

```bash
# 1. Créer le réseau Docker partagé
docker network create portfolio-net

# 2. Base de données (PostgreSQL + Adminer)
cd db && docker compose up -d

# 3. Backend (adapter les variables d'environnement)
cd ../backend
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=changeme \
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))") \
DATABASE_URL=postgresql://portfolio:portfolio@portfolio-db:5432/portfolio \
docker compose up -d

# 4. Frontend
cd ../frontend && docker compose up -d
```

- 🌐 **Site** : http://localhost:3000 (clic sur `EN` dans la nav pour basculer en anglais)
- 📂 **Livrables GRC** : http://localhost:3000/grc/ (listing nginx)
- 🔌 **API** : http://localhost:8000/api
- 🔐 **Admin** : http://localhost:3000/admin/login
- 🗄️ **Adminer** : http://localhost:8080

### Option B : En local sans Docker

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate            # Linux/macOS
# venv\Scripts\activate              # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

---

## 🌍 Internationalisation (FR / EN)

L'app React expose un **toggle FR ↔ EN** dans la nav. Le clic :

- Bascule **instantanément** toute l'UI (nav, titres de section, filtres, terminal, section GRC, contact, footer)
- Met à jour `<html lang="…">` pour le SEO
- Persiste le choix dans `localStorage`
- Au premier visit, détecte automatiquement la langue du navigateur (fallback FR)

> ⚠️ **Limite assumée** : le contenu fourni par l'API (bio, descriptions de projets, expériences) reste en français.
> Pour rendre ce contenu bilingue, ajouter des champs `*_en` aux schémas Pydantic backend.

Dictionnaire complet : [frontend/src/i18n/translations.ts](frontend/src/i18n/translations.ts)
Provider + hook : [frontend/src/context/LanguageContext.tsx](frontend/src/context/LanguageContext.tsx)

---

## 🎧 Expérience UI immersive

Tout est fait **maison**, sans aucune dépendance d'animation, d'audio ou d'icônes : Web Audio API, Canvas 2D, SVG inline et IntersectionObserver. Chaque effet respecte `prefers-reduced-motion`.

| Brique | Ce que ça fait | Tech |
|---|---|---|
| **Ambiance audio** ([MusicPlayer](frontend/src/components/MusicPlayer.tsx)) | Dock flottant play/pause + volume. Ambiance **générative** synthétisée à la volée, **zéro fichier audio**. Mini-égaliseur live alimenté par l'`AnalyserNode` partagé. | Web Audio API |
| **Moteur audio** ([audioEngine.ts](frontend/src/audio/audioEngine.ts)) | Synthèse temps réel, gestion volume/état, `AnalyserNode` partagé entre le dock et le fond. | Web Audio API |
| **Fond audio-réactif** ([AudioReactiveBackground](frontend/src/components/AudioReactiveBackground.tsx)) | 3 rideaux d'aurore (bleu / violet / rouge = **Purple Team**) qui ondulent et s'intensifient avec la musique. Dérive douce à l'arrêt. | Canvas 2D + `AnalyserNode` |
| **Timeline en fil sinueux** ([HomePage](frontend/src/pages/HomePage.tsx)) | Spline **Catmull-Rom** qui passe par chaque nœud d'expérience avec un balancement alterné : un vrai "fil déposé sur la table". | SVG path + ResizeObserver |
| **Formulaire de contact** | Envoi par `mailto:` (pré-rempli, sujet inclus). Pas de backend mail, donc rien à héberger. | mailto natif |
| **Logos sociaux** | GitHub, LinkedIn, TryHackMe (logo officiel CC0), Email, CV en **SVG inline**, hover par marque. | SVG inline |
| **UI vivante** | Curseur personnalisé + boutons magnétiques, réseau de nœuds en hero, bandeau techno défilant, compteurs animés, barre de progression de scroll. | Canvas + IntersectionObserver |

> 🎚️ Le dock audio démarre l'`AudioContext` au **premier clic** (politique autoplay des navigateurs). Le fond reste actif en dérive douce même sans son.

---

## 🔐 Espace admin

L'interface `/admin/login` permet (après authentification JWT) de modifier en direct :

- Profil (nom, headline, bio, photo, liens sociaux)
- Liste des projets (CRUD complet)
- Expériences professionnelles
- Catégories de compétences
- Certifications
- Centres d'intérêt
- Éditeur JSON brut pour les modifications avancées

> ⚠️ **Sécurité** : change `ADMIN_PASSWORD` et `JWT_SECRET` **avant** tout déploiement.
> Générer un secret fort : `python -c "import secrets; print(secrets.token_urlsafe(64))"`

---

## 📂 Livrables GRC (`frontend/grc/`)

Documents types réutilisables (MIT), accessibles depuis :

- la **section dédiée** dans la HomePage React (`#grc`)
- le listing nginx `http://localhost:3000/grc/`
- directement sur [GitHub](https://github.com/AGL2304/Mon_Portfolio/tree/main/frontend/grc)

Voir [frontend/grc/README.md](frontend/grc/README.md) pour le détail du contenu (5 livrables).

---

## 🧪 Tests

```bash
# Backend - unitaires + intégration
cd backend && pytest -q

# Frontend - unitaires
cd frontend && npm test

# Frontend - E2E (Playwright)
cd frontend
npm run e2e:install   # première fois
npm run e2e
```

---

## 🚢 Déploiement

| Cible | Config | Branche |
|---|---|---|
| Frontend → **Vercel** | `frontend/vercel.json` | `main` |
| Tous services → **Docker** | `db/compose.yml` / `backend/compose.yml` / `frontend/compose.yml` | n/a |
| CI/CD → **GitHub Actions** | `.github/workflows/ci.yml` | `main` |

---

## 📖 À propos

Réalisé par **Georges Lionel ANANI** | Étudiant M1 Architecte des SI à l'École-IT (option DevOps & Cybersécurité).

- 🐙 GitHub : [@AGL2304](https://github.com/AGL2304)
- 💼 LinkedIn : [Georges Lionel ANANI](https://www.linkedin.com/in/georges-lionel-c-a-anani-35256618b)
- ✉️ Email : [charbelazon23@gmail.com](mailto:charbelazon23@gmail.com)
- 📍 Île-de-France | École à Amiens

---

<div align="center">
  <sub>Construit avec ♥ et un peu de café | MIT License</sub>
</div>
