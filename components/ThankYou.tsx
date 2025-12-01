import React, { useEffect } from 'react';
import { CheckCircle2, Package, Clock, Smartphone, ArrowRight, Home, MessageCircle, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

interface ThankYouProps {
  orderData?: {
    orderId: string;
    platform: string;
    service: string;
    quantity: number;
    username: string;
    amount: number;
    estimatedDelivery: string;
  };
}

const ThankYou: React.FC<ThankYouProps> = ({ orderData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { whatsappGroupUrl } = useAdmin();

  // Get order data from URL params if not passed as props
  const orderId = orderData?.orderId || searchParams.get('orderId') || '';
  const platform = orderData?.platform || searchParams.get('platform') || '';
  const service = orderData?.service || searchParams.get('service') || '';
  const quantity = orderData?.quantity || parseInt(searchParams.get('quantity') || '0') || 0;
  const username = orderData?.username || searchParams.get('username') || '';
  const amount = orderData?.amount || parseFloat(searchParams.get('amount') || '0') || 0;
  const estimatedDelivery = orderData?.estimatedDelivery || '24-72 horas';

  // DataLayer event on mount
  useEffect(() => {
    if (orderId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'purchase_confirmed',
        ecommerce: {
          transaction_id: orderId,
          value: amount,
          currency: 'BRL',
          items: [{
            item_name: service,
            item_id: orderId,
            price: amount,
            quantity: 1
          }]
        }
      });
    }
  }, [orderId, amount, service]);

  const getPlatformGradient = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'from-purple-600 to-pink-600';
      case 'tiktok': return 'from-black to-pink-600';
      case 'youtube': return 'from-red-600 to-red-700';
      case 'kwai': return 'from-orange-500 to-orange-600';
      case 'facebook': return 'from-blue-600 to-blue-700';
      case 'twitter': return 'from-sky-400 to-blue-500';
      default: return 'from-purple-600 to-pink-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6 shadow-2xl animate-bounce-slow">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 animate-slide-up">
            Pagamento Confirmado! 🎉
          </h1>
          <p className="text-lg text-slate-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Seu pedido foi recebido e já está sendo processado.
          </p>
          
          {whatsappGroupUrl && (
            <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <Users className="w-5 h-5" />
                Entrar no Grupo de Promoções
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-slate-500 mt-2">
                Receba ofertas exclusivas e cupons de desconto!
              </p>
            </div>
          )}
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Order Number */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Número do Pedido</p>
              <p className="text-2xl font-black text-slate-900 font-mono">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getPlatformGradient(platform)} text-white font-bold text-sm shadow-lg`}>
              {platform.toUpperCase()}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Serviço
              </span>
              <span className="font-bold text-slate-900">{service}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Perfil/Username
              </span>
              <span className="font-bold text-slate-900">@{username}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Quantidade</span>
              <span className="font-bold text-slate-900">{quantity.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-lg font-bold text-slate-900">Total Pago</span>
              <span className="text-2xl font-black text-green-600">
                R$ {amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg shrink-0">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-green-900 mb-1">Início da Entrega</p>
              <p className="text-sm text-green-700">
                Seu pedido será iniciado em até <strong>{estimatedDelivery}</strong>.
                O processo é gradual e seguro para proteção da sua conta.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">✓</span>
            Próximos Passos
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Processamento Iniciado</p>
                <p className="text-sm text-slate-600">
                  Nossa equipeestá preparando seu pedido para entrega.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Entrega Gradual</p>
                <p className="text-sm text-slate-600">
                  Os {service.toLowerCase()} serão entregues gradualmente para parecer natural.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">Acompanhe pelo WhatsApp</p>
                <p className="text-sm text-slate-600">
                  Você receberá atualizações sobre seu pedido no WhatsApp cadastrado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all group"
          >
            <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </button>
          <a
            href={`https://wa.me/5511999999999?text=Olá! Gostaria de acompanhar meu pedido #${orderId.slice(0, 8).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all group"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Dúvidas? Entre em contato pelo WhatsApp ou email: suporte@impulso.app</p>
          <p className="mt-2">Pedido realizado em {new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
