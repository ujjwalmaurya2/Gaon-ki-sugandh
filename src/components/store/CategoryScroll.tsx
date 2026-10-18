import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/mockData';
import { CategoryId } from '../../types';
import { AnimatedCategoryIcon } from './AnimatedCategoryIcons';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CategoryScroll: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div id="category-scroll-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
          <h2 className="text-sm sm:text-base font-black text-brand-dark tracking-tight flex items-center gap-1.5">
            <span>Explore Organic Categories</span>
            <span className="text-[10px] font-black uppercase text-brand-green bg-brand-greenLight px-2 py-0.5 rounded-full border border-brand-green/30">
              Live Village Harvest
            </span>
          </h2>
        </div>
        
        <button 
          onClick={() => setSelectedCategory('all')}
          className="text-xs font-bold text-brand-green hover:text-brand-greenDark flex items-center gap-1 hover:underline"
        >
          <span>All Items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scroll Track of Animated AI Category Badges */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        {/* 'All Staples' Pill */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex flex-col items-center p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 w-24 sm:w-28 text-center select-none group relative ${
            selectedCategory === 'all'
              ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/70 to-white shadow-blinkit scale-105'
              : 'border-brand-border bg-white hover:border-brand-green/50 hover:shadow-soft hover:scale-102'
          }`}
        >
          {/* Animated AI Icon Container */}
          <div className="relative mb-2 transition-transform duration-300 group-hover:scale-110">
            <AnimatedCategoryIcon categoryId="all" size={60} />
            {selectedCategory === 'all' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-green ring-2 ring-white" />
            )}
          </div>

          <span className={`text-xs font-extrabold leading-tight truncate w-full ${
            selectedCategory === 'all' ? 'text-brand-green font-black' : 'text-brand-dark'
          }`}>
            All Staples
          </span>
          <span className="text-[10px] font-semibold text-brand-muted mt-0.5 truncate w-full">
            सभी उत्पाद
          </span>
        </button>

        {/* Individual Category Cards with Custom Animated AI Visuals */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryId)}
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-2xl border transition-all shrink-0 w-24 sm:w-28 text-center select-none group relative ${
                isSelected
                  ? 'border-brand-green bg-gradient-to-b from-brand-greenLight/70 to-white shadow-blinkit scale-105'
                  : 'border-brand-border bg-white hover:border-brand-green/50 hover:shadow-soft hover:scale-102'
              }`}
            >
              {/* Animated AI Icon Container */}
              <div className="relative mb-2 transition-transform duration-300 group-hover:scale-110">
                <AnimatedCategoryIcon categoryId={cat.id as CategoryId} size={60} />
                {isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-green ring-2 ring-white" />
                )}
              </div>

              <span className={`text-xs font-extrabold leading-tight truncate w-full ${
                isSelected ? 'text-brand-green font-black' : 'text-brand-dark'
              }`}>
                {cat.name}
              </span>
              <span className="text-[10px] font-semibold text-brand-muted mt-0.5 truncate w-full">
                {cat.hindiName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
