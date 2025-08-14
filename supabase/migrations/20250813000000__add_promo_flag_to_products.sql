-- Adds promo_flag column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS promo_flag BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.products.promo_flag IS 'Indique si le produit est en promotion';
