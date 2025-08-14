-- Suppression des éléments inutiles
DROP TABLE IF EXISTS public.ddl_audit;

-- La contrainte product_variants_ref_complete_key assure déjà l'unicité
DROP INDEX IF EXISTS public.idx_variants_ref_complete;
