import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformData, ServiceOffer, OrderForm, Product } from '../types';
import { ArrowLeft, Link as LinkIcon, Mail, Phone, QrCode, CreditCard, Lock, CheckCircle2, Copy, Loader2, Smartphone, Check, Plus, User, FileText, Users, Image as ImageIcon, Grid, X, UserPlus, Heart, Eye } from 'lucide-react';
import { InstagramProfile, InstagramPost, TikTokProfile, TikTokPost, YouTubeVideo } from '../services/api';
import { createPixPayment, checkPaymentStatus, PixCharge } from '../services/payment';
import PostSelector from './PostSelector';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface CheckoutProps {
  platform: PlatformData;
  offer: ServiceOffer;
  onBack: () => void;
  profileData?: any; // Can be InstagramProfile | TikTokProfile | YouTubeChannel | KwaiProfile
}

const Checkout: React.FC<CheckoutProps> = ({ platform, offer, onBack, profileData }) => {
  const navigate = useNavigate();

  // Helper to get username from different profile types
  const getUsername = () => {
    if (!profileData) return '';
    return profileData.username || profileData.uniqueId || profileData.title || profileData.name || '';
  };

  // Helper to get display name from different profile types  
  const getDisplayName = () => {
    if (!profileData) return '';
    return profileData.full_name || profileData.nickname || profileData.title || profileData.name || '';
  };

  // Helper to get avatar URL
  const getAvatarUrl = () => {
    if (!profileData) return '';
    return profileData.profile_pic_url || profileData.avatarUrl || profileData.thumbnailUrl || '';
  };

  // Helper to get follower/subscriber count
  const getFollowerCount = (): string | number => {
    if (!profileData) return 0;
    const count = profileData.follower_count || profileData.followerCount || profileData.subscriberCount;
    if (typeof count === 'number') return count;
    if (typeof count === 'string') return count;
    return 0;
  };

  // Helper to get content count (posts/videos/etc)
  const getContentCount = (): string | number => {
    if (!profileData) return 0;
    const count = profileData.media_count || profileData.videoCount || profileData.videoCount;
    if (typeof count === 'number') return count;
    if (typeof count === 'string') return count;
    return 0;
  };

  // Content type label based on platform
  const getContentLabel = () => {
    switch (platform.id) {
      case 'youtube': return 'vídeos';
      case 'tiktok': return 'vídeos';
      case 'kwai': return 'vídeos';
      default: return 'posts';
    }
  };

  const [formData, setFormData] = useState<OrderForm>({
    link: getUsername(),
    name: '', // Empty by default as requested
    cpf: '',
    email: '',
    whatsapp: '',
    paymentMethod: 'pix'
  });

  // Use products from the offer prop
  const packages = offer.products;

  // Default to the first package or the one that matches the starting price if possible
  const [selectedPackage, setSelectedPackage] = useState<Product>(packages[0] || { quantity: 0, price: 0, originalPrice: 0, id: 'default' });
  const [hasOrderBump, setHasOrderBump] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]); // Array of selected bump IDs

  // Post/Video Selection State
  const [isPostSelectorOpen, setIsPostSelectorOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<(InstagramPost | TikTokPost | YouTubeVideo)[]>([]);

  // Video Link State (for YouTube/Kwai)
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [currentVideoLink, setCurrentVideoLink] = useState('');

  // Determine which input method to show
  const needsPostSelector = (offer.type === 'likes' || offer.type === 'views') &&
    (platform.id === 'instagram' || platform.id === 'tiktok' || platform.id === 'youtube') && profileData;

  const needsVideoLink = (offer.type === 'likes' || offer.type === 'views') &&
    platform.id === 'kwai'; // Only Kwai uses manual video links now

  const needsManualProfileLink = platform.id === 'facebook' || platform.id === 'twitter';

  // Reset order bump when package changes
  useEffect(() => {
    setHasOrderBump(false);
  }, [selectedPackage]);

  // DataLayer: Begin Checkout
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [{
          item_name: offer.title,
          item_id: selectedPackage.id,
          price: selectedPackage.price,
          quantity: 1
        }]
      }
    });
  }, [offer, selectedPackage]);

  // CPF Validation Helper
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixCharge | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending');
  const [imageError, setImageError] = useState(false);

  const [pixSettings, setPixSettings] = useState({ enabled: true, percentage: 5 });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_key', 'pix_discount')
        .single();

      if (data?.setting_value) {
        setPixSettings(data.setting_value);
      }
    };
    fetchSettings();
  }, []);

  // Calculate prices based on selected package and selected bumps
  const orderBumps = selectedPackage.order_bumps || [];
  const selectedBumpsTotal = orderBumps
    .filter(bump => selectedBumps.includes(bump.id))
    .reduce((sum, bump) => sum + bump.price, 0);

  const subtotal = selectedPackage.price + selectedBumpsTotal;
  const pixDiscount = (formData.paymentMethod === 'pix' && pixSettings.enabled)
    ? subtotal * (pixSettings.percentage / 100)
    : 0;
  const total = subtotal - pixDiscount;

  // Note: Payment status polling is now handled directly in handlePayment
  // This prevents duplicate polling and ensures we have the correct order_id

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePostSelection = (posts: (InstagramPost | TikTokPost | YouTubeVideo)[]) => {
    setSelectedPosts(posts);
    setIsPostSelectorOpen(false);
  };

  const handleAddVideoLink = () => {
    if (currentVideoLink.trim()) {
      setVideoLinks([...videoLinks, currentVideoLink.trim()]);
      setCurrentVideoLink('');
    }
  };

  const handleRemoveVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const handlePayment = async () => {
    console.log('handlePayment called');
    console.log('FormData:', formData);

    // Validate all fields
    if (!formData.name || !formData.cpf || !formData.email || !formData.whatsapp) {
      console.log('Validation failed: Missing fields');
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validate Link, Posts, or Video Links based on platform
    if (needsPostSelector) {
      if (selectedPosts.length === 0) {
        console.log('Validation failed: No posts selected');
        alert("Por favor, selecione pelo menos uma postagem.");
        return;
      }
    } else if (needsVideoLink) {
      if (videoLinks.length === 0) {
        console.log('Validation failed: No video links provided');
        alert("Por favor, adicione pelo menos um link de vídeo.");
        return;
      }
    } else if (!formData.link && !profileData) {
      console.log('Validation failed: No link provided');
      alert("Por favor, informe o link do perfil ou postagem.");
      return;
    }

    setIsLoading(true);
    console.log('Validation passed, starting payment process...');

    try {

      if (!validateCPF(formData.cpf)) {
        alert('Por favor, insira um CPF válido.');
        setIsLoading(false);
        return;
      }

      if (formData.paymentMethod === 'credit_card') {
        if (selectedPackage.credit_card_url) {
          window.location.href = selectedPackage.credit_card_url;
          return;
        } else {
          alert('Link de pagamento por cartão não configurado para este produto. Por favor, entre em contato com o suporte.');
          setIsLoading(false);
          return;
        }
      }

      if (formData.paymentMethod === 'pix') {
        // Prepare selected posts data
        const selectedPostsData = selectedPosts.length > 0 ? selectedPosts.map(post => {
          const postUrl = platform.id === 'instagram'
            ? `https://www.instagram.com/p/${(post as InstagramPost).shortcode}/`
            : platform.id === 'tiktok'
              ? `https://www.tiktok.com/@${getUsername()}/video/${(post as TikTokPost).id}`
              : platform.id === 'youtube'
                ? `https://www.youtube.com/watch?v=${(post as YouTubeVideo).video_id}`
                : '';

          return {
            post_url: postUrl,
            post_id: 'id' in post ? post.id : (post as YouTubeVideo).video_id,
            quantity_per_post: Math.floor(selectedPackage.quantity / selectedPosts.length)
          };
        }) : [];

        const paymentData = {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.whatsapp,
          customer_document: formData.cpf,
          instagram_username: needsPostSelector ? (selectedPosts.length > 0 ? `${selectedPosts.length} posts selecionados` : '') : formData.link,
          service_type: offer?.title || 'Serviço',
          quantity: selectedPackage.quantity + selectedBumps.length * selectedPackage.quantity,
          unit_price: selectedPackage.price,
          total_amount: total,
          selected_posts: selectedPostsData, // Add selected posts array
          platform_id: platform.id,
          profile_username: getUsername(),
          order_bumps: orderBumps
            .filter(b => selectedBumps.includes(b.id))
            .map(b => ({
              id: b.id,
              title: b.title,
              price: b.price,
              discount_percentage: b.discount_percentage
            }))
        };

        console.log('Sending Payment Data:', paymentData);

        const response = await createPixPayment(paymentData);

        console.log('=== PIX PAYMENT RESPONSE ===');
        console.log('Full response:', response);
        console.log('response.success:', response.success);
        console.log('response.data:', response.data);
        console.log('===========================');

        if (response.success && response.data) {
          setPixData(response.data);
          setPaymentStatus('pending');

          // Verify order_id exists before polling
          if (!response.data.order_id) {
            console.error('Order ID not found in response:', response.data);
            alert('Erro: ID do pedido não encontrado. Por favor, tente novamente.');
            return;
          }

          console.log('Starting payment polling for order_id:', response.data.order_id);

          // Start polling with the new order_id
          const pollInterval = setInterval(async () => {
            try {
              const statusResponse = await checkPaymentStatus(response.data.order_id);
              if (statusResponse.success && statusResponse.data.status === 'paid') {
                setPaymentStatus('paid');
                clearInterval(pollInterval);

                // Redirect to thank you page with order data
                const searchParams = new URLSearchParams({
                  orderId: response.data.order_id,
                  platform: platform.name,
                  service: offer.title,
                  quantity: selectedPackage.quantity.toString(),
                  username: getUsername(),
                  amount: total.toString(),
                  estimatedDelivery: '24-72 horas'
                });
                navigate(`/thank-you?${searchParams.toString()}`);
              }
            } catch (err) {
              console.error('Error polling status:', err);
            }
          }, 5000);

          // DataLayer: Purchase
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: response.data.order_id,
              value: total,
              currency: 'BRL',
              items: [{
                item_name: offer.title,
                item_id: selectedPackage.id,
                price: selectedPackage.price,
                quantity: 1
              }]
            }
          });
        } else {
          throw new Error(response.error || 'Erro ao gerar PIX');
        }

      } else {
        // Handle credit card flow (placeholder)
        alert('Pagamento com cartão processado com sucesso! (Simulação)');
      }

    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert(`Erro ao processar pagamento: ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };


  const [step, setStep] = useState(1);

  // Helper to determine icon for bumps
  const getBumpIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('seguidores')) return <UserPlus className="w-6 h-6 text-white" />;
    if (lowerTitle.includes('curtidas') || lowerTitle.includes('likes')) return <Heart className="w-6 h-6 text-white" />;
    if (lowerTitle.includes('visualizações') || lowerTitle.includes('views')) return <Eye className="w-6 h-6 text-white" />;
    return <Plus className="w-6 h-6 text-white" />;
  };

  const handleNextStep = () => {
    setStep(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-white scroll-smooth">
      <div className="flex flex-col lg:flex-row min-h-full">
        {/* Left Column: Form */}
        <div className="flex-1 p-6 md:p-8">
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>

          {/* Profile Summary Card (Always visible) */}
          {profileData && (
            <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 animate-fade-in">
              <div className="relative shrink-0">
                {!imageError ? (
                  <img
                    src={getAvatarUrl()}
                    alt={getUsername()}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br ${platform.gradient}`}>
                    {getDisplayName() ? getDisplayName().charAt(0).toUpperCase() : getUsername().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${platform.color}`}>
                    {/* Icon based on platform would go here, simplified for now */}
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{getDisplayName()}</h4>
                <p className="text-sm text-slate-500 truncate">@{getUsername()}</p>
                <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {typeof getFollowerCount() === 'number' ? (getFollowerCount() as number).toLocaleString() : getFollowerCount()} {platform.id === 'youtube' ? 'inscritos' : 'seguidores'}
                  </span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> {typeof getContentCount() === 'number' ? (getContentCount() as number).toLocaleString() : getContentCount()} {getContentLabel()}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: QUANTITY SELECTION */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Selecione a quantidade</h3>
              <p className="text-slate-500 text-sm mb-6">Escolha o pacote ideal para o seu crescimento.</p>

              {/* PACKAGE SELECTOR GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`
                          relative cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center justify-center text-center transition-all duration-200 select-none
                          ${selectedPackage.id === pkg.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm scale-[1.02]'
                        : 'border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50'
                      }
                      `}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2.5 bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        POPULAR
                      </div>
                    )}
                    <span className="text-lg font-black text-slate-900 tracking-tight mb-1">
                      {pkg.quantity >= 1000 ? `${pkg.quantity / 1000}k` : pkg.quantity}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      {offer.type === 'followers' ? 'Seguidores' : offer.type === 'likes' ? 'Curtidas' : 'Visualizações'}
                    </span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 line-through">
                        R$ {pkg.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        R$ {pkg.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                Continuar
                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: DETAILS & PAYMENT */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Dados do pedido</h3>
              <p className="text-slate-500 text-sm mb-6">Preencha seus dados para finalizar.</p>

              {/* Post Selection Button (Only for Instagram/TikTok Likes/Views) */}
              {needsPostSelector && (
                <div className="mb-8 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Distribuição</h3>

                  {selectedPosts.length > 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700">
                          {selectedPosts.length} postagens selecionadas
                        </span>
                        <button
                          onClick={() => setIsPostSelectorOpen(true)}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          Alterar
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {selectedPosts.map(post => {
                          // Get display URL based on post type
                          const displayUrl = 'display_url' in post
                            ? post.display_url
                            : 'coverUrl' in post
                              ? post.coverUrl
                              : 'thumbnail' in post
                                ? post.thumbnail
                                : '';
                          const postId = 'id' in post ? post.id : (post as YouTubeVideo).video_id;

                          return (
                            <div key={postId} className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                              <img src={displayUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Receberão <strong>{Math.floor(selectedPackage.quantity / selectedPosts.length)}</strong> {offer.type === 'likes' ? 'curtidas' : 'views'} cada.
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsPostSelectorOpen(true)}
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Grid className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                      </div>
                      <span className="font-bold">Selecionar Postagens</span>
                      <span className="text-xs text-slate-500">Escolha onde receber as {offer.type === 'likes' ? 'curtidas' : 'visualizações'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Video Link Input (YouTube/Kwai) */}
              {needsVideoLink && (
                <div className="mb-8 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Vídeos</h3>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cole o link do vídeo
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={currentVideoLink}
                        onChange={(e) => setCurrentVideoLink(e.target.value)}
                        placeholder={`https://${platform.id}.com/...`}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <button
                        onClick={handleAddVideoLink}
                        disabled={!currentVideoLink.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Adicionar
                      </button>
                    </div>

                    {videoLinks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-600 mb-2">
                          {videoLinks.length} {videoLinks.length === 1 ? 'vídeo adicionado' : 'vídeos adicionados'}
                        </p>
                        {videoLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-700 truncate flex-1">{link}</span>
                            <button
                              onClick={() => handleRemoveVideoLink(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Receberão <strong>{Math.floor(selectedPackage.quantity / videoLinks.length)}</strong> {offer.type === 'likes' ? 'curtidas' : 'views'} cada.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-6 border-t border-slate-100 pt-6">
                Dados do pedido
              </h3>

              <div className="space-y-6">
                {/* Inputs Section */}
                <div className="space-y-4">
                  {/* Show Link input for followers or if no post selector needed */}
                  {!needsPostSelector && !needsVideoLink && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Link do perfil ou post</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="link"
                          value={formData.link}
                          onChange={handleInputChange}
                          placeholder={offer.type === 'followers' ? `https://${platform.id}.com/seu-usuario` : `Link da postagem`}
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                          readOnly={!!profileData} // Make read-only if profile data was fetched
                        />
                      </div>
                      {offer.type === 'followers' && (
                        <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> Seu perfil precisa estar <strong>público</strong>.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileText className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="cpf"
                          value={formData.cpf}
                          onChange={(e) => {
                            // Mask CPF
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length > 11) v = v.slice(0, 11);
                            v = v.replace(/(\d{3})(\d)/, '$1.$2');
                            v = v.replace(/(\d{3})(\d)/, '$1.$2');
                            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                            setFormData(prev => ({ ...prev, cpf: v }));
                          }}
                          placeholder="000.000.000-00"
                          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => {
                          // Mask Phone
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length > 11) v = v.slice(0, 11);
                          v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
                          v = v.replace(/(\d)(\d{4})$/, '$1-$2');
                          setFormData(prev => ({ ...prev, whatsapp: v }));
                        }}
                        placeholder="(00) 00000-0000"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Summary */}
        {step === 2 && (
          <div className="w-full lg:w-[400px] shrink-0 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 flex flex-col h-auto lg:h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Resumo do Pedido</h3>

            <div className="space-y-4 mb-8 flex-1">
              {/* Main Item */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} shadow-sm flex items-center justify-center shrink-0`}>
                  {offer.type === 'followers' ? (
                    <UserPlus className="w-6 h-6 text-white" />
                  ) : offer.type === 'likes' ? (
                    <Heart className="w-6 h-6 text-white" />
                  ) : (
                    <Eye className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedPackage.quantity} {offer.type === 'followers' ? 'Seguidores' : offer.type === 'likes' ? 'Curtidas' : 'Views'}
                  </p>
                  <p className="text-xs text-slate-500">{platform.name}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold text-slate-900 text-sm">R$ {selectedPackage.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              {/* Selected Order Bumps */}
              {selectedBumps.length > 0 && orderBumps.filter(b => selectedBumps.includes(b.id)).map((bump) => (
                <div key={bump.id} className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    {/* Dynamic Icon for Bumps */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platform.gradient.includes('pink') ? 'bg-pink-500' : 'bg-red-500'}`}>
                      {getBumpIcon(bump.title)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {bump.title}
                    </p>
                    {bump.discount_percentage > 0 && (
                      <p className="text-xs text-red-600 font-bold">Oferta Especial ({bump.discount_percentage}% OFF)</p>
                    )}
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-slate-900 text-sm">R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-900 mb-3">Método de pagamento</label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pix' }))}
                  className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 transition-all select-none ${formData.paymentMethod === 'pix' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-primary/50'}`}
                >
                  <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 text-xs">Pix</span>
                  {pixSettings.enabled && (
                    <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                      -{pixSettings.percentage}% OFF
                    </span>
                  )}
                </div>

                <div
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit_card' }))}
                  className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 transition-all select-none ${formData.paymentMethod === 'credit_card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-primary/50'}`}
                >
                  <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 text-xs">Cartão</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {formData.paymentMethod === 'pix' && pixSettings.enabled && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{pixSettings.percentage}% Desconto PIX</span>
                  <span>-R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
            </div>

            {/* ORDER BUMPS SELECTION (In Step 2) */}
            {orderBumps.length > 0 && (
              <div className="space-y-3 mb-6">
                {orderBumps.map((bump) => {
                  const isSelected = selectedBumps.includes(bump.id);
                  return (
                    <div
                      key={bump.id}
                      className="bg-white border-2 border-dashed border-red-200 rounded-xl p-3 flex gap-3 hover:border-red-300 transition-colors cursor-pointer shadow-sm"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedBumps(selectedBumps.filter(id => id !== bump.id));
                        } else {
                          setSelectedBumps([...selectedBumps, bump.id]);
                        }
                      }}
                    >
                      <div className="shrink-0 pt-1">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-red-500 border-red-500' : 'bg-slate-50 border-red-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-600 text-xs uppercase flex items-center gap-1.5 mb-1">
                          <span className="bg-red-100 px-1.5 py-0.5 rounded text-[10px]">OFERTA</span>
                          {bump.discount_percentage > 0 && `${bump.discount_percentage}% DE DESCONTO EXTRA`}
                        </h4>
                        <p className="text-sm font-medium text-slate-700 leading-tight mb-1">
                          {bump.title}
                        </p>
                        <p className="text-sm font-bold text-red-600">
                          R$ {bump.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-200">
              <div className="flex justify-between items-end mb-4">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {formData.paymentMethod === 'pix' ? 'Gerar Pix QR Code' : 'Pagar com Cartão'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                PAGAMENTO 100% SEGURO
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PIX QR Code Modal */}
      {pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Pix Gerado!</h3>
              <p className="text-slate-500 mb-6">
                Escaneie o QR Code abaixo ou copie o código para pagar.
                <br />
                <span className="text-sm font-bold text-red-500">Expira em 30 minutos</span>
              </p>

              <div className="bg-white p-4 border-2 border-slate-100 rounded-xl mb-6 inline-block">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-48 h-48"
                />
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  readOnly
                  value={pixData.copy_paste_code || pixData.qr_code}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-4 pr-12 text-sm text-slate-600 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.copy_paste_code || pixData.qr_code);
                    alert('Código PIX copiado!');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {paymentStatus === 'paid' ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-bounce">
                  <CheckCircle2 className="w-5 h-5" />
                  Pagamento Confirmado! Redirecionando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aguardando pagamento...
                </div>
              )}
            </div>
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
              <button
                onClick={() => {
                  setPixData(null);
                  setPaymentStatus('idle');
                }}
                className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Selector Modal */}
      {profileData && (
        <PostSelector
          isOpen={isPostSelectorOpen}
          onClose={() => setIsPostSelectorOpen(false)}
          username={(profileData as any).username || (profileData as any).uniqueId || ''}
          platformId={platform.id}
          packageQuantity={selectedPackage.quantity}
          onConfirm={handlePostSelection}
          initialSelectedPosts={selectedPosts}
          extraData={{
            ...profileData,
            channelId: profileData.channelId || profileData.id // For YouTube
          }}
        />
      )}
    </div>
  );
};

export default Checkout;