CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  product_variant_id uuid NOT NULL,
  quantity integer,
  unit_price numeric,
  total_price numeric,
  created_at timestamp with time zone
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  code_client text,
  total_amount numeric,
  status text,
  conseillere_id uuid NOT NULL,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  ref_complete text,
  contenance integer,
  unite text,
  prix numeric,
  stock_actuel integer,
  actif boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_produit text,
  nom_lolly text,
  nom_parfum_inspire text,
  marque_inspire text,
  genre text,
  saison text,
  famille_olfactive text,
  note_tete ARRAY,
  note_coeur ARRAY,
  note_fond ARRAY,
  description text,
  image_url text,
  active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  prix_15ml numeric,
  stock_15ml integer,
  prix_30ml numeric,
  stock_30ml integer,
  prix_50ml numeric,
  stock_50ml integer
);

CREATE TABLE promotions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text,
  description text,
  pourcentage_reduction numeric,
  date_debut date,
  date_fin date,
  active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE stock_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_variant_id uuid NOT NULL,
  type text,
  quantity integer,
  reason text,
  reference_document text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text,
  nom text,
  prenom text,
  telephone text,
  whatsapp text,
  date_naissance date,
  adresse text,
  role text,
  code_client text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);


