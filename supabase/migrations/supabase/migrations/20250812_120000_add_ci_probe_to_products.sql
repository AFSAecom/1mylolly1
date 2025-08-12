-- Test CI/CD : ajoute un petit indicateur sur la table products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS ci_probe boolean DEFAULT false;

COMMENT ON COLUMN public.products.ci_probe IS 'CI/CD test flag - peut être supprimé ensuite';
