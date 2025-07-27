
-- Exemple de produit avec variantes
INSERT INTO public.products (
    id, code_article, nom_lolly, parfum_inspire, marque_inspiree, genre, saison, famille_olfactive, description, image_url
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'L001',
    'Nom Lolly Exemple',
    'Parfum Inspiré',
    'Marque Inspirée',
    'Homme',
    'Été',
    'Fougère',
    'Description du parfum exemple.',
    'https://exemple.com/image.png'
);

-- Variantes associées
INSERT INTO public.product_variants (
    id, product_id, ref_complete, contenance, prix, stock_initial, stock_actuel
) VALUES 
    ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111111', 'L001-15ml', 15, 50, 100, 100),
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'L001-30ml', 30, 90, 100, 100),
    ('22222222-2222-2222-2222-222222222233', '11111111-1111-1111-1111-111111111111', 'L001-50ml', 50, 120, 100, 100);
