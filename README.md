# Mon_Portfolio — Georges Lionel ANANI

> Portfolio full-stack pour un **Alternant Cybersécurité GRC** (Gouvernance, Risques & Conformité).
> Page publique + back-office d'administration. Photo de profil, CV PDF téléchargeable, design premium dark-tech.

[![Status](https://img.shields.io/badge/status-online-22D3EE)](https://github.com/AGL2304/Mon_Portfolio)
[![Made with](https://img.shields.io/badge/stack-React%20%2B%20FastAPI-8B5CF6)](#stack)
[![License](https://img.shields.io/badge/license-MIT-10B981)](#)

---

## 🎯 Aperçu

Ce repo héberge **deux livrables complémentaires** :

1. **`portofolio.html`** — un site statique mono-fichier (HTML/CSS/JS pur) qui peut être servi tel quel sur GitHub Pages, Vercel ou Netlify. C'est la version "production légère".
2. **Une stack React + FastAPI complète** (dossiers `frontend/` et `backend/`) avec une **interface d'administration JWT** qui permet d'éditer profil / projets / expériences / compétences à chaud.

| Mode | Cible | Quand l'utiliser |
|---|---|---|
| Statique (`portofolio.html`) | Démo rapide, GitHub Pages | Quand le contenu ne bouge pas |
| Full-stack (React + FastAPI) | Long terme, contenu vivant | Quand tu veux modifier en ligne sans redéployer |

---

## 🧱 Stack

- **Frontend** : React + TypeScript + Vite + CSS modulaire
- **Backend** : FastAPI + SQLAlchemy + SQLite + JWT
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitLab CI (`.gitlab-ci.yml`)
- **Tests** : `pytest` (backend) · `vitest` (frontend)
- **Déploiement** : Vercel (frontend) · Railway (backend) — config présente

```
.
├── assets/                       # 👈 statiques (photo, CV)
│   ├── profile.jpg               # photo de profil (depuis LinkedIn)
│   ├── CV_Georges_Lionel_ANANI_GRC.pdf          # CV 1-page (lien hero)
│   └── CV_Georges_Lionel_ANANI_GRC_complet.pdf  # CV version longue
├── backend/                # FastAPI + SQLite + JWT auth
│   ├── app/
│   │   ├── main.py         # routes API
│   │   ├── seed_data.py    # contenu par défaut (profil, projets, etc.)
│   │   ├── models.py       # SQLAlchemy
│   │   └── security.py     # JWT, hashing
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React + TS + Vite
│   ├── src/
│   │   ├── pages/          # HomePage, AdminDashboardPage, AdminLoginPage
│   │   ├── components/     # ProjectCard, ProtectedRoute
│   │   ├── services/       # API client
│   │   └── styles/         # global.css
│   ├── Dockerfile
│   └── nginx.conf
├── portofolio.html         # 👈 version mono-fichier (premium dark-tech)
├── PROFILE_README.md       # README à copier vers AGL2304/AGL2304
├── docker-compose.yml
└── .gitlab-ci.yml
```

---

## ⚡ Démarrage rapide

### Option A — Version statique (10 secondes)

```bash
# ouvre simplement le fichier dans le navigateur
open portofolio.html      # macOS
xdg-open portofolio.html  # Linux
start portofolio.html     # Windows
```

Ou sers-le via un mini serveur HTTP :

```bash
python -m http.server 8080
# puis http://localhost:8080/portofolio.html
```

### Option B — Stack complète avec Docker Compose

```bash
cp .env.example .env
# édite ADMIN_PASSWORD et JWT_SECRET
docker compose up --build
```

- 🌐 **Frontend** : http://localhost:3000
- 🔌 **API** : http://localhost:8000/api
- 🔐 **Admin** : http://localhost:3000/admin/login

### Option C — En local sans Docker

**Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate            # Linux/macOS
# .venv/Scripts/activate             # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

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

> ⚠️ **Sécurité** : change toujours `ADMIN_PASSWORD` et `JWT_SECRET` avant tout déploiement.

---

## 🧪 Tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test
```

---

## 🚢 Déploiement

| Cible | Config | Branche |
|---|---|---|
| Frontend → **Vercel** | `frontend/vercel.json` | `main` |
| Backend → **Railway** | `railway.json` | `main` |
| Tous services → **Docker** | `docker-compose.yml` | n/a |
| CI/CD → **GitLab** | `.gitlab-ci.yml` | n/a |

---

## 📖 À propos

Réalisé par **Georges Lionel ANANI** — Étudiant M1 Architecte des SI à l'École-IT (option DevOps & Cybersécurité).

- 🐙 GitHub : [@AGL2304](https://github.com/AGL2304)
- 💼 LinkedIn : [Georges Lionel ANANI](https://www.linkedin.com/in/georges-lionel-c-a-anani-35256618b)
- ✉️ Email : [charbelazon23@gmail.com](mailto:charbelazon23@gmail.com)
- 📍 Amiens, France

---

<div align="center">
  <sub>Construit avec ♥ et un peu de café · MIT License</sub>
</div>
