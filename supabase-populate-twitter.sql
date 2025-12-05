-- Script to populate Twitter (X) services and products
-- Based on the provided images

DO $$
DECLARE
    v_platform_id text := 'twitter';
    v_offer_subs_id text := 'twitter-followers-auto';
    v_offer_likes_id text := 'twitter-likes-auto';
    v_offer_views_id text := 'twitter-views-auto';
BEGIN
    -- Ensure Twitter platform exists
    -- Using Blue color to match the provided images, but named Twitter (X)
    INSERT INTO platforms (id, name, color, gradient, icon_name, description, display_order)
    VALUES ('twitter', 'Twitter (X)', 'bg-[#1DA1F2]', 'from-[#1DA1F2] to-[#0C85D0]', 'Twitter', 'Cresça seu perfil no X com seguidores e engajamento', 4)
    ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        color = EXCLUDED.color,
        gradient = EXCLUDED.gradient,
        icon_name = EXCLUDED.icon_name,
        description = EXCLUDED.description,
        display_order = 4;

    -- ----------------------------------------------------------------
    -- 1. SEGUIDORES (Followers)
    -- ----------------------------------------------------------------
    
    -- Create/Update Service Offer for Followers
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_subs_id, v_platform_id, 'followers', 'Seguidores no Twitter', 39.90, 0, true, 1, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products for this offer
    DELETE FROM products WHERE service_offer_id = v_offer_subs_id;

    -- Insert Products: Seguidores
    -- 250 - R$ 39,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-250', v_offer_subs_id, 250, 39.90, 54.90, false, true);

    -- 500 - R$ 69,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-500', v_offer_subs_id, 500, 69.90, 94.90, false, true);

    -- 1.000 - R$ 119,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-1000', v_offer_subs_id, 1000, 119.90, 159.90, true, true);

    -- 2.000 - R$ 239,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-2000', v_offer_subs_id, 2000, 239.90, 319.90, false, true);

    -- 3.000 - R$ 349,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-3000', v_offer_subs_id, 3000, 349.90, 469.90, false, true);

    -- 5.000 - R$ 569,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-subs-5000', v_offer_subs_id, 5000, 569.90, 759.90, false, true);


    -- ----------------------------------------------------------------
    -- 2. CURTIDAS (Likes)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Likes
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_likes_id, v_platform_id, 'likes', 'Curtidas no Twitter', 29.90, 0, true, 2, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_likes_id;

    -- Insert Products: Curtidas
    -- 500 - R$ 29,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-500', v_offer_likes_id, 500, 29.90, 39.90, false, true);

    -- 1.000 - R$ 49,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-1000', v_offer_likes_id, 1000, 49.90, 69.90, true, true);

    -- 2.000 - R$ 99,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-2000', v_offer_likes_id, 2000, 99.90, 139.90, false, true);

    -- 3.000 - R$ 149,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-3000', v_offer_likes_id, 3000, 149.90, 199.90, false, true);

    -- 5.000 - R$ 229,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-5000', v_offer_likes_id, 5000, 229.90, 309.90, false, true);

    -- 10.000 - R$ 449,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-likes-10000', v_offer_likes_id, 10000, 449.90, 599.90, false, true);


    -- ----------------------------------------------------------------
    -- 3. VISUALIZAÇÕES (Views)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Views
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_views_id, v_platform_id, 'views', 'Visualizações no Twitter', 9.90, 0, true, 3, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_views_id;

    -- Insert Products: Visualizações
    -- 500 - R$ 9,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-500', v_offer_views_id, 500, 9.90, 14.90, false, true);

    -- 1.000 - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-1000', v_offer_views_id, 1000, 14.90, 24.90, true, true);

    -- 2.000 - R$ 27,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-2000', v_offer_views_id, 2000, 27.90, 39.90, false, true);

    -- 3.000 - R$ 39,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-3000', v_offer_views_id, 3000, 39.90, 54.90, false, true);

    -- 5.000 - R$ 59,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-5000', v_offer_views_id, 5000, 59.90, 79.90, false, true);

    -- 10.000 - R$ 99,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('tw-views-10000', v_offer_views_id, 10000, 99.90, 139.90, false, true);

END $$;
