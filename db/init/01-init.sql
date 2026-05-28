-- ============================================================
--  Portfolio DB — script d'initialisation
-- ============================================================
--  Execute par postgres a la 1ere initialisation seulement
--  (quand le volume de donnees est vide).
--
--  Le SCHEMA applicatif est cree par SQLAlchemy au demarrage
--  du backend (cf backend/app/database.py -> init_db()).
--  Ce script sert pour :
--    - extensions Postgres requises
--    - permissions / roles additionnels
--    - configuration session
-- ============================================================

-- Extensions utiles pour un backend FastAPI moderne
-- (a decommenter selon besoin)

-- pgcrypto : fonctions de hash et UUID v4
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- citext : type texte case-insensitive (utile pour emails)
-- CREATE EXTENSION IF NOT EXISTS citext;

-- Verification que la DB est bien initialisee
DO $$
BEGIN
    RAISE NOTICE '[portfolio-db] Initialisation terminee. Schema applicatif sera cree par le backend SQLAlchemy.';
END $$;
