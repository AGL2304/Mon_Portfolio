def default_portfolio_content() -> dict:
    return {
        "profile": {
            "full_name": "ANANI Georges Lionel",
            "headline": "Purple Team Engineer - Cybersecurite, GRC & DevSecOps",
            "short_bio": (
                "Etudiant en M1 Architecte des Systemes d'Information a l'Ecole-IT (option DevOps & Cybersecurite). "
                "En stage chez IRFA-APISUP (Transformation Numerique & Conformite) - audit M365, RGPD, PSSI. "
                "J'unifie l'offensif (pentest, exploitation web, CTF), le defensif (hardening, CVE intel) et "
                "la gouvernance (RGPD, audit droits, sensibilisation), le tout automatise via Docker, Kubernetes et CI/CD. "
                "Disponible en alternance des septembre 2026."
            ),
            "about": (
                "Mon angle : Purple Team. Comprendre l'attaque pour mieux defendre, automatiser pour ne plus "
                "reproduire la meme erreur, et structurer la gouvernance pour que la securite tienne dans le temps. "
                "Mon stage actuel chez IRFA-APISUP m'a permis de cartographier les usages M365 sur ~150 utilisateurs, "
                "d'auditer ~200 comptes SharePoint/Teams et de piloter la conduite du changement aupres de ~40 collaborateurs. "
                "En parallele, je developpe des applications full-stack securisees en Python (FastAPI), TypeScript "
                "(React/Vue) et PHP (Laravel/Symfony), et j'industrialise leur deploiement avec Docker, Kubernetes (GKE) "
                "et des pipelines CI/CD complets. "
                "Objectifs : alternance DevSecOps/GRC des septembre 2026, eJPT puis OSCP."
            ),
            "location": "Amiens, France",
            "email": "charbelazon23@gmail.com",
            "github_url": "https://github.com/AGL2304",
            "linkedin_url": "https://www.linkedin.com/in/georges-lionel-c-a-anani-35256618b",
            "cv_url": "#",
            "profile_image": "",
        },
        "hero_tags": [
            "Purple Team",
            "DevSecOps",
            "RGPD & Audit M365",
            "Pentest",
            "Docker / Kubernetes",
            "CI/CD",
            "Python · TypeScript · PHP",
        ],
        "experiences": [
            {
                "id": "stage-irfa-apisup",
                "title": "Stagiaire Transformation Numerique & Conformite",
                "company": "IRFA-APISUP, Amiens",
                "period": "Janvier 2026 - Aujourd'hui",
                "highlights": [
                    "Cartographie des usages Microsoft 365 (SharePoint, Teams, Power BI) sur ~150 utilisateurs et 8 entites - cartographie des donnees sensibles et matrice de risques RGPD priorisee en 3 vagues",
                    "Audit des droits d'acces SharePoint et Teams sur ~200 comptes - 12 ecarts au principe du moindre privilege identifies et plan de remediation a 90 jours en coherence avec la PSSI",
                    "Conception de 4 livrables d'audit (cartographies, matrice de risques, recommandations priorisees) et animation de 3 sessions de sensibilisation cybersecurite/RGPD vulgarisees pour publics non techniques (RH, finance, direction)",
                    "Pilotage de la conduite du changement aupres de ~40 collaborateurs - supports pedagogiques (fiches reflexes, FAQ) et reporting d'avancement dans un tableau de bord KPI/KRI hebdomadaire",
                ],
            },
            {
                "id": "stage-devops-metio",
                "title": "Stagiaire DevOps & Developpement Web",
                "company": "METIO (ex Iteracode), Amiens",
                "period": "Mai - Septembre 2025",
                "highlights": [
                    "Containerisation d'applications Node.js avec Docker multi-stage",
                    "Deploiement sur Kubernetes via GKE (Google Kubernetes Engine)",
                    "Mise en place d'un pipeline CI/CD complet (build > test > scan > deploy)",
                    "Monitoring et observabilite du cluster (logs, metriques)",
                ],
            },
            {
                "id": "stage-cyber-wildcode",
                "title": "Stage Cybersecurite - Audit & Remediation",
                "company": "WildCode-Solutions",
                "period": "Fevrier - Avril 2025",
                "highlights": [
                    "Audits de securite d'applications web (methodologie OWASP Top 10)",
                    "Analyse, exploitation et correction de vulnerabilites (SQLi, XSS, IDOR)",
                    "Redaction de rapports techniques avec recommandations priorisees",
                ],
            },
            {
                "id": "tele-enqueteur-mediametrie",
                "title": "Tele-enqueteur - Data Collection",
                "company": "Mediametrie, Amiens",
                "period": "Mars 2025 - Present",
                "highlights": [
                    "Collecte structuree et analyse de donnees pour etudes d'audience",
                    "Gestion de questionnaires et controle qualite des donnees",
                ],
            },
        ],
        "projects": [
            {
                "id": "portail-irfa-apisup",
                "title": "Portail interne IRFA-APISUP",
                "date": "Mars 2026",
                "categories": ["grc", "web"],
                "description": (
                    "Conception et developpement du portail interne pour IRFA-APISUP : "
                    "tableau de bord KPI/KRI hebdomadaire, fiches reflexes, FAQ cybersecurite "
                    "et zone documentaire de conduite du changement (~40 collaborateurs)."
                ),
                "technologies": ["SharePoint", "Power BI", "React", "TypeScript", "M365 Graph API"],
                "repository_url": None,
            },
            {
                "id": "secure-chat",
                "title": "Secure Chat E2E",
                "date": "Mai 2026",
                "categories": ["security", "web"],
                "description": (
                    "Application de messagerie chiffree end-to-end. La cle privee ne quitte jamais le navigateur "
                    "et les messages stockes sont chiffres. FastAPI + JWT + bcrypt cote serveur, SPA Vite cote client."
                ),
                "technologies": ["FastAPI", "JWT", "bcrypt", "SQLAlchemy", "Vite", "TailwindCSS"],
                "repository_url": "https://github.com/AGL2304/Secure_Chat",
            },
            {
                "id": "fileshare",
                "title": "FileShare",
                "date": "Mai 2026",
                "categories": ["security", "web", "devops"],
                "description": (
                    "Plateforme de partage de fichiers securisee : auth JWT (access 15min + refresh 7j), liens "
                    "partageables avec mot de passe, MIME whitelist, rate-limiting, storage S3-compatible."
                ),
                "technologies": ["React", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "Redis", "Docker"],
                "repository_url": "https://github.com/AGL2304/fileshare",
            },
            {
                "id": "red-blue-teams",
                "title": "Red Teams VS Blue Teams",
                "date": "Avril 2026",
                "categories": ["security"],
                "description": (
                    "Plateforme de simulation attaque/defense pour entrainer Red & Blue Teams. "
                    "Scenarios reproductibles, scoring temps reel et debriefs apres-action."
                ),
                "technologies": ["TypeScript", "Node.js", "Docker", "WebSocket"],
                "repository_url": "https://github.com/AGL2304/Red_Teams_VS_Blue_Teams",
            },
            {
                "id": "cve-trackers",
                "title": "CVE Tracker",
                "date": "Janvier 2026",
                "categories": ["security", "devops"],
                "description": (
                    "Systeme de veille et gestion des vulnerabilites CVE : agregation, scoring CVSS, alertes "
                    "et dashboard. Deployable en un docker-compose."
                ),
                "technologies": ["Next.js 15", "TypeScript", "Prisma", "SQLite", "Docker"],
                "repository_url": "https://github.com/AGL2304/Projet_CVE_Trackers",
            },
            {
                "id": "codearena",
                "title": "CodeArena",
                "date": "Octobre 2025",
                "categories": ["devops", "web"],
                "description": (
                    "Plateforme de competition de code en temps reel avec sandbox Docker pour execution securisee "
                    "du code utilisateur, leaderboard multijoueur via Socket.io et auth JWT."
                ),
                "technologies": ["Vue 3", "Pinia", "Node.js", "Express", "MongoDB", "Socket.io", "Docker"],
                "repository_url": "https://github.com/AGL2304/CodeArena_EcoleIT_Pisc",
            },
            {
                "id": "securevault",
                "title": "SecureVault",
                "date": "Septembre 2025",
                "categories": ["security", "web"],
                "description": (
                    "Gestionnaire de mots de passe securise avec chiffrement end-to-end cote client et "
                    "authentification multi-facteurs."
                ),
                "technologies": ["PHP", "Encryption", "2FA", "MySQL"],
                "repository_url": "https://github.com/AGL2304/securevault",
            },
            {
                "id": "parcours-qr",
                "title": "Parcours QR Code",
                "date": "Aout 2025",
                "categories": ["web"],
                "description": (
                    "Application Laravel de creation de parcours de visite interactifs via QR codes - "
                    "pensee pour musees et tourisme culturel."
                ),
                "technologies": ["Laravel", "Blade", "PHP", "MySQL"],
                "repository_url": "https://github.com/AGL2304/parcours_qr_code",
            },
            {
                "id": "travel-guides",
                "title": "Travel Guides",
                "date": "Juin 2025",
                "categories": ["web"],
                "description": (
                    "Guides de voyage collaboratifs developpes avec Symfony et Twig. Carte interactive, "
                    "contributions communautaires et profils utilisateurs."
                ),
                "technologies": ["Symfony", "Twig", "PostgreSQL", "API Maps"],
                "repository_url": "https://github.com/AGL2304/Travel_Guides",
            },
            {
                "id": "cloudninja-agl",
                "title": "CloudNinja AGL",
                "date": "Juin 2025",
                "categories": ["devops"],
                "description": (
                    "Application Node.js + scripts d'automatisation cloud avec CI GitHub Actions, "
                    "endpoints REST et health checks integres."
                ),
                "technologies": ["Node.js", "Express", "Bash", "GitHub Actions"],
                "repository_url": "https://github.com/AGL2304/cloudninja_agl-",
            },
            {
                "id": "infrastructure-devops",
                "title": "Infrastructure DevOps",
                "date": "Mai 2025",
                "categories": ["devops"],
                "description": (
                    "Infrastructure DevOps complete : containerisation, orchestration, automatisation des "
                    "deploiements et pipeline CI/CD bout-en-bout."
                ),
                "technologies": ["Docker", "Kubernetes", "Jenkins", "Monitoring"],
                "repository_url": "https://github.com/AGL2304/Projet_DevOps",
            },
            {
                "id": "biblioexchange",
                "title": "BiblioExchange",
                "date": "Decembre 2024",
                "categories": ["web"],
                "description": (
                    "Plateforme d'echange de livres entre utilisateurs : auth, catalogue, transactions, "
                    "recherche et profils."
                ),
                "technologies": ["Symfony", "Twig", "PostgreSQL", "TailwindCSS"],
                "repository_url": "https://github.com/AGL2304/BiblioExchange",
            },
        ],
        "skill_categories": [
            {
                "id": "langages-frameworks",
                "title": "Langages et Frameworks",
                "items": [
                    "Python (FastAPI, Django, Flask)",
                    "TypeScript (React, Vue.js, Node.js)",
                    "PHP (Laravel, Symfony)",
                    "Java, C/C++, Bash",
                    "SQL (PostgreSQL, MySQL, SQLite)",
                ],
            },
            {
                "id": "devops-cloud",
                "title": "DevOps et Cloud",
                "items": [
                    "Docker / Kubernetes (GKE)",
                    "CI/CD (GitHub Actions, GitLab CI)",
                    "IaC (Vagrant, Ansible)",
                    "Cloud (AWS, GCP)",
                    "Monitoring et observabilite",
                ],
            },
            {
                "id": "cybersecurite",
                "title": "Cybersecurite",
                "items": [
                    "Pentest / Red Team (Burp, Metasploit, Nmap, SQLmap)",
                    "Defense / Blue Team (Wireshark, Splunk, OWASP ZAP)",
                    "Scanners (Trivy, Snyk, Semgrep)",
                    "Crypto (JWT, bcrypt, AES, E2EE)",
                    "CTF (TryHackMe, HackTheBox, RootMe)",
                ],
            },
            {
                "id": "bases-donnees",
                "title": "Bases de donnees",
                "items": [
                    "PostgreSQL, MySQL, SQLite",
                    "Redis (cache, sessions)",
                    "MongoDB (NoSQL)",
                    "ORM (Prisma, SQLAlchemy, Eloquent)",
                    "Modelisation et optimisation",
                ],
            },
            {
                "id": "outils",
                "title": "Outils et OS",
                "items": [
                    "Git / GitHub / GitLab",
                    "Linux (admin systeme Debian, Ubuntu)",
                    "VS Code, Postman",
                    "Apache Hop (ETL)",
                    "Nginx, Apache, Traefik",
                ],
            },
            {
                "id": "soft-skills",
                "title": "Soft Skills",
                "items": [
                    "Travail en equipe pluridisciplinaire",
                    "Rigueur et esprit d'analyse",
                    "Adaptabilite et autonomie",
                    "Resolution de problemes complexes",
                    "Communication technique et vulgarisation",
                ],
            },
        ],
        "certifications": [
            {
                "id": "architecte-si",
                "title": "Architecte des Systemes d'Information",
                "subtitle": "Ecole-IT - Option DevOps & Cybersecurite - 2024/2026",
                "description": (
                    "Cursus pratique approfondi en architecture SI, DevOps, cloud et securite "
                    "offensive/defensive avec mises en situation reelles."
                ),
            },
            {
                "id": "hackathons-cyber",
                "title": "Hackathons & CTF",
                "subtitle": "TryHackMe - HackTheBox - RootMe",
                "description": (
                    "Participation active a des competitions de cybersecurite et des challenges de code, "
                    "en equipe et solo."
                ),
            },
            {
                "id": "ejpt",
                "title": "eJPT - eLearnSecurity Junior Penetration Tester",
                "subtitle": "En preparation - 2026",
                "description": (
                    "Certification pratique de pentest junior : recon, exploitation, post-exploitation, pivoting."
                ),
            },
            {
                "id": "oscp",
                "title": "OSCP - Offensive Security Certified Professional",
                "subtitle": "Objectif 2026/2027",
                "description": (
                    "Certification de reference en pentest offensif (24h d'examen pratique). "
                    "Preparation via labs HTB et PG."
                ),
            },
        ],
        "interests": [
            {
                "id": "ia",
                "title": "Intelligence Artificielle",
                "description": "LLMs, agents, automatisation des workflows.",
            },
            {
                "id": "open-source",
                "title": "Open Source",
                "description": "Contribution et veille active sur l'ecosysteme.",
            },
            {
                "id": "jeux-logique",
                "title": "Jeux de logique",
                "description": "CTF, puzzles, echecs - resolution de problemes.",
            },
            {
                "id": "veille-tech",
                "title": "Veille technologique",
                "description": "Threat intel, RSS, blogs securite et infra.",
            },
        ],
    }
