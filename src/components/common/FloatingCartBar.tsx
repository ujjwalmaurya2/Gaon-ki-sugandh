import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartTotal, cartSavings, setIsCartOpen, activeView } = useStore();

  if (cartCount === 0 || activeView === 'admin') return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-30 px-3 max-w-lg mx-auto sm:hidden animate-slide-up">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="bg-brand-green text-white p-3 rounded-2xl shadow-float flex items-center justify-between cursor-pointer border border-brand-greenDark active:scale-98 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-brand-yellow">₹{cartTotal}</span>
              <span className="text-xs text-white/80 font-medium">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </div>
            {cartSavings > 0 && (
              <span className="text-[10px] text-brand-yellowLight font-bold">
                🎉 Saved ₹{cartSavings}
              </span>
            )}
          </div>
        </div>

        <button 
          className="flex items-center gap-1.5 bg-white text-brand-green px-3.5 py-2 rounded-xl text-xs font-black shadow-sm"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
