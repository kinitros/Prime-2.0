-- Add default timestamp for created_at if it doesn't exist
ALTER TABLE orders 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Also ensure id has a default if using UUID
-- If using serial/bigserial, this might not be needed
-- ALTER TABLE orders ALTER COLUMN id SET DEFAULT gen_random_uuid();
