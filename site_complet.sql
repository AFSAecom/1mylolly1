
-- Désactivation des politiques RLS pour toutes les tables (pour le développement)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;

-- Index supplémentaires (si nécessaires)
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code_produit);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
