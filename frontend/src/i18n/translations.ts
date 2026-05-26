/**
 * i18n minimal — pas de dependance externe.
 * Usage : const t = useT(); t('nav.about')
 *
 * NOTE : seules les chaines de l'interface (chrome React) sont traduites.
 * Le CONTENU (profile.short_bio, projects[].description, etc.) provient
 * de l'API backend et n'est pas traduit cote front. Pour un contenu
 * entierement bilingue, ajouter des champs `_en` aux schemas backend.
 */

export type Lang = "fr" | "en";

export const SUPPORTED_LANGS: Lang[] = ["fr", "en"];

// Le type de reference est extrait du dictionnaire FR (le plus complet).
// Les autres langues doivent matcher la meme forme.
type DictShape = typeof FR_DICT;

const FR_DICT = {
  common: {
    loading: "Chargement du portfolio…",
    loadError: "Impossible de charger le portfolio.",
    switchToEN: "English version",
    switchToFR: "Version française",
  },
  nav: {
    menu: "Menu",
    about: "À propos",
    projects: "Projets",
    experience: "Expérience",
    skills: "Stack",
    certifications: "Formation",
    grc: "GRC",
    contact: "Me contacter",
    adminPanel: "Espace admin",
  },
  hero: {
    availableTitle: "Disponible",
    titleLine1: "Alternant",
    titleLine1Tag: "GRC.",
    titleLine2: "Cybersécurité · Conformité · Risques.",
    ctaProjects: "Voir mes projets →",
    ctaCV: "📄 Télécharger mon CV",
    metricProjects: "Projets",
    metricInternships: "Stages cyber/DevOps",
    metricThm: "Salles TryHackMe",
    metricEnglish: "Anglais · Gymglish",
  },
  about: {
    eyebrow: "// 01. À propos",
    titleStart: "Audit, risques, automatisation —",
    titleEnd: "le triangle de la sécu durable.",
    sub: "Mon objectif : structurer la gouvernance, traduire la réglementation en contrôles concrets, et automatiser leur vérification — pour que la sécurité tienne dans le temps, pas seulement le jour de l'audit.",
    currentLabel: "Stage en cours :",
    currentMiddle: "chez",
    focus: {
      auditTitle: "Audit & Compliance",
      auditDesc: "ISO 27001 (SMSI), HDS, DORA, NIS 2, RGPD, CRA, NIST CSF.",
      riskTitle: "Risques",
      riskDesc: "EBIOS RM, AIPD, TPRM, PCA/PRA, comitologie, KPI/KRI.",
      devsecopsTitle: "DevSecOps",
      devsecopsDesc: "Docker, K8s (GKE), GitHub Actions, Ansible, scanners.",
      pentestTitle: "Pentest & CTI",
      pentestDesc: "Burp, Nmap, sqlmap, Metasploit, OpenVAS, Nessus, MITRE ATT&CK.",
    },
  },
  projects: {
    eyebrow: "// 02. Projets",
    title: "Projets publiés.",
    sub: "Projets en environnement régulé (HDS / RGPD), CTI maison et travaux de pentest — filtrables par domaine.",
    filterAll: "Tous",
    filterGrc: "GRC / Conformité",
    filterSecurity: "Sécurité / Pentest",
    filterDevops: "DevOps",
    filterWeb: "Web",
    filterLabs: "Labs",
  },
  grc: {
    eyebrow: "// 03. Livrables GRC publics",
    titleStart: "Mes templates GRC",
    titleEnd: "en open-source.",
    sub: "Documents types que je produis sur des missions d'audit / conseil — anonymisés ou cas d'école. Réutilisables sous licence MIT.",
    browseAll: "Parcourir tous les livrables",
    alsoOnGithub: "Voir aussi sur GitHub",
    cards: {
      isoTitle: "Matrice de contrôles ISO 27001:2022",
      isoBadge: "93 contrôles",
      isoSub: "Annexe A · statut, preuve, échéance, pilote",
      isoDesc:
        "Disponible en Markdown (lecture) et CSV (Excel/Sheets). Top 10 écarts priorisés inclus.",
      isoLinkMd: "Markdown",
      isoLinkCsv: "CSV",
      ebiosTitle: "Template d'analyse EBIOS Risk Manager",
      ebiosBadge: "5 ateliers",
      ebiosSub: "Méthode ANSSI 2018 · mappé MITRE ATT&CK",
      ebiosDesc:
        "Squelette complet : cadrage, sources de risque, scénarios stratégiques & opérationnels, traitement, risques résiduels acceptés.",
      rgpdTitle: "Registre des traitements RGPD",
      rgpdBadge: "10 traitements",
      rgpdSub: "Article 30 RGPD · modèle CNIL",
      rgpdDesc:
        "Paie, recrutement, vidéosurveillance, newsletter, badges, évaluation, logs, cookies, incidents, whistleblowing.",
      pssiTitle: "Politique de Sécurité SI (PSSI)",
      pssiBadge: "Modèle PME",
      pssiSub: "12 chapitres · prête à personnaliser",
      pssiDesc:
        "Engagement direction, gouvernance, classification, contrôle d'accès, chiffrement, incidents, continuité, conformité, sanctions.",
    },
  },
  experience: {
    eyebrow: "// 04. Expérience",
    title: "Parcours pro.",
    sub: "Trois stages complémentaires : audit M365 / RGPD, DevSecOps Kubernetes, audit pentest.",
  },
  skills: {
    eyebrow: "// 05. Stack technique",
    title: "Compétences techniques.",
    sub: "Normes, analyse de risques, audit, sécurité applicative, outils de pentest et DevSecOps.",
  },
  certs: {
    eyebrow: "// 06. Formation & certifications",
    title: "Parcours académique & certifs.",
    sub: "Cursus diplômant en France et au Maroc + certifications cyber en cours.",
    inProgress: "En cours",
  },
  interests: {
    eyebrow: "// 07. Centres d'intérêt",
    title: "Hors clavier.",
  },
  contact: {
    title: "On échange ?",
    sub: "Alternance Cybersécurité GRC dès septembre 2026 · rythme 3 sem. entreprise / 1 sem. école. Disponible pour des entretiens en visio ou sur Paris.",
    mailSubject: "Alternance Cybersécurité GRC",
    ctaCV: "📄 Télécharger mon CV",
  },
  footer: {
    cv: "CV (PDF)",
  },
  adminLogin: {
    heading: "🔐 Espace administrateur",
    sub: "Édition du contenu du portfolio (profil, projets, expériences, CV, photo).",
    labelEmail: "Email",
    labelPassword: "Mot de passe",
    submit: "Se connecter →",
    submitting: "Connexion…",
    fallbackError: "Connexion impossible.",
    backToSite: "← Retour au site",
  },
  terminal: {
    promptHost: "georges@grc-lab",
    cmdWhoami: "whoami",
    whoamiOut: (name: string, role: string) => `→ ${name} · ${role}`,
    cmdProfile: "cat profile.json | jq",
    targetLabel: "Alternance GRC",
    targetSuffix: "Septembre 2026",
    rhythm: "3 sem. entreprise / 1 sem. école",
    cmdStatus: "./status.sh",
    currentInternship: (company: string) => `Stage en cours · ${company}`,
    cert: "EBIOS Risk Manager · ISO 27001 Lead Implementer (en cours)",
    openToInterviews: "Ouvert aux entretiens — réponse sous 24h",
  },
};

