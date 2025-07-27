
-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table : users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  role TEXT CHECK (role IN ('admin', 'client', 'conseillère')) NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Table : products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  inspiration TEXT,
  brand TEXT,
  family TEXT,
  top_notes TEXT,
  heart_notes TEXT,
  base_notes TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Table : product_variants
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  reference_code TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Table : orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES users(id),
  advisor_id uuid REFERENCES users(id),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT now()
);

-- Table : order_items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id uuid REFERENCES product_variants(id),
  quantity INT,
  unit_price DECIMAL(10,2)
);

-- Table : favorites
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  product_id uuid REFERENCES products(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Table : promotions
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  discount_percent INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE
);

-- Table : stock_movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id uuid REFERENCES product_variants(id),
  quantity INT,
  movement_type TEXT CHECK (movement_type IN ('entrée', 'sortie')) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);
