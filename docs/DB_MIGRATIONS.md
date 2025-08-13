# Migrations Supabase — Mode d’emploi

## Secrets à ajouter dans GitHub (Repo → Settings → Secrets and variables → Actions)
- SUPABASE_ACCESS_TOKEN : créer dans Supabase (Profile → Access Tokens)
- SUPABASE_DB_URL      : URL de connexion PostgreSQL (pooler 6543, `sslmode=require&pgbouncer=true&prefer_simple_protocol=true`)

> Après ajout des secrets, faites un petit commit (ex: modif README) pour déclencher l’action.

## Ajouter une migration
1. Créer un fichier dans `supabase/migrations/` nommé `YYYYMMDDHHMMSS__description.sql`.
2. Écrire du SQL **idempotent** (rejouable) :
   - `CREATE TABLE IF NOT EXISTS ...`
   - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`
   - `DROP ... IF EXISTS`
   - `INSERT ... ON CONFLICT DO NOTHING`
3. Ouvrir une **pull request**.

## Flow de déploiement
1. La PR lance le check requis **Supabase Auto Sync / plan (pull_request)**.
2. Une fois le check en vert, merger la PR vers `main`.
3. Le job `sync` du workflow applique automatiquement la migration sur Supabase.

## Vérifier
- GitHub → Actions : `plan` et `sync` en vert.
- Supabase → Table Editor : la table `_migrations_healthcheck` (ou votre changement) existe.

## Bonnes pratiques
- Ne modifiez pas le schéma dans l’UI Supabase **sans** créer la migration correspondante.
- Ne jamais committer de clés sensibles. Le Front n’utilise que :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
