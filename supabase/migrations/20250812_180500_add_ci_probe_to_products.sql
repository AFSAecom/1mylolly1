-- Ajout d'une colonne de test, idempotent
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ci_probe BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.products.ci_probe IS 'Colonne de test pour vérifier le pipeline CI';
