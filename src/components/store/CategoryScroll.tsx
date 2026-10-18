import React, { useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/mockData';
import { CategoryId } from '../../types';
import { AnimatedCategoryIcon } from './AnimatedCategoryIcons';
import { ArrowRight } from 'lucide-react';

/**
 * MobileCategoryScroll:
 * Sleek, ultra-compact, horizontally swipeable organic category navigation strip.
 * Designed to be embedded directly inside the sticky mobile header underneath the search bar.
 */
export const MobileCategoryScroll: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Smoothly center the active pill in horizontal slider when selectedCategory changes
  useEffect(() => {
    const activeBtn = document.getElementById(`mobile-cat-pill-${selectedCategory}`);
    if (activeBtn && scrollTrackRef.current) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  const handleCategorySelect = (catId: CategoryId | 'all', el?: HTMLElement) => {
    setSelectedCategory(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // If the user has scrolled down into products, smoothly scroll back to top of products grid
    const productsSection = document.getElementById('products-grid-section');
    if (productsSection) {
      const rect = productsSection.getBoundingClientRect();
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 180;
      if (rect.top < headerHeight) {
        const targetY = window.scrollY + rect.top - headerHeight + 6;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  };

  return (
    <div 
      id="mobile-category-scroll-section" 
      className="w-full bg-white select-none border-t border-brand-border/40 pt-1 pb-1.5 px-2"
    >
      {/* Compact category row header */}
      <div className="flex items-center justify-between px-1 mb-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shrink-0" />
          <span className="text-[11px] font-black text-brand-dark tracking-tight truncate">
            Explore Organic Categories
          </span>
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => handleCategorySelect('all')}
            className="text-[10px] font-bold text-brand-green hover:text-brand-greenDark flex items-center gap-0.5 shrink-0"
          >
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Horizontal swipeable track */}
      <div 
        ref={scrollTrackRef}
        className="w-full min-w-0 max-w-full flex flex-nowrap gap-2 overflow-x-auto no-scrollbar scroll-touch snap-x snap-mandatory px-0.5 pb-0.5 overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="tablist"
        aria-label="Organic grocery categories slider"
      >
        {/* All Staples Pill */}
        <button
          key="cat-all"
          id="mobile-cat-pill-all"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={(e) => handleCategorySelect('all', e.currentTarget)}
          className={`flex flex-col items-center justify-between py-1.5 px-1 rounded-xl border transition-all shrink-0 flex-none snap-start w-[68px] text-center group relative active:scale-95 ${
            selectedCategory === 'all'
              ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/80 to-white shadow-xs ring-1 ring-brand-green/30'
              : 'border-brand-border/80 bg-white hover:border-brand-green/40'
          }`}
        >
          <div className="relative mb-0.5 shrink-0">
            <AnimatedCategoryIcon categoryId="all" size={36} />
            {selectedCategory === 'all' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-green" />
            )}
          </div>
          <div className="w-full min-w-0">
            <span className={`text-[10px] font-extrabold leading-tight block truncate w-full ${
              selectedCategory === 'all' ? 'text-brand-green font-black' : 'text-brand-dark'
            }`}>
              All Items
            </span>
            <span className="text-[8.5px] font-semibold text-brand-muted block truncate w-full leading-none mt-0.5">
              सभी उत्पाद
            </span>
          </div>
        </button>

        {/* Category Pills */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`mobile-cat-pill-${cat.id}`}
              role="tab"
              aria-selected={isSelected}
              onClick={(e) => handleCategorySelect(cat.id as CategoryId, e.currentTarget)}
              className={`flex flex-col items-center justify-between py-1.5 px-1 rounded-xl border transition-all shrink-0 flex-none snap-start w-[68px] text-center group relative active:scale-95 ${
                isSelected
                  ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/80 to-white shadow-xs ring-1 ring-brand-green/30'
                  : 'border-brand-border/80 bg-white hover:border-brand-green/40'
              }`}
            >
              <div className="relative mb-0.5 shrink-0">
                <AnimatedCategoryIcon categoryId={cat.id as CategoryId} size={36} />
                {isSelected && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-green" />
                )}
              </div>
              <div className="w-full min-w-0">
                <span className={`text-[10px] font-extrabold leading-tight block truncate w-full ${
                  isSelected ? 'text-brand-green font-black' : 'text-brand-dark'
                }`}>
                  {cat.name}
                </span>
                <span className="text-[8.5px] font-semibold text-brand-muted block truncate w-full leading-none mt-0.5">
                  {cat.hindiName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * CategoryScroll:
 * Desktop & Tablet category section with large animated cards, headers, and full-width layout.
 */
export const CategoryScroll: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeBtn = document.getElementById(`desktop-cat-pill-${selectedCategory}`);
    if (activeBtn && scrollTrackRef.current) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  return (
    <section id="category-scroll-section" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 min-w-0">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 min-w-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping shrink-0" />
          <h2 className="text-sm sm:text-base font-black text-brand-dark tracking-tight flex items-center gap-1.5 min-w-0">
            <span className="truncate">Explore Organic Categories</span>
            <span className="hidden xs:inline-block text-[10px] font-black uppercase text-brand-green bg-brand-greenLight px-2 py-0.5 rounded-full border border-brand-green/30 shrink-0">
              Live Village Harvest
            </span>
          </h2>
        </div>
        
        <button 
          onClick={() => setSelectedCategory('all')}
          className="text-xs font-bold text-brand-green hover:text-brand-greenDark flex items-center gap-1 hover:underline shrink-0"
        >
          <span>All Items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scroll Track of Animated AI Category Badges */}
      <div 
        ref={scrollTrackRef}
        className="w-full min-w-0 max-w-full flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-touch snap-x snap-mandatory pb-3 pt-1 px-1 overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="region"
        aria-label="Organic grocery categories slider"
      >
        {/* 'All Staples' Pill */}
        <button
          id="desktop-cat-pill-all"
          onClick={() => setSelectedCategory('all')}
          className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 flex-none snap-start w-[88px] xs:w-24 sm:w-28 text-center select-none group relative ${
            selectedCategory === 'all'
              ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/80 to-white shadow-blinkit ring-1 ring-brand-green/30'
              : 'border-brand-border bg-white hover:border-brand-green/50 hover:shadow-soft'
          }`}
        >
          {/* Animated AI Icon Container */}
          <div className="relative mb-1.5 transition-transform duration-300 group-hover:scale-105 shrink-0">
            <AnimatedCategoryIcon categoryId="all" size={54} />
            {selectedCategory === 'all' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-green ring-2 ring-white" />
            )}
          </div>

          <div className="w-full min-w-0">
            <span className={`text-[11px] sm:text-xs font-extrabold leading-tight block truncate w-full ${
              selectedCategory === 'all' ? 'text-brand-green font-black' : 'text-brand-dark'
            }`}>
              All Staples
            </span>
            <span className="text-[10px] font-semibold text-brand-muted mt-0.5 block truncate w-full">
              सभी उत्पाद
            </span>
          </div>
        </button>

        {/* Individual Category Cards with Custom Animated AI Visuals */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`desktop-cat-pill-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id as CategoryId)}
              className={`flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 flex-none snap-start w-[88px] xs:w-24 sm:w-28 text-center select-none group relative ${
                isSelected
                  ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/80 to-white shadow-blinkit ring-1 ring-brand-green/30'
                  : 'border-brand-border bg-white hover:border-brand-green/50 hover:shadow-soft'
              }`}
            >
              {/* Animated AI Icon Container */}
              <div className="relative mb-1.5 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <AnimatedCategoryIcon categoryId={cat.id as CategoryId} size={54} />
                {isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-green ring-2 ring-white" />
                )}
              </div>

              <div className="w-full min-w-0">
                <span className={`text-[11px] sm:text-xs font-extrabold leading-tight block truncate w-full ${
                  isSelected ? 'text-brand-green font-black' : 'text-brand-dark'
                }`}>
                  {cat.name}
                </span>
                <span className="text-[10px] font-semibold text-brand-muted mt-0.5 block truncate w-full">
                  {cat.hindiName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
