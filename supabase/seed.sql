-- Insertion d'un admin
INSERT INTO users (id, nom, prenom, email, role, code_client) VALUES
('efc3534b-3d85-4740-b927-1772daf41850', 'Admin', 'Lolly', 'admin@lolly.tn', 'admin', 'ADM001');

-- Insertion de 2 conseillers
INSERT INTO users (id, nom, prenom, email, role, code_client) VALUES
('68fb23cc-3ce2-4e0c-8e48-021e39410c10', 'Ali', 'Ben Salah', 'ali.conseiller@lolly.tn', 'conseillere', 'CNS999001'),
('35730c34-d934-4f0a-b037-b61fcd50e617', 'Sana', 'Trabelsi', 'sana.conseiller@lolly.tn', 'conseillere', 'CNS999002');

-- Insertion de 2 clients
INSERT INTO users (id, nom, prenom, email, role, code_client) VALUES
('894b88c0-a880-4d91-80c9-085945b3704e', 'Mouna', 'Gharbi', 'mouna.client@lolly.tn', 'client', 'C801'),
('9d3cd6f2-b5ea-4883-a75b-f4445b5fd089', 'Youssef', 'Ayari', 'youssef.client@lolly.tn', 'client', 'C802');

-- Insertion de 2 parfums
INSERT INTO products (id, nom, description, prix, famille_olfactive) VALUES
('3424bafc-3aa2-4ec9-9ef1-ee5b92a4f308', 'Bois d'Ambre', 'Un parfum chaud et mystérieux', 85.000, 'oriental'),
('661619a9-89d8-46e4-afdb-2c5de34a56e2', 'Fleur de Lune', 'Un floral léger et élégant', 78.000, 'floral');

-- Insertion de 2 promotions
INSERT INTO promotions (id, nom, pourcentage, date_debut, date_fin) VALUES
(gen_random_uuid(), 'Promo Été', 10, '2025-08-01', '2025-08-31'),
(gen_random_uuid(), 'Lancement Lolly', 15, '2025-07-01', '2025-07-31');

-- Insertion de 2 commandes avec ID liés (à adapter selon les valeurs effectives dans la DB)
-- INSERT INTO commandes (id, utilisateur_id, produit_id, quantite, date_commande) VALUES
-- (gen_random_uuid(), 'UUID_CLIENT_1', 'UUID_PARFUM_1', 1, '2025-07-27T01:29:37.553162'),
-- (gen_random_uuid(), 'UUID_CLIENT_2', 'UUID_PARFUM_2', 2, '2025-07-27T01:29:37.553162');
