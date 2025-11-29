-- Make columns nullable that might not always be provided
ALTER TABLE orders 
ALTER COLUMN link DROP NOT NULL,
ALTER COLUMN selected_posts DROP NOT NULL,
ALTER COLUMN customer_whatsapp DROP NOT NULL,
ALTER COLUMN product_id DROP NOT NULL,
ALTER COLUMN platform_id DROP NOT NULL,
ALTER COLUMN service_offer_id DROP NOT NULL,
ALTER COLUMN profile_data DROP NOT NULL,
ALTER COLUMN subtotal DROP NOT NULL,
ALTER COLUMN discount DROP NOT NULL,
ALTER COLUMN has_order_bump DROP NOT NULL;

-- Ensure these are nullable too
ALTER TABLE orders 
ALTER COLUMN customer_phone DROP NOT NULL,
ALTER COLUMN customer_document DROP NOT NULL,
ALTER COLUMN instagram_username DROP NOT NULL,
ALTER COLUMN service_type DROP NOT NULL,
ALTER COLUMN quantity DROP NOT NULL,
ALTER COLUMN unit_price DROP NOT NULL;
