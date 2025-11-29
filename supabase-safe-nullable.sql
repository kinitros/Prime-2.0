-- Safe SQL to make only existing columns nullable
-- This version only modifies columns we know exist based on the error messages

DO $$ 
BEGIN
    -- Make columns nullable only if they exist
    
    -- Customer fields
    ALTER TABLE orders ALTER COLUMN customer_name DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN customer_cpf DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN customer_phone DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN customer_whatsapp DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN customer_document DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Order fields
DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN link DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN selected_posts DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN platform_id DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN service_offer_id DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN product_id DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN quantity DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN total_amount DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN payment_method DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN status DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN profile_data DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN has_order_bump DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN subtotal DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN discount DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN total DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- New PIX fields
DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN order_id DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN instagram_username DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN service_type DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN unit_price DROP NOT NULL;
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Set default for timestamp
DO $$ 
BEGIN
    ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();
    EXCEPTION WHEN undefined_column THEN NULL;
END $$;
