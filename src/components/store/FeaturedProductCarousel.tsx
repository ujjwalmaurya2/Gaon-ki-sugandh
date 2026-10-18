import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface FeaturedConfig {
  productId: string;
  badge: string;
  badgeColor: string;
  benefit: string;
  secondaryOffer: string;
  gradientClass: string;
  accentBorder: string;
  taglineHindi?: string;
}

const FEATURED_ITEMS: FeaturedConfig[] = [
  {
    productId: 'gks-dairy-01',
    badge: 'BESTSELLER',
    badgeColor: 'bg-amber-600 text-white',
    benefit: 'Traditional Bilona Churned · Pure A2 Cow Ghee',
    secondaryOffer: '100% Danedaar & Golden Nectar',
    gradientClass: 'from-amber-100/90 via-amber-50/80 to-yellow-50/70',
    accentBorder: 'border-amber-300/80',
    taglineHindi: 'पारंपरिक बिलोना घी'
  },
  {
    productId: 'gks-oil-01',
    badge: 'WOOD PRESSED',
    badgeColor: 'bg-yellow-700 text-white',
    benefit: 'Kolhu Pressed under 40°C · High Natural Pungency',
    secondaryOffer: 'Rich in Omega-3 & Authentic Aroma',
    gradientClass: 'from-yellow-100/90 via-amber-50/80 to-orange-50/60',
    accentBorder: 'border-yellow-300/80',
    taglineHindi: 'कच्ची घानी सरसों'
  },
  {
    productId: 'gks-spice-01',
    badge: '7.5%+ CURCUMIN',
    badgeColor: 'bg-orange-600 text-white',
    benefit: 'Meghalaya Jaintia Hills · 3x Natural Curcumin',
    secondaryOffer: 'Immunity Booster · Lead-Free Pure Haldi',
    gradientClass: 'from-orange-100/80 via-amber-50/80 to-yellow-50/70',
    accentBorder: 'border-orange-300/80',
    taglineHindi: 'शुद्ध लाकाडोंग हल्दी'
  },
  {
    productId: 'gks-atta-01',
    badge: 'FARM FRESH',
    badgeColor: 'bg-emerald-700 text-white',
    benefit: 'Stone-Ground Sehore Wheat · Soft Rotis with Zero Maida',
    secondaryOffer: '100% Whole Grain · Natural Wheat Germ Intact',
    gradientClass: 'from-stone-100/90 via-emerald-50/60 to-amber-50/50',
    accentBorder: 'border-stone-300/80',
    taglineHindi: 'एमपी शरबती चक्की आटा'
  },
  {
    productId: 'gks-ess-02',
    badge: 'WILD HARVEST',
    badgeColor: 'bg-amber-700 text-white',
    benefit: 'Sundarbans Deep Forest · Unheated & Enzyme Rich',
    secondaryOffer: 'Raw Forest Nectar with Natural Pollen',
    gradientClass: 'from-amber-100/80 via-yellow-50/80 to-orange-50/60',
    accentBorder: 'border-amber-300/80',
    taglineHindi: 'कच्चा जंगली शहद'
  },
];

