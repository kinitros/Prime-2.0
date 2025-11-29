-- Enable RLS for products and service_offers
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin write access for products" ON products;
DROP POLICY IF EXISTS "Public read access for service_offers" ON service_offers;
DROP POLICY IF EXISTS "Admin write access for service_offers" ON service_offers;
DROP POLICY IF EXISTS "Public insert access for orders" ON orders;
DROP POLICY IF EXISTS "Admin full access for orders" ON orders;

-- Products Policies
CREATE POLICY "Public read access for products" 
ON products FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admin write access for products" 
ON products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Service Offers Policies
CREATE POLICY "Public read access for service_offers" 
ON service_offers FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admin write access for service_offers" 
ON service_offers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Orders Policies
CREATE POLICY "Public insert access for orders" 
ON orders FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admin full access for orders" 
ON orders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON products TO anon;
GRANT ALL ON products TO authenticated;
GRANT SELECT ON service_offers TO anon;
GRANT ALL ON service_offers TO authenticated;
GRANT INSERT ON orders TO anon;
GRANT ALL ON orders TO authenticated;
