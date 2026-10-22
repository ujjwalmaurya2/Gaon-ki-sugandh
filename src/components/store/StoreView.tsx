import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { CategoryScroll } from './CategoryScroll';
import { FeaturedProductCarousel } from './FeaturedProductCarousel';
import { StoreOffersSection } from './StoreOffersSection';
import { ProductCard } from './ProductCard';
import { TrustSection } from './TrustSection';
import { Footer } from './Footer';
import { AnimatedCategoryIcon } from './AnimatedCategoryIcons';
import { CATEGORIES } from '../../data/mockData';
import { 
  ArrowUpDown, 
  Search, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    offers,
    activeOfferFilter,
    setActiveOfferFilter
  } = useStore();

  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Active Offer Details
  const activeOffer = useMemo(() => {
    return offers.find((o) => o.id === activeOfferFilter) || null;
  }, [offers, activeOfferFilter]);

  // Active Category details
  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find((c) => c.id === selectedCategory) || null;
  }, [selectedCategory]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Available flag
      if (!prod.isAvailable) return false;

      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Active Offer filter
      if (activeOffer) {
        if (
          activeOffer.applicableCategories &&
          activeOffer.applicableCategories.length > 0 &&
          !activeOffer.applicableCategories.includes('all' as any)
        ) {
          if (!activeOffer.applicableCategories.includes(prod.category)) return false;
        }
      }

      // In-stock filter
      if (inStockOnly) {
        const hasStock = prod.variants.some((v) => v.stock > 0);
        if (!hasStock) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesHindi = prod.hindiName.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        const matchesOrigin = prod.origin.toLowerCase().includes(q);
        const matchesTags = prod.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesHindi && !matchesCategory && !matchesOrigin && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const aPrice = a.variants[0]?.sellingPrice || 0;
      const bPrice = b.variants[0]?.sellingPrice || 0;

      if (sortBy === 'price-asc') return aPrice - bPrice;
      if (sortBy === 'price-desc') return bPrice - aPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.ratingCount - a.ratingCount; // popularity
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy, activeOffer]);

  // Best Sellers collection
  const bestSellers = useMemo(() => {
    return products.filter((p) => p.isFeatured && p.isAvailable).slice(0, 6);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full min-w-0">
      {/* 1. Blinkit Green & Yellow Hero Banner */}
      <HeroBanner />

      {/* 2. Horizontal Category Strip with Animated AI Graphics (Desktop & Tablet) */}
      <div className="hidden md:block">
        <CategoryScroll />
      </div>

      {/* Featured Products Auto-Rotating Carousel (Normal Document Flow) */}
      {!searchQuery && selectedCategory === 'all' && (
        <FeaturedProductCarousel />
      )}

      {/* Bumper Offers & Farm Deals Section */}
      {!searchQuery && (
        <StoreOffersSection />
      )}

      {/* Active Offer Spotlight Banner (when filtered by an offer) */}
      {activeOffer && !searchQuery && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-1 pb-3 w-full">
          <div
            className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${
              activeOffer.bannerGradient || 'from-emerald-700 via-emerald-600 to-green-700'
            } text-white shadow-md flex items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0">
                🎁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-yellow text-brand-dark shadow-xs">
                    {activeOffer.badgeText}
                  </span>
                  <span className="text-xs font-black text-white/95">
                    {activeOffer.offerType === 'percent'
                      ? `${activeOffer.discountValue}% OFF`
                      : activeOffer.offerType === 'flat'
                      ? `FLAT ₹${activeOffer.discountValue} OFF`
                      : `${activeOffer.discountValue}% SAVINGS`}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black mt-0.5 tracking-tight">
                  {activeOffer.title}
                </h3>
                <p className="text-xs text-white/90 line-clamp-1 max-w-xl font-medium">
                  {activeOffer.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveOfferFilter(null)}
              className="px-3.5 py-1.5 bg-white text-brand-dark hover:bg-yellow-50 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>View All Products</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Dedicated Active Category Spotlight Banner (when filtered) */}
      {activeCategoryInfo && !searchQuery && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-1 pb-3 w-full">
          <div className="bg-gradient-to-r from-emerald-50 via-brand-yellowPale to-emerald-50 p-4 sm:p-5 rounded-3xl border border-brand-green/30 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-1 bg-white rounded-2xl shadow-sm border border-brand-green/20">
                <AnimatedCategoryIcon categoryId={activeCategoryInfo.id} size={64} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-xl font-black text-brand-dark">
                    {activeCategoryInfo.name}
                  </h3>
                  <span className="text-xs font-bold text-brand-green bg-brand-greenLight px-2 py-0.5 rounded-full border border-brand-green/20">
                    {activeCategoryInfo.hindiName}
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-1 max-w-xl font-medium hidden sm:block">
                  {activeCategoryInfo.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:text-brand-dark shrink-0 flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>View All Categories</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Products Section Header & Controls */}
      <div id="products-grid-section" className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
          <div>
            <h2 className="text-base sm:text-xl font-black text-brand-dark tracking-tight flex items-center gap-2">
              <span>
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : activeOffer
                  ? `Bumper Deal: ${activeOffer.title}`
                  : selectedCategory === 'all' 
                  ? 'Everyday Organic Essentials' 
                  : `${activeCategoryInfo?.name || selectedCategory.toUpperCase()} Selection`}
              </span>
              <span className="text-xs font-bold text-brand-muted bg-brand-bg px-2 py-0.5 rounded-full border border-brand-border">
                {filteredProducts.length} items
              </span>
            </h2>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-brand-green font-bold hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>Clear search filter</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* In-Stock Toggle */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark cursor-pointer select-none hover:border-brand-green">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-brand-green w-3.5 h-3.5 rounded"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark outline-none focus:border-brand-green cursor-pointer pr-7 appearance-none"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-brand-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Products Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 w-full flex-1">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-brand-border p-6 max-w-md mx-auto my-6 shadow-xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-yellowPale flex items-center justify-center text-brand-dark">
              <Search className="w-8 h-8 text-brand-muted" />
            </div>
            <h3 className="text-base font-bold text-brand-dark">No organic products found</h3>
            <p className="text-xs text-brand-muted">
              We couldn't find any products matching your current filters. Try searching for "mustard oil", "atta", or "dal".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-greenDark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 6. Best Sellers Carousel / Grid (when browsing all) */}
      {selectedCategory === 'all' && !searchQuery && bestSellers.length > 0 && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 w-full border-t border-brand-border/60">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-green bg-brand-greenLight px-2 py-0.5 rounded">
                ⭐ Most Loved
              </span>
              <h3 className="text-base sm:text-lg font-black text-brand-dark mt-0.5">
                Top Rated Village Staples
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 7. Brand Trust & Authenticity Section */}
      <TrustSection />

      {/* 8. Comprehensive Footer */}
      <Footer />
    </div>
  );
};
