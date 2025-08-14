# PR #<NUM> — Scripts SQL à exécuter (ordre garanti)

1) pr<NUM>-01_core.sql          — DDL: tables/colonnes/index simples
2) pr<NUM>-02_backfill.sql      — Mises à jour de données (lots)
3) pr<NUM>-03_constraints.sql   — NOT NULL / FK après backfill
4) pr<NUM>-04_indexes.sql       — CREATE INDEX CONCURRENTLY (hors transaction)
5) pr<NUM>-05_cleanup.sql       — Nettoyage (colonnes obsolètes, etc.)

Tables impactées: (à compléter)
Risques/Remarques: (à compléter)
