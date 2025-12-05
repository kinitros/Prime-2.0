import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';
import { Settings as SettingsIcon, CreditCard, Percent, Save, AlertCircle, CheckCircle2, Link as LinkIcon, MessageCircle, Image as ImageIcon, Users } from 'lucide-react';

interface PixDiscountSettings {
    enabled: boolean;
    percentage: number;
}

const Settings: React.FC = () => {
    const { testButtonUrl, whatsappUrl, whatsappGroupUrl, logoUrl, faviconUrl, updateTestButtonUrl, updateWhatsappUrl, updateWhatsappGroupUrl, updateLogoUrl, updateFaviconUrl, creditCardEnabled, updateCreditCardEnabled } = useAdmin();
    const [localTestUrl, setLocalTestUrl] = useState('');
    const [localWhatsappUrl, setLocalWhatsappUrl] = useState('');
    const [localWhatsappGroupUrl, setLocalWhatsappGroupUrl] = useState('');
    const [localLogoUrl, setLocalLogoUrl] = useState('');
    const [localFaviconUrl, setLocalFaviconUrl] = useState('');
    const [pixDiscount, setPixDiscount] = useState<PixDiscountSettings>({ enabled: true, percentage: 5 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);

    useEffect(() => {
        fetchSettings();
        setLocalTestUrl(testButtonUrl);
        setLocalWhatsappUrl(whatsappUrl);
        setLocalWhatsappGroupUrl(whatsappGroupUrl);
        setLocalLogoUrl(logoUrl);
        setLocalFaviconUrl(faviconUrl);
    }, [testButtonUrl, whatsappUrl, whatsappGroupUrl, logoUrl, faviconUrl]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('O arquivo deve ter no máximo 2MB.');
            return;
        }

        const setLoading = type === 'logo' ? setUploadingLogo : setUploadingFavicon;
        const setUrl = type === 'logo' ? setLocalLogoUrl : setLocalFaviconUrl;

        setLoading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${type}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('site-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('site-assets')
                .getPublicUrl(filePath);

            setUrl(publicUrl);
        } catch (err: any) {
            console.error('Error uploading file:', err);
            setError('Erro ao fazer upload da imagem. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('setting_key', 'pix_discount')
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setPixDiscount(data.setting_value as PixDiscountSettings);
            }
        } catch (err: any) {
            console.error('Error fetching settings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setSaveSuccess(false);
        setError(null);

        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    setting_key: 'pix_discount',
                    setting_value: pixDiscount,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            // Save URLs
            await updateTestButtonUrl(localTestUrl);
            await updateWhatsappUrl(localWhatsappUrl);
            await updateWhatsappGroupUrl(localWhatsappGroupUrl);
            await updateLogoUrl(localLogoUrl);
            await updateFaviconUrl(localFaviconUrl);
            // Credit card enabled is saved immediately on toggle
        } catch (err: any) {
            console.error('Error saving settings:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Carregando configurações...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <SettingsIcon className="w-7 h-7 text-primary" />
                    Configurações do Sistema
                </h2>
                <p className="text-slate-500 mt-1">Gerencie descontos, formas de pagamento e integrações.</p>
            </div>

            {/* PIX Discount Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Formas de Pagamento
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Gerencie os métodos de pagamento disponíveis
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Credit Card Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                            <label className="font-bold text-slate-900 block mb-1">Pagamento por Cartão de Crédito</label>
                            <p className="text-sm text-slate-500">Ativar ou desativar a opção de pagamento via cartão no checkout</p>
                        </div>
                        <button
                            onClick={() => updateCreditCardEnabled(!creditCardEnabled)}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${creditCardEnabled ? 'bg-green-600' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${creditCardEnabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* PIX Discount Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Percent className="w-5 h-5 text-green-600" />
                        Desconto PIX
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Configure o desconto aplicado para pagamentos via PIX
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                            <label className="font-bold text-slate-900 block mb-1">Ativar Desconto PIX</label>
                            <p className="text-sm text-slate-500">Quando ativo, aplica desconto em pagamentos PIX</p>
                        </div>
                        <button
                            onClick={() => setPixDiscount(prev => ({ ...prev, enabled: !prev.enabled }))}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${pixDiscount.enabled ? 'bg-green-600' : 'bg-slate-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${pixDiscount.enabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Percentage Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Porcentagem de Desconto
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="0.5"
                                value={pixDiscount.percentage}
                                onChange={(e) => setPixDiscount(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                                disabled={!pixDiscount.enabled}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                                style={{
                                    background: pixDiscount.enabled
                                        ? `linear-gradient(to right, #10b981 0%, #10b981 ${(pixDiscount.percentage / 20) * 100}%, #e2e8f0 ${(pixDiscount.percentage / 20) * 100}%, #e2e8f0 100%)`
                                        : '#e2e8f0'
                                }}
                            />
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={pixDiscount.percentage}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (val >= 0 && val <= 20) {
                                            setPixDiscount(prev => ({ ...prev, percentage: val }));
                                        }
                                    }}
                                    disabled={!pixDiscount.enabled}
                                    className="w-16 px-3 py-2 border border-slate-200 rounded-lg text-center font-bold disabled:opacity-50 disabled:bg-slate-100"
                                />
                                <span className="text-slate-600 font-bold">%</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            {pixDiscount.enabled
                                ? `Clientes receberão ${pixDiscount.percentage}% de desconto ao pagar com PIX`
                                : 'Desconto PIX desativado - clientes pagarão o valor integral'}
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-sm font-bold text-green-900 mb-2">Preview do Desconto</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-green-700">Valor Original:</p>
                                <p className="text-lg font-bold text-green-900">R$ 100,00</p>
                            </div>
                            <div>
                                <p className="text-green-700">Com Desconto PIX:</p>
                                <p className="text-lg font-bold text-green-900">
                                    R$ {pixDiscount.enabled ? (100 - (100 * pixDiscount.percentage / 100)).toFixed(2).replace('.', ',') : '100,00'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* URL Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        Links e Integrações
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Configure os links externos do site
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Test Button URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Link do Botão "Teste por R$5,90"
                        </label>
                        <input
                            type="url"
                            value={localTestUrl}
                            onChange={(e) => setLocalTestUrl(e.target.value)}
                            placeholder="https://exemplo.com/teste"
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Este link aparecerá no botão de teste na seção Hero
                        </p>
                    </div>

                    {/* WhatsApp URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            Link do WhatsApp
                        </label>
                        <input
                            type="url"
                            value={localWhatsappUrl}
                            onChange={(e) => setLocalWhatsappUrl(e.target.value)}
                            placeholder="https://wa.me/5511999999999"
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Botão flutuante do WhatsApp (canto inferior direito)
                        </p>
                    </div>

                    {/* WhatsApp Group URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            Link do Grupo de Promoção (WhatsApp)
                        </label>
                        <input
                            type="url"
                            value={localWhatsappGroupUrl}
                            onChange={(e) => setLocalWhatsappGroupUrl(e.target.value)}
                            placeholder="https://chat.whatsapp.com/..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Link do botão na página de "Obrigado"
                        </p>
                    </div>
                </div>
            </div>

            {/* Visual Identity Settings */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                        Identidade Visual
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Personalize o logo e o favicon do site
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Logo URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Logo do Site
                        </label>
                        <div className="space-y-4">
                            {/* Upload Input */}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Fazer Upload</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'logo')}
                                    disabled={uploadingLogo}
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-primary/20
                                        cursor-pointer"
                                />
                                {uploadingLogo && <span className="text-xs text-primary mt-1 block">Enviando...</span>}
                            </div>

                            {/* Manual URL Input */}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Ou insira a URL manualmente</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="url"
                                            value={localLogoUrl}
                                            onChange={(e) => setLocalLogoUrl(e.target.value)}
                                            placeholder="https://exemplo.com/logo.png"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Recomendado: Imagem PNG com fundo transparente (max-height: 40px)
                                        </p>
                                    </div>
                                    {localLogoUrl && (
                                        <div className="p-2 bg-slate-100 rounded border border-slate-200">
                                            <img src={localLogoUrl} alt="Preview Logo" className="h-10 w-auto object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Favicon URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Favicon do Site
                        </label>
                        <div className="space-y-4">
                            {/* Upload Input */}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Fazer Upload</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'favicon')}
                                    disabled={uploadingFavicon}
                                    className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-primary/20
                                        cursor-pointer"
                                />
                                {uploadingFavicon && <span className="text-xs text-primary mt-1 block">Enviando...</span>}
                            </div>

                            {/* Manual URL Input */}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Ou insira a URL manualmente</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="url"
                                            value={localFaviconUrl}
                                            onChange={(e) => setLocalFaviconUrl(e.target.value)}
                                            placeholder="https://exemplo.com/favicon.ico"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Ícone que aparece na aba do navegador (recomendado .ico ou .png 32x32)
                                        </p>
                                    </div>
                                    {localFaviconUrl && (
                                        <div className="p-2 bg-slate-100 rounded border border-slate-200">
                                            <img src={localFaviconUrl} alt="Preview Favicon" className="w-8 h-8 object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Card Settings Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Links de Pagamento por Cartão</h4>
                        <p className="text-sm text-blue-700 mb-3">
                            Configure os links externos (Monetizze) para cada produto na aba <strong>Produtos</strong>.
                            Quando o cliente escolher "Cartão de Crédito", será redirecionado para o link configurado.
                        </p>
                        <p className="text-xs text-blue-600">
                            💡 Dica: Edite cada produto individualmente para adicionar o link da plataforma de pagamento.
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                    {saveSuccess && (
                        <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold">Configurações salvas com sucesso!</span>
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

export default Settings;
