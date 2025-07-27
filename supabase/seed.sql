-- Exemple d'insertion supplémentaire pour tester

INSERT INTO users (id, nom, prenom, email, role, code_client)
VALUES
  (gen_random_uuid(), 'Test', 'Client', 'test.client@lolly.tn', 'client', 'CLI999');

INSERT INTO products (id, nom, description, prix, famille_olfactive)
VALUES
  (gen_random_uuid(), 'Test Parfum', 'Description test', 99.999, 'Testé');

INSERT INTO promotions (id, nom, pourcentage, date_debut, date_fin)
VALUES
  (gen_random_uuid(), 'Test Promo', 20, '2025-09-01', '2025-09-30');
