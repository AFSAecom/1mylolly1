-- 0) Extensions nécessaires
create extension if not exists pgcrypto;

-- 1) Tables
-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT,
  whatsapp TEXT,
  date_naissance DATE,
  adresse TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'conseillere', 'admin')),
  code_client TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_produit TEXT UNIQUE NOT NULL,
  nom_lolly TEXT NOT NULL,
  nom_parfum_inspire TEXT NOT NULL,
  marque_inspire TEXT NOT NULL,
  genre TEXT NOT NULL CHECK (genre IN ('homme', 'femme', 'mixte')),
  saison TEXT NOT NULL CHECK (saison IN ('été', 'hiver', 'toutes saisons')),
  famille_olfactive TEXT NOT NULL,
  note_tete TEXT[],
  note_coeur TEXT[],
  note_fond TEXT[],
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variants table (for different sizes and prices)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  ref_complete TEXT UNIQUE NOT NULL,
  contenance INTEGER NOT NULL,
  unite TEXT NOT NULL DEFAULT 'ml',
  prix DECIMAL(10,3) NOT NULL,
  stock_actuel INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  code_client TEXT NOT NULL,
  total_amount DECIMAL(10,3) NOT NULL,
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
  conseillere_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,3) NOT NULL,
  total_price DECIMAL(10,3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  pourcentage_reduction DECIMAL(5,2) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (idempotence pour les promotions)
ALTER TABLE public.promotions
  ADD CONSTRAINT IF NOT EXISTS promotions_unique_nom_dates UNIQUE (nom, date_debut, date_fin);

-- Create stock movements table for tracking inventory changes
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_variant_id UUID REFERENCES public.product_variants(id),
  type TEXT NOT NULL CHECK (type IN ('entree', 'sortie', 'ajustement')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  reference_document TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2) Fonction de mise à jour automatique de updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- 3) Triggers
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_users_updated_at') then
    create trigger update_users_updated_at
    before update on public.users
    for each row execute function update_updated_at_column();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_products_updated_at') then
    create trigger update_products_updated_at
    before update on public.products
    for each row execute function update_updated_at_column();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_product_variants_updated_at') then
    create trigger update_product_variants_updated_at
    before update on public.product_variants
    for each row execute function update_updated_at_column();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_orders_updated_at') then
    create trigger update_orders_updated_at
    before update on public.orders
    for each row execute function update_updated_at_column();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'update_promotions_updated_at') then
    create trigger update_promotions_updated_at
    before update on public.promotions
    for each row execute function update_updated_at_column();
  end if;
end $$;

-- 4) Realtime (idempotent)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.product_variants;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.favorites;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.promotions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_movements;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5) Index
CREATE INDEX IF NOT EXISTS idx_products_code_produit ON public.products(code_produit);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_ref_complete ON public.product_variants(ref_complete);

