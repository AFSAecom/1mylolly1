
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'conseillere', 'client')),
    code_client TEXT UNIQUE,
    telephone TEXT,
    whatsapp TEXT,
    date_naissance DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_article TEXT NOT NULL UNIQUE,
    nom_lolly TEXT NOT NULL,
    parfum_inspire TEXT,
    marque_inspiree TEXT,
    genre TEXT,
    saison TEXT,
    famille_olfactive TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES public.products(id),
    ref_complete TEXT NOT NULL UNIQUE,
    contenance INTEGER NOT NULL CHECK (contenance IN (15, 30, 50)),
    unite TEXT NOT NULL DEFAULT 'ml',
    prix NUMERIC NOT NULL,
    stock_initial INTEGER DEFAULT 0,
    stock_actuel INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id),
    code_client TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
    conseillere_id uuid,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id),
    product_variant_id uuid REFERENCES public.product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: stock_movements
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_variant_id uuid REFERENCES public.product_variants(id),
    type TEXT NOT NULL CHECK (type IN ('entree', 'sortie', 'ajustement')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    reference_document TEXT,
    created_by uuid,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: favorites
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    product_id uuid,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: commandes
CREATE TABLE IF NOT EXISTS public.commandes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id uuid REFERENCES public.users(id),
    produit_id uuid REFERENCES public.products(id),
    quantite INTEGER,
    date_commande DATE
);

-- Table: promotions
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    description TEXT,
    pourcentage INTEGER NOT NULL,
    date_debut DATE,
    date_fin DATE
);

);

