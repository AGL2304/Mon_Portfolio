# Portfolio Backend

> **API REST FastAPI** + livrables GRC publics (Markdown/CSV).
> Service autonome, deployable independamment du frontend et de la DB.

## Stack

- **Python 3.12** + FastAPI 0.115 + SQLAlchemy 2.0 + JWT (python-jose)
- **PostgreSQL 16** (compatible SQLite pour les tests)
- **Tests** : pytest
- **Qualité** : ruff (lint + format)

## Structure

```
backend/
├── app/
│   ├── main.py             # routes API + mount /grc/ (StaticFiles)
│   ├── config.py           # Settings via pydantic-settings
│   ├── database.py         # SQLAlchemy engine + session
│   ├── models.py           # tables ORM
│   ├── schemas.py          # Pydantic DTOs
│   ├── crud.py             # accès DB
│   ├── security.py         # JWT + auth admin
│   └── seed_data.py        # contenu initial
├── grc/                    # livrables Markdown/CSV servis sur /grc/
├── seed/                   # CV PDFs + photo de demarrage (uploads admin)
├── tests/                  # pytest
├── Dockerfile
├── docker-compose.yml      # standalone (backend seul, DB externe)
├── pyproject.toml          # config ruff
├── requirements.txt
├── .env.example
└── README.md
```

## Lancement standalone

### Avec Docker (recommandé)

```bash
cd backend
cp .env.example .env
# Editer ADMIN_PASSWORD, JWT_SECRET, DATABASE_URL
docker compose up --build
```

**Prérequis** : une base PostgreSQL accessible via `DATABASE_URL`. Tu peux :
- Lancer `cd ../db && docker compose up -d` en parallèle
- Pointer vers Supabase / Neon / RDS / autre service managé
- Utiliser SQLite pour les tests (cf `tests/conftest.py`)

### Sans Docker (dev local)

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Linux/macOS
# venv\Scripts\activate           # Windows
pip install -r requirements.txt

export DATABASE_URL="postgresql+psycopg2://portfolio:portfolio@localhost:5432/portfolio"
export ADMIN_EMAIL="admin@test.local"
export ADMIN_PASSWORD="test-admin-password"
export JWT_SECRET="dev-secret"
export CORS_ORIGINS='["http://localhost:5173"]'

uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Healthcheck |
| POST | `/api/auth/login` | — | Login admin (JWT) |
| GET | `/api/public/content` | — | Contenu du portfolio public |
| GET | `/api/public/cv` | — | Telecharger le CV PDF |
| GET | `/api/public/photo` | — | Photo de profil |
| GET | `/api/grc/files` | — | Liste JSON des livrables GRC |
| GET | `/grc/*` | — | Fichiers GRC statiques (md, csv) |
| GET/PUT | `/api/admin/content` | JWT | Edition du contenu |
| POST/DELETE | `/api/admin/cv` | JWT | Upload/delete CV |
| POST/DELETE | `/api/admin/photo` | JWT | Upload/delete photo |

Documentation interactive : `/docs` (Swagger) ou `/redoc`.

## Tests

```bash
pytest -q
ruff check .                 # lint
ruff format --check .        # format check
```

## Déploiement

| Provider | Type | Notes |
|---|---|---|
| **Railway** | Container Docker | `railway up` après config DATABASE_URL |
| **Render** | Container Docker | Free tier OK pour démo |
| **Fly.io** | Container Docker | `fly launch` puis `fly deploy` |
| **Self-hosted** | Docker compose | Reverse proxy nginx/Caddy + Let's Encrypt |

Variables d'environnement requises en prod : voir `.env.example`.

## Sécurité

- ⚠️ **Toujours** changer `ADMIN_PASSWORD` et `JWT_SECRET` en prod
- Génerer un secret JWT fort : `python -c "import secrets; print(secrets.token_urlsafe(64))"`
- Limiter `CORS_ORIGINS` aux domaines réels (pas `*`)
- Cf [`../SECURITY.md`](../SECURITY.md) pour la politique de divulgation

## Migration vers un repo séparé

Quand tu veux extraire ce backend dans son propre repo GitHub :

```bash
# Depuis une copie temporaire du monorepo
git clone <monorepo-url> /tmp/portfolio-backend-extract
cd /tmp/portfolio-backend-extract
git filter-repo --subdirectory-filter backend/
# Push vers le nouveau repo
git remote add origin git@github.com:portfolio-org/backend.git
git push -u origin main
```

Le dossier `backend/` est conçu pour être self-contained : aucun fichier
en dehors n'est requis (Dockerfile attend `./` comme contexte de build).
