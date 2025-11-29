-- Tabela de configurações globais
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configuração padrão de desconto PIX
INSERT INTO settings (setting_key, setting_value) 
VALUES ('pix_discount', '{"enabled": true, "percentage": 5}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Adicionar coluna de link de cartão aos produtos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS credit_card_url TEXT;

-- Comentários para documentação
COMMENT ON TABLE settings IS 'Configurações globais do sistema';
COMMENT ON COLUMN settings.setting_key IS 'Chave única da configuração';
COMMENT ON COLUMN settings.setting_value IS 'Valor da configuração em formato JSON';
COMMENT ON COLUMN products.credit_card_url IS 'URL externa para pagamento por cartão (ex: Monetizze)';
