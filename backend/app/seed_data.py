def default_portfolio_content() -> dict:
    return {
        "profile": {
            "full_name": "ANANI Georges Lionel",
            "headline": "Ingenieur Cybersecurite et DevOps",
            "short_bio": (
                "Passionne par la cybersecurite et l'automatisation DevOps, "
                "je concois et deploie des solutions securisees et performantes."
            ),
            "about": (
                "Etudiant en cycle ingenieur specialise en cybersecurite, "
                "avec une experience en administration systeme/reseau et "
                "developpement d'applications securisees."
            ),
            "location": "Amiens, France",
            "email": "charbelazob23@gmail.com",
            "github_url": "https://github.com/votre-username",
            "linkedin_url": "https://linkedin.com/in/anani-georges",
            "cv_url": "#",
            "profile_image": "",
        },
        "hero_tags": [
            "Cybersecurite",
            "DevOps",
            "Docker/Kubernetes",
            "CI/CD",
            "Python",
            "FastAPI",
        ],
        "experiences": [
            {
                "id": "stage-devops-metio",
                "title": "Stage DevOps",
                "company": "METIO",
                "period": "Mai - Septembre 2025",
                "highlights": [
                    "Containerisation d'applications Node.js avec Docker",
                    "Deploiement sur Kubernetes via GKE",
                    "Mise en place d'un pipeline CI/CD",
                ],
            },
            {
                "id": "stage-cyber-wildcode",
                "title": "Stage Cybersecurite",
                "company": "WildCode-Solutions",
                "period": "Fevrier - Avril 2025",
                "highlights": [
                    "Audit de securite d'applications web",
                    "Analyse et correction de vulnerabilites",
                    "Redaction de rapports techniques et recommandations",
                ],
            },
            {
                "id": "tele-enqueteur-mediametrie",
                "title": "Tele-enqueteur",
                "company": "Mediametrie, Amiens",
                "period": "Mars 2025 - Present",
                "highlights": [
                    "Collecte et analyse de donnees",
                    "Gestion de questionnaires et suivi qualite",
                ],
            },
        ],
        "projects": [
            {
                "id": "ecolearn-ai",
                "title": "EcoLearn AI",
                "date": "2025",
                "categories": ["ai", "web"],
                "description": (
                    "Application web d'apprentissage intelligent avec gestion "
                    "d'utilisateurs, cours et suivi des progres."
                ),
                "technologies": ["FastAPI", "PostgreSQL", "Docker", "React", "Tailwind CSS"],
                "repository_url": "https://github.com/votre-username/EcolearnIA",
            },
            {
                "id": "biblioexchange",
                "title": "Biblioexchange",
                "date": "Decembre 2024",
                "categories": ["web"],
                "description": "Plateforme web d'echange de livres entre utilisateurs.",
                "technologies": ["Symfony", "Tailwind CSS", "PostgreSQL", "Twig"],
                "repository_url": "https://github.com/votre-username/BiblioExchange",
            },
            {
                "id": "audit-cyber",
                "title": "Outil d'Audit Cybersecurite",
                "date": "2025",
                "categories": ["security"],
                "description": (
                    "Outil web pour faciliter les audits de securite et la generation "
                    "automatique de rapports."
                ),
                "technologies": ["PHP", "Laravel", "SQL", "Security Tools"],
                "repository_url": None,
            },
            {
                "id": "codearena",
                "title": "CodeArena",
                "date": "Octobre 2025",
                "categories": ["devops", "web"],
                "description": (
                    "Plateforme de competition de code en temps reel avec sandbox Docker "
                    "securise et authentification JWT."
                ),
                "technologies": ["Vue.js", "Docker", "JWT", "WebSocket"],
                "repository_url": "https://github.com/votre-username/CodeArena_EcoleIT_Pisc",
            },
            {
                "id": "cve-trackers",
                "title": "CVE Trackers",
                "date": "Janvier 2025",
                "categories": ["security"],
                "description": "Systeme de surveillance des vulnerabilites CVE et alertes.",
                "technologies": ["Python", "CVE API", "Security", "Automation"],
                "repository_url": "https://github.com/votre-username/Projet_CVE_Trackers",
            },
            {
                "id": "securevault",
                "title": "SecureVault",
                "date": "Septembre 2025",
                "categories": ["security", "web"],
                "description": (
                    "Gestionnaire de mots de passe securise avec chiffrement "
                    "end-to-end et authentification multi-facteurs."
                ),
                "technologies": ["PHP", "Encryption", "2FA", "MySQL"],
                "repository_url": "https://github.com/votre-username/securevault",
            },
            {
                "id": "travel-guides",
                "title": "Travel Guides",
                "date": "Juin 2025",
                "categories": ["web"],
                "description": "Application web de guides de voyage collaboratifs.",
                "technologies": ["Symfony", "Twig", "PostgreSQL", "API Maps"],
                "repository_url": "https://github.com/votre-username/Travel_Guides",
            },
            {
                "id": "cloudninja-agl",
                "title": "CloudNinja AGL",
                "date": "Juin 2025",
                "categories": ["devops"],
                "description": (
                    "Infrastructure cloud automatisee avec scripts de deploiement, "
                    "pipeline CI/CD et monitoring."
                ),
                "technologies": ["Bash", "Cloud", "CI/CD", "Automation"],
                "repository_url": "https://github.com/votre-username/cloudninja_agl-",
            },
            {
                "id": "infrastructure-devops",
                "title": "Infrastructure DevOps",
                "date": "Mai 2025",
                "categories": ["devops"],
                "description": (
                    "Infrastructure DevOps complete avec containerisation, "
                    "orchestration et automatisation des deploiements."
                ),
                "technologies": ["Docker", "Kubernetes", "Jenkins", "Monitoring"],
                "repository_url": "https://github.com/votre-username/Projet_DevOps",
            },
        ],
        "skill_categories": [
            {
                "id": "langages-frameworks",
                "title": "Langages et Frameworks",
                "items": [
                    "Python (FastAPI, Django, Flask)",
                    "PHP (Symfony, Laravel)",
                    "JavaScript (Node.js, Express.js)",
                    "React / Tailwind CSS",
                    "SQL (PostgreSQL, MySQL)",
                ],
            },
            {
                "id": "devops-cloud",
                "title": "DevOps et Cloud",
                "items": [
                    "Docker / Kubernetes",
                    "CI/CD",
                    "GKE (Google Kubernetes Engine)",
                    "Vagrant / Ansible",
                    "Monitoring et Automation",
                ],
            },
            {
                "id": "cybersecurite",
                "title": "Cybersecurite",
                "items": [
                    "Tests d'intrusion",
                    "Audit de securite",
                    "Analyse de vulnerabilites (CVE)",
                    "Securite reseau",
                    "Chiffrement et authentification",
                ],
            },
            {
                "id": "bases-donnees",
                "title": "Bases de donnees",
                "items": [
                    "PostgreSQL",
                    "MySQL",
                    "SQL avance",
                    "Optimisation de requetes",
                    "Modelisation de donnees",
                ],
            },
            {
                "id": "outils",
                "title": "Outils",
                "items": [
                    "Git / GitHub",
                    "VS Code",
                    "Linux (administration systeme)",
                    "Postman",
                    "Apache Hop",
                ],
            },
            {
                "id": "soft-skills",
                "title": "Soft Skills",
                "items": [
                    "Travail en equipe",
                    "Rigueur et organisation",
                    "Adaptabilite",
                    "Resolution de problemes",
                    "Communication technique",
                ],
            },
        ],
        "certifications": [
            {
                "id": "architecte-si",
                "title": "Titre d'Architecte des systemes d'information",
                "subtitle": "Option DevOps - Ecole-IT",
                "description": (
                    "Formation pratique approfondie en DevOps et Cloud Computing "
                    "avec mise en situation reelle."
                ),
            },
            {
                "id": "hackathons-cyber",
                "title": "Hackathons et Challenges Techniques",
                "subtitle": "Cybersecurite",
                "description": (
                    "Participation active a des competitions de cybersecurite "
                    "et challenges de code."
                ),
            },
        ],
        "interests": [
            {
                "id": "ia",
                "title": "Intelligence Artificielle",
                "description": "Exploration des dernieres innovations en IA.",
            },
            {
                "id": "open-source",
                "title": "Open Source",
                "description": "Contribution a la communaute tech.",
            },
            {
                "id": "jeux-logique",
                "title": "Jeux de logique",
                "description": "Resolution de problemes complexes.",
            },
            {
                "id": "veille-tech",
                "title": "Veille technologique",
                "description": "Suivi continu des nouvelles technologies.",
            },
        ],
    }

