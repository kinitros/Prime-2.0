import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlatformData, ServiceOffer, Product, PlatformId, OrderBump } from '../types';
import { supabase } from '../lib/supabase';

interface AdminContextType {
    platforms: PlatformData[];
    isLoading: boolean;
    testButtonUrl: string;
    whatsappUrl: string;
    whatsappGroupUrl: string;
    logoUrl: string;
    faviconUrl: string;
    facebookPixelId: string;
    googleAdsId: string;
    gtmId: string;
    updateTestButtonUrl: (url: string) => Promise<void>;
    updateWhatsappUrl: (url: string) => Promise<void>;
    updateWhatsappGroupUrl: (url: string) => Promise<void>;
    updateLogoUrl: (url: string) => Promise<void>;
    updateFaviconUrl: (url: string) => Promise<void>;
    updateFacebookPixelId: (id: string) => Promise<void>;
    updateGoogleAdsId: (id: string) => Promise<void>;
    updateGtmId: (id: string) => Promise<void>;
    updateProduct: (platformId: string, offerId: string, product: Product) => Promise<void>;
    addProduct: (platformId: string, offerId: string, product: Product) => Promise<void>;
    deleteProduct: (platformId: string, offerId: string, productId: string) => Promise<void>;
    reorderProduct: (platformId: string, offerId: string, productId: string, direction: 'up' | 'down') => Promise<void>;
    reorderProductsBatch: (products: { id: string; display_order: number }[]) => Promise<void>;
    reorderServicesBatch: (services: { id: string; display_order: number }[]) => Promise<void>;
    updateOffer: (platformId: string, offer: ServiceOffer) => Promise<void>;
    addOffer: (platformId: string, offer: ServiceOffer) => Promise<void>;
    deleteOffer: (platformId: string, offerId: string) => Promise<void>;
    addOrderBump: (productId: string, bump: Omit<OrderBump, 'id' | 'product_id'>) => Promise<void>;
    updateOrderBump: (bumpId: string, bump: Partial<OrderBump>) => Promise<void>;
    deleteOrderBump: (bumpId: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [platforms, setPlatforms] = useState<PlatformData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [testButtonUrl, setTestButtonUrl] = useState('');
    const [whatsappUrl, setWhatsappUrl] = useState('');
    const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [faviconUrl, setFaviconUrl] = useState('');
    const [facebookPixelId, setFacebookPixelId] = useState('');
    const [googleAdsId, setGoogleAdsId] = useState('');
    const [gtmId, setGtmId] = useState('');

    // Load data from Supabase on mount
    useEffect(() => {
        loadPlatforms();
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .in('setting_key', ['site_logo', 'site_favicon', 'whatsapp_group_url', 'test_button_url', 'whatsapp_url', 'facebook_pixel_id', 'google_ads_id', 'google_tag_manager_id']);

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading settings:', error);
                return;
            }

            if (data) {
                const logoSetting = data.find(s => s.setting_key === 'site_logo');
                const faviconSetting = data.find(s => s.setting_key === 'site_favicon');
                const whatsappGroupSetting = data.find(s => s.setting_key === 'whatsapp_group_url');
                const testButtonSetting = data.find(s => s.setting_key === 'test_button_url');
                const whatsappSetting = data.find(s => s.setting_key === 'whatsapp_url');
                const facebookPixelSetting = data.find(s => s.setting_key === 'facebook_pixel_id');
                const googleAdsSetting = data.find(s => s.setting_key === 'google_ads_id');
                const gtmSetting = data.find(s => s.setting_key === 'google_tag_manager_id');

                if (logoSetting) setLogoUrl(logoSetting.setting_value);
                if (faviconSetting) setFaviconUrl(faviconSetting.setting_value);
                if (whatsappGroupSetting) setWhatsappGroupUrl(whatsappGroupSetting.setting_value);
                if (testButtonSetting) setTestButtonUrl(testButtonSetting.setting_value);
                if (whatsappSetting) setWhatsappUrl(whatsappSetting.setting_value);
                if (facebookPixelSetting) setFacebookPixelId(facebookPixelSetting.setting_value);
                if (googleAdsSetting) setGoogleAdsId(googleAdsSetting.setting_value);
                if (gtmSetting) setGtmId(gtmSetting.setting_value);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const updateLogoUrl = async (url: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'site_logo',
                    setting_value: url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setLogoUrl(url);
        } catch (error) {
            console.error('Error updating logo:', error);
            throw error;
        }
    };

    const updateFaviconUrl = async (url: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'site_favicon',
                    setting_value: url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setFaviconUrl(url);
        } catch (error) {
            console.error('Error updating favicon:', error);
            throw error;
        }
    };

    const updateWhatsappGroupUrl = async (url: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'whatsapp_group_url',
                    setting_value: url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setWhatsappGroupUrl(url);
        } catch (error) {
            console.error('Error updating whatsapp group url:', error);
            throw error;
        }
    };

