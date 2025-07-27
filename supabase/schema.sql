
-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    email TEXT UNIQUE,
    mot_de_passe TEXT,
    date_naissance DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    code_produit TEXT,
    nom_lolly TEXT,
    nom_parfum_inspire TEXT,
    marque_inspiree TEXT,
    description TEXT,
    genre TEXT,
    saison TEXT,
    famille_olfactive TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: product_variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    ref_complete TEXT,
    contenance INTEGER,
    unite TEXT,
    prix NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: promotions
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY,
    nom TEXT,
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    pourcentage NUMERIC,
    seuil_livraison_gratuite NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    code_client TEXT,
    total_amount NUMERIC,
    statut TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER,
    unit_price NUMERIC,
    total_price NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE: favorites
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    created_at TIMESTAMP DEFAULT NOW()
);
