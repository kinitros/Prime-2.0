import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PlatformCard from './components/PlatformCard';
import Features from './components/Features';
import Footer from './components/Footer';
import Modal from './components/Modal';
import { TESTIMONIALS } from './constants';
import { PlatformData } from './types';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminDashboard from './components/admin/AdminDashboard';

const MainApp: React.FC = () => {
  const { platforms } = useAdmin();
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId) || null;

  const handlePlatformClick = (platform: PlatformData) => {
    setSelectedPlatformId(platform.id);
    setIsModalOpen(true);
  };

  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-primary selection:text-white">
      {/* Black Friday Top Banner */}
      {showBanner && (
        <div className="bg-slate-900 text-white py-2 px-4 text-center relative z-50 animate-fade-in">
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

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden bg-mesh bg-cover bg-no-repeat bg-center">
        {/* Animated Background Blobs - Adjusted for Light Mode */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">

          {/* Black Friday Badge */}
          <div className="mb-6 inline-flex items-center gap-2 bg-slate-900/5 border border-slate-900/10 rounded-full px-4 py-1.5 animate-fade-in">
            <span className="bg-slate-900 text-yellow-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">BLACK FRIDAY</span>
            <span className="text-sm font-bold text-slate-900">Ofertas por tempo limitado 🔥</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Uma app para <br className="hidden md:block" />
            <span className="text-gradient">crescer todos eles.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 font-medium leading-relaxed">
            Simplifique seu crescimento digital. Instagram, TikTok, YouTube e mais — gerencie sua autoridade em uma única plataforma poderosa.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <a href="#services" className="px-10 py-4 bg-slate-900 text-yellow-400 rounded-xl font-black text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 border border-yellow-400/20">
              Ver Ofertas Black Friday
              <ArrowRight className="w-5 h-5" />
            </a>
            <button className="px-10 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center shadow-sm">
              Ver demonstração
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Garantia vitalícia
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Suporte 24/7
            </div>
          </div>

          {/* Dashboard Preview / Visual Anchor - Light Mode */}
          <div className="mt-20 relative w-full max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white rounded-2xl border border-slate-200 p-2 shadow-2xl">
              <div className="bg-slate-50 rounded-xl overflow-hidden aspect-[16/9] flex items-center justify-center relative border border-slate-100">
                {/* Abstract Representation of the App Interface */}
                <div className="absolute inset-0 grid grid-cols-12 gap-4 p-8 opacity-70">
                  <div className="col-span-3 bg-white rounded-lg h-full shadow-sm animate-pulse border border-slate-100"></div>
                  <div className="col-span-9 space-y-4">
                    <div className="flex gap-4 mb-8">
                      <div className="w-1/3 h-32 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                      <div className="w-1/3 h-32 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                      <div className="w-1/3 h-32 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                    </div>
                    <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-slate-100"></div>
                  </div>
                </div>
                <div className="z-10 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Painel de Controle Unificado</h3>
                  <p className="text-slate-500">Acompanhe métricas em tempo real.</p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Modern CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(123,97,255,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Economize tempo.<br />Cresça mais rápido.
              </h2>
              <p className="text-white/90 text-xl mb-10 font-medium max-w-2xl mx-auto">
                Junte-se a mais de 50.000 criadores que usam o Impulso para gerenciar sua presença digital.
              </p>
              <button className="bg-white text-primary font-bold text-lg px-12 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

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