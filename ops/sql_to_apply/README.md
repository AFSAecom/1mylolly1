# ops/sql_to_apply — Convention multi-fichiers

Toujours livrer dans la **branche de la PR** (avant merge) :
- `pr<N>-MANIFEST.md` (ordre d’exécution + tables impactées)
- `pr<N>-01_core.sql` (DDL), `-02_backfill.sql`, `-03_constraints.sql`, `-04_indexes.sql`, `-05_cleanup.sql` (selon besoin)

Règles:
- Idempotent (`IF NOT EXISTS`, checks `information_schema`)
- Index concurrents séparés (`-04_indexes.sql`)
- Ajouter 1–3 requêtes de vérification en commentaire à la fin de chaque fichier
