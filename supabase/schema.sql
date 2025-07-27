
-- schema.sql : Création de la structure de la base de données

CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'conseillere', 'client')),
  code_client text UNIQUE,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text,
  prix numeric NOT NULL,
  famille_olfactive text
);

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id),
  ref_complete text NOT NULL UNIQUE,
  contenance integer NOT NULL,
  unite text NOT NULL DEFAULT 'ml',
  prix numeric NOT NULL,
  stock_actuel integer DEFAULT 0,
  actif boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  code_client text NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
  conseillere_id uuid,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id),
  product_variant_id uuid REFERENCES public.product_variants(id),
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.promotions (
  id uuid PRIMARY KEY,
  nom text NOT NULL,
  pourcentage integer NOT NULL,
  date_debut date,
  date_fin date
);

CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id uuid REFERENCES public.product_variants(id),
  type text NOT NULL CHECK (type IN ('entree', 'sortie', 'ajustement')),
  quantity integer NOT NULL,
  reason text,
  reference_document text,
  created_by uuid,
  created_at timestamp DEFAULT now()
);

CREATE TABLE public.commandes (
  id uuid PRIMARY KEY,
  utilisateur_id uuid REFERENCES public.users(id),
  produit_id uuid REFERENCES public.products(id),
  quantite integer,
  date_commande date
);

