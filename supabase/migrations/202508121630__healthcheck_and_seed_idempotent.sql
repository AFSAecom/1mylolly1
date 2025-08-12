-- Healthcheck : table neutre pour vérifier la pipeline
CREATE TABLE IF NOT EXISTS public._migrations_healthcheck (
  id    BIGSERIAL PRIMARY KEY,
  note  TEXT,
  ran_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contraintes uniques/idempotence utiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraints c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'products' AND c.conname = 'products_code_produit_key'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_code_produit_key UNIQUE (code_produit);
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- no-op
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename='product_variants' AND indexname='uniq_product_variants_ref_complete'
  ) THEN
    CREATE UNIQUE INDEX uniq_product_variants_ref_complete
      ON public.product_variants(ref_complete);
  END IF;
EXCEPTION WHEN OTHERS THEN
END $$;

-- Seed PRODUITS (sans doublons)
INSERT INTO public.products
  (code_produit, nom_lolly, nom_parfum_inspire, marque_inspire, genre, saison, famille_olfactive,
   note_tete, note_coeur, note_fond, description, image_url)
VALUES
  ('L001','Élégance Nocturne','Black Opium','Yves Saint Laurent','femme','toutes saisons','oriental Vanillé',
   ARRAY['café','poire','mandarine'], ARRAY['jasmin','fleur d''oranger','vanille'], ARRAY['patchouli','cèdre','musc'],
   'Une fragrance envoûtante qui mêle l’intensité du café à la douceur de la vanille.',
   'https://images.unsplash.com/photo-1547887538-e3a2f32cbb2c?w=400&q=80'),
  ('L002','Aura Marine','Acqua di Gio','Giorgio Armani','homme','été','Aromatique Aquatique',
   ARRAY['bergamote','néroli'], ARRAY['romarin','persil','jasmin'], ARRAY['bois de cèdre','musc','ambre'],
   'Fraîche et marine inspirée par la Méditerranée.',
   'https://images.unsplash.com/photo-1559049530183-7ea47794261f?w=400&q=80'),
  ('L003','Séduction Florale','J''adore','Dior','femme','toutes saisons','Floral Fruité',
   ARRAY['bergamote','poire','melon'], ARRAY['rose de mai','jasmin','magnolia'], ARRAY['musc','bois de cèdre'],
   'Bouquet floral sophistiqué et élégant.',
   'https://images.unsplash.com/photo-15929545042344-b3fbadf7f539?w=400&q=80')
ON CONFLICT (code_produit) DO NOTHING;

-- Seed VARIANTS (sans doublons)
WITH base AS (
  SELECT id, code_produit FROM public.products WHERE code_produit IN ('L001','L002','L003')
),
variants(size, price, stock) AS (
  VALUES (15, 19.900, 25), (30, 29.900, 18), (50, 39.900, 10)
)
INSERT INTO public.product_variants (product_id, ref_complete, contenance, unite, prix, stock_actuel)
SELECT b.id,
       b.code_produit || '-' || v.size,
       v.size::integer,
       'ml',
       v.price,
       v.stock
FROM base b CROSS JOIN variants v
ON CONFLICT (ref_complete) DO NOTHING;

-- Ping healthcheck
INSERT INTO public._migrations_healthcheck(note) VALUES ('seed_ok');

-- Fin triggers/idempotence (facultatif si déjà présents)
-- Crée les triggers "update_updated_at_column" si absents
DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname='update_updated_at_column';
  IF NOT FOUND THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END; $$ LANGUAGE plpgsql;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
-- Ajoute d’autres triggers similaires si besoin…
