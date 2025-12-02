import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { PlatformId, Product, ServiceOffer, OrderBump } from '../../types';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, LogOut, LayoutGrid, Users, Globe, SettingsIcon, UserPlus, Heart, Eye, Target, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CRM from './CRM';
import Webhooks from './Webhooks';
import Settings from './Settings';
import Pixels from './Pixels';

const AdminDashboard: React.FC = () => {
    const { platforms, updateProduct, addProduct, deleteProduct, reorderProduct, reorderProductsBatch, addOffer, updateOffer, deleteOffer, addOrderBump, updateOrderBump, deleteOrderBump, isLoading: isDataLoading } = useAdmin();
    const [selectedPlatformId, setSelectedPlatformId] = useState<PlatformId>(PlatformId.INSTAGRAM);
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isAddingService, setIsAddingService] = useState(false);
    const [currentView, setCurrentView] = useState<'products' | 'crm' | 'webhooks' | 'settings' | 'pixels'>('crm');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [localProducts, setLocalProducts] = useState<Product[]>([]);

    // Default new product state
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        quantity: 100,
        price: 9.90,
        originalPrice: 14.90,
        popular: false,
        credit_card_url: ''
    });

    // Order bump form state
    const [isAddingBump, setIsAddingBump] = useState<string | null>(null); // productId when adding bump
    const [newBumpData, setNewBumpData] = useState({
        title: '',
        price: 0,
        discount_percentage: 20
    });

    // New service state
    const [newService, setNewService] = useState<Partial<ServiceOffer>>({
        type: 'followers',
        title: '',
        priceStart: 19.90,
        discount: 50,
        showOnHome: true
    });

    const [editingService, setEditingService] = useState<ServiceOffer | null>(null);

    const selectedPlatform = platforms.find(p => p.id === selectedPlatformId);
    const selectedOffer = selectedPlatform?.offers.find(o => o.id === selectedOfferId);

    useEffect(() => {
        if (selectedOffer) {
            setLocalProducts(selectedOffer.products);
        } else {
            setLocalProducts([]);
        }
    }, [selectedOffer]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Session check failed:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading || isDataLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Carregando painel...</p>
            </div>
        </div>
    );



    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(localProducts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalProducts(items);
    };

    const handleSaveOrder = async () => {
        const productsToUpdate = localProducts.map((p, index) => ({
            id: p.id,
            display_order: index
        }));
        await reorderProductsBatch(productsToUpdate);
        alert('Ordem dos produtos salva com sucesso!');
    };

    const handleSaveProduct = () => {
        if (editingProduct && selectedOffer) {
            updateProduct(selectedPlatformId, selectedOffer.id, editingProduct);
            setEditingProduct(null);
        }
    };

    const handleAddProduct = () => {
        if (selectedOffer && newProduct.quantity && newProduct.price && newProduct.originalPrice) {
            const product: Product = {
                id: `${selectedOffer.id}-${Date.now()}`,
                quantity: newProduct.quantity!,
                price: newProduct.price!,
                originalPrice: newProduct.originalPrice!,
                popular: newProduct.popular || false,
                credit_card_url: newProduct.credit_card_url,
                order_bumps: []
            };
            addProduct(selectedPlatformId, selectedOffer.id, product);
            setIsAddingProduct(false);
            setNewProduct({
                quantity: 100,
                price: 9.90,
                originalPrice: 14.90,
                popular: false,
                credit_card_url: ''
            });
        }
    };

    const handleAddService = () => {
        if (selectedPlatform && newService.type && newService.title && newService.priceStart && newService.discount !== undefined) {
            const service: ServiceOffer = {
                id: `${selectedPlatformId}-${newService.type}-${Date.now()}`,
                type: newService.type as 'followers' | 'likes' | 'views',
                title: newService.title,
                priceStart: newService.priceStart,
                discount: newService.discount,
                showOnHome: newService.showOnHome ?? true,
                products: []
            };
            addOffer(selectedPlatformId, service);
            setIsAddingService(false);
            setNewService({ type: 'followers', title: '', priceStart: 19.90, discount: 50, showOnHome: true });
        }
    };

    const handleEditService = () => {
        if (editingService) {
            updateOffer(selectedPlatformId, editingService);
            setEditingService(null);
        }
    };

    const handleDeleteService = (offerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço? Todos os produtos associados também serão removidos.')) {
            deleteOffer(selectedPlatformId, offerId);
            if (selectedOfferId === offerId) {
                setSelectedOfferId(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full overflow-y-auto z-10">
                <div className="mb-8 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                    <h1 className="text-xl font-bold text-slate-900">Admin Area</h1>
                </div>

                <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-2">Geral</p>
                    <button
                        onClick={() => setCurrentView('crm')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${currentView === 'crm' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Users className="w-5 h-5" />
                        CRM / Pedidos
                    </button>
                    <button
                        onClick={() => setCurrentView('webhooks')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${currentView === 'webhooks' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Globe className="w-5 h-5" />
                        Webhooks
                    </button>
                    <button
                        onClick={() => setCurrentView('pixels')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${currentView === 'pixels' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Target className="w-5 h-5" />
                        Pixels
                    </button>
                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${currentView === 'settings' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <SettingsIcon className="w-5 h-5" />
                        Configurações
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-2">Plataformas</p>
                    <div className="space-y-1">
                        {platforms.map(platform => (
                            <button
                                key={platform.id}
                                onClick={() => {
                                    setCurrentView('products');
                                    setSelectedPlatformId(platform.id);
                                    setSelectedOfferId(null);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${currentView === 'products' && selectedPlatformId === platform.id ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                                {platform.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 ml-64">
                {currentView === 'crm' ? (
                    <CRM />
                ) : currentView === 'webhooks' ? (
                    <Webhooks />
                ) : currentView === 'pixels' ? (
                    <Pixels />
                ) : currentView === 'settings' ? (
                    <Settings />
                ) : (
                    <>
                        {selectedPlatform ? (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">{selectedPlatform.name} - Gerenciar Produtos</h2>

                                {/* Category Tabs */}
                                <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1 items-center overflow-x-auto">
                                    {selectedPlatform.offers.map(offer => (
                                        <button
                                            key={offer.id}
                                            onClick={() => setSelectedOfferId(offer.id)}
                                            className={`pb-3 px-2 font-medium text-sm transition-colors relative whitespace-nowrap ${selectedOfferId === offer.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {offer.title}
                                            {selectedOfferId === offer.id && (
                                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                                            )}
                                        </button>
                                    ))}
                                    {selectedOfferId && (
                                        <button
                                            onClick={() => {
                                                const offer = selectedPlatform.offers.find(o => o.id === selectedOfferId);
                                                if (offer) setEditingService(offer);
                                            }}
                                            className="ml-2 flex items-center gap-1 text-slate-400 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                                            title="Editar Serviço"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsAddingService(true)}
                                        className="ml-auto flex items-center gap-1 text-primary hover:bg-primary/10 px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" /> Novo Serviço
                                    </button>
                                </div>

                                {/* Add Service Modal */}
                                {isAddingService && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsAddingService(false)}>
                                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                            <h3 className="text-xl font-bold text-slate-900 mb-6">Criar Novo Serviço</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo</label>
                                                    <select
                                                        value={newService.type}
                                                        onChange={e => setNewService({ ...newService, type: e.target.value as 'followers' | 'likes' | 'views' })}
                                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                    >
                                                        <option value="followers">Seguidores</option>
                                                        <option value="likes">Curtidas</option>
                                                        <option value="views">Visualizações</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ex: Seguidores Brasileiros"
                                                        value={newService.title}
                                                        onChange={e => setNewService({ ...newService, title: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Preço Inicial (R$)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={newService.priceStart}
                                                            onChange={e => setNewService({ ...newService, priceStart: Number(e.target.value) })}
                                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Desconto (%)</label>
                                                        <input
                                                            type="number"
                                                            value={newService.discount}
                                                            onChange={e => setNewService({ ...newService, discount: Number(e.target.value) })}
                                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center pt-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={newService.showOnHome ?? true}
                                                            onChange={e => setNewService({ ...newService, showOnHome: e.target.checked })}
                                                            className="rounded text-primary focus:ring-primary w-4 h-4"
                                                        />
                                                        <span className="text-sm text-slate-700 font-medium">Mostrar na página inicial?</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-6">
                                                <button
                                                    onClick={() => setIsAddingService(false)}
                                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleAddService}
                                                    className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
                                                >
                                                    Criar Serviço
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Edit Service Modal */}
                                {editingService && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingService(null)}>
                                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-slate-900">Editar Serviço</h3>
                                                <button
                                                    onClick={() => handleDeleteService(editingService.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Excluir Serviço"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo</label>
                                                    <select
                                                        value={editingService.type}
                                                        onChange={e => setEditingService({ ...editingService, type: e.target.value as 'followers' | 'likes' | 'views' })}
                                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                    >
                                                        <option value="followers">Seguidores</option>
                                                        <option value="likes">Curtidas</option>
                                                        <option value="views">Visualizações</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Título</label>
                                                    <input
                                                        type="text"
                                                        value={editingService.title}
                                                        onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                                                        className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Preço Inicial (R$)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={editingService.priceStart}
                                                            onChange={e => setEditingService({ ...editingService, priceStart: Number(e.target.value) })}
                                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Desconto (%)</label>
                                                        <input
                                                            type="number"
                                                            value={editingService.discount}
                                                            onChange={e => setEditingService({ ...editingService, discount: Number(e.target.value) })}
                                                            className="w-full border border-slate-300 rounded-lg p-3 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center pt-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={editingService.showOnHome ?? true}
                                                            onChange={e => setEditingService({ ...editingService, showOnHome: e.target.checked })}
                                                            className="rounded text-primary focus:ring-primary w-4 h-4"
                                                        />
                                                        <span className="text-sm text-slate-700 font-medium">Mostrar na página inicial?</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-6">
                                                <button
                                                    onClick={() => setEditingService(null)}
                                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleEditService}
                                                    className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors"
                                                >
                                                    Salvar Alterações
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOffer ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-slate-800">Produtos Disponíveis</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveOrder}
                                                    className="flex items-center gap-2 bg-white text-primary border border-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/5 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" /> Salvar Ordem
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingProduct(true)}
                                                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-hover transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" /> Novo Produto
                                                </button>
                                            </div>
                                        </div>

                                        {/* Add Product Form */}
                                        {isAddingProduct && (
                                            <div className="bg-white p-6 rounded-xl border border-primary/20 shadow-sm mb-6 animate-fade-in">
                                                <h4 className="font-bold text-slate-900 mb-4">Adicionar Novo Produto</h4>
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Quantidade</label>
                                                        <input
                                                            type="number"
                                                            value={newProduct.quantity}
                                                            onChange={e => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Preço (R$)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={newProduct.price}
                                                            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Preço Original (R$)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={newProduct.originalPrice}
                                                            onChange={e => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Link Pagamento Cartão (Monetizze/Outros)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="https://..."
                                                            value={newProduct.credit_card_url || ''}
                                                            onChange={e => setNewProduct({ ...newProduct, credit_card_url: e.target.value })}
                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex items-center pt-5">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={newProduct.popular}
                                                                onChange={e => setNewProduct({ ...newProduct, popular: e.target.checked })}
                                                                className="rounded text-primary focus:ring-primary"
                                                            />
                                                            <span className="text-sm text-slate-700 font-medium">Popular?</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => setIsAddingProduct(false)}
                                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium text-sm"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={handleAddProduct}
                                                        className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover"
                                                    >
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Product List */}
                                        <DragDropContext onDragEnd={handleDragEnd}>
                                            <Droppable droppableId="products">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="grid gap-4"
                                                    >
                                                        {localProducts.map((product, index) => (
                                                            <Draggable key={product.id} draggableId={product.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all"
                                                                    >
                                                                        {/* Drag Handle */}
                                                                        <div {...provided.dragHandleProps} className="mr-4 cursor-grab text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                                                            <GripVertical className="w-5 h-5" />
                                                                        </div>

                                                                        <div className="flex-1 flex items-center justify-between w-full">
                                                                            {editingProduct?.id === product.id ? (
                                                                                // Edit Mode
                                                                                <div className="flex-1 grid grid-cols-4 gap-4 mr-4">
                                                                                    <input
                                                                                        type="number"
                                                                                        value={editingProduct.quantity}
                                                                                        onChange={e => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                                                                                        className="border border-slate-200 rounded-lg p-2 text-sm"
                                                                                    />
                                                                                    <input
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        value={editingProduct.price}
                                                                                        onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                                                                        className="border border-slate-200 rounded-lg p-2 text-sm"
                                                                                    />
                                                                                    <input
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        value={editingProduct.originalPrice}
                                                                                        onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                                                                                        className="border border-slate-200 rounded-lg p-2 text-sm"
                                                                                    />
                                                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={editingProduct.popular}
                                                                                            onChange={e => setEditingProduct({ ...editingProduct, popular: e.target.checked })}
                                                                                        />
                                                                                        <span className="text-sm">Popular</span>
                                                                                    </label>
                                                                                    <div className="col-span-4">
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="Link Pagamento Cartão"
                                                                                            value={editingProduct.credit_card_url || ''}
                                                                                            onChange={e => setEditingProduct({ ...editingProduct, credit_card_url: e.target.value })}
                                                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                // View Mode
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-8">
                                                                                        <div>
                                                                                            <p className="text-xs text-slate-400 font-bold uppercase">Quantidade</p>
                                                                                            <p className="font-bold text-slate-900">{product.quantity}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs text-slate-400 font-bold uppercase">Preço</p>
                                                                                            <p className="font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs text-slate-400 font-bold uppercase">Original</p>
                                                                                            <p className="font-medium text-slate-500 line-through">R$ {product.originalPrice.toFixed(2)}</p>
                                                                                        </div>
                                                                                        {product.popular && (
                                                                                            <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">POPULAR</span>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Order Bumps Section - Always show */}
                                                                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                            <h5 className="text-xs font-bold text-slate-600 uppercase">Order Bumps ({product.order_bumps?.length || 0})</h5>
                                                                                            {isAddingBump !== product.id && (
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        setIsAddingBump(product.id);
                                                                                                        setNewBumpData({ title: '', price: 0, discount_percentage: 20 });
                                                                                                    }}
                                                                                                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                                                                                                >
                                                                                                    <Plus className="w-3 h-3" /> Adicionar Bump
                                                                                                </button>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Add Bump Form */}
                                                                                        {isAddingBump === product.id && (
                                                                                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                                                <h6 className="text-xs font-bold text-blue-900 mb-2">Novo Order Bump</h6>
                                                                                                <div className="space-y-2">
                                                                                                    <div>
                                                                                                        <label className="block text-xs font-medium text-slate-700 mb-1">Título</label>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={newBumpData.title}
                                                                                                            onChange={e => setNewBumpData({ ...newBumpData, title: e.target.value })}
                                                                                                            placeholder="Ex: Leve mais 500 seguidores"
                                                                                                            className="w-full border border-slate-300 rounded p-2 text-xs"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="grid grid-cols-2 gap-2">
                                                                                                        <div>
                                                                                                            <label className="block text-xs font-medium text-slate-700 mb-1">Preço (R$)</label>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                step="0.01"
                                                                                                                value={newBumpData.price || ''}
                                                                                                                onChange={e => setNewBumpData({ ...newBumpData, price: parseFloat(e.target.value) || 0 })}
                                                                                                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <label className="block text-xs font-medium text-slate-700 mb-1">Desconto (%)</label>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                value={newBumpData.discount_percentage}
                                                                                                                onChange={e => setNewBumpData({ ...newBumpData, discount_percentage: parseFloat(e.target.value) || 0 })}
                                                                                                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex gap-2 pt-2">
                                                                                                        <button
                                                                                                            onClick={async () => {
                                                                                                                if (!newBumpData.title || newBumpData.price <= 0) {
                                                                                                                    alert('Por favor, preencha todos os campos obrigatórios.');
                                                                                                                    return;
                                                                                                                }
                                                                                                                await addOrderBump(product.id, {
                                                                                                                    title: newBumpData.title,
                                                                                                                    price: newBumpData.price,
                                                                                                                    discount_percentage: newBumpData.discount_percentage,
                                                                                                                    position: product.order_bumps?.length || 0
                                                                                                                });
                                                                                                                setIsAddingBump(null);
                                                                                                                setNewBumpData({ title: '', price: 0, discount_percentage: 20 });
                                                                                                            }}
                                                                                                            className="flex-1 bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90"
                                                                                                        >
                                                                                                            Salvar
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={() => {
                                                                                                                setIsAddingBump(null);
                                                                                                                setNewBumpData({ title: '', price: 0, discount_percentage: 20 });
                                                                                                            }}
                                                                                                            className="flex-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-slate-300"
                                                                                                        >
                                                                                                            Cancelar
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                        {product.order_bumps && product.order_bumps.length > 0 ? (
                                                                                            <div className="space-y-2">
                                                                                                {product.order_bumps.map((bump) => (
                                                                                                    <div key={bump.id} className="bg-slate-50 p-2 rounded-lg flex items-center justify-between text-xs">
                                                                                                        <div className="flex-1">
                                                                                                            <p className="font-bold text-slate-700">{bump.title}</p>
                                                                                                            <p className="text-slate-500">R$ {bump.price.toFixed(2)} {bump.discount_percentage > 0 && `(${bump.discount_percentage}% off)`}</p>
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-1">
                                                                                                            <button
                                                                                                                onClick={async () => {
                                                                                                                    const title = prompt('Novo título:', bump.title);
                                                                                                                    if (!title) return;
                                                                                                                    const priceStr = prompt('Novo preço (R$):', bump.price.toString());
                                                                                                                    if (!priceStr) return;
                                                                                                                    const price = parseFloat(priceStr);
                                                                                                                    const discountStr = prompt('Novo desconto (%):', bump.discount_percentage.toString());
                                                                                                                    const discount = discountStr ? parseFloat(discountStr) : 0;

                                                                                                                    await updateOrderBump(bump.id, { title, price, discount_percentage: discount });
                                                                                                                }}
                                                                                                                className="p-1 text-slate-400 hover:text-primary hover:bg-white rounded transition-colors"
                                                                                                            >
                                                                                                                <Edit2 className="w-3 h-3" />
                                                                                                            </button>
                                                                                                            <button
                                                                                                                onClick={async () => {
                                                                                                                    if (confirm('Remover este order bump?')) {
                                                                                                                        await deleteOrderBump(bump.id);
                                                                                                                    }
                                                                                                                }}
                                                                                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                                                                                                            >
                                                                                                                <Trash2 className="w-3 h-3" />
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p className="text-xs text-slate-400 italic">Nenhum order bump configurado. Clique em "Adicionar Bump" para criar o primeiro.</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            <div className="flex items-center gap-2 ml-4">
                                                                                {editingProduct?.id === product.id ? (
                                                                                    <>
                                                                                        <button onClick={handleSaveProduct} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                                                            <Save className="w-4 h-4" />
                                                                                        </button>
                                                                                        <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                                                                                            <X className="w-4 h-4" />
                                                                                        </button>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                                                                            <Edit2 className="w-4 h-4" />
                                                                                        </button>
                                                                                        <button onClick={() => deleteProduct(selectedPlatformId, selectedOffer.id, product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                                            <Trash2 className="w-4 h-4" />
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <p className="text-slate-400 font-medium">Selecione uma categoria acima para gerenciar os produtos.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-400 font-medium">Selecione uma plataforma no menu lateral.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
