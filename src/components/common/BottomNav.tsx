import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, Search, Clock, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setSelectedCategory,
    setSearchQuery,
    orders,
    setTrackingOrderId
  } = useStore();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-brand-border py-1.5 px-2 flex items-center justify-around shadow-lg">
      {/* Home */}
      <button
        onClick={() => {
          setActiveView('store');
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeView === 'store' ? 'text-brand-green font-bold' : 'text-brand-muted font-medium'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => {
          setActiveView('store');
          // Scroll to category strip
          const mobileEl = document.getElementById('mobile-category-scroll-section');
          const desktopEl = document.getElementById('category-scroll-section');
          if (mobileEl) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (desktopEl) {
            desktopEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-brand-muted hover:text-brand-green transition-colors"
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Categories</span>
      </button>

      {/* Search */}
      <button
        onClick={() => {
          setActiveView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const searchInput = document.querySelector('header input') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
        className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-brand-muted hover:text-brand-green transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Search</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => {
          if (orders.length > 0) {
            setTrackingOrderId(orders[0].id);
          } else {
            setActiveView('admin');
          }
        }}
        className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-brand-muted hover:text-brand-green relative transition-colors"
      >
        <div className="relative">
          <Clock className="w-5 h-5" />
          {orders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-green"></span>
          )}
        </div>
        <span className="text-[10px]">Orders</span>
      </button>

      {/* Admin */}
      <button
        onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
          activeView === 'admin' ? 'text-brand-green font-bold' : 'text-brand-muted font-medium'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px]">Admin</span>
      </button>
    </nav>
  );
};
