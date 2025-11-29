import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlatformData, ServiceOffer, Product, PlatformId, OrderBump } from '../types';
import { supabase } from '../lib/supabase';

interface AdminContextType {
    platforms: PlatformData[];
    isLoading: boolean;
    testButtonUrl: string;
    whatsappUrl: string;
    updateTestButtonUrl: (url: string) => Promise<void>;
    updateWhatsappUrl: (url: string) => Promise<void>;
    updateProduct: (platformId: string, offerId: string, product: Product) => Promise<void>;
    addProduct: (platformId: string, offerId: string, product: Product) => Promise<void>;
    deleteProduct: (platformId: string, offerId: string, productId: string) => Promise<void>;
    reorderProduct: (platformId: string, offerId: string, productId: string, direction: 'up' | 'down') => Promise<void>;
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

    // Load data from Supabase on mount
    useEffect(() => {
        loadPlatforms();
    }, []);

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
                popular: newProduct.popular || false
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

    const updateTestButtonUrl = async (url: string) => {
        setTestButtonUrl(url);
        // Store in localStorage for now (could be moved to Supabase later)
        localStorage.setItem('testButtonUrl', url);
    };

    const updateWhatsappUrl = async (url: string) => {
        setWhatsappUrl(url);
        // Store in localStorage for now (could be moved to Supabase later)
        localStorage.setItem('whatsappUrl', url);
    };

    // Load URLs from localStorage on mount
    useEffect(() => {
        const savedTestUrl = localStorage.getItem('testButtonUrl') || '';
        const savedWhatsappUrl = localStorage.getItem('whatsappUrl') || '';
        setTestButtonUrl(savedTestUrl);
        setWhatsappUrl(savedWhatsappUrl);
    }, []);

    return (
        <AdminContext.Provider value={{
            platforms,
            isLoading,
            testButtonUrl,
            whatsappUrl,
            updateTestButtonUrl,
            updateWhatsappUrl,
            updateProduct,
            addProduct,
            deleteProduct,
            reorderProduct,
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
