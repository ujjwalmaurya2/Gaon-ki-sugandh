import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Star, 
  Sparkles,
  ShoppingBag,
  Award
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    cart, 
    addToCart, 
    updateCartQuantity,
    settings 
  } = useStore();

  const product = selectedProductForDetail;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants[0]?.id || ''
  );

  if (!product) return null;

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const cartItem = cart.find(
    (c) => c.productId === product.id && c.variantId === currentVariant.id
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  const discountPercent = currentVariant.mrp > currentVariant.sellingPrice
    ? Math.round(((currentVariant.mrp - currentVariant.sellingPrice) / currentVariant.mrp) * 100)
    : 0;

  const isOutOfStock = currentVariant.stock <= 0;

  return (
    <div 
      onClick={() => setSelectedProductForDetail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-brand-border my-auto"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-green bg-brand-greenLight px-2 py-0.5 rounded">
              {product.category.toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-brand-muted hidden sm:inline">
              Origin: {product.origin}
            </span>
          </div>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Image & Badges */}
          <div>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-brand-border p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {discountPercent > 0 && (
                <div className="absolute top-2 left-2 bg-brand-yellow text-brand-dark text-xs font-black px-2 py-1 rounded-md shadow-xs">
                  {discountPercent}% OFF
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-extrabold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-brand-green" />
                <span>Delivery in {settings.estimatedDeliveryTime}</span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="mt-4 p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1.5 text-xs text-brand-muted">
              <div className="flex items-center gap-2 text-brand-dark font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>100% Farm Origin Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Directly packed from source farms in {product.origin}. Unrefined, no preservatives or industrial solvents.
              </p>
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-amber-500 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-brand-dark">{product.rating}</span>
                </div>
                <span className="text-xs text-brand-muted font-medium">
                  ({product.ratingCount} verified reviews)
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-brand-dark leading-snug">
                {product.name}
              </h2>
              <p className="text-xs font-semibold text-brand-green mt-0.5">
                {product.hindiName}
              </p>

              <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                {product.longDescription || product.description}
              </p>

              {/* Pack Size Variants */}
              <div className="mt-4">
                <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === currentVariant.id;
                    const isOut = variant.stock <= 0;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={isOut}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          isSelected
                            ? 'border-brand-green bg-brand-greenLight text-brand-green font-black shadow-xs'
                            : isOut
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                            : 'border-brand-border hover:border-brand-green/40 text-brand-dark'
                        }`}
                      >
                        <div className="font-extrabold">{variant.name}</div>
                        <div className="text-[11px]">₹{variant.sellingPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extra Details */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-brand-bg p-3 rounded-xl border border-brand-border">
                <div>
                  <span className="text-brand-muted block font-medium">Shelf Life:</span>
                  <span className="font-bold text-brand-dark">{product.shelfLife || '12 Months'}</span>
                </div>
                <div>
                  <span className="text-brand-muted block font-medium">Stock Status:</span>
                  <span className={`font-bold ${currentVariant.stock <= 5 ? 'text-red-600' : 'text-brand-green'}`}>
                    {currentVariant.stock > 0 ? `${currentVariant.stock} units available` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Price & Add Action */}
            <div className="pt-3 border-t border-brand-border flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-muted block">Selling Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-brand-dark">₹{currentVariant.sellingPrice}</span>
                  {currentVariant.mrp > currentVariant.sellingPrice && (
                    <span className="text-xs line-through text-brand-lightMuted">₹{currentVariant.mrp}</span>
                  )}
                </div>
              </div>

              {/* Add / Qty Controller */}
              {isOutOfStock ? (
                <button 
                  disabled
                  className="px-5 py-3 bg-gray-200 text-gray-500 rounded-xl text-xs font-bold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : cartQty > 0 ? (
                <div className="flex items-center bg-brand-green text-white rounded-xl overflow-hidden shadow-blinkit">
                  <button
                    onClick={() => updateCartQuantity(product.id, currentVariant.id, cartQty - 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-greenDark active:scale-95 transition-all"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-brand-yellow">
                    {cartQty}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(product.id, currentVariant.id, cartQty + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-greenDark active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, currentVariant.id, 1)}
                  className="px-6 py-3 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs sm:text-sm font-black shadow-blinkit transition-all flex items-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
