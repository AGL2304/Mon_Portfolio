# ============================================================
#  Portfolio Database — PostgreSQL 16
# ============================================================
#  Extends l'image officielle postgres:16-alpine en ajoutant :
#   - les scripts d'initialisation (init/*.sql executes au 1er run)
#   - les migrations versionnees (placeholder pour le futur)
#
#  Build :
#    docker build -t portfolio-db .
#
#  Run standalone :
#    docker run --rm -p 5432:5432 \
#      -e POSTGRES_USER=portfolio \
#      -e POSTGRES_PASSWORD=portfolio \
#      -e POSTGRES_DB=portfolio \
#      portfolio-db
# ============================================================
FROM postgres:16-alpine

# Healthcheck integre — surveille que Postgres repond
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD pg_isready -U "${POSTGRES_USER:-portfolio}" -d "${POSTGRES_DB:-portfolio}" || exit 1

# Les scripts dans /docker-entrypoint-initdb.d/ sont executes
# automatiquement par postgres a la premiere initialisation
# (volume vide). Ordre alphabetique : 01_, 02_, etc.
COPY init/ /docker-entrypoint-initdb.d/

# Encoding par defaut UTF-8 (deja le defaut de postgres:16-alpine
# mais on explicite pour eviter toute surprise)
ENV LANG=C.UTF-8

EXPOSE 5432