const EN_DICT: DictShape = {
  common: {
    loading: "Loading portfolio…",
    loadError: "Unable to load the portfolio.",
    switchToEN: "English version",
    switchToFR: "Version française",
  },
  nav: {
    menu: "Menu",
    about: "About",
    projects: "Projects",
    experience: "Experience",
    skills: "Stack",
    certifications: "Education",
    grc: "GRC",
    contact: "Contact me",
    adminPanel: "Admin panel",
  },
  hero: {
    availableTitle: "Available",
    titleLine1: "",
    titleLine1Tag: "GRC apprentice.",
    titleLine2: "Cybersecurity · Compliance · Risk.",
    ctaProjects: "See my projects →",
    ctaCV: "📄 Download my résumé",
    metricProjects: "Projects",
    metricInternships: "Cyber/DevOps internships",
    metricThm: "TryHackMe rooms",
    metricEnglish: "English · Gymglish",
  },
  about: {
    eyebrow: "// 01. About",
    titleStart: "Audit, risk, automation —",
    titleEnd: "the triangle of durable security.",
    sub: "My goal: shape governance, translate regulation into concrete controls, and automate their verification — so security stands up over time, not just on audit day.",
    currentLabel: "Current internship:",
    currentMiddle: "at",
    focus: {
      auditTitle: "Audit & Compliance",
      auditDesc: "ISO 27001 (ISMS), DORA, NIS 2, GDPR, CRA, NIST CSF.",
      riskTitle: "Risk",
      riskDesc: "EBIOS RM, DPIA, TPRM, BCP/DRP, governance bodies, KPI/KRI.",
      devsecopsTitle: "DevSecOps",
      devsecopsDesc: "Docker, K8s (GKE), GitHub Actions, Ansible, scanners.",
      pentestTitle: "Pentest & CTI",
      pentestDesc: "Burp, Nmap, sqlmap, Metasploit, OpenVAS, Nessus, MITRE ATT&CK.",
    },
  },
  projects: {
    eyebrow: "// 02. Projects",
    title: "Published work.",
    sub: "Projects in regulated environments (HDS / GDPR), home-grown CTI tooling and pentest work — filter by domain.",
    filterAll: "All",
    filterGrc: "GRC / Compliance",
    filterSecurity: "Security / Pentest",
    filterDevops: "DevOps",
    filterWeb: "Web",
    filterLabs: "Labs",
  },
  grc: {
    eyebrow: "// 03. Open-source GRC deliverables",
    titleStart: "My GRC templates",
    titleEnd: "in the open.",
    sub: "Sample deliverables I produce on audit / advisory engagements — anonymized or case-study material. MIT-licensed.",
    browseAll: "Browse all deliverables",
    alsoOnGithub: "Also on GitHub",
    cards: {
      isoTitle: "ISO 27001:2022 control matrix",
      isoBadge: "93 controls",
      isoSub: "Annex A · status, evidence, due date, owner",
      isoDesc:
        "Available as Markdown (reading) and CSV (Excel/Sheets). Top 10 prioritized gaps included.",
      isoLinkMd: "Markdown",
      isoLinkCsv: "CSV",
      ebiosTitle: "EBIOS Risk Manager analysis template",
      ebiosBadge: "5 workshops",
      ebiosSub: "French ANSSI method (2018) · mapped to MITRE ATT&CK",
      ebiosDesc:
        "Complete skeleton: scoping, threat sources, strategic & operational scenarios, treatment, accepted residual risks.",
      rgpdTitle: "GDPR records of processing",
      rgpdBadge: "10 records",
      rgpdSub: "GDPR Article 30 · French CNIL model",
      rgpdDesc:
        "Payroll, recruitment, CCTV, newsletter, badges, performance reviews, logs, cookies, incidents, whistleblowing.",
      pssiTitle: "Information Security Policy (ISSP)",
      pssiBadge: "SMB template",
      pssiSub: "12 chapters · ready to customize",
      pssiDesc:
        "Leadership commitment, governance, classification, access control, cryptography, incidents, continuity, compliance, sanctions.",
    },
  },
  experience: {
    eyebrow: "// 04. Experience",
    title: "Career so far.",
    sub: "Three complementary internships: M365 / GDPR audit, Kubernetes DevSecOps, pentest engagements.",
  },
  skills: {
    eyebrow: "// 05. Technical stack",
    title: "Technical skills.",
    sub: "Standards, risk assessment, audit, application security, pentest tooling and DevSecOps.",
  },
  certs: {
    eyebrow: "// 06. Education & certifications",
    title: "Academic path & certs.",
    sub: "Diplomas earned in France and Morocco + cybersecurity certifications in progress.",
    inProgress: "In progress",
  },
  interests: {
    eyebrow: "// 07. Interests",
    title: "Off-keyboard.",
  },
  contact: {
    title: "Let's talk.",
    sub: "Cybersecurity GRC apprenticeship from September 2026 · 3 weeks on-site / 1 week at school. Available for video calls or in-person interviews in the Paris area.",
    mailSubject: "GRC Cybersecurity Apprenticeship",
    ctaCV: "📄 Download my résumé",
  },
  footer: {
    cv: "Résumé (PDF)",
  },
  adminLogin: {
    heading: "🔐 Admin panel",
    sub: "Edit the portfolio content (profile, projects, experience, résumé, photo).",
    labelEmail: "Email",
    labelPassword: "Password",
    submit: "Sign in →",
    submitting: "Signing in…",
    fallbackError: "Sign-in failed.",
    backToSite: "← Back to site",
  },
  terminal: {
    promptHost: "georges@grc-lab",
    cmdWhoami: "whoami",
    whoamiOut: (name: string, role: string) => `→ ${name} · ${role}`,
    cmdProfile: "cat profile.json | jq",
    targetLabel: "GRC apprenticeship",
    targetSuffix: "September 2026",
    rhythm: "3 weeks on-site / 1 week at school",
    cmdStatus: "./status.sh",
    currentInternship: (company: string) => `Current internship · ${company}`,
    cert: "EBIOS Risk Manager · ISO 27001 Lead Implementer (in progress)",
    openToInterviews: "Open to interviews — reply within 24h",
  },
};

export const translations: Record<Lang, DictShape> = {
  fr: FR_DICT,
  en: EN_DICT,
};

export type TranslationDict = DictShape;
