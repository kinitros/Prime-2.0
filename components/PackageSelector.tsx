import React from 'react';
import { Product } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PackageSelectorProps {
  packages: Product[];
  selectedPackage: Product;
  onSelect: (pkg: Product) => void;
  offerType: 'followers' | 'likes' | 'views' | 'comments' | string;
  onNext?: () => void;
  showContinueButton?: boolean;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({
  packages,
  selectedPackage,
  onSelect,
  offerType,
  onNext,
  showContinueButton = true
}) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Selecione a quantidade</h3>
      <p className="text-slate-500 text-sm mb-6">Escolha o pacote ideal para o seu crescimento.</p>

      {/* PACKAGE SELECTOR GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onSelect(pkg)}
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
              {pkg.quantity.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              {offerType === 'followers' ? 'Seguidores' : offerType === 'likes' ? 'Curtidas' : 'Visualizações'}
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

      {showContinueButton && onNext && (
        <button
          onClick={onNext}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
        >
          Continuar
          <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default PackageSelector;
