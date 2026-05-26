# ------------------------------------------------------------
#  Build stage : compile l'app React (Vite)
# ------------------------------------------------------------
# IMPORTANT : ce Dockerfile suppose que le BUILD CONTEXT est la
# RACINE du repo (cf. docker-compose.yml -> context: .).
# Cela permet de copier dans l'image nginx finale :
#   - assets/  (CV, photo, favicon, screenshots)
#   - grc/     (livrables Gouvernance Risques Conformite)
# ------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json \
     frontend/vite.config.ts frontend/index.html ./
COPY frontend/src ./src

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ------------------------------------------------------------
#  Runtime : nginx servant l'app React + assets + grc/
# ------------------------------------------------------------
FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Fichiers statiques additionnels :
#   - assets/ : favicon SVG, photo, CV PDF, screenshots README
#   - grc/    : livrables GRC publics (ISO 27001, EBIOS RM, RGPD, PSSI)
COPY assets /usr/share/nginx/html/assets
COPY grc /usr/share/nginx/html/grc

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
