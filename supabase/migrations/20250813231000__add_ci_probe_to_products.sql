ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ci_probe boolean DEFAULT false;

COMMENT ON COLUMN public.products.ci_probe IS 'Colonne de test CI (peut être supprimée plus tard)';
