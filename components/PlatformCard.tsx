import React from 'react';
import { PlatformData } from '../types';
import { Instagram, Facebook, Youtube, Twitter, Video, Music2, ArrowRight } from 'lucide-react';
import { TikTokIcon } from './TikTokIcon';

interface PlatformCardProps {
  platform: PlatformData;
  onClick: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onClick }) => {
  const getIcon = (name: string) => {
    const className = "w-6 h-6 text-white";
    switch (name) {
      case 'Instagram': return <Instagram className={className} />;
      case 'Facebook': return <Facebook className={className} />;
      case 'Youtube': return <Youtube className={className} />;
      case 'Twitter': return <Twitter className={className} />;
      case 'TikTok': return <TikTokIcon className={className} />;
      case 'Music2': return <Music2 className={className} />;
      case 'Video': return <Video className={className} />;
      default: return <ArrowRight className={className} />;
    }
  };

  const hoverBorderColor = platform.id === 'instagram' ? 'hover:border-pink-500/50' :
    platform.id === 'facebook' ? 'hover:border-blue-600/50' :
      platform.id === 'youtube' ? 'hover:border-red-600/50' : 'hover:border-primary/50';

  const badgeColor = platform.id === 'instagram' ? 'bg-pink-100 text-pink-700' :
    platform.id === 'facebook' ? 'bg-blue-100 text-blue-700' :
      platform.id === 'youtube' ? 'bg-red-100 text-red-700' :
        platform.id === 'tiktok' ? 'bg-slate-100 text-slate-800' :
          platform.id === 'twitter' ? 'bg-sky-100 text-sky-700' :
            'bg-orange-100 text-orange-700';

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-slate-200 ${hoverBorderColor} rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full shadow-sm`}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${platform.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {getIcon(platform.iconName)}
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 group-hover:border-primary/30 transition-colors">
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{platform.name}</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium line-clamp-2">
          {platform.description}
        </p>

        {/* Pricing Offers */}
        <div className="mt-auto space-y-3">
          {platform.offers
            .filter(offer => offer.showOnHome !== false)
            .slice(0, 3)
            .map((offer) => {
              // Calculate original price based on discount
              const originalPrice = offer.priceStart / (1 - (offer.discount / 100));

              return (
                <div key={offer.id} className="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-700 text-xs font-bold uppercase tracking-wide">
                      {offer.type === 'followers' ? 'Seguidores' : offer.type === 'likes' ? 'Curtidas' : 'Visualizações'}
                    </span>
                    <span className={`${badgeColor} text-[10px] font-black px-2 py-0.5 rounded-md`}>
                      {offer.discount}% OFF
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-[11px] text-slate-400 font-medium line-through mb-0.5">
                      R$ {originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500">por</span>
                      <span className="text-base font-bold text-slate-900">
                        R$ {offer.priceStart.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;