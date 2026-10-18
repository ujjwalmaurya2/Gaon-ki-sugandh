import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartTotal, 
    cartMrpTotal, 
    cartSavings, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    settings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  // Free delivery calculations
  const remainingForFree = Math.max(0, settings.freeDeliveryThreshold - cartTotal);
  const freeProgress = Math.min(100, Math.round((cartTotal / settings.freeDeliveryThreshold) * 100));

  // Delivery fee
  const deliveryFee = cartTotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const handlingFee = settings.handlingFee;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.discountValue;
    } else {
      const perc = (cartTotal * appliedCoupon.discountValue) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(perc, appliedCoupon.maxDiscount) : perc;
    }
  }

  const finalPayable = Math.max(0, cartTotal + deliveryFee + handlingFee - couponDiscount);
  const totalSavingsWithCoupon = cartSavings + couponDiscount + (cartTotal >= settings.freeDeliveryThreshold ? settings.deliveryFee : 0);

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (cartTotal < settings.minimumOrderValue) {
      setCouponError(`Minimum order value is ₹${settings.minimumOrderValue}`);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-greenLight flex items-center justify-center text-brand-green">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-brand-dark">My Cart</h2>
                <p className="text-xs text-brand-muted">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your basket</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-brand-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-brand-greenLight flex items-center justify-center text-brand-green">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">Your cart is empty</h3>
                  <p className="text-xs text-brand-muted mt-1 max-w-xs mx-auto">
                    Explore freshly wood-pressed oils, stone-milled flours, and organic essentials from our farms.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Meter */}
                <div className="p-3 bg-brand-yellowPale rounded-xl border border-brand-yellow/50">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-dark mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-green" />
                      {remainingForFree > 0 ? (
                        <>Add <span className="text-brand-greenDark font-black">₹{remainingForFree}</span> more for <strong>FREE Delivery</strong></>
                      ) : (
                        <span className="text-brand-green font-black flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-brand-green" />
                          Yay! FREE Delivery unlocked
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-brand-muted">{freeProgress}%</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-brand-yellow">
                    <div 
                      className="bg-brand-green h-full transition-all duration-300 rounded-full" 
                      style={{ width: `${freeProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-muted">
                    <span>ITEMS ({cart.length})</span>
                    <button 
                      onClick={clearCart}
                      className="text-red-600 hover:underline text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div 
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center gap-3 p-2.5 bg-brand-bg rounded-xl border border-brand-border"
                    >
                      <img 
                        src={item.image} 
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-brand-border shrink-0 shadow-2xs" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-brand-dark truncate">{item.productName}</h4>
                        <span className="inline-block text-[10px] font-semibold text-brand-muted bg-white px-1.5 py-0.5 rounded border border-brand-border mt-0.5">
                          {item.variantName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-black text-brand-dark">₹{item.sellingPrice}</span>
                          {item.mrp > item.sellingPrice && (
                            <span className="text-[10px] line-through text-brand-lightMuted">₹{item.mrp}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center bg-white rounded-lg border border-brand-green overflow-hidden shadow-xs shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-green hover:bg-brand-greenLight transition-colors"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-6 text-center text-xs font-black text-brand-green">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-green hover:bg-brand-greenLight transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupons Section */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-brand-dark block mb-2">Offers & Coupons</span>
                  
                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-brand-green rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-brand-green shrink-0" />
                        <div>
                          <p className="text-xs font-black text-brand-green">Code: {appliedCoupon.code}</p>
                          <p className="text-[11px] text-emerald-800">
                            {appliedCoupon.description} (Saved ₹{couponDiscount})
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          placeholder="Enter Promo Code"
                          className="flex-1 px-3 py-2 border border-brand-border rounded-xl text-xs font-bold uppercase outline-none focus:border-brand-green"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-xl hover:bg-brand-greenDark transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>
                      )}

                      {/* Quick Coupon Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {coupons.filter(c => c.isActive).map(c => (
                          <button
                            key={c.code}
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-[10px] font-bold text-brand-green bg-brand-greenLight hover:bg-emerald-100 border border-brand-green/30 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {c.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-brand-bg p-3.5 rounded-xl border border-brand-border space-y-2 text-xs">
                  <h4 className="font-bold text-brand-dark uppercase tracking-wider text-[11px]">Bill Details</h4>
                  
                  <div className="flex justify-between text-brand-muted">
                    <span>Item Total</span>
                    <span className="font-bold text-brand-dark">₹{cartTotal}</span>
                  </div>

                  <div className="flex justify-between text-brand-muted">
                    <span className="flex items-center gap-1">
                      Delivery Charge
                      {deliveryFee === 0 && <span className="text-[10px] text-brand-green font-bold">(FREE)</span>}
                    </span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-brand-green font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-brand-muted">
                    <span>Packaging & Handling</span>
                    <span className="font-bold text-brand-dark">₹{handlingFee}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-brand-green font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="border-t border-brand-border pt-2 flex justify-between text-sm font-black text-brand-dark">
                    <span>To Pay</span>
                    <span className="text-base text-brand-green font-black">₹{finalPayable}</span>
                  </div>

                  {totalSavingsWithCoupon > 0 && (
                    <div className="p-2 bg-brand-yellowPale rounded-lg border border-brand-yellow/40 text-center text-xs font-bold text-brand-greenDark">
                      🎉 Total Savings on this order: ₹{totalSavingsWithCoupon}
                    </div>
                  )}
                </div>

                {/* Trust Guarantee Note */}
                <div className="p-3 bg-white rounded-xl border border-brand-border flex items-start gap-2.5 text-brand-muted text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-dark">Gaon Ki Sugandh Freshness Promise:</span>
                    <p className="mt-0.5">100% natural cold extraction. If any seal is broken or compromised, instant doorstep replacement provided.</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Fixed Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-brand-border bg-white sticky bottom-0">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl font-black text-sm flex items-center justify-between shadow-blinkit transition-all active:scale-98"
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs text-brand-yellow font-bold uppercase tracking-wider">
                    {cart.length} {cart.length === 1 ? 'Item' : 'Items'} • ₹{finalPayable}
                  </span>
                  <span className="text-sm font-extrabold text-white">Proceed to Pay</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
