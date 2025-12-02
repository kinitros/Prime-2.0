import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  name: string;
  videoId: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Vitória',
    videoId: 'rVKFobCT2lk'
  },
  {
    name: 'Eduardo',
    videoId: 'fEGGGDFnxQA'
  },
  {
    name: 'Alícia',
    videoId: 'x73guV90gro'
  }
];

const VideoTestimonials: React.FC = () => {
  // Mobile state for carousel navigation
  const [mobileIndex, setMobileIndex] = useState(0);

  const nextSlide = () => {
    setMobileIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setMobileIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            O que nossos <span className="text-primary">Clientes</span> dizem
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Descubra como a Seguidores Prime transformou a presença digital de centenas de criadores e empresas.
          </p>
        </div>

        {/* 
           Desktop Layout (Unchanged)
        */}
        <div className="hidden md:flex items-center justify-center gap-6 h-[500px]">
          {TESTIMONIALS.map((testimonial, index) => {
            const isCenter = index === 1;
            return (
              <div 
                key={index}
                className={`
                  relative flex-shrink-0 w-full max-w-[260px]
                  bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100
                  transition-all duration-300
                  ${isCenter ? 'scale-110 z-10 shadow-2xl ring-4 ring-primary/5' : 'scale-95 opacity-90 hover:opacity-100'}
                `}
              >
                <div className="relative aspect-[9/16] bg-black overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${testimonial.videoId}?rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=0&disablekb=1`}
                    title={`Depoimento de ${testimonial.name}`}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180%] h-[125%] object-cover pointer-events-auto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-white text-center border-t border-slate-50">
                  <p className="font-bold text-slate-900 text-base">{testimonial.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 
           Mobile Layout (Single Card with Arrows)
        */}
        <div className="md:hidden relative flex flex-col items-center justify-center">
           {/* Main Card Display */}
           <div className="relative w-full max-w-[280px] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
              <div className="relative aspect-[9/16] bg-black overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${TESTIMONIALS[mobileIndex].videoId}?rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=0&disablekb=1`}
                    title={`Depoimento de ${TESTIMONIALS[mobileIndex].name}`}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180%] h-[125%] object-cover pointer-events-auto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
              </div>
              <div className="p-6 bg-white text-center border-t border-slate-50">
                  <p className="font-bold text-slate-900 text-lg">{TESTIMONIALS[mobileIndex].name}</p>
              </div>
           </div>

           {/* Navigation Arrows */}
           <button 
             onClick={prevSlide}
             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg text-slate-700 hover:text-primary transition-colors z-30"
             aria-label="Anterior"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>

           <button 
             onClick={nextSlide}
             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg text-slate-700 hover:text-primary transition-colors z-30"
             aria-label="Próximo"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
