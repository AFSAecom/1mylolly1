
INSERT INTO utilisateurs (id, nom, email, mot_de_passe, role) VALUES
  (uuid_generate_v4(), 'Admin Lolly', 'admin@lolly.tn', 'admin123', 'admin'),
  (uuid_generate_v4(), 'Conseiller One', 'conseiller1@lolly.tn', 'pass123', 'conseiller'),
  (uuid_generate_v4(), 'Conseiller Two', 'conseiller2@lolly.tn', 'pass456', 'conseiller'),
  (uuid_generate_v4(), 'Client Alpha', 'client1@lolly.tn', 'alpha321', 'client'),
  (uuid_generate_v4(), 'Client Beta', 'client2@lolly.tn', 'beta654', 'client');

INSERT INTO produits (id, nom, description, prix, marque_inspiree, notes_tete, notes_coeur, notes_fond, genre, famille) VALUES
  (uuid_generate_v4(), 'Oud Lolly', 'Un parfum intense et raffiné', 85.00, 'Maison Francis Kurkdjian', 'Safran, Jasmin', 'Ambre gris, Ambre', 'Résines, Bois de cèdre', 'mixte', 'oriental'),
  (uuid_generate_v4(), 'Rose Élégance', 'Fraîcheur florale délicate', 59.90, 'Dior', 'Bergamote', 'Rose, Pivoine', 'Musc blanc', 'femme', 'floral');