    const loadPlatforms = async () => {
        setIsLoading(true);
        try {
            // Fetch platforms
            const { data: platformsData, error: platformsError } = await supabase
                .from('platforms')
                .select('*')
                .order('display_order', { ascending: true });

            if (platformsError) throw platformsError;

            // Fetch service offers
            const { data: offersData, error: offersError } = await supabase
                .from('service_offers')
                .select('*')
                .order('display_order', { ascending: true });

            if (offersError) throw offersError;

            // Fetch products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('display_order', { ascending: true });

            if (productsError) throw productsError;

            // Fetch order bumps
            const { data: orderBumpsData, error: bumpsError } = await supabase
                .from('order_bumps')
                .select('*')
                .order('position', { ascending: true });

            if (bumpsError) throw bumpsError;

            // Combine data into hierarchical structure
            const platformsWithData: PlatformData[] = (platformsData || []).map(platform => {
                const platformOffers = (offersData || [])
                    .filter(offer => offer.platform_id === platform.id)
                    .map(offer => {
                        const offerProducts = (productsData || [])
                            .filter(product => product.service_offer_id === offer.id)
                            .map(product => {
                                const productBumps = (orderBumpsData || [])
                                    .filter(bump => bump.product_id === product.id)
                                    .map(bump => ({
                                        id: bump.id,
                                        product_id: bump.product_id,
                                        title: bump.title,
                                        price: bump.price,
                                        discount_percentage: bump.discount_percentage || 0,
                                        position: bump.position || 0
                                    }));

                                return {
                                    id: product.id,
                                    quantity: product.quantity,
                                    price: product.price,
                                    originalPrice: product.original_price,
                                    popular: product.popular || false,
                                    credit_card_url: product.credit_card_url,
                                    order_bumps: productBumps
                                };
                            });

                        return {
                            id: offer.id,
                            type: offer.type as 'followers' | 'likes' | 'views',
                            title: offer.title,
                            priceStart: offer.price_start,
                            discount: offer.discount,
                            showOnHome: offer.show_on_home ?? true,
                            products: offerProducts
                        } as ServiceOffer;
                    });

                return {
                    id: platform.id as PlatformId,
                    name: platform.name,
                    color: platform.color,
                    gradient: platform.gradient,
                    iconName: platform.icon_name,
                    description: platform.description,
                    offers: platformOffers
                } as PlatformData;
            });

            setPlatforms(platformsWithData);
        } catch (error) {
            console.error('Error loading platforms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        await loadPlatforms();
    };

    const updateProduct = async (platformId: string, offerId: string, updatedProduct: Product) => {
        const { error } = await supabase
            .from('products')
            .update({
                quantity: updatedProduct.quantity,
                price: updatedProduct.price,
                original_price: updatedProduct.originalPrice,
                popular: updatedProduct.popular || false,
                credit_card_url: updatedProduct.credit_card_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', updatedProduct.id);

        if (error) {
            console.error('Error updating product:', error);
            throw error;
        }

        await refreshData();
    };

    const addProduct = async (platformId: string, offerId: string, newProduct: Product) => {
        const { error } = await supabase
            .from('products')
            .insert({
                id: newProduct.id,
                service_offer_id: offerId,
                quantity: newProduct.quantity,
                price: newProduct.price,
                original_price: newProduct.originalPrice,
                popular: newProduct.popular || false,
                credit_card_url: newProduct.credit_card_url
            });

        if (error) {
            console.error('Error adding product:', error);
            throw error;
        }

        await refreshData();
    };

    const deleteProduct = async (platformId: string, offerId: string, productId: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) {
            console.error('Error deleting product:', error);
            throw error;
        }

        await refreshData();
    };

    const reorderProduct = async (platformId: string, offerId: string, productId: string, direction: 'up' | 'down') => {
        // Get all products for this offer
        const { data: products, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('service_offer_id', offerId)
            .order('display_order', { ascending: true });

        if (fetchError || !products) {
            console.error('Error fetching products for reorder:', fetchError);
            return;
        }

        const currentIndex = products.findIndex(p => p.id === productId);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= products.length) return;

        // Swap display_order values
        const currentProduct = products[currentIndex];
        const targetProduct = products[targetIndex];

        const { error: error1 } = await supabase
            .from('products')
            .update({ display_order: targetProduct.display_order })
            .eq('id', currentProduct.id);

        const { error: error2 } = await supabase
            .from('products')
            .update({ display_order: currentProduct.display_order })
            .eq('id', targetProduct.id);

        if (error1 || error2) {
            console.error('Error reordering products:', error1 || error2);
            return;
        }

        await refreshData();
    };

    const reorderProductsBatch = async (products: { id: string; display_order: number }[]) => {
        try {
            // Using parallel updates instead of upsert to avoid "missing fields" error
            // This is safe and fast enough for the number of products we handle
            const updatePromises = products.map(p => 
                supabase
                    .from('products')
                    .update({ 
                        display_order: p.display_order,
                        updated_at: new Date().toISOString() 
                    })
                    .eq('id', p.id)
            );

            await Promise.all(updatePromises);
            await refreshData();
        } catch (error) {
            console.error('Error reordering products batch:', error);
            throw error;
        }
    };

    const reorderServicesBatch = async (services: { id: string; display_order: number }[]) => {
        try {
            const updatePromises = services.map(s => 
                supabase
                    .from('service_offers')
                    .update({ 
                        display_order: s.display_order,
                        updated_at: new Date().toISOString() 
                    })
                    .eq('id', s.id)
            );

            await Promise.all(updatePromises);
            await refreshData();
        } catch (error) {
            console.error('Error reordering services batch:', error);
            throw error;
        }
    };

    const updateOffer = async (platformId: string, updatedOffer: ServiceOffer) => {
        const { error } = await supabase
            .from('service_offers')
            .update({
                type: updatedOffer.type,
                title: updatedOffer.title,
                price_start: updatedOffer.priceStart,
                discount: updatedOffer.discount,
                show_on_home: updatedOffer.showOnHome ?? true,
                updated_at: new Date().toISOString()
            })
            .eq('id', updatedOffer.id);

        if (error) {
            console.error('Error updating offer:', error);
            throw error;
        }

        await refreshData();
    };

    const addOffer = async (platformId: string, newOffer: ServiceOffer) => {
        const { error } = await supabase
            .from('service_offers')
            .insert({
                id: newOffer.id,
                platform_id: platformId,
                type: newOffer.type,
                title: newOffer.title,
                price_start: newOffer.priceStart,
                discount: newOffer.discount,
                show_on_home: newOffer.showOnHome ?? true
            });

        if (error) {
            console.error('Error adding offer:', error);
            throw error;
        }

        await refreshData();
    };

    const deleteOffer = async (platformId: string, offerId: string) => {
        const { error } = await supabase
            .from('service_offers')
            .delete()
            .eq('id', offerId);

        if (error) {
            console.error('Error deleting offer:', error);
            throw error;
        }

        await refreshData();
    };

    const addOrderBump = async (productId: string, bump: Omit<OrderBump, 'id' | 'product_id'>) => {
        const { error } = await supabase
            .from('order_bumps')
            .insert({
                product_id: productId,
                title: bump.title,
                price: bump.price,
                discount_percentage: bump.discount_percentage || 0,
                position: bump.position || 0
            });

        if (error) {
            console.error('Error adding order bump:', error);
            throw error;
        }

        await refreshData();
    };

    const updateOrderBump = async (bumpId: string, bump: Partial<OrderBump>) => {
        const updateData: any = {};
        if (bump.title !== undefined) updateData.title = bump.title;
        if (bump.price !== undefined) updateData.price = bump.price;
        if (bump.discount_percentage !== undefined) updateData.discount_percentage = bump.discount_percentage;
        if (bump.position !== undefined) updateData.position = bump.position;

        const { error } = await supabase
            .from('order_bumps')
            .update(updateData)
            .eq('id', bumpId);

        if (error) {
            console.error('Error updating order bump:', error);
            throw error;
        }

        await refreshData();
    };

    const deleteOrderBump = async (bumpId: string) => {
        const { error } = await supabase
            .from('order_bumps')
            .delete()
            .eq('id', bumpId);

        if (error) {
            console.error('Error deleting order bump:', error);
            throw error;
        }

        await refreshData();
    };

    const updateGoogleAdsId = async (id: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'google_ads_id',
                    setting_value: id,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setGoogleAdsId(id);
        } catch (error) {
            console.error('Error updating google ads id:', error);
            throw error;
        }
    };

    const updateFacebookPixelId = async (id: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'facebook_pixel_id',
                    setting_value: id,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setFacebookPixelId(id);
        } catch (error) {
            console.error('Error updating facebook pixel id:', error);
            throw error;
        }
    };

    const updateGtmId = async (id: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'google_tag_manager_id',
                    setting_value: id,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setGtmId(id);
        } catch (error) {
            console.error('Error updating google tag manager id:', error);
            throw error;
        }
    };

