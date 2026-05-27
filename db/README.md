# DB — Portfolio (PostgreSQL)

Tier données de l'architecture n-tiers. Base PostgreSQL 16, gérée via Docker Compose.

## Stack

| Outil | Version | Rôle |
|---|---|---|
| PostgreSQL | 16-alpine | Base de données relationnelle |

## Schéma

Les tables sont créées automatiquement par SQLAlchemy au démarrage du backend (`CREATE TABLE IF NOT EXISTS`).

| Table | Description |
|---|---|
| `portfolio_documents` | Contenu JSON du portfolio (profil, projets, expériences…) |
| `cv_documents` | PDF du CV stocké en BYTEA |
| `profile_images` | Photo de profil stockée en BYTEA |

## Démarrage rapide

```bash
# Démarre PostgreSQL et crée le réseau portfolio-net
docker compose up -d

# Vérifier que la base est prête
docker compose exec db pg_isready -U portfolio
```

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `POSTGRES_USER` | `portfolio` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `portfolio` | Mot de passe |
| `POSTGRES_DB` | `portfolio` | Nom de la base |

Copier `.env.example` à la racine du repo en `.env` et adapter les valeurs avant de lancer.

## Réseau

Ce compose crée le réseau Docker `portfolio-net`. Les tiers `backend` et `frontend` le rejoignent comme réseau externe.

Ordre de démarrage recommandé (standalone) :

```bash
cd db       && docker compose up -d
cd backend  && docker compose up -d
cd frontend && docker compose up -d
```

Pour démarrer la stack complète en une commande, utiliser le `compose.yml` à la racine du repo.
