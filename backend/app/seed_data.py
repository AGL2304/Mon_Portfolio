def default_portfolio_content() -> dict:
    """Contenu initial du portfolio (utilise quand la base est vide).

    Toutes les valeurs sont editables ensuite via le panel admin
    (PUT /api/admin/content). Les uploads CV et photo metttent a jour
    automatiquement profile.cv_url et profile.profile_image.
    """
    return {
        "profile": {
            "full_name": "Georges Lionel ANANI",
            "headline": "Alternant Cybersecurite - Gouvernance, Risques & Conformite (GRC)",
            "tagline": "M1 - Ecole-IT Amiens - Gentilly (94)",
            "short_bio": (
                "Mastere Architectures Systemes, Reseaux & Securite (M1, Ecole-IT Amiens). "
                "Stagiaire Transformation Numerique & Conformite chez IRFA-APISUP. "
                "Audit & compliance (ISO 27001, HDS, DORA, NIS 2, RGPD), analyse de risques EBIOS, "
                "evaluation fournisseurs TPRM et sensibilisation cybersecurite. "
                "Disponible en alternance des septembre 2026."
            ),
            "about": (
                "Mon objectif : structurer la gouvernance, traduire la reglementation en controles "
                "concrets et automatiser leur verification — pour que la securite tienne dans le temps, "
                "pas seulement le jour de l'audit. Mon stage actuel chez IRFA-APISUP (audit Microsoft 365, "
                "cartographie de donnees sensibles, revue de droits SharePoint/Teams, animation de sessions "
                "de sensibilisation RGPD) m'a donne le terrain. Mon projet d'orchestration de donnees "
                "patients en pharmacie (contexte HDS) m'a appris a raisonner avec des contraintes sante. "
                "Ma veille active sur DORA, ISO 27001, NIS 2 et le Cyber Resilience Act me prepare a "
                "contribuer au pilotage du SMSI, a l'evaluation des fournisseurs et a la mise en "
                "conformite. Cote technique je reste hands-on : 5 parcours certifies sur TryHackMe "
                "(Red Teaming, Offensive Pentesting, Jr Penetration Tester, CompTIA Pentest+, Web "
                "Fundamentals), 185 salles, Top 1% mondial."
            ),
            "availability": "Alternance des Septembre 2026 - 3 sem. entreprise / 1 sem. ecole",
            "location": "Gentilly (94), France - Ecole a Amiens",
            "address": "103 Raymond Lefebvre, 94250 Gentilly",
            "phone": "06 11 73 73 89",
            "email": "charbelazon23@gmail.com",
            "github_url": "https://github.com/AGL2304",
            "linkedin_url": "https://www.linkedin.com/in/georges-lionel-c-a-anani-35256618b",
            "tryhackme_url": "https://tryhackme.com/p/agl23",
            "cv_url": "",  # rempli par upload admin
            "profile_image": "",  # rempli par upload admin
            "english_level": "C1 - certifie Gymglish",
        },
        "hero_tags": [
            "ISO 27001",
            "HDS",
            "DORA",
            "NIS 2",
            "RGPD / CNIL",
            "EBIOS Risk Manager",
            "NIST CSF",
            "OWASP Top 10",
            "TryHackMe Top 1%",
        ],
        "experiences": [
            {
                "id": "stage-irfa-apisup",
                "title": "Stagiaire Transformation Numerique & Conformite",
                "company": "IRFA-APISUP",
                "location": "Amiens",
                "period": "Janvier 2026 - Aujourd'hui",
                "current": True,
                "highlights": [
                    "Cartographie des usages Microsoft 365 (SharePoint, Teams, Power BI) sur ~150 utilisateurs et 8 entites, aboutissant a une cartographie des donnees sensibles et une matrice de risques RGPD priorisee en 3 vagues",
                    "Audit des droits d'acces SharePoint et Teams sur ~200 comptes, identifie 12 ecarts au principe du moindre privilege et formalise un plan de remediation a 90 jours en coherence avec la PSSI",
                    "Conception de 4 livrables d'audit (cartographies, matrice de risques, recommandations priorisees) et animation de 3 sessions de sensibilisation cybersecurite RGPD vulgarisees pour publics non techniques (RH, finance, direction)",
                    "Pilotage de la conduite du changement aupres de ~40 collaborateurs - supports pedagogiques (fiches reflexes, FAQ) et reporting d'avancement dans un tableau de bord KPI / KRI hebdomadaire",
                ],
            },
            {
                "id": "stage-devops-metio",
                "title": "Stagiaire DevOps & Developpement Web",
                "company": "METIO (ex Iteracode)",
                "location": "Amiens",
                "period": "Avril - Aout 2025",
                "current": False,
                "highlights": [
                    "Conception d'une application web Laravel avec architecture securisee (security by design) — gestion RBAC, JWT, validation des entrees, controle CSRF — deployee via conteneurisation Docker et pipeline CI/CD GitHub Actions sur Kubernetes (GKE)",
                    "Implementation des controles OWASP Top 10 (validation entrees, authentification JWT, sessions, chiffrement, CSRF) sur 100% des routes de l'application, en coherence avec une logique security by default",
                    "Automatisation du provisionnement d'infrastructure via Ansible — reduction du temps de deploiement de ~60% et fiabilisation des environnements de pre-production",
                ],
            },
            {
                "id": "stage-cyber-wildcode",
                "title": "Stagiaire Cybersecurite - Audit & Pentest",
                "company": "WildCode-Solutions",
                "location": "Amiens",
                "period": "Fevrier - Avril 2025",
                "current": False,
                "highlights": [
                    "3 missions d'audit de securite applicative sur cibles web et mobile pour des PME clientes — methodologie OWASP, qualification CVSS, formalisation de rapports structures (synthese executive + detail technique + plan d'action)",
                    "Identification et exploitation de ~15 vulnerabilites OWASP (injections SQL via sqlmap, XSS, defauts d'authentification), evaluation du risque selon le scoring CVSS et formulation des preconisations correctives priorisees",
                    "Veille CVE active sur les vulnerabilites emergentes (NVD, sources publiques) — socle direct du projet personnel CVE Tracker (CTI maison) developpe en autonomie ensuite",
                ],
            },
        ],
        "projects": [
            {
                "id": "audit-juiceshop-purple-team",
                "title": "Audit OWASP Juice Shop - Purple Team (M1PPAW)",
                "date": "Avril 2026",
                "categories": ["security", "grc"],
                "description": (
                    "Audit de securite Red/Purple/Blue Team de 4 jours sur OWASP Juice Shop v6.2.0 "
                    "(equipe M1PPAW de 4 membres, role Red Team Lead). "
                    "Methodologie PTES + OWASP Testing Guide v4.2. "
                    "5 vulnerabilites identifiees : SQLi UNION-based (CVSS 9.8), SQLi bypass auth "
                    "(CVSS 9.1), IDOR (CVSS 8.1), FTP null byte bypass (CVSS 7.5), XSS stocke avec "
                    "vol de JWT admin (CVSS 7.2). "
                    "Compromission complete en <30 min : dump de 22 comptes, crack de 4 mots de passe "
                    "(admin123), exfiltration de fichiers FTP (KeePass, bytecode). "
                    "Defense Blue Team : WAF Nginx + ModSecurity (8 regles custom), SIEM ELK Stack, "
                    "rate limiting. Validation Purple Team : 16 tests automatises, score 9/16 (56%) "
                    "avec plan de remediation a 14/16 (87%)."
                ),
                "technologies": [
                    "Kali Linux", "Burp Suite", "sqlmap", "John the Ripper", "Hashcat",
                    "Nginx", "ModSecurity", "ELK Stack", "Docker", "Python", "OWASP Top 10",
                ],
                "repository_url": None,
                "private_note": "Rapport d'audit confidentiel - disponible sur demande",
            },
            {
                "id": "n8n-pharmacie",
                "title": "Workflow n8n - Pharmacie (HDS / RGPD)",
                "date": "Avril 2026",
                "categories": ["grc"],
                "description": (
                    "Orchestration CRUD securisee entre Notion et Google Workspace pour la gestion de "
                    "~200 contacts patients et ordonnances (contexte HDS / RGPD). Logique upsert (dedup), "
                    "gestion d'erreurs, idempotence, chiffrement des credentials, sensibilisation aux "
                    "contraintes d'Hebergement de Donnees de Sante."
                ),
                "technologies": ["n8n", "Notion API", "Google Workspace", "OAuth2", "HDS", "RGPD"],
                "repository_url": None,
                "private_note": "Workflow secteur sante - prive",
            },
            {
                "id": "portail-irfa-apisup",
                "title": "Portail interne IRFA-APISUP",
                "date": "Mars 2026",
                "categories": ["grc", "web"],
                "description": (
                    "Conception et developpement du portail interne pour IRFA-APISUP : tableau de bord "
                    "KPI/KRI hebdomadaire, fiches reflexes, FAQ cybersecurite et zone documentaire de "
                    "conduite du changement (~40 collaborateurs)."
                ),
                "technologies": ["SharePoint", "Power BI", "React", "TypeScript", "M365 Graph API"],
                "repository_url": None,
                "private_note": "Projet interne - code non public",
            },
            {
                "id": "cve-tracker",
                "title": "CVE Tracker - CTI maison",
                "date": "Janvier 2026",
                "categories": ["grc", "security", "devops"],
                "description": (
                    "Plateforme de Cyber Threat Intelligence maison : collecte et qualification "
                    "automatisee de ~50 CVE/jour depuis NVD et MITRE ATT&CK, agregation et suivi temporel. "
                    "Demarche alignee avec les exigences de veille sur les menaces emergentes (NIS 2, "
                    "DORA, CRA)."
                ),
                "technologies": ["Next.js 15", "TypeScript", "Prisma", "SQLite", "Docker", "NVD API"],
                "repository_url": "https://github.com/AGL2304/Projet_CVE_Trackers",
                "private_note": None,
            },
            {
                "id": "secure-chat",
                "title": "Secure Chat E2E",
                "date": "Mai 2026",
                "categories": ["security", "web"],
                "description": (
                    "Messagerie chiffree bout-en-bout. Architecture E2E avec gestion des cles (la cle "
                    "privee ne quitte jamais le navigateur), WebSockets, FastAPI + JWT + bcrypt. "
                    "Comprehension pratique des protocoles cryptographiques — transposable aux enjeux de "
                    "protection des donnees patient."
                ),
                "technologies": ["FastAPI", "WebSocket", "JWT", "bcrypt", "SQLAlchemy", "Vite"],
                "repository_url": "https://github.com/AGL2304/Secure_Chat",
                "private_note": None,
            },
            {
                "id": "securevault",
                "title": "SecureVault - Gestionnaire de secrets",
                "date": "Septembre 2025",
                "categories": ["security", "web"],
                "description": (
                    "Gestionnaire de secrets chiffres (credentials, tokens API) : stockage chiffre au "
                    "repos, authentification JWT, audit log des acces. Illustration de security by design "
                    "appliquee a la gestion de donnees sensibles."
                ),
                "technologies": ["Python", "FastAPI", "PostgreSQL", "JWT", "Chiffrement symetrique"],
                "repository_url": "https://github.com/AGL2304/securevault",
                "private_note": None,
            },
            {
                "id": "keystroke-auditor",
                "title": "Keystroke Security Auditor",
                "date": "2025",
                "categories": ["security"],
                "description": (
                    "Etude des vecteurs d'attaque lies aux entrees clavier (keyloggers, side-channels) "
                    "et contre-mesures. Projet pedagogique en Python pour comprendre la surface "
                    "d'attaque cote endpoint."
                ),
                "technologies": ["Python", "Endpoint Security"],
                "repository_url": None,
                "private_note": "Projet pedagogique - prive",
            },
            {
                "id": "fileshare",
                "title": "FileShare",
                "date": "Mai 2026",
                "categories": ["security", "web", "devops"],
                "description": (
                    "Plateforme de partage de fichiers securisee : auth JWT (access 15min + refresh 7j), "
                    "liens partageables avec mot de passe, MIME whitelist, rate-limiting, storage "
                    "S3-compatible."
                ),
                "technologies": ["React", "TypeScript", "Fastify", "Prisma", "PostgreSQL", "Redis", "Docker"],
                "repository_url": "https://github.com/AGL2304/fileshare",
                "private_note": None,
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
                "private_note": None,
            },
            {
                "id": "codearena",
                "title": "CodeArena",
                "date": "Octobre 2025",
                "categories": ["devops", "web"],
                "description": (
                    "Plateforme de competition de code en temps reel avec sandbox Docker pour execution "
                    "securisee du code utilisateur, leaderboard multijoueur via Socket.io et auth JWT."
                ),
                "technologies": ["Vue 3", "Pinia", "Node.js", "Express", "MongoDB", "Socket.io", "Docker"],
                "repository_url": "https://github.com/AGL2304/CodeArena_EcoleIT_Pisc",
                "private_note": None,
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
                "private_note": None,
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
                "private_note": None,
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
                "private_note": None,
            },
            {
                "id": "infrastructure-devops",
                "title": "Infrastructure DevOps",
                "date": "Mai 2025",
                "categories": ["devops"],
                "description": (
                    "Infrastructure DevOps complete : containerisation, orchestration, automatisation "
                    "des deploiements et pipeline CI/CD bout-en-bout."
                ),
                "technologies": ["Docker", "Kubernetes", "Jenkins", "Monitoring"],
                "repository_url": "https://github.com/AGL2304/Projet_DevOps",
                "private_note": None,
            },
            {
                "id": "mon-app-simple",
                "title": "MonAppSimple",
                "date": "Mai 2025",
                "categories": ["web"],
                "description": (
                    "Application JavaScript minimaliste pour experimenter rapidement des concepts "
                    "front-end et tester des pipelines de deploiement."
                ),
                "technologies": ["JavaScript", "HTML", "CSS"],
                "repository_url": "https://github.com/AGL2304/MonAppSimple",
                "private_note": None,
            },
            {
                "id": "mon-projet-devops",
                "title": "MonProjetDevOps",
                "date": "Mai 2025",
                "categories": ["devops"],
                "description": (
                    "Stack Dockerisee pour tester orchestration et environnements multi-conteneurs : "
                    "labo personnel DevOps."
                ),
                "technologies": ["Dockerfile", "Docker Compose"],
                "repository_url": "https://github.com/AGL2304/MonProjetDevOps",
                "private_note": None,
            },
            {
                "id": "reservations-agl",
                "title": "Reservations AGL",
                "date": "Mai 2025",
                "categories": ["web"],
                "description": (
                    "Systeme de reservation web en PHP avec gestion des creneaux, utilisateurs et "
                    "statuts de reservation."
                ),
                "technologies": ["PHP", "MySQL", "Bootstrap"],
                "repository_url": "https://github.com/AGL2304/Reservations_AGL",
                "private_note": None,
            },
            {
                "id": "todo-app",
                "title": "ToDo App",
                "date": "Mars 2025",
                "categories": ["web"],
                "description": (
                    "Application de gestion de taches en PHP - CRUD complet, etats, filtres, "
                    "persistance MySQL."
                ),
                "technologies": ["PHP", "MySQL"],
                "repository_url": "https://github.com/AGL2304/ToDo_App",
                "private_note": None,
            },
            {
                "id": "docker-twitter",
                "title": "Docker Twitter",
                "date": "Mars 2025",
                "categories": ["devops", "web"],
                "description": (
                    "Clone Twitter dockerise : application PHP, base de donnees et reverse proxy "
                    "orchestres via Docker Compose."
                ),
                "technologies": ["PHP", "Docker", "MySQL", "Nginx"],
                "repository_url": "https://github.com/AGL2304/docker_twitter",
                "private_note": None,
            },
            {
                "id": "battle-python",
                "title": "Battle Python",
                "date": "Mars 2025",
                "categories": ["game"],
                "description": (
                    "Mini-jeu de combat en console implemente en Python pour exercer les patterns "
                    "OO et la gestion d'etat."
                ),
                "technologies": ["Python"],
                "repository_url": "https://github.com/AGL2304/Battle_python",
                "private_note": None,
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
                "private_note": None,
            },
            {
                "id": "snake-game",
                "title": "Snake Game",
                "date": "Decembre 2024",
                "categories": ["game"],
                "description": (
                    "Implementation Java du classique Snake : moteur de jeu, rendu, collisions, "
                    "score persistant."
                ),
                "technologies": ["Java", "Swing"],
                "repository_url": "https://github.com/AGL2304/Snake_game",
                "private_note": None,
            },
        ],
        "skill_categories": [
            {
                "id": "normes-reglementations",
                "title": "Normes & Reglementations",
                "items": [
                    "ISO 27001 (SMSI)",
                    "HDS - DORA - NIS 2",
                    "RGPD / CNIL - AIPD",
                    "Cyber Resilience Act (CRA)",
                    "NIST CSF - MITRE ATT&CK",
                    "Veille : AI Act (RIA), SecNumCloud, Post-Quantum Crypto",
                ],
            },
            {
                "id": "analyse-risques",
                "title": "Analyse de risques & resilience",
                "items": [
                    "EBIOS Risk Manager",
                    "Cartographie des risques",
                    "AIPD / PIA - evaluation fournisseurs (TPRM)",
                    "PCA / PRA / Plan de Resilience Numerique",
                    "Comitologie cybersecurite - KPI / KRI",
                ],
            },
            {
                "id": "audit-controle",
                "title": "Audit & controle",
                "items": [
                    "Revue de conformite ISO 27001 / HDS",
                    "Plans d'audit internes / externes",
                    "Qualification CVSS - recommandations priorisees",
                    "Tableaux de bord cybersecurite",
                    "Redaction PSSI - procedures - controles",
                ],
            },
            {
                "id": "securite-applicative",
                "title": "Securite applicative",
                "items": [
                    "OWASP Top 10 (SQLi, XSS, IDOR, SSRF)",
                    "Authentification JWT - sessions - CSRF",
                    "Chiffrement (AES, bcrypt, E2EE)",
                    "Security by design / by default",
                    "Conduite du changement & vulgarisation",
                ],
            },
            {
                "id": "pentest-cti",
                "title": "Pentest & Threat Intel",
                "items": [
                    "Burp Suite - Nmap - sqlmap",
                    "Metasploit - OpenVAS - Nessus",
                    "CTI - veille CVE - MITRE ATT&CK",
                    "TryHackMe (agl23 - Top 1% - 185 salles)",
                    "5 parcours certifies THM (Red Team, Pentest+, Jr Pentester...)",
                ],
            },
            {
                "id": "devsecops-cloud",
                "title": "DevSecOps & Cloud",
                "items": [
                    "Docker - Kubernetes (GKE)",
                    "CI/CD GitHub Actions - GitLab CI",
                    "Ansible - IaC",
                    "Scanners (Trivy, Snyk, Semgrep)",
                    "Monitoring & observabilite",
                ],
            },
            {
                "id": "langages-sgbd",
                "title": "Langages & SGBD",
                "items": [
                    "Python - FastAPI, Django, Flask",
                    "JavaScript - Node.js, Express, React, Vue",
                    "PHP - Laravel, Symfony",
                    "PostgreSQL - MySQL - SQLite",
                    "Bash - Java - C/C++",
                ],
            },
            {
                "id": "reseaux-langues",
                "title": "Reseaux & systemes - Langues",
                "items": [
                    "TCP/IP - HTTP/HTTPS - routing",
                    "Linux (Ubuntu, Debian) - Windows Server",
                    "Active Directory - Microsoft 365",
                    "Francais - natif",
                    "Anglais - C1 certifie Gymglish",
                ],
            },
            {
                "id": "soft-skills",
                "title": "Soft Skills",
                "items": [
                    "Autonomie - force de proposition",
                    "Rigueur - esprit d'analyse et de synthese",
                    "Pedagogie - vulgarisation pour non-tech",
                    "Polyvalence - sens ethique",
                    "Travail d'equipe pluridisciplinaire",
                ],
            },
        ],
        "certifications": [
            {
                "id": "mastere-archi-si",
                "title": "Mastere Architectures Systemes, Reseaux & Securite",
                "subtitle": "Ecole-IT, Amiens - M1 - 2025-2026",
                "description": "Cursus axe architecture SI, cybersecurite, DevOps et cloud - alternance prevue des septembre 2026.",
                "in_progress": True,
            },
            {
                "id": "bachelor-devops",
                "title": "Bachelor Informatique - specialite DevOps",
                "subtitle": "Ecole-IT, Amiens - 2024-2025",
                "description": "Containerisation, orchestration, CI/CD et automatisation d'infrastructure.",
                "in_progress": False,
            },
            {
                "id": "licence-info-ibn-tofail",
                "title": "Licence Informatique (Maths & Informatique)",
                "subtitle": "Universite Ibn Tofail, Kenitra (Maroc) - 2023-2024",
                "description": "Algorithmique, structures de donnees, bases mathematiques.",
                "in_progress": False,
            },
            {
                "id": "deust-mip",
                "title": "DEUST Mathematiques, Informatique, Physique",
                "subtitle": "Universite Moulay Ismail / FST Errachidia (Maroc) - 2020-2023",
                "description": "Tronc commun scientifique avec specialisation progressive en informatique.",
                "in_progress": False,
            },
            {
                "id": "tryhackme-top1",
                "title": "TryHackMe - Top 1% mondial (agl23)",
                "subtitle": "185 salles - 22 badges - 5 parcours certifies",
                "description": "Red Teaming, Offensive Pentesting, Jr Penetration Tester, CompTIA Pentest+, Web Fundamentals.",
                "in_progress": False,
            },
            {
                "id": "ebios-rm",
                "title": "EBIOS Risk Manager",
                "subtitle": "Formation ecole - Mastere",
                "description": "Methode d'appreciation et de traitement des risques cyber promue par l'ANSSI.",
                "in_progress": True,
            },
            {
                "id": "iso-27001-li",
                "title": "ISO 27001 Lead Implementer",
                "subtitle": "Auto-formation - 2026",
                "description": "Mise en oeuvre d'un SMSI conforme a la norme ISO/IEC 27001.",
                "in_progress": True,
            },
            {
                "id": "anglais-c1",
                "title": "Anglais C1 - certifie Gymglish",
                "subtitle": "Veille reglementaire continue",
                "description": "Veille : DORA, NIS 2, AI Act (RIA), Cyber Resilience Act, SecNumCloud.",
                "in_progress": False,
            },
        ],
        "interests": [
            {
                "id": "veille-conformite",
                "title": "Veille cyber & conformite",
                "description": "DORA, NIS 2, AI Act, HDS.",
                "emoji": "📡",
            },
            {
                "id": "ctf",
                "title": "Capture The Flag",
                "description": "TryHackMe, Root-Me, HackTheBox, VulnHub.",
                "emoji": "🚩",
            },
            {
                "id": "associatif",
                "title": "Engagement associatif",
                "description": "ASEBEM, CESAM.",
                "emoji": "🤝",
            },
            {
                "id": "football",
                "title": "Football amateur",
                "description": "Sport collectif & cohesion.",
                "emoji": "⚽",
            },
        ],
    }
