import React from 'react';
import { ShieldCheck, HeartHandshake, Zap, Lock, Layers, BarChart } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      title: "Segurança de Dados",
      description: "Criptografia de ponta a ponta para proteger sua conta."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
      title: "Suporte Humano",
      description: "Especialistas reais disponíveis para ajudar sua estratégia."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "bg-yellow-500",
      title: "Entrega Instantânea",
      description: "Sistema automatizado que inicia assim que o pagamento aprova."
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      color: "bg-green-500",
      title: "Pagamento Seguro",
      description: "Processamento via PIX com total sigilo bancário."
    },
    {
      icon: <Layers className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
      title: "Multi-Plataforma",
      description: "Gerencie todas as suas redes em um único dashboard."
    },
    {
      icon: <BarChart className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      title: "Métricas Reais",
      description: "Acompanhe o crescimento e o impacto no seu engajamento."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Construído para <span className="text-gradient">performance</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Tudo o que você precisa para escalar sua presença digital sem dores de cabeça.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
            <div key={index} className="p-8 bg-surface rounded-2xl border border-slate-100 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg">
                <div className={`mb-6 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shadow-md`}>
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default Features;