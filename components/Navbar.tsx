import React from 'react';
import { Menu, X, CheckSquare, Zap } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass-nav border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-primary fill-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              impulso
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <a href="#home" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Produto</a>
              <a href="#services" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Soluções</a>
              <a href="#benefits" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Empresas</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors text-sm font-medium">Preços</a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button className="text-slate-600 hover:text-primary text-sm font-medium">
                Entrar
             </button>
             <button className="bg-brand-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm shadow-[0_4px_14px_0_rgba(123,97,255,0.39)]">
                Começar Grátis
             </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-nav border-t border-slate-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-4 text-center text-base font-medium text-slate-600 hover:text-primary border-b border-slate-100">Produto</a>
            <a href="#services" className="block px-3 py-4 text-center text-base font-medium text-slate-600 hover:text-primary border-b border-slate-100">Soluções</a>
            <a href="#benefits" className="block px-3 py-4 text-center text-base font-medium text-slate-600 hover:text-primary">Empresas</a>
            <div className="p-4">
                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg">Começar Agora</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;