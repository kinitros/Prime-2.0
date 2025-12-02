import React from 'react';
import { Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Footer: React.FC = () => {
  const { logoUrl } = useAdmin();

  return (
    <footer className="bg-surface border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Zap className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">Seguidores Prime</span>
                </>
              )}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              A plataforma líder para impulsionamento de redes sociais. Seguro, rápido e eficaz.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-bold mb-4">Produto</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4">Recursos</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Comunidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-500 text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} Seguidores Prime. Feito com ❤️ para criadores.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;