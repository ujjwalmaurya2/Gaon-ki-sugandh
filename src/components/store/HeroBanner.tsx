import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Droplets, Heart } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { settings, setSelectedCategory, applyCoupon } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
      {/* Main Promo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Main Big Feature Banner */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-green to-brand-greenDark p-5 sm:p-7 text-white shadow-soft flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
          {/* Subtle background graphics */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full fill-current text-white">
              <path d="M45,-60C58,-52,68,-39,72,-25C76,-11,74,4,69,19C64,34,56,48,44,58C32,68,16,73,0,73C-16,73,-32,68,-45,58C-58,48,-68,34,-72,18C-76,2,-74,-15,-67,-30C-60,-45,-48,-57,-34,-64C-20,-71,-5,-73,9,-70C23,-67,32,-68,45,-60Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-yellow text-brand-dark text-[11px] font-black rounded-full uppercase tracking-wider mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.promoBannerDiscount}</span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight uppercase">
              {settings.promoBannerText}
            </h1>
            
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 font-medium line-clamp-2">
              {settings.promoBannerSubtext}
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory('oils');
                const el = document.getElementById('products-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Explore Cold-Pressed Oils</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => applyCoupon(settings.promoBannerCode)}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Coupon: <span className="text-brand-yellow font-black">{settings.promoBannerCode}</span>
            </button>
          </div>
        </div>

        {/* Side Mini Highlight Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-brand-yellow to-yellow-500 p-5 text-brand-dark shadow-soft flex flex-col justify-between min-h-[170px]">
          <div>
            <div className="inline-block px-2 py-0.5 bg-brand-green text-white text-[10px] font-black rounded-md uppercase tracking-wider mb-2">
              Vedic Bilona Ghee
            </div>
            <h3 className="text-base sm:text-lg font-black leading-tight text-brand-dark">
              A2 Gir Cow Desi Ghee
            </h3>
            <p className="text-xs text-brand-dark/80 mt-1 font-medium">
              Made from cultured curd in earthen pots. 100% Danedaar & Pure.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <span className="text-xs font-black text-brand-greenDark bg-white/80 px-2 py-1 rounded-md">
              From ₹790
            </span>
            <button
              onClick={() => {
                setSelectedCategory('dairy');
                const el = document.getElementById('products-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-brand-dark hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
            >
              Shop Ghee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
