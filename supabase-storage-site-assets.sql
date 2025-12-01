-- Criação do Bucket para Assets do Site (Logo, Favicon, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Imagens são públicas para visualização" ON storage.objects;
DROP POLICY IF EXISTS "Upload permitido para todos (temporário)" ON storage.objects;
DROP POLICY IF EXISTS "Update permitido para todos (temporário)" ON storage.objects;
DROP POLICY IF EXISTS "Delete permitido para todos (temporário)" ON storage.objects;

-- Política 1: Permitir que QUALQUER PESSOA visualize os arquivos (Leitura Pública)
CREATE POLICY "Imagens são públicas para visualização"
ON storage.objects FOR SELECT
USING ( bucket_id = 'site-assets' );

-- Política 2: Permitir upload (INSERT)
-- Nota: Em produção, você deve restringir isso apenas para admins autenticados.
-- Exemplo seguro: TO authenticated USING ( bucket_id = 'site-assets' AND (auth.jwt() ->> 'role') = 'admin' )
CREATE POLICY "Upload permitido para todos (temporário)"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'site-assets' );

-- Política 3: Permitir atualização (UPDATE)
CREATE POLICY "Update permitido para todos (temporário)"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'site-assets' );

-- Política 4: Permitir deleção (DELETE)
CREATE POLICY "Delete permitido para todos (temporário)"
ON storage.objects FOR DELETE
USING ( bucket_id = 'site-assets' );
