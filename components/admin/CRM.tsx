import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, DollarSign, Calendar, User, Smartphone, Mail, FileText, Copy, Plus } from 'lucide-react';

interface Order {
    id: string; // UUID
    friendly_id?: number; // Sequential ID
    order_id: string; // Custom ID (PIX-...)
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_document: string;
    instagram_username: string;
    service_type: string;
    quantity: number;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    pix_copy_paste_code?: string;
    pix_url?: string;
    selected_posts?: string; // JSON string
    platform_id?: string;
    link?: string;
    metadata?: {
        order_bumps?: Array<{
            title: string;
            price: number;
        }>;
    };
}

const CRM: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.customer_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.order_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.friendly_id?.toString() || '').includes(searchTerm) ||
            (order.instagram_username?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'pago':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
            case 'não pago':
            case 'aguardando':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled':
            case 'cancelado':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado para a área de transferência!');
    };

    // Calculate Stats
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'Pago');
    const paidRevenue = paidOrders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'Não Pago' || o.status === 'aguardando');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestão de Pedidos (CRM)</h2>
                    <p className="text-slate-500">Gerencie todos os pedidos e clientes em um só lugar.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchOrders} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Atualizar">
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total de Pedidos</p>
                            <h3 className="text-2xl font-bold text-slate-900">{orders.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pagos</p>
                            <h3 className="text-2xl font-bold text-slate-900">{paidOrders.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-700">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Pago</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {formatCurrency(paidRevenue)}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pendentes</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {pendingOrders.length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email, ID ou usuário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary bg-white"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                        <option value="cancelled">Cancelado</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID do Pedido</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Serviço</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Carregando pedidos...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Nenhum pedido encontrado.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono text-slate-600">
                                            #{order.friendly_id || order.order_id || order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{order.customer_name}</span>
                                                <span className="text-xs text-slate-500">{order.customer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {order.quantity} {order.service_type}
                                                </span>
                                                <span className="text-xs text-slate-500">@{order.instagram_username}</span>
                                                {order.metadata?.order_bumps && order.metadata.order_bumps.length > 0 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 w-fit">
                                                        + ORDER BUMP
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status === 'pending' ? 'Pendente' : order.status === 'paid' ? 'Pago' : order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Ver Detalhes"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Detalhes do Pedido</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="flex justify-between items-start bg-slate-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">ID do Pedido</p>
                                    <p className="text-lg font-mono font-bold text-slate-900">#{selectedOrder.friendly_id || selectedOrder.order_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status === 'pending' ? 'Pendente' : selectedOrder.status === 'paid' ? 'Pago' : selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                                    <User className="w-4 h-4 text-primary" /> Dados do Cliente
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Nome Completo</p>
                                        <p className="text-slate-900">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Email</p>
                                        <p className="text-slate-900">{selectedOrder.customer_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">CPF</p>
                                        <p className="text-slate-900">{selectedOrder.customer_document}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Telefone/WhatsApp</p>
                                        <p className="text-slate-900">{selectedOrder.customer_phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Service Info */}
                            <div>
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                                    <Smartphone className="w-4 h-4 text-primary" /> Serviço Contratado
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Tipo de Serviço</p>
                                        <p className="text-slate-900">{selectedOrder.service_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Perfil/Link</p>
                                        <p className="text-slate-900 text-primary font-medium">
                                            @{selectedOrder.link || selectedOrder.instagram_username}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Quantidade</p>
                                        <p className="text-slate-900">{selectedOrder.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold mb-1">Valor Total</p>
                                        <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedOrder.total_amount)}</p>
                                    </div>
                                </div>

                                {/* Selected Posts Section */}
                                {selectedOrder.selected_posts && (() => {
                                    try {
                                        const posts = JSON.parse(selectedOrder.selected_posts);
                                        if (posts && posts.length > 0) {
                                            return (
                                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                                    <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {posts.length} {posts.length === 1 ? 'Post Selecionado' : 'Posts Selecionados'}
                                                    </p>
                                                    <div className="space-y-2">
                                                        {posts.map((post: any, index: number) => (
                                                            <div key={index} className="bg-white p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                                                                <div className="flex-1">
                                                                    <a
                                                                        href={post.post_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
                                                                    >
                                                                        Post #{index + 1}
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    </a>
                                                                    <p className="text-xs text-slate-500 mt-1 truncate">{post.post_url}</p>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <p className="text-xs text-slate-500">Quantidade</p>
                                                                    <p className="text-sm font-bold text-slate-900">{post.quantity_per_post}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    } catch (e) {
                                        console.error('Error parsing selected_posts:', e);
                                    }
                                    return null;
                                })()}
                            </div>

                            {/* Order Bumps Section */}
                            {selectedOrder.metadata?.order_bumps && selectedOrder.metadata.order_bumps.length > 0 && (
                                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                    <p className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Order Bumps Adicionais
                                    </p>
                                    <div className="space-y-2">
                                        {selectedOrder.metadata.order_bumps.map((bump, index) => (
                                            <div key={index} className="bg-white p-3 rounded-lg border border-purple-100 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{bump.title}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900">R$ {bump.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div>
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                                    <DollarSign className="w-4 h-4 text-primary" /> Pagamento
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Método:</span>
                                        <span className="font-medium text-slate-900 uppercase">{selectedOrder.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Data do Pedido:</span>
                                        <span className="font-medium text-slate-900">{formatDate(selectedOrder.created_at)}</span>
                                    </div>
                                    {selectedOrder.pix_copy_paste_code && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 font-bold mb-2">Código PIX Copia e Cola</p>
                                            <div className="flex gap-2">
                                                <code className="flex-1 text-xs bg-white p-2 rounded border border-slate-200 break-all">
                                                    {selectedOrder.pix_copy_paste_code}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.pix_copy_paste_code!)}
                                                    className="p-2 bg-white border border-slate-200 rounded hover:bg-slate-50"
                                                >
                                                    <Copy className="w-4 h-4 text-slate-500" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRM;
