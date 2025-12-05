-- Script to populate YouTube services and products
-- Based on the provided images

-- 1. Get YouTube Platform ID (assuming it exists, otherwise insert it)
DO $$
DECLARE
    v_platform_id text := 'youtube';
    v_offer_subs_id text := 'youtube-followers-auto';
    v_offer_likes_id text := 'youtube-likes-auto';
    v_offer_views_id text := 'youtube-views-auto';
BEGIN
    -- Ensure YouTube platform exists
    INSERT INTO platforms (id, name, color, gradient, icon_name, description, display_order)
    VALUES ('youtube', 'YouTube', 'bg-[#FF0000]', 'from-[#FF0000] to-[#CC0000]', 'youtube', 'Cresça seu canal com inscritos e visualizações', 2)
    ON CONFLICT (id) DO UPDATE SET display_order = 2;

    -- ----------------------------------------------------------------
    -- 1. INSCRITOS (Followers)
    -- ----------------------------------------------------------------
    
    -- Create/Update Service Offer for Subscribers
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_subs_id, v_platform_id, 'followers', 'Inscritos no Youtube', 24.90, 0, true, 1, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products for this offer to avoid duplicates/conflicts during population
    DELETE FROM products WHERE service_offer_id = v_offer_subs_id;

    -- Insert Products: Inscritos
    -- 100 Inscritos - R$ 24,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-100', v_offer_subs_id, 100, 24.90, 34.90, false, true);

    -- 300 Inscritos - R$ 69,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-300', v_offer_subs_id, 300, 69.90, 89.90, false, true);

    -- 500 Inscritos - R$ 109,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-500', v_offer_subs_id, 500, 109.90, 139.90, true, true);

    -- 1000 Inscritos - R$ 199,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-1000', v_offer_subs_id, 1000, 199.90, 249.90, false, true);

    -- 1500 Inscritos - R$ 289,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-1500', v_offer_subs_id, 1500, 289.90, 359.90, false, true);

    -- 2000 Inscritos - R$ 369,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-subs-2000', v_offer_subs_id, 2000, 369.90, 459.90, false, true);


    -- ----------------------------------------------------------------
    -- 2. CURTIDAS (Likes)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Likes
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_likes_id, v_platform_id, 'likes', 'Curtidas no Vídeo', 14.90, 0, true, 2, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_likes_id;

    -- Insert Products: Curtidas
    -- 500 Curtidas - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-500', v_offer_likes_id, 500, 14.90, 19.90, false, true);

    -- 1.000 Curtidas - R$ 24,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-1000', v_offer_likes_id, 1000, 24.90, 34.90, true, true);

    -- 2.000 Curtidas - R$ 44,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-2000', v_offer_likes_id, 2000, 44.90, 59.90, false, true);

    -- 3.000 Curtidas - R$ 64,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-3000', v_offer_likes_id, 3000, 64.90, 84.90, false, true);

    -- 5.000 Curtidas - R$ 99,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-5000', v_offer_likes_id, 5000, 99.90, 129.90, false, true);

    -- 10.000 Curtidas - R$ 189,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-likes-10000', v_offer_likes_id, 10000, 189.90, 249.90, false, true);


    -- ----------------------------------------------------------------
    -- 3. VISUALIZAÇÕES (Views)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Views
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_views_id, v_platform_id, 'views', 'Visualizações no Youtube', 14.90, 0, true, 3, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_views_id;

    -- Insert Products: Visualizações
    -- 500 Views - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-500', v_offer_views_id, 500, 14.90, 19.90, false, true);

    -- 1.000 Views - R$ 27,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-1000', v_offer_views_id, 1000, 27.90, 39.90, true, true);

    -- 2.000 Views - R$ 54,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-2000', v_offer_views_id, 2000, 54.90, 74.90, false, true);

    -- 3.000 Views - R$ 74,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-3000', v_offer_views_id, 3000, 74.90, 99.90, false, true);

    -- 5.000 Views - R$ 114,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-5000', v_offer_views_id, 5000, 114.90, 149.90, false, true);

    -- 10.000 Views - R$ 219,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('yt-views-10000', v_offer_views_id, 10000, 219.90, 299.90, false, true);

END $$;
