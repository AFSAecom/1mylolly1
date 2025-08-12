# CODEX_INSTRUCTIONS — Automatiser TOUTES les modifs Supabase via migrations

> Place ce fichier dans le dépôt à l’emplacement **`.github/CODEX_INSTRUCTIONS.md`**.  
> Objectif : Codex gère **100%** des changements de base (création/édition de tables, colonnes, index, seeds) via **migrations SQL** + **GitHub Actions**. L’humain ne fait rien au quotidien.

---

## 1) RÈGLE D’OR (obligatoire)

- **Toute** modification de la base passe par **un fichier de migration** dans `supabase/migrations/`.
- **Nom de fichier** : `YYYYMMDDHHMMSS__description.sql` (14 chiffres collés + `__`).  
  Exemples :  
  `20250812193000__add_ci_probe_to_products.sql`  
  `20250812194530__create_brands_table.sql`  
  ⚠️ **Interdit** : `20250812_193000__...` (underscore entre date et heure) — **ignoré** par le CLI.
- **SQL idempotent** (rejouable sans casser) :
  - `CREATE TABLE IF NOT EXISTS …`
  - `ALTER TABLE … ADD COLUMN IF NOT EXISTS …`
  - `DROP … IF EXISTS`
  - `INSERT … ON CONFLICT DO NOTHING` (ou `DO UPDATE` quand il faut mettre à jour)
  - Blocs sécurisés si besoin :  
    ```sql
    DO $$ BEGIN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.products';
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    ```
- **Processus** (toujours le même) :  
  1) Créer la migration (`supabase/migrations/*.sql`)  
  2) Commit + push sur **main** (ou ouvrir une PR)  
  3) La CI applique automatiquement sur Supabase

### Modèles prêts à réutiliser
**Ajouter une colonne**
```sql
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ci_probe boolean DEFAULT false;

COMMENT ON COLUMN public.products.ci_probe IS 'Colonne de test CI';
```

**Créer une table**
```sql
CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_brands_name ON public.brands(name);
```

**Upsert de données**
```sql
INSERT INTO public.brands (name) VALUES ('Acme')
ON CONFLICT (name) DO NOTHING;
```

---

## 2) GARDE-FOU CI (empêche d’oublier une migration)

> À copier dans ton workflow `.github/workflows/supabase-migrations.yml` **avant** l’étape d’application des migrations.  
> Effet : si quelqu’un change `supabase/` (hors `supabase/migrations/`) **sans ajouter une migration**, la CI échoue.

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Guard: DB changée => migration requise
  if: ${{ github.event_name == 'pull_request' || github.event_name == 'push' }}
  run: |
    set -e
    if [ "${{ github.event_name }}" = "pull_request" ]; then
      RANGE="origin/${{ github.base_ref }}...${{ github.sha }}"
    else
      RANGE="${{ github.event.before }}...${{ github.sha }}"
    fi
    echo "Diff range: $RANGE"
    CHANGED="$(git diff --name-only $RANGE || true)"
    echo "$CHANGED" | sed 's/^/ - /'

    CHANGED_DB="$(echo "$CHANGED" | grep -E '^supabase/' | grep -vE '^supabase/migrations/' || true)"
    HAS_MIG="$(echo "$CHANGED" | grep -E '^supabase/migrations/.*\.sql$' || true)"

    if [ -n "$CHANGED_DB" ] && [ -z "$HAS_MIG" ]; then
      echo '❌ Des fichiers DB ont changé sans migration SQL (supabase/migrations/*.sql).'
      exit 1
    fi
    echo '✅ Garde-fou OK : aucune infraction.'
```

### Exemple de job complet (push sur `main`)
```yaml
name: Supabase Auto Sync

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  sync:
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      SUPABASE_DB_URL:      ${{ secrets.SUPABASE_DB_URL }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }

      - name: Guard: DB changée => migration requise
        if: ${{ github.event_name == 'pull_request' || github.event_name == 'push' }}
        run: |
          set -e
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            RANGE="origin/${{ github.base_ref }}...${{ github.sha }}"
          else
            RANGE="${{ github.event.before }}...${{ github.sha }}"
          fi
          CHANGED="$(git diff --name-only $RANGE || true)"
          CHANGED_DB="$(echo "$CHANGED" | grep -E '^supabase/' | grep -vE '^supabase/migrations/' || true)"
          HAS_MIG="$(echo "$CHANGED" | grep -E '^supabase/migrations/.*\.sql$' || true)"
          if [ -n "$CHANGED_DB" ] && [ -z "$HAS_MIG" ]; then
            echo '❌ Des fichiers DB ont changé sans migration SQL.'; exit 1
          fi
          echo '✅ Garde-fou OK'

      - uses: supabase/setup-cli@v1
        with: { version: latest }

      - name: Appliquer les migrations (idempotent)
        run: |
          set -e
          supabase db push             --db-url "${SUPABASE_DB_URL}"             --workdir ./supabase             --include-all             --yes
```

> Secrets requis dans GitHub (déjà en place chez toi) :  
> `SUPABASE_DB_URL` (pooler 6543, ex. `...?sslmode=require&pgbouncer=true&prefer_simple_protocol=true`)  
> `SUPABASE_ACCESS_TOKEN` (token Supabase)

---

## 3) PROTECTION DE BRANCHE (empêche de bypass la CI)

> À définir **une fois** dans l’interface GitHub : *Settings → Branches → Add rule* pour la branche `main`.

- ✅ **Require a pull request before merging** (si tu veux forcer les PR)  
- ✅ **Require status checks to pass before merging**  
  Coche les checks de ton workflow (ex.: *Supabase Auto Sync / sync* et, si tu utilises des PR, *Supabase Auto Sync / plan*).  
- (Optionnel) **Block force pushes** et **Block branch deletions**
- (Optionnel) **Restrict who can push to matching branches** (si tu veux interdire les pushes directs)

> Effet : si une migration est oubliée ou si la CI échoue, **le merge est bloqué**. Codex est obligé d’ajouter sa migration.

---

### Résumé
- Codex écrit **toujours** une migration SQL (idempotente) → commit/push.  
- La **CI vérifie** qu’il n’a pas oublié et **applique** automatiquement.  
- La **branch protection** empêche de passer en force quand la CI est rouge.

*Fin du fichier.*
