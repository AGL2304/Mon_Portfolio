# Template d'analyse de risques — EBIOS Risk Manager

> Squelette d'analyse de risques selon la méthode **EBIOS RM** (ANSSI, 2018).
> 5 ateliers à mener dans l'ordre. Adapter à votre contexte.

---

## Métadonnées de l'étude

| Champ            | Valeur                                                     |
| ---------------- | ---------------------------------------------------------- |
| Objet de l'étude | _ex : Application RH SaaS hébergée chez fournisseur tiers_ |
| Sponsor          | _Direction Métier concernée_                               |
| Pilote EBIOS RM  | _Nom + rôle_                                               |
| Périmètre        | _ex : flux RH, données salariés, intégrations SIRH_        |
| Période couverte | _ex : 2026-2028_                                           |
| Version          | 0.1 — `YYYY-MM-DD`                                         |
| Validation       | _CODIR / COMEX / Comité Risques_                           |

---

## Atelier 1 — Cadrage et socle de sécurité

### 1.1 Valeurs métier

| ID    | Valeur métier    | Description               | Besoin DICP (Disp/Intég/Confid/Preuve) |
| ----- | ---------------- | ------------------------- | -------------------------------------- |
| VM-01 | Données salariés | Identité, contrats, paie  | C4 / I3 / D2 / P2                      |
| VM-02 | Processus paie   | Calcul + virement mensuel | D4 / I4 / C3 / P3                      |
| VM-03 | _…_              |                           |                                        |

### 1.2 Biens supports

| ID    | Bien support            | Type        | Valeurs métier supportées |
| ----- | ----------------------- | ----------- | ------------------------- |
| BS-01 | SaaS SIRH (Hébergeur X) | Application | VM-01, VM-02              |
| BS-02 | API d'intégration       | Service     | VM-01, VM-02              |
| BS-03 | Comptes administrateurs | Identité    | VM-01, VM-02              |

### 1.3 Évènements redoutés

| ID    | Évènement redouté                    | Valeur métier impactée | Impact (financier / juridique / image / opérationnel) | Gravité (1-4) |
| ----- | ------------------------------------ | ---------------------- | ----------------------------------------------------- | ------------- |
| ER-01 | Divulgation massive données salariés | VM-01                  | RGPD 4% CA + image                                    | **G4**        |
| ER-02 | Indisponibilité paie > 5 jours       | VM-02                  | Retard versement + relations sociales                 | **G3**        |
| ER-03 | Altération des fiches paie           | VM-02                  | Litiges + URSSAF                                      | **G3**        |

### 1.4 Socle de sécurité

Référentiels applicables : _RGPD · ISO 27001 · Hygiène ANSSI · NIS 2 (si OSE)_

| Référentiel   | Statut socle | Écarts identifiés                  |
| ------------- | ------------ | ---------------------------------- |
| RGPD          | Conforme     | DPIA à compléter sur ce traitement |
| ANSSI Hygiène | Partiel      | 38/42 mesures                      |

---

## Atelier 2 — Sources de risque (SR) et objectifs visés (OV)

| ID SR | Source de risque          | Motivation                    | Capacité (1-4) | Ressources         |
| ----- | ------------------------- | ----------------------------- | -------------- | ------------------ |
| SR-01 | Cybercriminel financier   | Lucre (ransomware, extorsion) | 4              | Élevées            |
| SR-02 | État-nation (CTI : APT-X) | Espionnage économique         | 4              | Très élevées       |
| SR-03 | Ex-salarié mécontent      | Vengeance                     | 2              | Faibles à modérées |
| SR-04 | Concurrent                | Espionnage industriel         | 3              | Modérées           |
| SR-05 | Hacktiviste               | Notoriété / idéologie         | 2              | Faibles            |

### Couples SR×OV retenus (pertinents)

| ID      | Source             | Objectif visé                       | Pertinence                   |
| ------- | ------------------ | ----------------------------------- | ---------------------------- |
| SROV-01 | SR-01 (cybercrime) | Chiffrer la base RH pour rançon     | **Élevée**                   |
| SROV-02 | SR-03 (ex-salarié) | Exfiltrer la base salariés          | **Moyenne**                  |
| SROV-03 | SR-02 (APT-X)      | Espionner les contrats stratégiques | **Faible** (à confirmer CTI) |

---

## Atelier 3 — Scénarios stratégiques

> Vue **macro** : qui attaque, par quel chemin global, contre quelle valeur métier.

