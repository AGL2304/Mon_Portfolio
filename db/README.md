# Portfolio DB

> Service **PostgreSQL 16** isole, deployable independamment du backend
> et du frontend. Image Docker basee sur `postgres:16-alpine` avec scripts
> d'initialisation et placeholder pour des migrations futures.

## Structure

```
db/
├── Dockerfile              # extends postgres:16-alpine + healthcheck
├── docker-compose.yml      # deploiement standalone
├── init/
│   └── 01-init.sql         # script execute au 1er init (extensions, roles…)
├── migrations/
│   └── README.md           # doc pour ajouter Alembic plus tard
├── .env.example
└── README.md
```

## Lancement standalone

```bash
cd db
cp .env.example .env
# Editer POSTGRES_PASSWORD au minimum
docker compose up --build
```

La DB est accessible sur `localhost:5432` (configurable via `DB_HOST_PORT`).

## Connexion

```bash
psql -h localhost -p 5432 -U portfolio -d portfolio
# OU
docker exec -it portfolio-db psql -U portfolio -d portfolio
```

## Schema applicatif

Le schema est gere par **SQLAlchemy** cote backend : a son demarrage,
le backend execute `Base.metadata.create_all()` qui cree les tables
manquantes. Pas de migration formelle pour l'instant.

Voir [`migrations/README.md`](migrations/README.md) pour passer a Alembic.

## Sauvegarde / restauration

```bash
# Backup
docker exec portfolio-db pg_dump -U portfolio portfolio > backup-$(date +%Y%m%d).sql

# Restore
cat backup.sql | docker exec -i portfolio-db psql -U portfolio -d portfolio
```

## Deploiement en production

Options :

| Provider | Type | Notes |
|---|---|---|
| **Supabase** | DB managee | Pas besoin de ce Dockerfile, juste `DATABASE_URL` |
| **Neon** | DB managee Postgres | Idem, serverless avec free tier genereux |
| **Railway** | DB managee ou Docker | Le Dockerfile fonctionne tel quel |
| **Render** | DB managee | Free tier 90j puis payant |
| **Self-hosted** | VPS + Docker | `docker compose up -d` puis backup cron |

Pour les providers manages, ce dossier est juste **documentation** :
le backend pointe vers leur `DATABASE_URL` via variable d'env.

## Variables d'environnement

| Variable | Defaut | Description |
|---|---|---|
| `POSTGRES_USER` | _(requis)_ | Nom du super-user de la DB |
| `POSTGRES_PASSWORD` | _(requis)_ | Mot de passe (FORT en prod) |
| `POSTGRES_DB` | _(requis)_ | Nom de la base creee au 1er run |
| `DB_HOST_PORT` | `5432` | Port expose sur l'hote |

## Securite

- ⚠️ **Ne jamais** committer `.env` (deja dans `.gitignore`)
- Generer un mot de passe fort : `openssl rand -base64 32`
- En production, exposer uniquement sur le reseau interne (pas `0.0.0.0:5432`)
- Activer SSL/TLS pour les connexions cross-host
