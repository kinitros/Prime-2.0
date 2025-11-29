-- Adicionar campos de Order Bump personalizado na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS order_bump_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS order_bump_title TEXT,
ADD COLUMN IF NOT EXISTS order_bump_price NUMERIC,
ADD COLUMN IF NOT EXISTS order_bump_discount NUMERIC;

COMMENT ON COLUMN products.order_bump_active IS 'Se o order bump personalizado está ativo';
COMMENT ON COLUMN products.order_bump_title IS 'Título do produto no order bump (ex: Leve mais 500 seguidores)';
COMMENT ON COLUMN products.order_bump_price IS 'Preço do order bump';
COMMENT ON COLUMN products.order_bump_discount IS 'Porcentagem de desconto visual (opcional)';
