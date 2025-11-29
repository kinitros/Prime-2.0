-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'pix',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS link TEXT,
ADD COLUMN IF NOT EXISTS selected_posts JSONB;

-- Update RLS policies if necessary (optional, but good practice)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (for public checkout)
CREATE POLICY "Enable insert for everyone" ON orders FOR INSERT WITH CHECK (true);

-- Allow users to view their own orders (if we had auth, but for now maybe just public insert is enough for the error)
