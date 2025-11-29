-- Add display_order to service_offers table
ALTER TABLE service_offers ADD COLUMN display_order INTEGER DEFAULT 0;

-- Add display_order to products table
ALTER TABLE products ADD COLUMN display_order INTEGER DEFAULT 0;

-- Set initial order for existing service_offers (order by creation date)
WITH ordered_offers AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY platform_id ORDER BY created_at) as row_num
    FROM service_offers
)
UPDATE service_offers
SET display_order = ordered_offers.row_num
FROM ordered_offers
WHERE service_offers.id = ordered_offers.id;

-- Set initial order for existing products (order by quantity ascending)
WITH ordered_products AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY service_offer_id ORDER BY quantity) as row_num
    FROM products
)
UPDATE products
SET display_order = ordered_products.row_num
FROM ordered_products
WHERE products.id = ordered_products.id;
