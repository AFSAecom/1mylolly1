-- INSERT de test pour produits + variants

INSERT INTO public.products (code_article, nom_lolly, parfum_inspire, marque_inspiree, genre, saison, famille_olfactive, description, image_url)
VALUES
('P001', 'Lune Noire', 'La Nuit Trésor', 'Lancôme', 'femme', 'hiver', 'oriental', 'Une explosion de mystère et de sensualité', 'https://cdn.exemple.com/img/p001.jpg');

INSERT INTO public.product_variants (product_id, ref_complete, contenance, prix)
SELECT id, 'P001-15ML', 15, 29.900 FROM public.products WHERE code_article = 'P001';

INSERT INTO public.product_variants (product_id, ref_complete, contenance, prix)
SELECT id, 'P001-30ML', 30, 49.900 FROM public.products WHERE code_article = 'P001';

INSERT INTO public.product_variants (product_id, ref_complete, contenance, prix)
SELECT id, 'P001-50ML', 50, 69.900 FROM public.products WHERE code_article = 'P001';
