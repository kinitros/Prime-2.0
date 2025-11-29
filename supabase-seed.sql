-- Seed initial platform data
-- Run this AFTER creating the schema

-- Insert platforms
INSERT INTO platforms (id, name, color, gradient, icon_name, description) VALUES
('instagram', 'Instagram', 'bg-pink-600', 'from-yellow-400 via-red-500 to-purple-600', 'Instagram', 'Aumente sua autoridade visual e alcance.'),
('tiktok', 'TikTok', 'bg-slate-900', 'from-cyan-400 to-pink-500', 'Video', 'Domine o algoritmo mais viral do mundo.'),
('youtube', 'YouTube', 'bg-red-600', 'from-red-500 to-red-700', 'Youtube', 'Cresça seu canal e monetize mais rápido.'),
('twitter', 'Twitter (X)', 'bg-sky-500', 'from-sky-400 to-sky-600', 'Twitter', 'Amplifique sua voz e debates.'),
('facebook', 'Facebook', 'bg-blue-600', 'from-blue-500 to-indigo-600', 'Facebook', 'Expanda seu alcance no maior social do mundo.'),
('kwai', 'Kwai', 'bg-orange-500', 'from-orange-400 to-red-500', 'Video', 'Cresça rápido com recompensas.');

-- Insert Instagram service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('ig-fol', 'instagram', 'followers', 'Seguidores Instagram', 22.90, 54),
('ig-lik', 'instagram', 'likes', 'Curtidas Instagram', 10.90, 20),
('ig-view', 'instagram', 'views', 'Visualizações Instagram', 10.90, 37);

-- Insert Instagram Followers products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('ig-fol-500', 'ig-fol', 500, 22.90, 34.90, false),
('ig-fol-1000', 'ig-fol', 1000, 39.90, 64.90, true),
('ig-fol-2000', 'ig-fol', 2000, 79.90, 119.90, false),
('ig-fol-3000', 'ig-fol', 3000, 109.90, 164.90, false),
('ig-fol-5000', 'ig-fol', 5000, 174.90, 249.90, false),
('ig-fol-10000', 'ig-fol', 10000, 339.90, 449.90, false);

-- Insert Instagram Likes products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('ig-lik-500', 'ig-lik', 500, 10.90, 15.90, false),
('ig-lik-1000', 'ig-lik', 1000, 19.90, 29.90, true),
('ig-lik-5000', 'ig-lik', 5000, 89.90, 129.90, false);

-- Insert Instagram Views products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('ig-view-1000', 'ig-view', 1000, 10.90, 15.90, false),
('ig-view-5000', 'ig-view', 5000, 39.90, 59.90, true),
('ig-view-10000', 'ig-view', 10000, 69.90, 99.90, false);

-- Insert TikTok service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('tt-fol', 'tiktok', 'followers', 'Seguidores TikTok', 19.90, 50),
('tt-lik', 'tiktok', 'likes', 'Curtidas TikTok', 9.90, 45),
('tt-view', 'tiktok', 'views', 'Visualizações TikTok', 7.90, 60);

-- Insert TikTok products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('tt-fol-500', 'tt-fol', 500, 19.90, 29.90, false),
('tt-fol-1000', 'tt-fol', 1000, 34.90, 54.90, true),
('tt-fol-5000', 'tt-fol', 5000, 149.90, 219.90, false),
('tt-lik-500', 'tt-lik', 500, 9.90, 14.90, false),
('tt-lik-1000', 'tt-lik', 1000, 17.90, 27.90, true),
('tt-lik-5000', 'tt-lik', 5000, 79.90, 119.90, false),
('tt-view-1000', 'tt-view', 1000, 7.90, 12.90, false),
('tt-view-5000', 'tt-view', 5000, 29.90, 49.90, true),
('tt-view-10000', 'tt-view', 10000, 49.90, 79.90, false);

-- Insert YouTube service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('yt-fol', 'youtube', 'followers', 'Inscritos YouTube', 49.90, 40),
('yt-lik', 'youtube', 'likes', 'Likes YouTube', 14.90, 35),
('yt-view', 'youtube', 'views', 'Visualizações YouTube', 24.90, 50);

