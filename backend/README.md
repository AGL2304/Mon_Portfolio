# Backend — Portfolio (FastAPI)

Tier logique métier de l'architecture n-tiers. API REST construite avec FastAPI et SQLAlchemy, exposée sur le port 8000.

## Stack

| Outil | Version | Rôle |
|---|---|---|
| FastAPI | 0.115 | Framework API |
| SQLAlchemy | 2.0 | ORM |
| psycopg2 | 2.9 | Driver PostgreSQL |
| python-jose | 3.3 | JWT |
| Uvicorn | 0.34 | Serveur ASGI |
| pytest | 8.3 | Tests |
| ruff | 0.8 | Lint / format |

## Structure

```
backend/
├── app/
│   ├── main.py        # Routes FastAPI (auth, content, uploads, health)
│   ├── config.py      # Pydantic settings
│   ├── models.py      # Modèles SQLAlchemy
│   ├── schemas.py     # Schémas Pydantic
│   ├── database.py    # Moteur SQLAlchemy, session
│   ├── security.py    # JWT, vérification credentials
│   ├── crud.py        # Opérations CRUD
│   └── seed_data.py   # Données par défaut
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   └── test_content.py
├── Dockerfile
├── compose.yml        # Service backend standalone
├── requirements.txt
└── pyproject.toml     # Config ruff + pytest
```

## Démarrage rapide

### Développement local

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

### Docker standalone

> Pré-requis : réseau `portfolio-net` existant (`cd ../db && docker compose up -d`)

```bash
docker compose up -d
```

### Tests

```bash
pytest tests -q
ruff check .
ruff format --check .
```

## Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `ADMIN_EMAIL` | oui | Email de l'admin |
| `ADMIN_PASSWORD` | oui | Mot de passe admin |
| `JWT_SECRET` | oui | Clé de signature JWT |
| `DATABASE_URL` | oui | URL PostgreSQL (ou SQLite pour les tests) |
| `APP_BASE_URL` | non | URL publique de base (pour URLs absolues) |
| `CORS_ORIGINS` | non | JSON array des origines autorisées |

## Routes API

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Obtenir un JWT |
| GET | `/api/public/content` | — | Contenu du portfolio |
| GET | `/api/public/cv` | — | Télécharger le CV |
| GET | `/api/public/photo` | — | Photo de profil |
| GET/PUT | `/api/admin/content` | JWT | Lire / modifier le contenu |
| POST/DELETE | `/api/admin/cv` | JWT | Gérer le CV |
| POST/DELETE | `/api/admin/photo` | JWT | Gérer la photo |
