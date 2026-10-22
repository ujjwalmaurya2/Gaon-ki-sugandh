import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BumperOffer } from '../../types';
import { Sparkles, ArrowRight, Tag, Percent, Clock, ChevronRight } from 'lucide-react';

export const StoreOffersSection: React.FC = () => {
  const { offers, activeOfferFilter, setActiveOfferFilter, setSelectedCategory, showToast } = useStore();

  // Active & valid offers
  const activeOffers = useMemo(() => {
    return offers.filter((o) => {
      if (o.status !== 'active') return false;
      // Active in demo
      return true;
    });
  }, [offers]);

  if (activeOffers.length === 0) return null;

  const handleSelectOffer = (offer: BumperOffer) => {
    setActiveOfferFilter(offer.id);

    // If offer targets a specific single category, select it for convenience
    if (
      offer.applicableCategories &&
      offer.applicableCategories.length === 1 &&
      offer.applicableCategories[0] !== ('all' as any)
    ) {
      setSelectedCategory(offer.applicableCategories[0]);
    }

    // Smooth scroll to products section
    const target = document.getElementById('products-grid-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showToast(`🏷️ Applied offer "${offer.title}"! Showing eligible items.`, 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-brand-yellowPale text-brand-dark flex items-center justify-center font-black text-sm">
            🎁
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-dark tracking-tight flex items-center gap-1.5">
              <span>Bumper Deals & Farm Offers</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-brand-yellow text-brand-dark rounded-full">
                Limited Time
              </span>
            </h3>
            <p className="text-[11px] text-brand-muted font-medium hidden sm:block">
              Exclusive discounts on authentic village harvest, wood-pressed oils & Vedic essentials.
            </p>
          </div>
        </div>

        {activeOfferFilter && (
          <button
            onClick={() => {
              setActiveOfferFilter(null);
              showToast('Cleared offer filter. Showing all products.', 'info');
            }}
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
          >
            <span>Reset Offer Filter</span>
          </button>
        )}
      </div>

      {/* Banners Grid / Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activeOffers.map((offer) => {
          const isCurrentActive = activeOfferFilter === offer.id;

          return (
            <div
              key={offer.id}
              className={`rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br ${
                offer.bannerGradient || 'from-emerald-700 via-emerald-600 to-green-700'
              } shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                isCurrentActive ? 'ring-3 ring-brand-yellow scale-[1.01]' : ''
              }`}
            >
              {/* Top Row: Badge & Discount Pill */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow text-brand-dark shadow-xs">
                  {offer.badgeText}
                </span>

                <div className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-black flex items-center gap-1 border border-white/20">
                  <Percent className="w-3 h-3 text-brand-yellow" />
                  <span>
                    {offer.offerType === 'percent'
                      ? `${offer.discountValue}% OFF`
                      : offer.offerType === 'flat'
                      ? `₹${offer.discountValue} OFF`
                      : `${offer.discountValue}% SAVINGS`}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="my-1.5 space-y-1">
                <h4 className="text-base sm:text-lg font-black leading-snug drop-shadow-sm">
                  {offer.title}
                </h4>
                <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed">
                  {offer.subtitle}
                </p>
              </div>

              {/* Bottom CTA Row */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/80 font-medium">
                  {offer.minOrderValue
                    ? `Min cart ₹${offer.minOrderValue}`
                    : 'Valid on selected packs'}
                </span>

                <button
                  onClick={() => handleSelectOffer(offer)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isCurrentActive
                      ? 'bg-brand-yellow text-brand-dark hover:bg-yellow-400 font-black'
                      : 'bg-white hover:bg-emerald-50 text-brand-dark'
                  }`}
                >
                  <span>{isCurrentActive ? 'Applied ✓' : offer.ctaLabel || 'Shop Offer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtle background ambient graphic */}
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none blur-sm" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
