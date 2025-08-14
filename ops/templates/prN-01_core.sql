-- PR#<NUM> 01_core — DDL de base (exécuter en 1er)
BEGIN;

-- Exemple:
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS origin_country TEXT;

COMMIT;

/* Vérifications (à lancer manuellement)
SELECT table_name, column_name FROM information_schema.columns
WHERE table_name IN ('products');
*/
