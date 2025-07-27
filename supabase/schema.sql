-- SCHEMA.SQL : Création des tables

drop table if exists commandes, promotions, products, users cascade;

create table users (
    id uuid primary key,
    nom text not null,
    prenom text not null,
    email text not null unique,
    role text check (role in ('admin', 'conseillere', 'client')) not null,
    code_client text unique
);

create table products (
    id uuid primary key,
    name text not null,
    description text,
    prix numeric not null,
    famille_olfactive text
);

create table promotions (
    id uuid primary key,
    nom text not null,
    pourcentage int not null,
    date_debut date,
    date_fin date
);

create table commandes (
    id uuid primary key,
    utilisateur_id uuid references users(id),
    produit_id uuid references products(id),
    quantite int,
    date_commande date
);
