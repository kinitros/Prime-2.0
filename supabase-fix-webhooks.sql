-- Solução para permitir que o Backend leia os webhooks sem expor a tabela publicamente
-- Crie esta função no SQL Editor do Supabase

CREATE OR REPLACE FUNCTION get_active_webhooks()
RETURNS SETOF webhooks
LANGUAGE sql
SECURITY DEFINER -- Importante: Executa com permissões de admin, ignorando RLS do usuário
AS $$
  SELECT * FROM webhooks WHERE is_active = true;
$$;

-- Garantir permissão de execução para usuários anônimos (backend) e autenticados
GRANT EXECUTE ON FUNCTION get_active_webhooks() TO anon, authenticated, service_role;
