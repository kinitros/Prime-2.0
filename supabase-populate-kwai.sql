-- Script to populate Kwai services and products
-- Based on the provided images

DO $$
DECLARE
    v_platform_id text := 'kwai';
    v_offer_subs_id text := 'kwai-followers-auto';
    v_offer_likes_id text := 'kwai-likes-auto';
    v_offer_views_id text := 'kwai-views-auto';
BEGIN
    -- Ensure Kwai platform exists
    -- Using Orange/Yellow gradient to match the brand
    INSERT INTO platforms (id, name, color, gradient, icon_name, description, display_order)
    VALUES ('kwai', 'Kwai', 'bg-[#FF8F00]', 'from-[#FF8F00] to-[#FF5500]', 'video', 'Viralize no Kwai com seguidores e visualizações', 5)
    ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        color = EXCLUDED.color,
        gradient = EXCLUDED.gradient,
        icon_name = EXCLUDED.icon_name,
        description = EXCLUDED.description,
        display_order = 5;

    -- ----------------------------------------------------------------
    -- 1. SEGUIDORES (Followers - Brasileiros)
    -- ----------------------------------------------------------------
    
    -- Create/Update Service Offer for Followers
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_subs_id, v_platform_id, 'followers', 'Seguidores Brasileiros', 19.90, 0, true, 1, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products for this offer
    DELETE FROM products WHERE service_offer_id = v_offer_subs_id;

    -- Insert Products: Seguidores Brasileiros
    -- 500 - R$ 19,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-500', v_offer_subs_id, 500, 19.90, 29.90, false, true);

    -- 1.000 - R$ 39,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-1000', v_offer_subs_id, 1000, 39.90, 59.90, true, true);

    -- 2.000 - R$ 74,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-2000', v_offer_subs_id, 2000, 74.90, 99.90, false, true);

    -- 3.000 - R$ 99,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-3000', v_offer_subs_id, 3000, 99.90, 139.90, false, true);

    -- 5.000 - R$ 179,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-5000', v_offer_subs_id, 5000, 179.90, 249.90, false, true);

    -- 10.000 - R$ 329,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-subs-10000', v_offer_subs_id, 10000, 329.90, 459.90, false, true);


    -- ----------------------------------------------------------------
    -- 2. CURTIDAS (Likes - Brasileiras)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Likes
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_likes_id, v_platform_id, 'likes', 'Curtidas Brasileiras', 14.90, 0, true, 2, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_likes_id;

    -- Insert Products: Curtidas Brasileiras
    -- 500 - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-500', v_offer_likes_id, 500, 14.90, 19.90, false, true);

    -- 1.000 - R$ 29,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-1000', v_offer_likes_id, 1000, 29.90, 39.90, true, true);

    -- 2.000 - R$ 59,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-2000', v_offer_likes_id, 2000, 59.90, 79.90, false, true);

    -- 3.000 - R$ 89,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-3000', v_offer_likes_id, 3000, 89.90, 119.90, false, true);

    -- 5.000 - R$ 149,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-5000', v_offer_likes_id, 5000, 149.90, 199.90, false, true);

    -- 10.000 - R$ 279,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-likes-10000', v_offer_likes_id, 10000, 279.90, 379.90, false, true);


    -- ----------------------------------------------------------------
    -- 3. VISUALIZAÇÕES (Views)
    -- ----------------------------------------------------------------

    -- Create/Update Service Offer for Views
    INSERT INTO service_offers (id, platform_id, type, title, price_start, discount, show_on_home, display_order, is_active)
    VALUES (v_offer_views_id, v_platform_id, 'views', 'Visualizações Kwai', 14.90, 0, true, 3, true)
    ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title,
        price_start = EXCLUDED.price_start;

    -- Delete existing products
    DELETE FROM products WHERE service_offer_id = v_offer_views_id;

    -- Insert Products: Visualizações
    -- 500 - R$ 14,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-500', v_offer_views_id, 500, 14.90, 19.90, false, true);

    -- 1.000 - R$ 29,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-1000', v_offer_views_id, 1000, 29.90, 39.90, true, true);

    -- 2.000 - R$ 59,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-2000', v_offer_views_id, 2000, 59.90, 79.90, false, true);

    -- 3.000 - R$ 89,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-3000', v_offer_views_id, 3000, 89.90, 119.90, false, true);

    -- 5.000 - R$ 149,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-5000', v_offer_views_id, 5000, 149.90, 199.90, false, true);

    -- 10.000 - R$ 279,90
    INSERT INTO products (id, service_offer_id, quantity, price, original_price, popular, is_active)
    VALUES ('kwai-views-10000', v_offer_views_id, 10000, 279.90, 379.90, false, true);

END $$;
