# Migrations Supabase — Mode d’emploi

## Secrets à ajouter dans GitHub (Repo → Settings → Secrets and variables → Actions)
- SUPABASE_ACCESS_TOKEN : créer dans Supabase (Profile → Access Tokens)
- SUPABASE_PROJECT_REF  : identifiant du projet (ex: hxuioxxxxxx, visible dans l’URL ou Settings → General)

> Après ajout des secrets, faites un petit commit (ex: modif README) pour déclencher l’action.

## Ajouter une migration
1. Créer un fichier dans `supabase/migrations/` nommé `YYYYMMDD_HHMM_description.sql`.
2. Écrire du SQL **idempotent** :
   - `create table if not exists ...`
   - `alter table if exists ... add column if not exists ...`
   - Policies RLS : `drop policy if exists ...` puis `create policy ...`
3. Push sur `main` → la GitHub Action applique automatiquement sur Supabase.

## Vérifier
- GitHub → Actions → **Supabase Migrations** doit être en vert.
- Supabase → Table Editor : la table `_migrations_healthcheck` (ou votre changement) existe.

## Bonnes pratiques
- Ne modifiez pas le schéma dans l’UI Supabase **sans** créer la migration correspondante.
- Ne jamais committer de clés sensibles. Le Front n’utilise que :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
