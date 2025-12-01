-- Add missing PIX-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS pushin_pay_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS pix_expiration_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_pushin_pay_transaction_id ON orders(pushin_pay_transaction_id);
