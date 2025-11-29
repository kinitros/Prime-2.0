-- Create platforms table
CREATE TABLE platforms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    gradient TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_offers table
CREATE TABLE service_offers (
    id TEXT PRIMARY KEY,
    platform_id TEXT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('followers', 'likes', 'views')),
    title TEXT NOT NULL,
    price_start DECIMAL(10, 2) NOT NULL,
    discount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    service_offer_id TEXT NOT NULL REFERENCES service_offers(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_id TEXT NOT NULL,
    service_offer_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    
    -- Customer info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_cpf TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    
    -- Order details
    link TEXT,
    selected_posts JSONB,
    has_order_bump BOOLEAN DEFAULT FALSE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card')),
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')),
    
    -- Profile data (if verified)
    profile_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_service_offers_platform_id ON service_offers(platform_id);
CREATE INDEX idx_products_service_offer_id ON products(service_offer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (products/platforms)
CREATE POLICY "Enable read access for all users" ON platforms FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON service_offers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);

-- Create policies for insert access (orders from frontend)
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- Note: For admin operations, you'll need to use the service_role key or create authenticated policies
-- For now, admin operations will use the service_role key in a secure backend endpoint
