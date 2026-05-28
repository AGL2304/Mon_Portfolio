# Frontend — Portfolio (React + Nginx)

Tier présentation de l'architecture n-tiers. Construit avec React 18, TypeScript et Vite, servi par Nginx.

## Stack

| Outil | Version | Rôle |
|---|---|---|
| React | 18 | UI |
| TypeScript | 5 | Typage |
| Vite | 5 | Build |
| Nginx | 1.27 | Serveur statique + proxy `/api` |
| Vitest | 2 | Tests unitaires |
| Playwright | 1.49 | Tests E2E |

## Structure

```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── context/         # AuthContext, LanguageContext
│   ├── pages/           # HomePage, AdminLoginPage, AdminDashboardPage
│   ├── services/        # Client API, utilitaires
│   ├── types/           # Interfaces TypeScript
│   └── i18n/            # Traductions FR/EN
├── e2e/                 # Tests Playwright
├── assets/              # CV PDF, photo, favicon, screenshots
├── grc/                 # Livrables GRC publics (ISO 27001, EBIOS RM, RGPD, PSSI)
├── Dockerfile           # Build multi-stage (Node → Nginx)
└── compose.yml          # Service frontend standalone
```

## Démarrage rapide

### Développement local

```bash
npm install
npm run dev          # http://localhost:5173
```

### Docker standalone

> Pré-requis : réseau `portfolio-net` existant (`cd ../db && docker compose up -d`)

```bash
docker compose up -d
# http://localhost:3000
```

### Tests

```bash
npm run test         # Vitest (unitaires)
npm run e2e          # Playwright (E2E, nécessite le backend)
npm run lint         # ESLint + Prettier
```

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | URL de l'API (build-time) |

## Fonctionnalités

- **Bilingue FR/EN** — bascule sans rechargement, persisté dans `localStorage`
- **Admin protégé** — routes `/admin/*` derrière JWT (`ProtectedRoute`)
- **SEO** — JSON-LD Person, OpenGraph, Twitter Cards
- **Headers sécurité** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy
