-- Add metadata column to orders table to store additional details like order bumps
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
