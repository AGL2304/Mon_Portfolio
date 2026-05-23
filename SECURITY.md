# Politique de divulgation responsable

> Ce projet est porté par un profil **Cybersécurité GRC** — la sécurité
> de cette base de code est traitée avec le même niveau d'exigence que
> celui prêché auprès des entreprises auditées.

## Versions supportées

| Version | Support sécurité |
|---|---|
| `main` (branche par défaut) | ✅ |
| Tags `v1.x` | ✅ correctifs critiques |
| Branches archivées | ❌ |

## Signaler une vulnérabilité

Si vous découvrez une faille de sécurité dans ce portfolio (XSS, IDOR,
auth bypass, injection, exposition de secrets, mauvaise configuration
CORS / cookies, etc.), **merci de ne pas ouvrir d'issue publique**.

### Canal préféré

📧 **charbelazon23@gmail.com** — sujet préfixé par `[SECURITY]`

Précisez si possible :

- Le composant impacté (`backend`, `frontend`, `portfolio.html`, Docker, CI…)
- Une preuve de concept reproductible (commande, requête HTTP, capture)
- L'impact estimé (CVSS si vous l'avez)
- Vos coordonnées pour un crédit éventuel

### Engagement de réponse

| Étape | Délai cible |
|---|---|
| Accusé de réception | sous 72 h |
| Triage initial + sévérité | sous 7 jours |
| Correctif `main` (Haute/Critique) | sous 14 jours |
| Publication d'un avis | après déploiement du correctif |

## Périmètre

Sont **dans le périmètre** :

- Code applicatif (`backend/`, `frontend/`, `portfolio.html`)
- Configuration Docker / CI exposant des secrets
- Dépendances avec CVE connues (rapport via GitHub Dependabot bienvenu)
- Mauvaises pratiques d'auth / session / CSRF / CORS

Sont **hors périmètre** :

- Spam / phishing visant les coordonnées publiques
- Vulnérabilités nécessitant un accès physique à un poste de l'auteur
- Attaques sur les services tiers (LinkedIn, TryHackMe, GitHub) hébergeant des données

## Bonnes pratiques en local

Avant de déployer ce projet, vous **devez** :

- Définir `ADMIN_PASSWORD`, `JWT_SECRET`, `POSTGRES_PASSWORD` dans un
  `.env` jamais commité (le `.gitignore` est déjà configuré)
- Régénérer `JWT_SECRET` avec `python -c "import secrets; print(secrets.token_urlsafe(64))"`
- Restreindre `CORS_ORIGINS` à vos domaines réels (pas de `*`)
- Servir l'API derrière TLS (Caddy / Nginx / Cloudflare)

Merci de contribuer à garder ce projet propre. 🛡️
