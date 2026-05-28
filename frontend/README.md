# Portfolio Frontend

> **Application React 18 + TypeScript + Vite** servie par nginx.
> Bilingue FR/EN avec toggle sans rechargement, section GRC native.
> Service autonome, deployable independamment du backend et de la DB.

## Stack

- **React 18** + TypeScript 5.7 + Vite 5
- **i18n maison** (FR/EN, sans dépendance externe)
- **React Router 6** (routing client-side)
- **nginx** (runtime, sert le bundle + proxie /api/ et /grc/ vers le backend)
- **Tests** : Vitest (unitaires) + Playwright (E2E)
- **Qualité** : ESLint + Prettier

## Structure

```
frontend/
├── src/
│   ├── pages/              # HomePage, AdminLoginPage, AdminDashboardPage
│   ├── components/         # ProjectCard, Terminal, Toast, ProtectedRoute
│   ├── context/            # AuthContext, LanguageContext
│   ├── i18n/               # translations.ts (FR + EN typés)
│   ├── services/           # api.ts (client HTTP backend)
│   ├── styles/             # global.css
│   └── types/              # PortfolioContent etc.
├── public/
│   ├── favicon.svg         # icône onglet navigateur
│   └── screenshots/        # captures README
├── e2e/                    # tests Playwright
├── Dockerfile              # build Node + runtime nginx
├── docker-compose.yml      # standalone (frontend + backend externe)
├── nginx.conf              # proxy /api/ + /grc/ vers backend
├── eslint.config.js
├── package.json
├── .env.example
└── README.md
```

## Lancement standalone

### Avec Docker

```bash
cd frontend
cp .env.example .env
# Editer BACKEND_HOST si le backend n'est pas sur l'hote
docker compose up --build
```

Site sur http://localhost:3000.

### Sans Docker (dev local avec hot reload)

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Le backend doit tourner sur http://localhost:8000 (ou ajuster `VITE_API_URL`
dans `.env`).

## Internationalisation (FR / EN)

Toggle FR ↔ EN dans la nav :
- Bascule **instantanément** toute l'UI sans rechargement
- Met à jour `<html lang="…">` pour le SEO
- Persiste dans `localStorage`
- Au premier visit, détecte la langue navigateur (fallback FR)

Dictionnaire : [src/i18n/translations.ts](src/i18n/translations.ts)
Provider : [src/context/LanguageContext.tsx](src/context/LanguageContext.tsx)

> ⚠️ **Limite** : le contenu fourni par l'API (bio, descriptions de projets)
> reste en français. Pour bilingue complet, ajouter `*_en` aux schémas backend.

## Tests

```bash
npm run lint              # ESLint
npm run format:check      # Prettier
npm test                  # Vitest unitaires
npm run e2e:install       # première fois : install Chromium
npm run e2e               # Playwright E2E
npm run build             # bundle production
```

## Déploiement

| Provider | Type | Notes |
|---|---|---|
| **Vercel** | Static + SSR | `vercel --prod`. Rewrites pour proxy `/api/*` et `/grc/*` vers backend |
| **Netlify** | Static | `_redirects` file pour proxy |
| **Cloudflare Pages** | Static + Workers | Workers pour proxy si même domaine |
| **Self-hosted** | Docker (nginx) | `docker compose up -d` derrière reverse proxy |

### Exemple `vercel.json` pour proxy

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://backend.example.com/api/:path*" },
    { "source": "/grc/:path*", "destination": "https://backend.example.com/grc/:path*" }
  ]
}
```

## Variables d'environnement

| Variable | Defaut | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Préfixe d'URL pour l'API (build-time) |
| `BACKEND_HOST` | `host.docker.internal` | Hôte du backend (runtime nginx, envsubst) |
| `BACKEND_PORT` | `8000` | Port du backend |
| `FRONTEND_HOST_PORT` | `3000` | Port host pour nginx |

## Migration vers un repo séparé

```bash
git clone <monorepo-url> /tmp/portfolio-frontend-extract
cd /tmp/portfolio-frontend-extract
git filter-repo --subdirectory-filter frontend/
git remote add origin git@github.com:portfolio-org/frontend.git
git push -u origin main
```

Le dossier `frontend/` est self-contained : aucun fichier en dehors n'est
requis (le Dockerfile a son contexte limité à ce dossier).
