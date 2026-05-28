# ============================================================
#  Portfolio Frontend — React 18 + Vite + nginx
# ============================================================
#  Build stage : compile l'app React (Vite)
#  Runtime    : nginx sert le bundle statique + proxie /api/ et /grc/
#               vers le backend (resolu par variable d'env BACKEND_HOST).
#
#  Le build context est ./frontend (dossier autonome, deployable seul).
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY tsconfig.json tsconfig.app.json tsconfig.node.json \
     vite.config.ts index.html ./
COPY src ./src
COPY public ./public

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ------------------------------------------------------------
#  Runtime : nginx servant React
# ------------------------------------------------------------
FROM nginx:1.27-alpine

# Template nginx (envsubst au boot pour resoudre BACKEND_HOST)
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Defaults : en docker-compose le service backend est resolu via DNS.
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=8000

EXPOSE 80

# nginx:1.27-alpine execute automatiquement envsubst sur les fichiers
# dans /etc/nginx/templates/ au boot (cf. /docker-entrypoint.d/20-envsubst-on-templates.sh)