-- Insert YouTube products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('yt-fol-100', 'yt-fol', 100, 49.90, 69.90, false),
('yt-fol-500', 'yt-fol', 500, 189.90, 279.90, true),
('yt-fol-1000', 'yt-fol', 1000, 349.90, 499.90, false),
('yt-lik-100', 'yt-lik', 100, 14.90, 19.90, false),
('yt-lik-500', 'yt-lik', 500, 59.90, 89.90, true),
('yt-lik-1000', 'yt-lik', 1000, 109.90, 159.90, false),
('yt-view-1000', 'yt-view', 1000, 24.90, 39.90, false),
('yt-view-5000', 'yt-view', 5000, 99.90, 149.90, true),
('yt-view-10000', 'yt-view', 10000, 179.90, 269.90, false);

-- Insert Twitter service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('tw-fol', 'twitter', 'followers', 'Seguidores X', 39.90, 54),
('tw-lik', 'twitter', 'likes', 'Curtidas X', 19.90, 20),
('tw-view', 'twitter', 'views', 'Visualizações X', 14.90, 37);

-- Insert Twitter products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('tw-fol-500', 'tw-fol', 500, 39.90, 59.90, false),
('tw-fol-1000', 'tw-fol', 1000, 69.90, 99.90, true),
('tw-fol-5000', 'tw-fol', 5000, 299.90, 449.90, false),
('tw-lik-500', 'tw-lik', 500, 19.90, 29.90, false),
('tw-lik-1000', 'tw-lik', 1000, 34.90, 49.90, true),
('tw-lik-5000', 'tw-lik', 5000, 149.90, 219.90, false),
('tw-view-1000', 'tw-view', 1000, 14.90, 19.90, false),
('tw-view-5000', 'tw-view', 5000, 59.90, 89.90, true),
('tw-view-10000', 'tw-view', 10000, 109.90, 159.90, false);

-- Insert Facebook service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('fb-fol', 'facebook', 'followers', 'Seguidores Facebook', 29.90, 50),
('fb-lik', 'facebook', 'likes', 'Curtidas Facebook', 14.90, 40),
('fb-view', 'facebook', 'views', 'Visualizações Facebook', 12.90, 45);

-- Insert Facebook products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('fb-fol-500', 'fb-fol', 500, 29.90, 44.90, false),
('fb-fol-1000', 'fb-fol', 1000, 54.90, 79.90, true),
('fb-fol-5000', 'fb-fol', 5000, 249.90, 369.90, false),
('fb-lik-500', 'fb-lik', 500, 14.90, 19.90, false),
('fb-lik-1000', 'fb-lik', 1000, 26.90, 39.90, true),
('fb-lik-5000', 'fb-lik', 5000, 119.90, 179.90, false),
('fb-view-1000', 'fb-view', 1000, 12.90, 17.90, false),
('fb-view-5000', 'fb-view', 5000, 49.90, 74.90, true),
('fb-view-10000', 'fb-view', 10000, 89.90, 129.90, false);

-- Insert Kwai service offers
INSERT INTO service_offers (id, platform_id, type, title, price_start, discount) VALUES
('kw-fol', 'kwai', 'followers', 'Seguidores Kwai', 24.90, 48),
('kw-lik', 'kwai', 'likes', 'Curtidas Kwai', 11.90, 35),
('kw-view', 'kwai', 'views', 'Visualizações Kwai', 9.90, 52);

-- Insert Kwai products
INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular) VALUES
('kw-fol-500', 'kw-fol', 500, 24.90, 37.90, false),
('kw-fol-1000', 'kw-fol', 1000, 44.90, 64.90, true),
('kw-fol-5000', 'kw-fol', 5000, 199.90, 299.90, false),
('kw-lik-500', 'kw-lik', 500, 11.90, 16.90, false),
('kw-lik-1000', 'kw-lik', 1000, 21.90, 31.90, true),
('kw-lik-5000', 'kw-lik', 5000, 99.90, 149.90, false),
('kw-view-1000', 'kw-view', 1000, 9.90, 14.90, false),
('kw-view-5000', 'kw-view', 5000, 39.90, 59.90, true),
('kw-view-10000', 'kw-view', 10000, 69.90, 99.90, false);
