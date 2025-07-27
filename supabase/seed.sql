
-- Insertion des utilisateurs
INSERT INTO users (id, nom, prenom, email, mot_de_passe, role) VALUES
  ('aad36f0a-1c21-4f24-9431-000000000001', 'Admin', 'Test', 'admin@test.com', 'adminpass', 'admin'),
  ('aad36f0a-1c21-4f24-9431-000000000002', 'Client', 'Un', 'client1@test.com', 'clientpass', 'client'),
  ('aad36f0a-1c21-4f24-9431-000000000003', 'Client', 'Deux', 'client2@test.com', 'clientpass', 'client'),
  ('aad36f0a-1c21-4f24-9431-000000000004', 'Conseiller', 'Un', 'conseiller1@test.com', 'conseillerpass', 'conseiller'),
  ('aad36f0a-1c21-4f24-9431-000000000005', 'Conseiller', 'Deux', 'conseiller2@test.com', 'conseillerpass', 'conseiller');

-- Insertion des produits
INSERT INTO produits (id, nom, description, prix, famille_olfactive) VALUES
  ('bcd36f0a-2b22-5f25-8542-000000000001', 'Parfum Ambre', 'Un parfum chaud et mystérieux', 120.00, 'Oriental'),
  ('bcd36f0a-2b22-5f25-8542-000000000002', 'Parfum Floral', 'Un parfum frais et floral', 95.00, 'Floral');

-- Insertion des promotions
INSERT INTO promotions (id, titre, description, taux_remise, date_debut, date_fin) VALUES
  ('cde36f0a-3c23-6f26-9653-000000000001', 'Promo Été', 'Remise estivale', 15.0, '2025-07-01', '2025-08-31'),
  ('cde36f0a-3c23-6f26-9653-000000000002', 'Black Friday', 'Remise exceptionnelle', 30.0, '2025-11-25', '2025-11-30');

-- Insertion des commandes
INSERT INTO commandes (id, utilisateur_id, produit_id, quantite, total, statut, date_commande) VALUES
  ('def36f0a-4d24-7f27-a764-000000000001', 'aad36f0a-1c21-4f24-9431-000000000002', 'bcd36f0a-2b22-5f25-8542-000000000001', 2, 240.00, 'payée', '2025-07-15'),
  ('def36f0a-4d24-7f27-a764-000000000002', 'aad36f0a-1c21-4f24-9431-000000000003', 'bcd36f0a-2b22-5f25-8542-000000000002', 1, 95.00, 'en attente', '2025-07-20');
