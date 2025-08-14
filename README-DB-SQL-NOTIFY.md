# DB SQL Notify — Multi-fichiers (no-block)

But : alerter quand la PR touche la DB et afficher MANIFEST + SQL *sans bloquer* le merge.
Convention : 1 MANIFEST + SQL numérotés dans `ops/sql_to_apply/`.

## Convention
- `ops/sql_to_apply/pr<N>-MANIFEST.md` : ordre d'exécution, liste des fichiers, tables impactées.
- `ops/sql_to_apply/pr<N>-01_core.sql` : DDL de base (BEGIN/COMMIT ok)
- `ops/sql_to_apply/pr<N>-02_backfill.sql` : UPDATE en lots
- `ops/sql_to_apply/pr<N>-03_constraints.sql` : NOT NULL / FK
- `ops/sql_to_apply/pr<N>-04_indexes.sql` : CREATE INDEX CONCURRENTLY (pas de transaction)
- `ops/sql_to_apply/pr<N>-05_cleanup.sql` : suppression conditionnelle

## Permissions GitHub
Settings > Actions > Workflow permissions: **Read and write**.

## Décision
- Label `DB: Heads-up` présent → exécuter SQL dans Supabase, puis Merge.
