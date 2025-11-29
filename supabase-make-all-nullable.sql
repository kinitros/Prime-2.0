-- Make ALL columns nullable in orders table except id and essential fields
-- This is a comprehensive fix to allow the new PIX flow to work

-- First, let's see what constraints we have
-- Run this to see all constraints: SELECT * FROM information_schema.table_constraints WHERE table_name = 'orders';

-- Make all potentially problematic columns nullable
ALTER TABLE orders 
ALTER COLUMN customer_name DROP NOT NULL,
ALTER COLUMN customer_email DROP NOT NULL,
ALTER COLUMN customer_cpf DROP NOT NULL,
ALTER COLUMN customer_phone DROP NOT NULL,
ALTER COLUMN customer_whatsapp DROP NOT NULL,
ALTER COLUMN customer_document DROP NOT NULL,
ALTER COLUMN link DROP NOT NULL,
ALTER COLUMN selected_posts DROP NOT NULL,
ALTER COLUMN platform_id DROP NOT NULL,
ALTER COLUMN service_offer_id DROP NOT NULL,
ALTER COLUMN product_id DROP NOT NULL,
ALTER COLUMN quantity DROP NOT NULL,
ALTER COLUMN price DROP NOT NULL,
ALTER COLUMN total_amount DROP NOT NULL,
ALTER COLUMN payment_method DROP NOT NULL,
ALTER COLUMN status DROP NOT NULL,
ALTER COLUMN profile_data DROP NOT NULL,
ALTER COLUMN has_order_bump DROP NOT NULL,
ALTER COLUMN subtotal DROP NOT NULL,
ALTER COLUMN discount DROP NOT NULL,
ALTER COLUMN total DROP NOT NULL,
ALTER COLUMN order_id DROP NOT NULL,
ALTER COLUMN instagram_username DROP NOT NULL,
ALTER COLUMN service_type DROP NOT NULL,
ALTER COLUMN unit_price DROP NOT NULL;

-- Set defaults for timestamp fields
ALTER TABLE orders 
ALTER COLUMN created_at SET DEFAULT NOW();
