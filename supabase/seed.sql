
-- Données de test pour la table users
INSERT INTO users (id, nom, prenom, email, mot_de_passe, date_naissance)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ben Ali', 'Ahmed', 'admin@lolly.tn', 'hashedpassword123', '1985-05-01'),
  ('00000000-0000-0000-0000-000000000002', 'Fersi', 'Lina', 'lina@lolly.tn', 'password456', '1990-11-23');

-- Données de test pour la table products
INSERT INTO products (id, code_produit, nom_lolly, nom_parfum_inspire, marque_inspiree, description, genre, saison, famille_olfactive, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'L001', 'Rose Éclatante', 'Miss Dior', 'Dior', 'Un floral lumineux', 'Femme', 'Printemps', 'Floral', 'https://example.com/img1.png');

-- Données de test pour la table product_variants
INSERT INTO product_variants (id, product_id, ref_complete, contenance, unite, prix)
VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'L001-30ml', 30, 'ml', 49.9),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000010', 'L001-50ml', 50, 'ml', 69.9);

-- Données de test pour la table promotions
INSERT INTO promotions (id, nom, description, date_debut, date_fin, pourcentage, seuil_livraison_gratuite)
VALUES
  ('00000000-0000-0000-0000-000000000200', 'Fête des Mères', 'Remise spéciale 20%', '2025-05-01', '2025-05-10', 20, 150);

-- Données de test pour la table orders
INSERT INTO orders (id, user_id, code_client, total_amount, statut)
VALUES
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000001', 'C001', 119.8, 'Payée');

-- Données de test pour la table order_items
INSERT INTO order_items (id, order_id, product_variant_id, quantity, unit_price, total_price)
VALUES
  ('00000000-0000-0000-0000-000000000400', '00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000100', 2, 49.9, 99.8);

-- Données de test pour la table favorites
INSERT INTO favorites (id, user_id, product_id)
VALUES
  ('00000000-0000-0000-0000-000000000500', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010');
