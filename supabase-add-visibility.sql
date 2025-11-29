-- Add show_on_home field to service_offers table
ALTER TABLE service_offers ADD COLUMN show_on_home BOOLEAN DEFAULT true;

-- Set initial visibility: show only the first service of each type on home
-- Instagram: Only "Seguidores Instagram" shows on home
UPDATE service_offers SET show_on_home = true WHERE id = 'ig-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'ig-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'ig-view';

-- TikTok: Only default services show on home
UPDATE service_offers SET show_on_home = true WHERE id = 'tt-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'tt-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'tt-view';

-- YouTube: Only default services show on home
UPDATE service_offers SET show_on_home = true WHERE id = 'yt-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'yt-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'yt-view';

-- Twitter: Only default services show on home
UPDATE service_offers SET show_on_home = true WHERE id = 'tw-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'tw-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'tw-view';

-- Facebook: Only default services show on home
UPDATE service_offers SET show_on_home = true WHERE id = 'fb-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'fb-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'fb-view';

-- Kwai: Only default services show on home
UPDATE service_offers SET show_on_home = true WHERE id = 'kw-fol';
UPDATE service_offers SET show_on_home = true WHERE id = 'kw-lik';
UPDATE service_offers SET show_on_home = true WHERE id = 'kw-view';