    const updateTestButtonUrl = async (url: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'test_button_url',
                    setting_value: url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setTestButtonUrl(url);
        } catch (error) {
            console.error('Error updating test button url:', error);
            throw error;
        }
    };

    const updateWhatsappUrl = async (url: string) => {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'whatsapp_url',
                    setting_value: url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;
            setWhatsappUrl(url);
        } catch (error) {
            console.error('Error updating whatsapp url:', error);
            throw error;
        }
    };

    // Load URLs from localStorage on mount - Removed as now loading from Supabase
    /* useEffect(() => {
        const savedTestUrl = localStorage.getItem('testButtonUrl') || '';
        const savedWhatsappUrl = localStorage.getItem('whatsappUrl') || '';
        setTestButtonUrl(savedTestUrl);
        setWhatsappUrl(savedWhatsappUrl);
    }, []); */

    return (
        <AdminContext.Provider value={{
            platforms,
            isLoading,
            testButtonUrl,
            whatsappUrl,
            whatsappGroupUrl,
            logoUrl,
            faviconUrl,
            facebookPixelId,
            googleAdsId,
            gtmId,
            updateTestButtonUrl,
            updateWhatsappUrl,
            updateWhatsappGroupUrl,
            updateLogoUrl,
            updateFaviconUrl,
            updateFacebookPixelId,
            updateGoogleAdsId,
            updateGtmId,
            updateProduct,
            addProduct,
            deleteProduct,
            reorderProduct,
            reorderProductsBatch,
            reorderServicesBatch,
            updateOffer,
            addOffer,
            deleteOffer,
            addOrderBump,
            updateOrderBump,
            deleteOrderBump,
            refreshData
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
