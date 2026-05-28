# Matrice de contrôles ISO/IEC 27001:2022 — Annexe A

> **Cas d'école fictif** — une PME industrielle française de ~200 salariés
> cherchant la certification initiale. Les 93 contrôles sont organisés en
> 4 thèmes (Organisationnel, Humain, Physique, Technologique).
>
> Format compagnon : [`iso-27001-control-matrix.csv`](iso-27001-control-matrix.csv)
> (importable Excel / Sheets).

## Légende des statuts

| Statut                | Sens                                 | Action attendue                         |
| --------------------- | ------------------------------------ | --------------------------------------- |
| ✅ **En place**       | Contrôle opérationnel, preuve à jour | Maintenir + audit                       |
| 🟠 **Partiel**        | Mise en œuvre en cours / incomplète  | Compléter selon échéance                |
| 🔴 **Non en place**   | Écart majeur identifié               | Plan de remédiation prioritaire         |
| ⚪ **Non applicable** | Hors périmètre justifié              | Documenter la justification dans le SoA |

## Indicateurs synthétiques (extrait CSV)

| Thème                 |  Total |  ✅ En place |   🟠 Partiel | 🔴 Non en place |
| --------------------- | -----: | -----------: | -----------: | --------------: |
| Organisationnel (A.5) |     37 |           30 |            7 |               0 |
| Humain (A.6)          |      8 |            8 |            0 |               0 |
| Physique (A.7)        |     14 |           13 |            1 |               0 |
| Technologique (A.8)   |     34 |           27 |            7 |               0 |
| **Total**             | **93** | **78 (84%)** | **15 (16%)** |           **0** |

➡️ **Taux de maturité global** : 84 % en place, 16 % en cours.
Cible pré-audit de certification : 95 % en place sous 6 mois.

## Top 10 écarts à fermer en priorité

| #   | ID     | Contrôle                                            | Échéance   | Pilote   |
| --- | ------ | --------------------------------------------------- | ---------- | -------- |
| 1   | A.5.3  | Séparation des tâches                               | 2026-06-30 | RSSI     |
| 2   | A.5.13 | Marquage de l'information (sensitivity labels M365) | 2026-09-30 | IT Sec   |
| 3   | A.5.18 | Revue semestrielle des droits d'accès               | 2026-06-30 | IT Sec   |
| 4   | A.5.21 | Sécurité chaîne d'approv ICT (SBOM)                 | 2026-09-30 | RSSI     |
| 5   | A.5.26 | Playbooks réponse incident                          | 2026-12-31 | SOC Lead |
| 6   | A.5.28 | Forensics (chain of custody)                        | 2026-09-30 | SOC Lead |
| 7   | A.8.2  | PAM (CyberArk) sur 100 % du périmètre               | 2026-09-30 | IT Sec   |
| 8   | A.8.3  | Zero Trust                                          | 2027-06-30 | IT Sec   |
| 9   | A.8.22 | Micro-segmentation prod                             | 2026-12-31 | IT Infra |
| 10  | A.8.33 | Anonymisation env de test                           | 2026-12-31 | DBA      |

## Liens utiles

- [Norme ISO/IEC 27001:2022](https://www.iso.org/standard/27001) (payante)
- [Guide ANSSI Méthodologie SMSI](https://cyber.gouv.fr/publications/maitriser-le-risque-numerique-lapproche-par-audit)
- Mon template d'analyse de risques EBIOS RM : [`ebios-rm-template.md`](ebios-rm-template.md)
