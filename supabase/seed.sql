-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Utilisateurs
INSERT INTO users (id, nom, prenom, email, role) VALUES
('2a193ca6-7ff4-4fdc-9f62-2954c0a67bd4', 'Lolly', 'Admin', 'admin@lolly.tn', 'admin'),
('37e479fb-6253-4451-8bde-e5d2b02aeeb5', 'Ali', 'Client', 'ali@test.tn', 'client'),
('86d73bc6-7cb3-493f-a88f-07cfacbd42dc', 'Sonia', 'Client', 'sonia@test.tn', 'client'),
('1acfec6a-6116-4e7d-bf2e-741ea7c18ec9', 'Sami', 'Conseiller', 'sami@lolly.tn', 'conseillere'),
('36012922-f983-446a-99e7-5476fd74ef8e', 'Amel', 'Conseillere', 'amel@lolly.tn', 'conseillere');

-- Parfums
INSERT INTO products (id, name, family, price) VALUES
('e988cc98-61bf-40ba-b08d-a58105497133', 'Bois d'Ambre', 'Oriental', 59.9),
('9bf06ea9-a1bf-4e13-97c5-3e7b9a52623d', 'Fleur de Jasmin', 'Floral', 49.9);

-- Commandes
INSERT INTO orders (id, client_id, total_amount) VALUES
('258fdc6a-f07b-4751-be27-5adebc0ba60b', '37e479fb-6253-4451-8bde-e5d2b02aeeb5', 119.8),
('975db974-0270-4499-97b5-44369fcaf390', '86d73bc6-7cb3-493f-a88f-07cfacbd42dc', 49.9);

-- Promotions
INSERT INTO promotions (id, name, discount_percent, is_active, start_date, end_date) VALUES
('65083a5d-8f61-429b-8507-2967072c2193', 'Promo 1', 10, true, '2025-07-01', '2025-08-01'),
('8b751775-e784-42cb-b7de-138564202be4', 'Promo 2', 20, true, '2025-07-01', '2025-08-01');
