CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'conseillere')),
    code_client TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code_produit TEXT NOT NULL UNIQUE,
    nom_lolly TEXT NOT NULL,
    nom_parfum_inspire TEXT NOT NULL,
    marque_inspire TEXT NOT NULL,
    genre TEXT NOT NULL,
    saison TEXT NOT NULL,
    famille_olfactive TEXT NOT NULL,
    note_tete TEXT[],
    note_coeur TEXT[],
    note_fond TEXT[],
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    prix_15ml DECIMAL(10,2),
    stock_15ml INTEGER DEFAULT 0,
    prix_30ml DECIMAL(10,2),
    stock_30ml INTEGER DEFAULT 0,
    prix_50ml DECIMAL(10,2),
    stock_50ml INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id),
    ref_complete TEXT NOT NULL UNIQUE,
    contenance INTEGER NOT NULL,
    unite TEXT NOT NULL DEFAULT 'ml',
    prix NUMERIC NOT NULL,
    stock_actuel INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    code_client TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee')),
    conseillere_id uuid,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
