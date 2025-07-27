-- Insertion admin
INSERT INTO users (id, nom, prenom, email, role, code_client)
VALUES 
  ('f371e933-e497-4932-b95e-b4ee72bd9337', 'Admin', 'Lolly', 'admin@lolly.tn', 'admin', 'ADM0001');

-- Insertion conseillers
INSERT INTO users (id, nom, prenom, email, role, code_client)
VALUES
  ('dc425a02-50ab-46a4-b45d-243068f37f2b', 'Ali', 'Ben Salah', 'ali.conseiller@lolly.tn', 'conseillere', 'CON001'),
  ('3604d069-480d-4e38-b8c1-aa992267056e', 'Sana', 'Trabelsi', 'sana.conseiller@lolly.tn', 'conseillere', 'CON002');

-- Insertion clients
INSERT INTO users (id, nom, prenom, email, role, code_client)
VALUES
  ('39b72f45-621a-4cf1-8847-3647c2218ea3', 'Mouna', 'Gharbi', 'mouna.client@lolly.tn', 'client', 'CLI001'),
  ('e023acea-50a7-4093-aa36-056e7fa8759d', 'Youssef', 'Ayari', 'youssef.client@lolly.tn', 'client', 'CLI002');

-- Insertion parfums
INSERT INTO products (id, nom, description, prix, famille_olfactive)
VALUES
  ('ed4313c9-e64c-4831-ad06-ad2b5eba47f7', 'Bois d’Ambre', 'Un parfum chaud et mystérieux', 85.000, 'Oriental'),
  ('e5953c54-3eea-4289-9459-e77b5db94749', 'Fleur de Lune', 'Un floral léger et élégant', 78.000, 'Floral');

-- Insertion promotions
INSERT INTO promotions (id, nom, pourcentage, date_debut, date_fin)
VALUES
  (gen_random_uuid(), 'Promo Été', 10, '2025-08-01', '2025-08-31'),
  (gen_random_uuid(), 'Lancement Lolly', 15, '2025-07-01', '2025-07-31');

-- Insertion commandes
INSERT INTO commandes (id, utilisateur_id, produit_id, quantite, date_commande)
VALUES
  (gen_random_uuid(), '39b72f45-621a-4cf1-8847-3647c2218ea3', 'ed4313c9-e64c-4831-ad06-ad2b5eba47f7', 1, '2025-07-01'),
  (gen_random_uuid(), 'e023acea-50a7-4093-aa36-056e7fa8759d', 'e5953c54-3eea-4289-9459-e77b5db94749', 2, '2025-07-15');
