-- Set correct platform order
UPDATE platforms SET display_order = 1 WHERE id = 'instagram';
UPDATE platforms SET display_order = 2 WHERE id = 'tiktok';
UPDATE platforms SET display_order = 3 WHERE id = 'youtube';
UPDATE platforms SET display_order = 4 WHERE id = 'twitter';
UPDATE platforms SET display_order = 5 WHERE id = 'facebook';
UPDATE platforms SET display_order = 6 WHERE id = 'kwai';

-- Add RLS policies for INSERT, UPDATE, DELETE on admin tables
-- Platforms policies
CREATE POLICY "Enable insert for all users" ON platforms FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON platforms FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON platforms FOR DELETE USING (true);

-- Service offers policies  
CREATE POLICY "Enable insert for all users" ON service_offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON service_offers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON service_offers FOR DELETE USING (true);

-- Products policies
CREATE POLICY "Enable insert for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON products FOR DELETE USING (true);
