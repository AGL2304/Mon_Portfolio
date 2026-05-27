# Politique de Sécurité des Systèmes d'Information (PSSI) — modèle

> Trame **réutilisable** pour une PME / ETI. À personnaliser : nom de
> l'organisation, signatures, références internes. Validée par la direction
> avant publication.

---

**Référence** : `PSSI-001`
**Version** : 0.1 — `YYYY-MM-DD`
**Classification** : Interne
**Validation** : `CODIR du YYYY-MM-DD`
**Prochaine revue** : Annuelle (`YYYY-MM-DD`)

---

## 1. Objet et engagement de la direction

La présente Politique de Sécurité des Systèmes d'Information (PSSI)
définit les principes, règles et responsabilités qui s'appliquent à
**[Organisation]** en matière de protection de l'information.

La direction reconnaît que la sécurité de l'information est un enjeu
stratégique. Elle s'engage à :

- Fournir les ressources nécessaires (humaines, financières, techniques)
- Approuver et faire respecter la présente PSSI
- Promouvoir une culture de sécurité auprès de tous les collaborateurs

> Signature du Directeur Général : ____________________ Date : __________

## 2. Périmètre

La PSSI s'applique à :

- **Personnes** : tous les salariés, intérimaires, stagiaires, prestataires
- **Informations** : toute donnée numérique ou physique appartenant à l'organisation ou confiée par un tiers
- **Systèmes** : SI internes, services cloud, postes utilisateurs, équipements mobiles, IoT
- **Locaux** : sites de l'organisation et environnements de télétravail

## 3. Référentiels applicables

| Référentiel | Statut | Pilote |
|---|---|---|
| ISO/IEC 27001:2022 | Cadre cible (certif visée Q4 2027) | RSSI |
| Hygiène ANSSI (42 mesures) | Socle obligatoire | RSSI |
| RGPD | Obligation légale | DPO |
| NIS 2 (si OSE/OES) | Obligation légale | RSSI + DPO |
| HDS (si données de santé) | Selon traitement | DPO |

## 4. Gouvernance et rôles

| Rôle | Mission principale |
|---|---|
| **Direction Générale** | Approuver la PSSI, arbitrer les risques résiduels |
| **RSSI** | Décliner la PSSI, animer le SMSI, reporter au CODIR |
| **DPO** | Conformité RGPD, registre des traitements, DPIA |
| **DSI / IT Manager** | Mise en œuvre opérationnelle des mesures techniques |
| **Métiers** | Propriétaires des données, classification, accès |
| **Tous les collaborateurs** | Respecter la charte informatique, signaler les incidents |

## 5. Classification de l'information

| Niveau | Description | Marquage | Exemple |
|---|---|---|---|
| **Public** | Diffusion libre | Aucun | Site web institutionnel |
| **Interne** | Diffusion limitée à l'organisation | `[INTERNE]` | Note de service |
| **Confidentiel** | Accès sur le besoin d'en connaître | `[CONFIDENTIEL]` | Données RH, contrats clients |
| **Secret** | Diffusion strictement nominative | `[SECRET]` | Plans stratégiques, données R&D sensibles |

## 6. Principes de sécurité

### 6.1 Contrôle d'accès

- **Moindre privilège** appliqué partout
- **MFA obligatoire** pour tout accès distant et tout compte privilégié
- **Comptes nominatifs** uniquement (pas de compte partagé sans dérogation RSSI)
- **Revue semestrielle** des droits par les propriétaires métier

### 6.2 Cryptographie

- Données au repos : **AES-256**
- Données en transit : **TLS 1.2+** (1.3 préféré)
- Secrets : coffre-fort dédié (CyberArk, Vault, Key Vault)
- Clés gérées selon politique `CRYPTO-001`

### 6.3 Sauvegardes

- Stratégie **3-2-1** : 3 copies, 2 supports différents, 1 hors site
- **Sauvegardes immuables** sur 30 jours minimum (anti-ransomware)
- **Tests de restauration mensuels** documentés

### 6.4 Journalisation et supervision

- Logs centralisés (SIEM) avec rétention **90 jours minimum** (1 an pour les incidents)
- Supervision 24/7 sur les systèmes critiques
- Alertes corrélées et triées par le SOC

### 6.5 Gestion des vulnérabilités

| Sévérité | Délai de remédiation |
|---|---|
| Critique (CVSS ≥ 9.0) | 7 jours |
| Haute (7.0–8.9) | 30 jours |
| Moyenne (4.0–6.9) | 90 jours |
| Basse (< 4.0) | Best effort |

### 6.6 Sécurité du développement

- **SDLC sécurisé** : threat modeling, revue de code, SAST/DAST/SCA en CI
- **Branch protection** : revues obligatoires, signature des commits
- **Pas de secrets** dans le code (gitleaks, pre-commit hooks)

### 6.7 Gestion des fournisseurs (TPRM)

- Évaluation sécurité **avant contractualisation** (questionnaire + revue)
- **Clauses contractuelles** : annexe sécurité type
- **Audit annuel** des fournisseurs critiques
- SBOM exigé pour les composants logiciels intégrés

### 6.8 Sensibilisation

- **Formation obligatoire** à l'embauche puis annuelle (100 % effectif)
- **Phishing simulé** trimestriel
- **Communications régulières** (newsletter, affiches, intranet)

## 7. Gestion des incidents

- Procédure **IRP** documentée (`IRP-001`)
- **Signalement** via : `security@[organisation].com` ou outil dédié
- **Délai de notification** :
  - CODIR : sous 1 h pour incident critique
  - CNIL : sous 72 h si violation de données personnelles (art. 33 RGPD)
  - ANSSI : selon NIS 2 / LPM si applicable
- **Post-mortem** systématique avec plan d'action

## 8. Continuité d'activité

- **PCA / PRA** approuvés par la direction
- Tests **annuels** documentés
- **RTO / RPO** définis par service métier (cf. BIA)

## 9. Conformité et audit

- **Audit interne SSI** annuel
- **Audit externe** tous les 2 ans
- **Revue de direction** semestrielle (KPI / KRI)
- **Veille réglementaire** trimestrielle (juridique + RSSI)

## 10. Sanctions

Le non-respect de la PSSI peut entraîner :

- Sanctions disciplinaires (cf. règlement intérieur)
- Sanctions pénales en cas de fraude (art. 323-1 et s. du Code pénal)
- Résiliation contractuelle pour les prestataires

## 11. Documents associés

- Charte informatique (`CHARTE-001`)
- Politique cryptographique (`CRYPTO-001`)
- Procédure IRP (`IRP-001`)
- Procédure TPRM (`TPRM-001`)
- Plan de continuité (`PCA-V3`)
- Registre des traitements RGPD ([CSV](registre-traitements-rgpd.csv))
- Matrice de contrôles ISO 27001 ([CSV](iso-27001-control-matrix.csv))

## 12. Historique des versions

| Version | Date | Auteur | Modifications |
|---|---|---|---|
| 0.1 | `YYYY-MM-DD` | RSSI | Création initiale |

---

_Trame open-source — MIT. Adaptez à votre contexte avant publication._
