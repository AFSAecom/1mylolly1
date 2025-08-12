-- Seed initial data for perfume shop
create extension if not exists pgcrypto;

-- Products (idempotent)
insert into public.products
  (code_produit, nom_lolly, nom_parfum_inspire, marque_inspire, genre, saison, famille_olfactive,
   note_tete, note_coeur, note_fond, description, image_url)
values
  ('L001', 'Élégance Nocturne', 'Black Opium', 'Yves Saint Laurent', 'femme', 'toutes saisons', 'oriental Vanillé',
   array['café', 'poire', 'mandarine'],
   array['jasmin', 'fleur d''oranger', 'vanille'],
   array['patchouli', 'cèdre', 'musc'],
   'Une fragrance envoûtante qui mêle l’intensité du café à la douceur de la vanille, créant une signature olfactive addictive et mystérieuse.',
   'https://images.unsplash.com/photo-1547887538-e3a2f32cbb2c?w=400&q=80'),
  ('L002', 'Aura Marine', 'Acqua di Gio', 'Giorgio Armani', 'homme', 'été', 'Aromatique Aquatique',
   array['bergamote','néroli'],
   array['romarin','persil','jasmin'],
   array['bois de cèdre','musc','ambre'],
   'Une fragrance fraîche et marine inspirée par la mer Méditerranée.',
   'https://images.unsplash.com/photo-1559049530183-7ea47794261f?w=400&q=80'),
  ('L003', 'Séduction Florale', 'J''adore', 'Dior', 'femme', 'toutes saisons', 'Floral Fruité',
   array['bergamote','poire','melon'],
   array['rose de mai','jasmin','magnolia'],
   array['musc','bois de cèdre'],
   'Un bouquet floral sophistiqué et élégant aux notes délicates.',
   'https://images.unsplash.com/photo-15929545042344-b3fbadf7f539?w=400&q=80')
on conflict (code_produit) do nothing;

-- Product variants (idempotent)
insert into public.product_variants (product_id, ref_complete, contenance, unite, prix, stock_actuel)
select p.id,
       p.code_produit || '-' || v.size::text,
       v.size, 'ml', v.price, v.stock
from public.products p
cross join (values (15, 19.900, 25), (30, 29.900, 18), (50, 39.900, 10)) as v(size, price, stock)
where p.code_produit in ('L001','L002','L003')
on conflict (ref_complete) do update
  set prix = excluded.prix,
      stock_actuel = excluded.stock_actuel;

-- Promotions (idempotent)
insert into public.promotions (nom, description, pourcentage_reduction, date_debut, date_fin) values
('Soldes d''Hiver', 'Promotion de fin d''année sur tous les parfums', 20.00, '2025-01-01', '2025-01-31'),
('Nouvelle Année', 'Remise spéciale Nouvelle Année', 10.00, '2025-01-01', '2025-02-28')
on conflict (nom, date_debut, date_fin) do nothing;

