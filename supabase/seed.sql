-- SEED.SQL : Insertion des utilisateurs

insert into users (id, nom, prenom, email, role, code_client)
values
    -- Admin
    ('f371e933-e497-4932-b95e-b4ee72bd9337', 'Admin', 'Lolly', 'admin@lolly.tn', 'admin', 'ADM0001'),

    -- Conseillères
    ('dc425a02-50ab-46a4-b45d-243068f37f2b', 'Ali', 'Ben Salah', 'ali.conseiller@lolly.tn', 'conseillere', 'CON001'),
    ('3604d069-480d-4e38-b8c1-aa99226705e6', 'Sana', 'Trabelsi', 'sana.conseiller@lolly.tn', 'conseillere', 'CON002'),

    -- Clients
    ('39b72f45-621a-4fc1-8847-3647c2218ea3', 'Mouna', 'Gharbi', 'mouna.client@lolly.tn', 'client', 'CLI001'),
    ('e023acea-50a7-4093-aa36-056e7fa8759d', 'Youssef', 'Ayari', 'youssef.client@lolly.tn', 'client', 'CLI002');
