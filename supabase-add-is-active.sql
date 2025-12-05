-- Add is_active column to products table
ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Update existing products to be active
UPDATE products SET is_active = TRUE WHERE is_active IS NULL;
