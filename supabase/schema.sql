CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE utilisateurs (
  id UUID PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(100),
  mot_de_passe VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE produits (
  id UUID PRIMARY KEY,
  nom VARCHAR(100),
  description TEXT,
  prix DECIMAL(10,2),
  marque_inspiree VARCHAR(100),
  notes_tete VARCHAR(255),
  notes_coeur VARCHAR(255),
  notes_fond VARCHAR(255),
  genre VARCHAR(20),
  famille VARCHAR(50)
);

CREATE TABLE commandes (
  id UUID PRIMARY KEY,
  utilisateur_id UUID REFERENCES utilisateurs(id),
  produit_id UUID REFERENCES produits(id),
  quantite INTEGER,
  date_commande DATE
);

CREATE TABLE promotions (
  id UUID PRIMARY KEY,
  nom VARCHAR(100),
  description TEXT,
  valeur DECIMAL(5,2),
  date_debut DATE,
  date_fin DATE
);


