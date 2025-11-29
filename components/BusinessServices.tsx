import React from 'react';
import { Globe, MapPin, CheckCircle2, ArrowRight, Layout, Store } from 'lucide-react';

const BusinessServices: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Premium</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Soluções para Empresas</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Leve o seu negócio para o próximo nível com nossos serviços de desenvolvimento e posicionamento local.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Website Creation Card */}
                    <div className="group relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 hover:border-primary/20 transition-all hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/10"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <Layout className="w-8 h-8 text-primary" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Criação de Websites</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Desenvolvemos sites modernos, rápidos e otimizados para conversão. Tenha uma presença digital profissional que transmite autoridade.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Design Exclusivo e Responsivo
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Otimizado para SEO (Google)
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Alta Velocidade de Carregamento
                                </li>
                            </ul>

                            <button className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group-hover:text-primary-hover">
                                Solicitar Orçamento <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Google My Business Card */}
                    <div className="group relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 hover:border-secondary/20 transition-all hover:shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-secondary/10"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <Store className="w-8 h-8 text-secondary" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Google Meu Negócio</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Seja encontrado por clientes na sua região. Otimizamos sua ficha no Google Maps para você aparecer no topo das buscas locais.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Otimização de Ficha (SEO Local)
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Gestão de Avaliações
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-success" /> Aumento de Ligações e Visitas
                                </li>
                            </ul>

                            <button className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all group-hover:text-secondary">
                                Solicitar Orçamento <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessServices;
