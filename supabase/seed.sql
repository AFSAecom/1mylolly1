
-- seed.sql : Données fictives pour test

INSERT INTO public.users (id, nom, prenom, email, role, code_client)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ben Ali', 'Ahmed', 'ahmed@lolly.tn', 'admin', 'C001'),
  ('00000000-0000-0000-0000-000000000002', 'Fersi', 'Lina', 'lina@lolly.tn', 'client', 'C002');

INSERT INTO public.products (id, name, description, prix, famille_olfactive)
VALUES
  ('00000000-0000-0000-0000-000000000100', 'Rose Éclatante', 'Un floral lumineux', 99.90, 'Floral');

INSERT INTO public.product_variants (id, product_id, ref_complete, contenance, prix)
VALUES
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000100', 'ROSE-30ML', 30, 49.90);

INSERT INTO public.orders (id, user_id, code_client, total_amount, status)
VALUES
  ('00000000-0000-0000-0000-000000010000', '00000000-0000-0000-0000-000000000002', 'C002', 49.90, 'confirmee');

INSERT INTO public.order_items (id, order_id, product_variant_id, quantity, unit_price, total_price)
VALUES
  ('00000000-0000-0000-0000-000000020000', '00000000-0000-0000-0000-000000010000', '00000000-0000-0000-0000-000000001001', 1, 49.90, 49.90);

INSERT INTO public.favorites (id, user_id, product_id)
VALUES
  ('00000000-0000-0000-0000-000000030000', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000100');

INSERT INTO public.promotions (id, nom, pourcentage, date_debut, date_fin)
VALUES
  ('00000000-0000-0000-0000-000000040000', 'Promo Été', 20, '2025-07-01', '2025-07-31');

INSERT INTO public.stock_movements (id, product_variant_id, type, quantity, reason)
VALUES
  ('00000000-0000-0000-0000-000000050000', '00000000-0000-0000-0000-000000001001', 'entree', 100, 'Stock initial');

INSERT INTO public.commandes (id, utilisateur_id, produit_id, quantite, date_commande)
VALUES
  ('00000000-0000-0000-0000-000000060000', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000100', 2, '2025-07-27');
