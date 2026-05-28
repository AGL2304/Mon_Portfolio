# DB — Portfolio (PostgreSQL)

Tier données de l'architecture n-tiers. Base PostgreSQL 15, gérée via Docker Compose.

## Stack

| Outil | Version | Rôle |
|---|---|---|
| PostgreSQL | 15-alpine | Base de données relationnelle |
| Adminer | 4 | Interface web d'administration de la base |

## Schéma

Les tables sont créées automatiquement par SQLAlchemy au démarrage du backend (`CREATE TABLE IF NOT EXISTS`).

| Table | Description |
|---|---|
| `portfolio_documents` | Contenu JSON du portfolio (profil, projets, expériences…) |
| `cv_documents` | PDF du CV stocké en BYTEA |
| `profile_images` | Photo de profil stockée en BYTEA |

## Démarrage rapide

```bash
# Pré-requis : réseau portfolio-net existant
docker network create portfolio-net

# Démarre PostgreSQL et Adminer
docker compose up -d

# Vérifier que la base est prête
docker compose exec db pg_isready -U portfolio
```

- 🗄️ **Adminer** : http://localhost:8080 (serveur : `portfolio-db`, utilisateur : `portfolio`)

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `POSTGRES_USER` | `portfolio` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `portfolio` | Mot de passe |
| `POSTGRES_DB` | `portfolio` | Nom de la base |

Adapter ces valeurs via des variables d'environnement shell ou un fichier `.env` local avant de lancer.

## Réseau

Le réseau Docker `portfolio-net` est déclaré **externe** dans ce compose — il doit être créé manuellement avant de démarrer les tiers :

```bash
docker network create portfolio-net
```

Les tiers `backend` et `frontend` rejoignent ce même réseau externe.

Ordre de démarrage recommandé (standalone) :

```bash
docker network create portfolio-net
cd db       && docker compose up -d
cd ../backend  && docker compose up -d
cd ../frontend && docker compose up -d
```
