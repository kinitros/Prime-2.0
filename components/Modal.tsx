import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { PlatformData, ServiceOffer, Product } from '../types';
import Checkout from './Checkout';
import UsernameInput from './UsernameInput';
import PackageSelector from './PackageSelector';
import { InstagramProfile } from '../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformData | null;
  isPromotion?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, platform, isPromotion = false }) => {
  const [view, setView] = useState<'selection' | 'package_selection' | 'username' | 'checkout'>('selection');
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Product | null>(null);
  const [userProfile, setUserProfile] = useState<InstagramProfile | null>(null);

  // Reset state when modal opens/closes or platform changes
  useEffect(() => {
    if (isOpen) {
      setView('selection');
      setSelectedOffer(null);
      setSelectedPackage(null);
      setUserProfile(null);
    }
  }, [isOpen, platform]);

  if (!isOpen || !platform) return null;

  const handleSelectOffer = (offer: ServiceOffer) => {
    setSelectedOffer(offer);

    if (isPromotion) {
      setView('package_selection');
      // Default to first package
      if (offer.products.length > 0) {
        setSelectedPackage(offer.products[0]);
      }
      return;
    }

    // Platforms with API verification
    const platformsWithAPIVerification = ['instagram', 'tiktok', 'youtube', 'kwai'];

    if (platformsWithAPIVerification.includes(platform.id)) {
      setView('username');
    } else {
      // Facebook, Twitter, etc. - skip verification, go straight to checkout
      setView('checkout');
    }
  };

  const handleProfileFound = (profile: InstagramProfile) => {
    setUserProfile(profile);
    setView('checkout');
  };

  const handleBackToSelection = () => {
    setView('selection');
    setSelectedOffer(null);
    setSelectedPackage(null);
    setUserProfile(null);
  };

  const handleBackToPackageSelection = () => {
    setView('package_selection');
    setUserProfile(null);
  };

  const handleBackToUsername = () => {
    const platformsWithAPIVerification = ['instagram', 'tiktok', 'youtube', 'kwai'];

    if (platformsWithAPIVerification.includes(platform.id)) {
      setView('username');
    } else if (isPromotion) {
      setView('package_selection');
    } else {
      handleBackToSelection();
    }
  };

  const handlePackageSelected = (pkg: Product) => {
    setSelectedPackage(pkg);
  };

  const handlePackageConfirmed = () => {
    setView('username');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className={`relative bg-white border border-slate-200 w-full ${view === 'checkout' ? 'max-w-4xl' : 'max-w-2xl'} overflow-hidden shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh] rounded-3xl transition-all duration-300`}>

        {view === 'selection' && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.gradient} shadow-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{platform.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Pacotes de crescimento acelerado</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Selecione o pacote ideal
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Oferta por tempo limitado</span>
              </h4>

              <div className="space-y-4">
                {platform.offers.map((offer) => {
                  // Correct Formula: Original = Price / (1 - Discount%)
                  const originalPrice = offer.priceStart / (1 - (offer.discount / 100));

                  return (
                    <div
                      key={offer.id}
                      onClick={() => handleSelectOffer(offer)}
                      className="relative overflow-hidden border border-slate-200 bg-white hover:border-primary/50 hover:shadow-lg p-5 rounded-2xl transition-all cursor-pointer group"
                    >
                      <div className="absolute top-0 right-0 bg-success/10 text-success text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-success/10">
                        MELHOR CUSTO-BENEFÍCIO
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-slate-900">{offer.title}</h4>
                            <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                              {offer.discount}% OFF
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Check className="w-3 h-3 text-success" /> Entrega Rápida
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Check className="w-3 h-3 text-success" /> Perfis Reais
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4 sm:gap-1">
                          <div className="text-right">
                            <span className="block text-xs text-slate-400 line-through">
                              de R$ {originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                            <div className="flex items-baseline gap-1 justify-end">
                              <span className="text-xs text-slate-500 font-medium">por</span>
                              <span className="text-2xl font-black text-slate-900 tracking-tight">
                                R$ {offer.priceStart.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                          <button className="bg-slate-900 hover:bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-primary/25 shrink-0">
                            Comprar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center gap-3 text-slate-500 text-xs font-medium text-center">
                <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                <span>Pagamento processado com segurança via SSL. Garantia de reposição de 30 dias.</span>
              </div>
            </div>
          </>
        )}

        {view === 'package_selection' && selectedOffer && selectedPackage && (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('selection')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Selecione a quantidade</h3>
                  <p className="text-xs text-slate-500">{selectedOffer.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <PackageSelector
                packages={selectedOffer.products}
                selectedPackage={selectedPackage}
                onSelect={handlePackageSelected}
                offerType={selectedOffer.type}
                onNext={handlePackageConfirmed}
              />
            </div>
          </div>
        )}

        {view === 'username' && (
          <UsernameInput
            platform={platform}
            onProfileFound={handleProfileFound}
            onBack={isPromotion ? handleBackToPackageSelection : handleBackToSelection}
          />
        )}

        {view === 'checkout' && selectedOffer && (
          <Checkout
            platform={platform}
            offer={selectedOffer}
            onBack={handleBackToUsername}
            profileData={userProfile}
            initialStep={isPromotion ? 2 : 1}
            initialPackage={isPromotion && selectedPackage ? selectedPackage : undefined}
          />
        )}

      </div>
    </div>
  );
};

export default Modal;