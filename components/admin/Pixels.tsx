import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Target, Save, CheckCircle2, AlertCircle, Facebook, Search, Tag } from 'lucide-react';

const Pixels: React.FC = () => {
    const { facebookPixelId, googleAdsId, gtmId, updateFacebookPixelId, updateGoogleAdsId, updateGtmId } = useAdmin();
    
    const [localFacebookPixelId, setLocalFacebookPixelId] = useState('');
    const [localGoogleAdsId, setLocalGoogleAdsId] = useState('');
    const [localGtmId, setLocalGtmId] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLocalFacebookPixelId(facebookPixelId || '');
        setLocalGoogleAdsId(googleAdsId || '');
        setLocalGtmId(gtmId || '');
    }, [facebookPixelId, googleAdsId, gtmId]);

    const saveSettings = async () => {
        setSaving(true);
        setSaveSuccess(false);
        setError(null);

        try {
            await updateFacebookPixelId(localFacebookPixelId);
            await updateGoogleAdsId(localGoogleAdsId);
            await updateGtmId(localGtmId);
            
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            console.error('Error saving pixel settings:', err);
            setError('Erro ao salvar configurações. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-7 h-7 text-primary" />
                    Rastreamento e Pixels
                </h2>
                <p className="text-slate-500 mt-1">Gerencie os códigos de rastreamento para suas campanhas de tráfego.</p>
            </div>

            {/* Facebook Pixel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                        Facebook Pixel
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Rastreamento de eventos e conversões para Facebook/Instagram Ads
                    </p>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        ID do Pixel do Facebook
                    </label>
                    <input
                        type="text"
                        value={localFacebookPixelId}
                        onChange={(e) => setLocalFacebookPixelId(e.target.value)}
                        placeholder="Ex: 123456789012345"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Insira apenas o ID numérico do seu Pixel. O script será injetado automaticamente em todas as páginas.
                    </p>
                </div>
            </div>

            {/* Google Ads */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Search className="w-5 h-5 text-[#EA4335]" />
                        Google Ads Tag
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Tag de conversão e remarketing para Google Ads
                    </p>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        ID da Tag do Google Ads (AW-...)
                    </label>
                    <input
                        type="text"
                        value={localGoogleAdsId}
                        onChange={(e) => setLocalGoogleAdsId(e.target.value)}
                        placeholder="Ex: AW-123456789"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Insira o ID que começa com "AW-". A tag global (gtag.js) será configurada automaticamente.
                    </p>
                </div>
            </div>

            {/* Google Tag Manager */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-[#4285F4]" />
                        Google Tag Manager
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Gerenciamento centralizado de tags (GTM)
                    </p>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        ID do Container (GTM-...)
                    </label>
                    <input
                        type="text"
                        value={localGtmId}
                        onChange={(e) => setLocalGtmId(e.target.value)}
                        placeholder="Ex: GTM-XXXXXXX"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Insira o ID que começa com "GTM-". O script será injetado automaticamente.
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                    {saveSuccess && (
                        <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold">Pixels salvos com sucesso!</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 animate-fade-in">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-bold">Erro: {error}</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Salvar Configurações
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Pixels;
