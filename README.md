# Portfolio Full-Stack (React + FastAPI)

Reorganisation complete du projet a partir de `portofolio.html` comme reference visuelle et de contenu.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Python + SQLite
- CI/CD: GitLab CI (`.gitlab-ci.yml`)
- Conteneurisation: Docker + Docker Compose
- Tests unitaires: `pytest` (backend) et `vitest` (frontend)

## Structure

```text
.
|-- backend/
|   |-- app/
|   |-- tests/
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |-- Dockerfile
|   `-- nginx.conf
|-- docker-compose.yml
|-- .gitlab-ci.yml
|-- .env.example
`-- portofolio.html
```

## Fonctionnalites

- Page publique portfolio basee sur tes informations.
- Espace admin protege par mot de passe (JWT).
- Modification facile:
  - Formulaire profil.
  - Gestion des projets (ajout/modification/suppression).
  - Editeur JSON complet pour modifier aussi experiences, competences, certifications, centres d'interet.

## Configuration

1. Copier `.env.example` en `.env`.
2. Changer au minimum:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

## Lancement en local (sans Docker)

Backend:

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000/api`
- Login admin: `http://localhost:5173/admin/login`

## Lancement avec Docker Compose

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API backend: `http://localhost:8000/api`
- Zone admin: `http://localhost:3000/admin/login`

## Tests unitaires

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm test
```

# Mon_Portfolio
