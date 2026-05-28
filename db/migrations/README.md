# Migrations

> **Statut actuel** : pas de migrations formelles. Le schema est gere par
> SQLAlchemy `Base.metadata.create_all()` au demarrage du backend.
> Ce dossier est prepare pour passer a Alembic plus tard.

## Quand ajouter Alembic ?

- Quand le schema commence a changer en production avec des donnees a preserver
- Quand plusieurs developpeurs modifient les modeles SQLAlchemy en parallele
- Quand on veut un audit trail des changements de schema

## Setup Alembic (recette pour plus tard)

```bash
cd backend
pip install alembic
alembic init alembic                  # cree alembic.ini + alembic/

# Editer alembic.ini :
#   sqlalchemy.url = postgresql+psycopg2://portfolio:portfolio@db:5432/portfolio

# Editer alembic/env.py pour importer les modeles :
#   from app.models import Base
#   target_metadata = Base.metadata

# Generer la migration initiale
alembic revision --autogenerate -m "initial schema"

# Appliquer
alembic upgrade head
```

Les fichiers `alembic/versions/*.py` viendraient ici dans `db/migrations/`
(ou rester dans `backend/alembic/versions/` — au choix).

## Migrations SQL brutes (alternative legere)

Si tu veux pas Alembic, naming convention :

```
db/migrations/
├── V001__initial_schema.sql
├── V002__add_user_avatar_column.sql
└── V003__rename_profile_table.sql
```

Et un script bash qui execute dans l'ordre les fichiers non encore appliques
(tracking dans une table `_migrations` avec checksums).
