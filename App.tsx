import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PlatformCard from './components/PlatformCard';
import Features from './components/Features';
import Footer from './components/Footer';
import BusinessServices from './components/BusinessServices';
import FOMONotifications from './components/FOMONotifications';
import WhatsAppFloat from './components/WhatsAppFloat';
import Modal from './components/Modal';
import { TESTIMONIALS } from './constants';
import { PlatformData } from './types';
import { ArrowRight, Star, CheckCircle2, Instagram, Youtube, Video, Play, ThumbsUp, Users, Eye, MessageCircle, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminDashboard from './components/admin/AdminDashboard';

const MainApp: React.FC = () => {
  const { platforms, testButtonUrl, faviconUrl } = useAdmin();
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update Favicon dynamically
  React.useEffect(() => {
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [faviconUrl]);

  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) || null;

  const handlePlatformClick = (platform: PlatformData) => {
    setSelectedPlatformId(platform.id);
    setIsModalOpen(true);
  };

  const [showBanner, setShowBanner] = useState(true);
  const [activeHeroTab, setActiveHeroTab] = useState<'instagram' | 'tiktok' | 'youtube' | 'kwai'>('instagram');

  const getPlatformById = (id: string) => platforms.find(p => p.id === id);

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-primary selection:text-white">
      <FOMONotifications />
      {/* Black Friday Top Banner - Sticky */}
      {showBanner && (
        <div className="sticky top-0 bg-slate-900 text-white py-2 px-4 text-center relative z-50 animate-fade-in shadow-lg">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">BLACK FRIDAY</span>
            <span className="hidden sm:inline">Aproveite descontos de até</span>
            <span className="font-bold text-yellow-400">80% OFF</span>
            <span className="hidden sm:inline">em todos os pacotes!</span>
            <ArrowRight className="w-4 h-4 text-yellow-400 ml-1" />
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      <Navbar />

      {/* Hero Section - Black with Shine */}
      <section id="home" className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden bg-black">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-tight">
            Compre Seguidores e Curtidas <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">Entregue em Minutos!</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-12 font-medium leading-relaxed">
            Conte com a <strong className="text-white">Seguidores Prime</strong>, o serviço de crescimento nº 1 do Brasil, para construir uma presença robusta nas redes sociais.
          </p>

          {/* INTERACTIVE SERVICE SELECTOR CARD */}
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">

            {/* TABS */}
            <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide">
              <button
                onClick={() => setActiveHeroTab('instagram')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${activeHeroTab === 'instagram' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Instagram className="w-5 h-5" /> Instagram
              </button>
              <button
                onClick={() => setActiveHeroTab('tiktok')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${activeHeroTab === 'tiktok' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="w-5 h-5 flex items-center justify-center"><Video className="w-5 h-5" /></div> TikTok
              </button>
              <button
                onClick={() => setActiveHeroTab('youtube')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${activeHeroTab === 'youtube' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Youtube className="w-5 h-5" /> YouTube
              </button>
              <button
                onClick={() => setActiveHeroTab('kwai')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${activeHeroTab === 'kwai' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Play className="w-5 h-5" /> Kwai
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* DYNAMIC BUTTONS BASED ON ACTIVE TAB */}
                {activeHeroTab === 'instagram' && (
                  <>
                    <button
                      onClick={() => {
                        const p = getPlatformById('instagram');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Comprar Seguidores</span>
                          <span className="text-xs text-slate-500 font-medium">Reais e Brasileiros</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-orange-500 transition-colors" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const p = getPlatformById('instagram');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                          <ThumbsUp className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Comprar Curtidas</span>
                          <span className="text-xs text-slate-500 font-medium">Entrega Instantânea</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-pink-500 transition-colors" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const p = getPlatformById('instagram');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                          <Eye className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Comprar Views</span>
                          <span className="text-xs text-slate-500 font-medium">Para Reels e Stories</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-purple-500 transition-colors" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        const p = getPlatformById('instagram');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Comprar Comentários</span>
                          <span className="text-xs text-slate-500 font-medium">Personalizados</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-blue-500 transition-colors" />
                      </div>
                    </button>
                  </>
                )}

                {activeHeroTab === 'tiktok' && (
                  <>
                    <button
                      onClick={() => {
                        const p = getPlatformById('tiktok');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-black p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-slate-100 p-3 rounded-full text-slate-900">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Seguidores TikTok</span>
                          <span className="text-xs text-slate-500 font-medium">Alta Qualidade</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-slate-900 transition-colors" />
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        const p = getPlatformById('tiktok');
                        if (p) handlePlatformClick(p);
                      }}
                      className="group bg-black p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                        <div className="bg-red-100 p-3 rounded-full text-red-600">
                          <ThumbsUp className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-slate-900 text-lg">Curtidas TikTok</span>
                          <span className="text-xs text-slate-500 font-medium">Impulsione seu vídeo</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-red-600 transition-colors" />
                      </div>
                    </button>
                  </>
                )}

                {activeHeroTab === 'youtube' && (
                  <button
                    onClick={() => {
                      const p = getPlatformById('youtube');
                      if (p) handlePlatformClick(p);
                    }}
                    className="group bg-red-600 p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 col-span-2"
                  >
                    <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                      <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <Youtube className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-slate-900 text-lg">Serviços para YouTube</span>
                        <span className="text-xs text-slate-500 font-medium">Inscritos, Views e Likes</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-red-600 transition-colors" />
                    </div>
                  </button>
                )}

                {activeHeroTab === 'kwai' && (
                  <button
                    onClick={() => {
                      const p = getPlatformById('kwai');
                      if (p) handlePlatformClick(p);
                    }}
                    className="group bg-orange-500 p-[1px] rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 col-span-2"
                  >
                    <div className="bg-white h-full w-full rounded-xl p-4 flex items-center gap-4 group-hover:bg-opacity-90 transition-all">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <Play className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-slate-900 text-lg">Serviços para Kwai</span>
                        <span className="text-xs text-slate-500 font-medium">Seguidores e Curtidas</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-orange-600 transition-colors" />
                    </div>
                  </button>
                )}

              </div>
            </div>

            {/* TRUST BAR */}
            <div className="bg-white border-t border-slate-100 p-4 flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                <span>4.8/5 Estrelas</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Pix & Cartão</span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          {testButtonUrl && (
            <div className="mt-8">
              <a
                href={testButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-black text-xl px-12 py-5 rounded-2xl transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1 animate-pulse-glow"
              >
                <span className="relative z-10">🔥 Teste por apenas R$5,90</span>

                {/* Pulse rings */}
                <span className="absolute inset-0 rounded-2xl bg-yellow-400 animate-ping opacity-20"></span>
                <span className="absolute inset-0 rounded-2xl bg-yellow-400 animate-pulse opacity-30"></span>
              </a>

              <style>{`
                @keyframes pulse-glow {
                  0%, 100% {
                    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3);
                  }
                  50% {
                    box-shadow: 0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.5);
                  }
                }
                
                .animate-pulse-glow {
                  animation: pulse-glow 2s ease-in-out infinite;
                }
              `}</style>
            </div>
          )}

        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Soluções</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Escolha sua plataforma</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Impulsione métricas específicas em cada rede social com apenas alguns cliques.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onClick={() => handlePlatformClick(platform)}
              />
            ))}
          </div>
        </div>
      </section>

      <BusinessServices />

      <Features />

      {/* Testimonials */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Amado por criadores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 font-medium leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA - Black with Shine */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-12 md:p-20 text-center border border-white/10 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Economize tempo.<br />Cresça mais rápido.
            </h2>
            <p className="text-white/80 text-xl mb-10 font-medium max-w-2xl mx-auto">
              Junte-se a mais de 50.000 criadores que usam a Seguidores Prime para gerenciar sua presença digital.
            </p>
            <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white font-bold text-lg px-12 py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1">
              Começar Agora
            </button>
          </div>
        </div>

        <style>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%) skewX(-15deg);
            }
            100% {
              transform: translateX(200%) skewX(-15deg);
            }
          }
          
          .animate-shine {
            animation: shine 8s ease-in-out infinite;
          }
        `}</style>
      </section>

      <Footer />

      <WhatsAppFloat />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        platform={selectedPlatform}
      />
    </div>
  );
};

import Login from './components/Login';
import ThankYou from './components/ThankYou';

const App: React.FC = () => {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
};

export default App;