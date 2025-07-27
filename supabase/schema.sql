-- Création des tables

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'client', 'conseillere')) NOT NULL,
    code_client TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    prix DECIMAL(10,3),
    famille_olfactive TEXT
);

CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY,
    nom TEXT NOT NULL,
    pourcentage INTEGER,
    date_debut DATE,
    date_fin DATE
);

CREATE TABLE IF NOT EXISTS commandes (
    id UUID PRIMARY KEY,
    utilisateur_id UUID REFERENCES users(id),
    produit_id UUID REFERENCES products(id),
    quantite INTEGER,
    date_commande DATE
);