export const FeaturedProductCarousel: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    setSelectedProductForDetail 
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch & pointer gesture state refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Match actual available products from catalog
  const slides = FEATURED_ITEMS.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isAvailable) return null;
    const variant = product.variants[0];
    const discountPercent = variant && variant.mrp > variant.sellingPrice
      ? Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)
      : 0;

    return {
      config: item,
      product,
      variant,
      discountPercent,
    };
  }).filter((s): s is NonNullable<typeof s> => s !== null && !!s.variant);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay effect with pause and reduced motion support
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    // Respect user's motion preferences
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, goToNext]);

  // Page visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Pointer & Touch handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    touchEndX.current = clientX;
    touchEndY.current = clientY;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsPaused(true);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    touchEndX.current = clientX;
    touchEndY.current = clientY;
    if (touchStartX.current !== null && Math.abs(clientX - touchStartX.current) > 10) {
      hasDraggedRef.current = true;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      const deltaY = (touchStartY.current || 0) - (touchEndY.current || 0);

      // Require horizontal swipe threshold (35px) and dominant horizontal direction
      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;

    // Reset hasDragged flag after event queue clears
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);

    // Resume autoplay after 2s delay
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  if (totalSlides === 0) return null;

  return (
    <div 
      className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 w-full group relative select-none"
      aria-label="Featured Organic Products Carousel"
    >
      {/* Carousel Track Container */}
      <div 
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xs border border-brand-border/70 touch-pan-y cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (isDraggingRef.current) handlePointerUp();
          setIsPaused(false);
        }}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={(e) => {
          if (e.changedTouches && e.changedTouches[0]) {
            handlePointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }
          handlePointerUp();
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
      >
        {/* Slides Track */}
        <div 
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const { config, product, variant, discountPercent } = slide;
            const isOutOfStock = variant.stock <= 0;
            const cartItem = cart.find(
              (c) => c.productId === product.id && c.variantId === variant.id
            );
            const cartQty = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={config.productId}
                className="w-full shrink-0 min-w-full cursor-pointer relative"
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  setSelectedProductForDetail(product);
                }}
              >
                {/* Card Background Gradient */}
                <div 
                  className={`bg-gradient-to-r ${config.gradientClass} p-3.5 sm:p-5 min-h-[160px] sm:min-h-[185px] flex items-center justify-between gap-3 relative overflow-hidden`}
                >
                  {/* Subtle Background Pattern Graphic */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-brand-dark">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </div>

                  {/* Left Column: Information & Actions */}
                  <div className="flex-1 min-w-0 pr-1 sm:pr-4 z-10 flex flex-col justify-between self-stretch">
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${config.badgeColor} shadow-2xs`}>
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{config.badge}</span>
                        </span>
                        {config.taglineHindi && (
                          <span className="text-[10px] font-bold text-brand-dark/75 bg-white/75 px-1.5 py-0.5 rounded border border-black/5">
                            {config.taglineHindi}
                          </span>
                        )}
                        <span className="hidden xs:inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-dark/80 bg-white/80 px-1.5 py-0.5 rounded border border-black/5">
                          ⭐ {product.rating}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 className="text-sm sm:text-lg font-black text-brand-dark tracking-tight leading-snug line-clamp-1 sm:line-clamp-2 mt-1 sm:mt-1.5">
                        {product.name}
                      </h3>

                      {/* Supporting Benefit Text */}
                      <p className="text-[11px] sm:text-xs text-brand-muted font-medium line-clamp-1 mt-0.5">
                        {config.benefit}
                      </p>
                    </div>

                    {/* Price, Discount & CTA Row */}
                    <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2 flex-wrap">
                      {/* Price Block */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-xl font-black text-brand-greenDark">
                          ₹{variant.sellingPrice}
                        </span>
                        {variant.mrp > variant.sellingPrice && (
                          <span className="text-xs text-brand-muted line-through">
                            ₹{variant.mrp}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] font-extrabold text-brand-green bg-brand-greenLight px-1.5 py-0.5 rounded border border-brand-green/20">
                            {discountPercent}% OFF
                          </span>
                        )}
                        <span className="text-[10px] text-brand-muted font-semibold hidden sm:inline">
                          ({variant.name})
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Primary CTA: Shop Now */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductForDetail(product);
                          }}
                          className="px-3 sm:px-3.5 py-1.5 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                          title={`View details for ${product.name}`}
                        >
                          <span>Shop Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Add / Cart Control */}
                        {isOutOfStock ? (
                          <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-xl">
                            Sold Out
                          </span>
                        ) : cartQty === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, variant.id, 1);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-brand-green border border-brand-green/40 text-xs font-black rounded-xl shadow-2xs flex items-center gap-1 active:scale-95 transition-all"
                            title={`Add ${product.name} to cart`}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>ADD</span>
                          </button>
                        ) : (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center bg-brand-green text-white rounded-xl shadow-xs px-1.5 py-0.5 gap-1.5"
                          >
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, variant.id, cartQty - 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                            <span className="text-xs font-black min-w-[12px] text-center">
                              {cartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(product.id, variant.id, cartQty + 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: High Quality Product Visual */}
                  <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 flex items-center justify-center p-1 relative shrink-0">
                    {/* Soft Radial Glow */}
                    <div className="absolute inset-2 bg-white/70 rounded-full blur-md pointer-events-none" />
                    
                    {/* Product Packshot */}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-105"
                      loading={idx === 0 ? "eager" : "lazy"}
                      width={160}
                      height={160}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Prev / Next Navigation Arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
            setIsPaused(true);
            goToPrev();
            resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2500);
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-md border border-brand-border/60 hover:bg-white text-brand-dark hidden md:flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
            setIsPaused(true);
            goToNext();
            resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2500);
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-md border border-brand-border/60 hover:bg-white text-brand-dark hidden md:flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Pagination Indicators (Bottom Center) */}
        <div 
          className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/10 backdrop-blur-xs px-2 py-1 rounded-full pointer-events-auto"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                setIsPaused(true);
                setCurrentIndex(idx);
                resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2500);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-5 sm:w-6 h-1.5 bg-brand-green shadow-xs'
                  : 'w-1.5 h-1.5 bg-black/30 hover:bg-black/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