### Scénario S1 — Ransomware via fournisseur

```
SR-01 → Compromission MSP IT → Accès SaaS RH → Chiffrement base
                                              → Exfiltration (double extorsion)
```

| Critère               | Évaluation                     |
| --------------------- | ------------------------------ |
| Gravité (G)           | **G4** (ER-01 + ER-02)         |
| Vraisemblance globale | **V3** (probable sous 12 mois) |
| Niveau de risque brut | 🔴 **R12 — Critique**          |

### Scénario S2 — Exfiltration interne

```
SR-03 → Compte légitime conservé après départ → Téléchargement masse → Vente / publication
```

| Critère       | Évaluation        |
| ------------- | ----------------- |
| Gravité       | **G4** (ER-01)    |
| Vraisemblance | **V2** (possible) |
| Risque brut   | 🟠 **R8 — Élevé** |

---

## Atelier 4 — Scénarios opérationnels

> Vue **technique** : déroulé pas-à-pas, mappé MITRE ATT&CK.

### S1 décliné — Ransomware via MSP

| Phase ATT&CK     | Tactique                        | Technique                | Probabilité | Contrôle existant           | Contrôle résiduel ? |
| ---------------- | ------------------------------- | ------------------------ | ----------- | --------------------------- | ------------------- |
| Initial Access   | T1199 Trusted Relationship      | Compromission MSP        | Modérée     | Audit fournisseur annuel    | Insuffisant         |
| Execution        | T1059 Command and Scripting     | PowerShell via outil MSP | Élevée      | EDR Defender                | Suffisant           |
| Persistence      | T1078 Valid Accounts            | Compte service MSP       | Modérée     | PAM partiel                 | **À renforcer**     |
| Lateral Movement | T1021 Remote Services           | RDP / WinRM              | Modérée     | Micro-segmentation pilote   | **À renforcer**     |
| Impact           | T1486 Data Encrypted for Impact | LockBit-like             | Élevée      | Sauvegardes 3-2-1 immuables | Suffisant           |

### Vraisemblance recalculée S1 : **V3** confirmé.

---

## Atelier 5 — Traitement du risque

### Mesures de sécurité retenues

| ID   | Mesure                                                 | Type (Évit/Réd/Trans/Acc) | Cible(s)         | Coût   | Réduction G/V    |
| ---- | ------------------------------------------------------ | ------------------------- | ---------------- | ------ | ---------------- |
| M-01 | Exiger ISO 27001 du MSP + audit annuel                 | Réduction                 | SROV-01          | Faible | V3→V2            |
| M-02 | PAM CyberArk étendu aux comptes service                | Réduction                 | SROV-01, SROV-02 | Élevé  | V3→V1            |
| M-03 | Micro-segmentation prod                                | Réduction                 | SROV-01          | Élevé  | G4→G3            |
| M-04 | Cyber-assurance couvrant ransomware                    | Transfert                 | SROV-01          | Moyen  | Impact financier |
| M-05 | Procédure offboarding sous 24 h + révocation immédiate | Réduction                 | SROV-02          | Faible | V2→V1            |
| M-06 | DLP M365 + alertes SOC sur téléchargement masse        | Réduction                 | SROV-02          | Moyen  | V2→V1            |

### Risques résiduels acceptés

| ID    | Scénario                 | Niveau résiduel | Justification                                                 | Décideur | Date         |
| ----- | ------------------------ | --------------- | ------------------------------------------------------------- | -------- | ------------ |
| RR-01 | SROV-03 (APT espionnage) | 🟠 R6           | Probabilité faible, mesures M-02/M-03 réduisent vraisemblance | CODIR    | `YYYY-MM-DD` |

### Indicateurs de suivi (KRI)

- Taux de comptes service couverts par PAM (cible 100 %)
- Délai moyen de révocation des comptes après départ (cible < 4 h)
- Taux de couverture micro-segmentation (cible 80 % prod)
- Score audit MSP annuel (cible ≥ 80/100)

---

## Annexes

- **Échelles** (DICP, Gravité, Vraisemblance) : à formaliser dans une politique
- **Matrice de gravité × vraisemblance** : 4×4 standard ANSSI
- **Glossaire** : EBIOS RM, ATT&CK, DPIA, KRI…
- **Validation CODIR** : PV à joindre à la version finale

---

_Template open-source — MIT. Adapté par Georges Lionel ANANI à partir
du guide officiel ANSSI EBIOS Risk Manager (2018)._
