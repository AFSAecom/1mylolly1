-- Adds origin_country column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS origin_country TEXT;

COMMENT ON COLUMN public.products.origin_country IS 'Pays d\'origine du produit';
