-- Add is_active column to service_offers table
ALTER TABLE service_offers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Update existing services to be active
UPDATE service_offers SET is_active = TRUE WHERE is_active IS NULL;
