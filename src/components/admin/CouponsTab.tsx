import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Tag, Plus, Check, X, Trash2, Sparkles } from 'lucide-react';

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive, showToast } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 399,
    description: '',
    isActive: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      showToast('Coupon code is required', 'warning');
      return;
    }
    addCoupon({
      ...newCoupon,
      code: newCoupon.code.trim().toUpperCase(),
      description: newCoupon.description || `${newCoupon.discountType === 'flat' ? `Flat ₹${newCoupon.discountValue}` : `${newCoupon.discountValue}%`} OFF on orders above ₹${newCoupon.minOrderValue}`,
    });
    setIsAdding(false);
    setNewCoupon({
      code: '',
      discountType: 'flat',
      discountValue: 50,
      minOrderValue: 399,
      description: '',
      isActive: true,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Promotional Coupons & Offers
          </h2>
          <p className="text-xs text-brand-muted">
            Configure discount codes for storefront customers ({coupons.length} coupons configured).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {coupons.map((c) => (
          <div 
            key={c.code}
            className={`p-4 rounded-2xl border transition-all ${
              c.isActive
                ? 'bg-white border-brand-green/40 shadow-xs'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-black text-brand-green bg-brand-greenLight px-2.5 py-1 rounded-lg border border-brand-green/30">
                {c.code}
              </span>
              <button
                onClick={() => toggleCouponActive(c.code)}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                  c.isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-gray-200 text-gray-600 border-gray-300'
                }`}
              >
                {c.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <p className="text-xs font-bold text-brand-dark mt-2">{c.description}</p>

            <div className="mt-3 pt-3 border-t border-brand-border/60 text-[11px] text-brand-muted flex justify-between">
              <span>Min Order: <strong>₹{c.minOrderValue}</strong></span>
              <span>
                Discount: <strong>{c.discountType === 'flat' ? `₹${c.discountValue}` : `${c.discountValue}%`}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-brand-border">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-brand-dark">Create New Coupon Code</h3>
              <button onClick={() => setIsAdding(false)} className="text-brand-muted hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE15"
                  className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold uppercase outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold outline-none"
                  >
                    <option value="flat">Flat ₹</option>
                    <option value="percentage">Percentage %</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Value</label>
                  <input
                    type="number"
                    min={1}
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Minimum Cart Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Description</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. ₹50 off on pure organic staples"
                  className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 border border-brand-border rounded-xl text-brand-muted hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
