-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for everyone" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for users based on email" ON orders;

-- Create a policy that allows anyone (anon and authenticated) to insert orders
CREATE POLICY "Enable insert for everyone" 
ON orders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create a policy that allows reading (optional, maybe restricted to own orders later)
-- For now, let's allow reading created rows if needed for the return
CREATE POLICY "Enable read access for all users" 
ON orders 
FOR SELECT 
TO public 
USING (true);

-- Grant necessary permissions to the anon role
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
