import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  X,
  PackageCheck
} from 'lucide-react';
import { MobileCategoryScroll } from '../store/CategoryScroll';

export const Header: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery,
    deliveryLocation,
    setIsLocationModalOpen,
    activeView,
    setActiveView,
    orders,
    setTrackingOrderId
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border shadow-sm">
      {/* Top Banner ticker */}
      <div className="bg-brand-yellow px-3 sm:px-4 py-1 text-xs text-brand-dark font-medium flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 mx-auto min-w-0 truncate">
          <span className="inline-block px-1.5 py-0.2 bg-brand-green text-white text-[10px] font-bold rounded shrink-0">
            DEMO MODE
          </span>
          <span className="hidden sm:inline font-semibold shrink-0">Gaon Ki Sugandh:</span>
          <span className="truncate">{settings.tagline}</span>
          <span className="hidden md:inline text-brand-greenDark font-bold shrink-0">• Use code <span className="underline">{settings.promoBannerCode}</span> for ₹50 off!</span>
        </div>
        <button
          onClick={() => setActiveView(activeView === 'store' ? 'admin' : 'store')}
          className="text-[10px] sm:text-[11px] font-bold text-brand-greenDark hover:text-black flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-full border border-brand-green/30 transition-all shrink-0"
        >
          {activeView === 'store' ? '⚡ Open Admin Panel' : '🛒 View Storefront'}
        </button>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Logo */}
          <div 
            onClick={() => setActiveView('store')}
            className="cursor-pointer flex items-center gap-2 group select-none"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-brand-green flex items-center justify-center text-brand-yellow font-black shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-8-7z" fill="#086518" stroke="#F8CB46" strokeWidth="1.5"/>
                <path d="M12 8c-2 2-3 4-3 6a3 3 0 0 0 6 0c0-2-1-4-3-6z" fill="#F8CB46" stroke="#FFFFFF" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-brand-green leading-none">
                  Gaon Ki
                </span>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-brand-dark leading-none">
                  Sugandh
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-brand-muted hidden sm:block">
                शुद्धता हर घर तक • 100% Organic
              </p>
            </div>
          </div>

          {/* Delivery Location & Time Pill */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-brand-border cursor-pointer hover:opacity-85 transition-opacity"
            title="Click to change location or PIN code"
          >
            <div className="hidden xs:flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-green flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-brand-green animate-pulse" />
                  {settings.estimatedDeliveryTime}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-brand-dark max-w-[130px] sm:max-w-[200px] truncate">
                <MapPin className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                <span className="truncate">{deliveryLocation.address}</span>
                <ChevronDown className="w-3 h-3 text-brand-muted shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search "mustard oil", "sharbati atta", "ghee", "turmeric"...'
              className="w-full pl-10 pr-9 py-2.5 bg-brand-bg hover:bg-white focus:bg-white border border-transparent focus:border-brand-green rounded-xl text-sm font-medium text-brand-dark placeholder:text-brand-lightMuted outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Tracking Quick Action */}
          {orders.length > 0 && (
            <button
              onClick={() => {
                // open the most recent order tracking
                setTrackingOrderId(orders[0].id);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-brand-dark hover:text-brand-green hover:bg-brand-bg rounded-xl transition-all"
              title="Track recent orders"
            >
              <PackageCheck className="w-4 h-4 text-brand-green" />
              <span>Track Orders</span>
              <span className="w-4 h-4 rounded-full bg-brand-greenLight text-brand-green text-[10px] font-black flex items-center justify-center">
                {orders.length}
              </span>
            </button>
          )}

          {/* Blinkit Green Cart Button (Desktop) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl font-bold shadow-blinkit transition-all hover:scale-102 active:scale-98"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand-yellow text-brand-dark text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left leading-tight">
              {cartCount === 0 ? (
                <span className="text-sm">My Cart</span>
              ) : (
                <>
                  <span className="text-xs text-white/90 font-medium">{cartCount} items</span>
                  <span className="text-sm font-black text-brand-yellow">₹{cartTotal}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Row (Always visible beneath header on small screens) */}
      <div className="md:hidden px-3 pb-1.5 pt-0.5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search "mustard oil", "atta", "dal", "ghee"...'
            className="w-full pl-9 pr-8 py-2 bg-brand-bg focus:bg-white border border-brand-border focus:border-brand-green rounded-xl text-xs sm:text-sm font-medium text-brand-dark placeholder:text-brand-lightMuted outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sticky Category Navigation Strip (Sticky with Header on Mobile) */}
      {activeView === 'store' && (
        <div className="md:hidden">
          <MobileCategoryScroll />
        </div>
      )}
    </header>
  );
};
