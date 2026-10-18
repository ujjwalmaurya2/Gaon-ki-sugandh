import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus, Minus, Clock, Sparkles, ChevronDown, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    setSelectedProductForDetail,
    settings 
  } = useStore();

  // Selected variant on this card (defaults to first variant)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );

  const currentVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Check if in cart
  const cartItem = cart.find(
    (c) => c.productId === product.id && c.variantId === currentVariant.id
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Calculate discount percentage
  const discountPercent = currentVariant.mrp > currentVariant.sellingPrice
    ? Math.round(((currentVariant.mrp - currentVariant.sellingPrice) / currentVariant.mrp) * 100)
    : 0;

  const isOutOfStock = currentVariant.stock <= 0;
  const isLowStock = currentVariant.stock > 0 && currentVariant.stock <= product.lowStockThreshold;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, currentVariant.id, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, currentVariant.id, cartQty + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, currentVariant.id, cartQty - 1);
  };

  return (
    <div 
      onClick={() => setSelectedProductForDetail(product)}
      className="bg-white rounded-2xl border border-brand-border p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-soft transition-all cursor-pointer relative group"
    >
      {/* Top Media Section */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-brand-border/60 p-2 sm:p-2.5 mb-2 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 bg-brand-yellow text-brand-dark text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
            {discountPercent}% OFF
          </div>
        )}

        {/* Delivery Time Badge */}
        <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-xs text-brand-dark text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
          <Clock className="w-2.5 h-2.5 text-brand-green" />
          <span>{settings.estimatedDeliveryTime}</span>
        </div>

        {/* Low Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs animate-pulse">
            Only {currentVariant.stock} left!
          </div>
        )}
      </div>

      {/* Middle Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-brand-dark leading-tight line-clamp-2 min-h-[32px] sm:min-h-[36px]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between text-[10px] mt-0.5">
            {product.hindiName && (
              <span className="text-brand-green font-semibold truncate">
                {product.hindiName}
              </span>
            )}
            <span className="text-brand-muted font-medium truncate ml-auto">
              {product.origin}
            </span>
          </div>

          {/* Variant Selector */}
          <div className="mt-1.5">
            {product.variants.length > 1 ? (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative"
              >
                <select
                  value={currentVariant.id}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg text-[11px] font-semibold text-brand-dark py-1 px-2 appearance-none outline-none focus:border-brand-green cursor-pointer pr-6"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — ₹{v.sellingPrice}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-brand-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <span className="inline-block text-[11px] font-semibold text-brand-muted bg-brand-bg px-2 py-0.5 rounded border border-brand-border">
                {currentVariant.name}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price and Add Button */}
        <div className="mt-3 flex items-center justify-between pt-1 border-t border-brand-border/60">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-black text-brand-dark">
                ₹{currentVariant.sellingPrice}
              </span>
              {currentVariant.mrp > currentVariant.sellingPrice && (
                <span className="text-[10px] line-through text-brand-lightMuted">
                  ₹{currentVariant.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Blinkit Style ADD Button / Counter */}
          <div>
            {isOutOfStock ? (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-lg border border-gray-200">
                OUT
              </span>
            ) : cartQty > 0 ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-brand-green text-white rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-6 sm:w-7 h-7 flex items-center justify-center hover:bg-brand-greenDark active:scale-95 transition-all"
                >
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="w-5 sm:w-6 text-center text-xs font-black text-brand-yellow">
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-6 sm:w-7 h-7 flex items-center justify-center hover:bg-brand-greenDark active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-1.5 bg-brand-greenLight hover:bg-brand-green text-brand-green hover:text-white border border-brand-green rounded-lg text-xs font-black transition-all shadow-xs active:scale-95"
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
