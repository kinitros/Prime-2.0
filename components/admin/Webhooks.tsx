import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Globe, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

interface Webhook {
    id: string;
    url: string;
    events: string[];
    is_active: boolean;
    created_at: string;
}

const AVAILABLE_EVENTS = [
    { id: 'order.created', label: 'Pedido Criado' },
    { id: 'order.approved', label: 'Pedido Aprovado' },
    { id: 'order.cancelled', label: 'Pedido Cancelado' },
    { id: 'customer.created', label: 'Cliente Criado' }
];

const Webhooks: React.FC = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('webhooks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWebhooks(data || []);
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWebhook = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        if (!newUrl) {
            setError('A URL é obrigatória.');
            setSaving(false);
            return;
        }

        if (selectedEvents.length === 0) {
            setError('Selecione pelo menos um evento.');
            setSaving(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('webhooks')
                .insert([{
                    url: newUrl,
                    events: selectedEvents,
                    is_active: true
                }])
                .select()
                .single();

            if (error) throw error;

            setWebhooks([data, ...webhooks]);
            setIsAdding(false);
            setNewUrl('');
            setSelectedEvents([]);
        } catch (err: any) {
            console.error('Error adding webhook:', err);
            setError(err.message || 'Erro ao adicionar webhook.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este webhook?')) return;

        try {
            const { error } = await supabase
                .from('webhooks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setWebhooks(webhooks.filter(w => w.id !== id));
        } catch (error) {
            console.error('Error deleting webhook:', error);
            alert('Erro ao excluir webhook.');
        }
    };

    const toggleEvent = (eventId: string) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter(id => id !== eventId));
        } else {
            setSelectedEvents([...selectedEvents, eventId]);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Webhooks</h2>
                    <p className="text-slate-500">Configure integrações externas para eventos do sistema.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                    {isAdding ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isAdding ? 'Cancelar' : 'Novo Webhook'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                    <h3 className="font-bold text-lg mb-4 text-slate-900">Adicionar Novo Webhook</h3>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddWebhook} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">URL de Destino (POST)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://seu-sistema.com/webhook"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Eventos Gatilho</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {AVAILABLE_EVENTS.map(event => (
                                    <label key={event.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedEvents.includes(event.id) ? 'bg-primary/5 border-primary' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.includes(event.id)}
                                            onChange={() => toggleEvent(event.id)}
                                            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                                        />
                                        <span className={`text-sm font-medium ${selectedEvents.includes(event.id) ? 'text-primary' : 'text-slate-600'}`}>
                                            {event.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Salvar Webhook
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Carregando webhooks...</div>
                ) : webhooks.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Nenhum webhook configurado.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {webhooks.map((webhook) => (
                            <div key={webhook.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`p-2 rounded-lg ${webhook.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <Globe className="w-5 h-5" />
                                        </span>
                                        <h4 className="font-bold text-slate-900 break-all">{webhook.url}</h4>
                                        {webhook.is_active ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">Ativo</span>
                                        ) : (
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold border border-slate-200">Inativo</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-12">
                                        {webhook.events.map(event => (
                                            <span key={event} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                {AVAILABLE_EVENTS.find(e => e.id === event)?.label || event}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteWebhook(webhook.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto md:ml-0"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Webhooks;
