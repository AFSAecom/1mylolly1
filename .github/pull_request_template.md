## Description
<!-- Explique ce que fait cette PR. -->

## Base de Données (si le schéma change)
- [ ] **MANIFEST fourni** : `ops/sql_to_apply/pr<NUM>-MANIFEST.md`
- [ ] **SQL fournis** dans `ops/sql_to_apply/` (numérotés) :
  - `pr<NUM>-01_core.sql` (DDL)
  - `pr<NUM>-02_backfill.sql` (MAJ données)
  - `pr<NUM>-03_constraints.sql` (NOT NULL/FK)
  - `pr<NUM>-04_indexes.sql` (CONCURRENTLY si besoin)
  - `pr<NUM>-05_cleanup.sql` (optionnel)

**Résumé des changements DB** :
- Tables impactées :
- Colonnes/index/contraintes :
- Plan de rollback (si utile) :
