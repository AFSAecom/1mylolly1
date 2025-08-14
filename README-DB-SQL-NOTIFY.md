# Lolly — DB SQL Notify (no-block) — Version 3

Objectif : **notifier** automatiquement quand une PR touche la base de données, **sans bloquer** les merges.
- Ajoute un **commentaire** et un **label d'information** si la DB est impactée.
- Peut afficher (si présent) un fichier `ops/sql_to_apply/*.sql` pour exécution manuelle dans Supabase.
- Zéro échec CI, c'est **informatif uniquement**.

## Installation
Copier:
- `.github/workflows/db-sql-notify.yml`
- `.github/pull_request_template.md`
- `ops/sql_to_apply/README.md` (convention pour placer le SQL facultatif)

## Convention SQL (facultatif mais recommandé)
- Un fichier par PR: `ops/sql_to_apply/pr<NUMERO>.sql`
- SQL prêt à exécuter dans Supabase (idempotent si possible).
