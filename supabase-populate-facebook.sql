-- Script to populate Facebook services and products
-- Based on the provided images

DO $$
DECLARE
    v_platform_id text := 'facebook';
    v_offer_subs_id text := 'facebook-followers-auto';
    v_offer_likes_id text := 'facebook-likes-auto';
    v_offer_views_id text := 'facebook-views-auto';
BEGIN
    -- Ensure Facebook platform exists
    INSERT INTO platforms (id, name, color, gradient, icon_name, description, display_order)
    VALUES ('facebook', 'Facebook', 'bg-[#1877F2]', 'from-[#1877F2] to-[#0C5DC7]', 'facebook', 'Aumente sua presença no Facebook', 3)
    ON CONFLICT (id) DO UPDATE SET display_order = 3;

    -- ----------------------------------------------------------------
    -- 1. SEGUIDORES (Followers - Mundiais)
    -- ----------------------------------------------------------------
    
    -- Create/Update Service Offer for Followers
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_subs_id, v_platform_id, 'followers', 'Seguidores Facebook (Mundiais)', 19.90, 0, true, 1, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products for this offer
    DELETE FROM products WHERE service_offer_id = v_offer_subs_id;

    -- Insert Products: Seguidores Mundiais
    -- 500 - R$ 19,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-500', v_offer_subs_id, 500, 19.90, 29.90, false, true);

    -- 1.000 - R$ 39,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-1000', v_offer_subs_id, 1000, 39.90, 59.90, true, true);

    -- 2.000 - R$ 79,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-2000', v_offer_subs_id, 2000, 79.90, 109.90, false, true);

    -- 3.000 - R$ 119,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-3000', v_offer_subs_id, 3000, 119.90, 159.90, false, true);

    -- 5.000 - R$ 199,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-5000', v_offer_subs_id, 5000, 199.90, 269.90, false, true);

    -- 10.000 - R$ 399,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-subs-10000', v_offer_subs_id, 10000, 399.90, 529.90, false, true);


    -- ----------------------------------------------------------------
    -- 2. CURTIDAS (Likes)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Likes
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_likes_id, v_platform_id, 'likes', 'Curtidas em Publicação', 14.90, 0, true, 2, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_likes_id;

    -- Insert Products: Curtidas
    -- 500 - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-500', v_offer_likes_id, 500, 14.90, 19.90, false, true);

    -- 1.000 - R$ 29,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-1000', v_offer_likes_id, 1000, 29.90, 39.90, true, true);

    -- 2.000 - R$ 59,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-2000', v_offer_likes_id, 2000, 59.90, 79.90, false, true);

    -- 3.000 - R$ 89,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-3000', v_offer_likes_id, 3000, 89.90, 119.90, false, true);

    -- 5.000 - R$ 149,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-5000', v_offer_likes_id, 5000, 149.90, 199.90, false, true);

    -- 10.000 - R$ 299,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-likes-10000', v_offer_likes_id, 10000, 299.90, 399.90, false, true);


    -- ----------------------------------------------------------------
    -- 3. VISUALIZAÇÕES (Views)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Views
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_views_id, v_platform_id, 'views', 'Visualizações em Vídeo', 19.90, 0, true, 3, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_views_id;

    -- Insert Products: Visualizações
    -- 500 - R$ 19,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-500', v_offer_views_id, 500, 19.90, 29.90, false, true);

    -- 1.000 - R$ 34,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-1000', v_offer_views_id, 1000, 34.90, 49.90, true, true);

    -- 2.000 - R$ 64,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-2000', v_offer_views_id, 2000, 64.90, 89.90, false, true);

    -- 3.000 - R$ 89,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-3000', v_offer_views_id, 3000, 89.90, 119.90, false, true);

    -- 5.000 - R$ 139,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-5000', v_offer_views_id, 5000, 139.90, 189.90, false, true);

    -- 10.000 - R$ 249,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('fb-views-10000', v_offer_views_id, 10000, 249.90, 329.90, false, true);

END $$;
