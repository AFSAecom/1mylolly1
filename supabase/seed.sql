-- INSERT de test pour utilisateurs

INSERT INTO public.users (nom, prenom, email, role, code_client)
VALUES
('Admin', 'Principal', 'admin@example.com', 'admin', 'CLT001'),
('Selim', 'Lima', 'selim@example.com', 'client', 'CLT002'),
('Nour', 'Ben Salem', 'nour@example.com', 'conseillere', 'CLT003');
