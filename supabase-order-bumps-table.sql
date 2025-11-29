-- Criar tabela para múltiplos order bumps por produto
CREATE TABLE IF NOT EXISTS order_bumps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    discount_percentage NUMERIC DEFAULT 0,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida por product_id
CREATE INDEX IF NOT EXISTS idx_order_bumps_product_id ON order_bumps(product_id);

-- Comentários
COMMENT ON TABLE order_bumps IS 'Tabela para armazenar múltiplos order bumps por produto';
COMMENT ON COLUMN order_bumps.product_id IS 'ID do produto ao qual este bump pertence';
COMMENT ON COLUMN order_bumps.title IS 'Título do order bump (ex: Leve mais 500 seguidores)';
COMMENT ON COLUMN order_bumps.price IS 'Preço do order bump';
COMMENT ON COLUMN order_bumps.discount_percentage IS 'Porcentagem de desconto visual (opcional)';
COMMENT ON COLUMN order_bumps.position IS 'Ordem de exibição do bump';

-- Remover colunas antigas de order bump da tabela products (se existirem)
ALTER TABLE products 
DROP COLUMN IF EXISTS order_bump_active,
DROP COLUMN IF EXISTS order_bump_title,
DROP COLUMN IF EXISTS order_bump_price,
DROP COLUMN IF EXISTS order_bump_discount;
