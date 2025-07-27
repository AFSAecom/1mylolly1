CREATE TABLE favorites (
  id UUID,
  user_id UUID,
  product_id UUID,
  created_at TIMESTAMPTZ
);

CREATE TABLE order_items (
  id UUID,
  order_id UUID,
  product_variant_id UUID,
  quantity INTEGER,
  unit_price NUMERIC,
  total_price NUMERIC,
  created_at TIMESTAMPTZ
);

CREATE TABLE orders (
  id UUID,
  user_id UUID,
  code_client TEXT,
  total_amount NUMERIC,
  status TEXT,
  conseillere_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE product_variants (
  id UUID,
  product_id UUID,
  ref_complete TEXT,
  contenance INTEGER,
  unite TEXT,
  prix NUMERIC,
  stock_actuel INTEGER,
  actif BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE products (
  id UUID,
  code_produit TEXT,
  nom_lolly TEXT,
  nom_parfum_inspire TEXT,
  marque_inspire TEXT,
  genre TEXT,
  saison TEXT,
  famille_olfactive TEXT,
  note_tete ARRAY,
  note_coeur ARRAY,
  note_fond ARRAY,
  description TEXT,
  image_url TEXT,
  active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  prix_15ml NUMERIC,
  stock_15ml INTEGER,
  prix_30ml NUMERIC,
  stock_30ml INTEGER,
  prix_50ml NUMERIC,
  stock_50ml INTEGER
);

CREATE TABLE promotions (
  id UUID,
  nom TEXT,
  description TEXT,
  pourcentage_reduction NUMERIC,
  date_debut DATE,
  date_fin DATE,
  active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE stock_movements (
  id UUID,
  product_variant_id UUID,
  type TEXT,
  quantity INTEGER,
  reason TEXT,
  reference_document TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID,
  email TEXT,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  whatsapp TEXT,
  date_naissance DATE,
  adresse TEXT,
  role TEXT,
  code_client TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

