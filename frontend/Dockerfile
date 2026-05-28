# ------------------------------------------------------------
#  Build stage : compile l'app React (Vite)
# ------------------------------------------------------------
# Le BUILD CONTEXT est le dossier frontend/ (cf. compose.yml -> context: .)
# assets/ et grc/ sont désormais dans frontend/ et copiés directement.
# ------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY tsconfig.json tsconfig.app.json tsconfig.node.json \
     vite.config.ts index.html ./
COPY src ./src

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ------------------------------------------------------------
#  Runtime : nginx servant l'app React + assets + grc/
# ------------------------------------------------------------
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Fichiers statiques additionnels :
#   - assets/ : favicon SVG, photo, CV PDF, screenshots README
#   - grc/    : livrables GRC publics (ISO 27001, EBIOS RM, RGPD, PSSI)
COPY assets /usr/share/nginx/html/assets
COPY grc /usr/share/nginx/html/grc

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
