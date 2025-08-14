-- PR#<NUM> 05_cleanup — nettoyage conditionnel
DO $$
BEGIN
  -- Exemple:
  -- IF EXISTS (
  --   SELECT 1 FROM information_schema.columns
  --   WHERE table_schema='public' AND table_name='products' AND column_name='old_col'
  -- ) THEN
  --   ALTER TABLE public.products DROP COLUMN old_col;
  -- END IF;
END $$;
