-- SITE.SQL : Insertion des données produits, promotions, commandes (dépendants de users)

insert into products (id, name, description, prix, famille_olfactive)
values
    ('ed4313c9-e64c-4831-ad06-ad2b5eba47f7', 'Bois d''Ambre', 'Un parfum chaud et mystérieux', 85.000, 'oriental'),
    ('e5953c54-3eea-4289-9459-e77bb5d94749', 'Fleur de Lune', 'Un floral léger et élégant', 78.000, 'floral');

insert into promotions (id, nom, pourcentage, date_debut, date_fin)
values
    (gen_random_uuid(), 'Promo Été', 10, '2025-06-01', '2025-08-31'),
    (gen_random_uuid(), 'Lancement Lolly', 15, '2025-07-01', '2025-07-31');

insert into commandes (id, utilisateur_id, produit_id, quantite, date_commande)
values
    (gen_random_uuid(), '39b72f45-621a-4fc1-8847-3647c2218ea3', 'ed4313c9-e64c-4831-ad06-ad2b5eba47f7', 1, '2025-07-01'),
    (gen_random_uuid(), 'e023acea-50a7-4093-aa36-056e7fa8759d', 'e5953c54-3eea-4289-9459-e77bb5d94749', 2, '2025-07-15');
