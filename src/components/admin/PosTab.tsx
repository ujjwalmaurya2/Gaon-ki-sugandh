import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, OfflineSale, OfflineSaleItem } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Receipt,
  CheckCircle2,
  Printer,
  ArrowRight,
  Clock,
  User,
  Phone,
  FileText,
  IndianRupee,
  ShoppingBag,
  X,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';

export const PosTab: React.FC = () => {
  const { products, offlineSales, createOfflineSale, settings, showToast } = useStore();

  // Active view: terminal or history
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'history'>('terminal');

  // Search & category filter for product catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Current POS Cart
  const [posCart, setPosCart] = useState<OfflineSaleItem[]>([]);

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Payment Simulation Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [completedSale, setCompletedSale] = useState<OfflineSale | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Receipt Modal State (for viewing historical or just completed receipt)
  const [receiptToView, setReceiptToView] = useState<OfflineSale | null>(null);

  // Filter products for POS terminal
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(q));
      return matchCat && matchSearch && p.isAvailable;
    });
  }, [products, selectedCategory, searchQuery]);

  // POS Cart Calculations
  const cartSubtotal = useMemo(() => {
    return posCart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [posCart]);

  const cartItemsCount = useMemo(() => {
    return posCart.reduce((sum, item) => sum + item.quantity, 0);
  }, [posCart]);

  // Cart operations
  const addToPosCart = (product: Product, variant: ProductVariant) => {
    if (variant.stock <= 0) {
      showToast(`${product.name} (${variant.name}) is out of stock!`, 'warning');
      return;
    }

    setPosCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (existing.quantity >= variant.stock) {
          showToast(`Only ${variant.stock} units available in stock`, 'warning');
          return prev;
        }
        const updated = [...prev];
        const newQty = existing.quantity + 1;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.unitPrice,
        };
        return updated;
      }

      const newItem: OfflineSaleItem = {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        sellingPrice: variant.sellingPrice,
        unitPrice: variant.sellingPrice,
        totalPrice: variant.sellingPrice,
        mrp: variant.mrp,
        quantity: 1,
        image: product.image,
        category: product.category,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name} (${variant.name})`, 'info');
  };

  const updatePosQty = (productId: string, variantId: string, delta: number) => {
    setPosCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const product = products.find((p) => p.id === productId);
            const variant = product?.variants.find((v) => v.id === variantId);
            const maxStock = variant ? variant.stock : 999;

            const nextQty = item.quantity + delta;
            if (nextQty > maxStock) {
              showToast(`Cannot exceed available stock of ${maxStock}`, 'warning');
              return item;
            }
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as OfflineSaleItem[];
    });
  };

  const removePosItem = (productId: string, variantId: string) => {
    setPosCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const clearPosCart = () => {
    setPosCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNotes('');
  };

  // Open simulated payment modal
  const handleProceedToPayment = () => {
    if (posCart.length === 0) {
      showToast('Please add items to the bill first', 'warning');
      return;
    }
    setIsPaymentSuccess(false);
    setCompletedSale(null);
    setIsPaymentModalOpen(true);
  };

  // Simulate payment completion
  const handleSimulatePaymentSuccess = () => {
    const sale = createOfflineSale({
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || undefined,
      items: [...posCart],
      subtotal: cartSubtotal,
      discount: 0,
      totalAmount: cartSubtotal,
      paymentMethod: 'UPI / QR (Online)',
      paymentStatus: 'Paid (Simulated)',
      orderSource: 'Offline / POS',
      notes: customerNotes.trim() || undefined,
    });

    setCompletedSale(sale);
    setIsPaymentSuccess(true);
    // Clear POS cart after successful billing
    clearPosCart();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://gaonkisugandh.com/pay?bill=${completedSale?.id || 'POS-DEMO'}&amount=${cartSubtotal}`
    );
    setIsLinkCopied(true);
    showToast('Simulated payment link copied to clipboard', 'success');
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  // Metrics for offline sales
  const todayOfflineSales = useMemo(() => {
    const todayStr = new Date().toDateString();
    return offlineSales.filter((s) => new Date(s.createdAt).toDateString() === todayStr);
  }, [offlineSales]);

  const totalOfflineRevenue = useMemo(() => {
    return offlineSales.reduce((sum, s) => sum + s.totalAmount, 0);
  }, [offlineSales]);

  const avgTicketSize = useMemo(() => {
    if (offlineSales.length === 0) return 0;
    return Math.round(totalOfflineRevenue / offlineSales.length);
  }, [offlineSales, totalOfflineRevenue]);

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
              Offline Sales & Quick POS Terminal
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase tracking-wider">
              Farm Storefront Mode
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Create instant in-store walk-in bills, simulate dynamic UPI QR payments, and print tax receipts.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-brand-border shadow-xs">
          <button
            onClick={() => setActiveSubTab('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeSubTab === 'terminal'
                ? 'bg-brand-green text-white shadow-xs'
                : 'text-brand-dark hover:bg-brand-bg'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New POS Bill ({cartItemsCount})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-brand-green text-white shadow-xs'
                : 'text-brand-dark hover:bg-brand-bg'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Sales History ({offlineSales.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Today's POS Sales</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-brand-dark">
              ₹{todayOfflineSales.reduce((sum, s) => sum + s.totalAmount, 0)}
            </h3>
            <p className="text-[11px] text-brand-green font-bold mt-0.5">
              {todayOfflineSales.length} bills completed today
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Total POS Revenue</span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-brand-dark">₹{totalOfflineRevenue}</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">
              {offlineSales.length} total offline transactions
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>Avg Ticket Size</span>
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-brand-dark">₹{avgTicketSize}</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">Per offline customer</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted uppercase">
            <span>POS Status</span>
            <span className="w-7 h-7 rounded-lg bg-brand-yellowPale text-brand-dark flex items-center justify-center font-black text-xs">
              ⚡
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-black text-brand-dark flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Terminal Ready</span>
            </h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">
              Auto inventory sync enabled
            </p>
          </div>
        </div>
      </div>

      {/* Main Terminal View */}
      {activeSubTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Product Catalog & Search (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs space-y-3">
              {/* Search & Category Pills */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product by name, Hindi, or SKU..."
                    className="w-full pl-9 pr-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-semibold outline-none focus:border-brand-green"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-bold text-brand-dark outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value="all">All Farm Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Quick Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-bg hover:bg-gray-200 text-brand-dark'
                  }`}
                >
                  All Items ({products.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-bg hover:bg-gray-200 text-brand-dark'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-2xl border border-brand-border hover:border-brand-green/50 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl bg-brand-bg p-1.5 border border-brand-border/60 shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-brand-dark truncate leading-tight">
                        {product.name}
                      </h4>
                      {product.hindiName && (
                        <p className="text-[10px] font-semibold text-brand-green truncate">
                          {product.hindiName}
                        </p>
                      )}
                      <p className="text-[10px] text-brand-muted truncate mt-0.5">
                        {product.origin}
                      </p>
                    </div>
                  </div>

                  {/* Variants List & Add Buttons */}
                  <div className="mt-3 pt-2 border-t border-brand-border/60 space-y-1.5">
                    {product.variants.map((v) => {
                      const isOutOfStock = v.stock <= 0;
                      const inCart = posCart.find(
                        (item) => item.productId === product.id && item.variantId === v.id
                      );

                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between text-xs bg-brand-bg p-2 rounded-xl"
                        >
                          <div>
                            <span className="font-bold text-brand-dark text-[11px]">
                              {v.name}
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="font-black text-brand-green">₹{v.sellingPrice}</span>
                              {v.mrp > v.sellingPrice && (
                                <span className="text-[10px] line-through text-brand-lightMuted">
                                  ₹{v.mrp}
                                </span>
                              )}
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  v.stock <= 5
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {v.stock > 0 ? `${v.stock} in stock` : 'Out of Stock'}
                              </span>
                            </div>
                          </div>

                          <div>
                            {isOutOfStock ? (
                              <span className="px-2 py-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-lg">
                                Sold Out
                              </span>
                            ) : (
                              <button
                                onClick={() => addToPosCart(product, v)}
                                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all flex items-center gap-1 ${
                                  inCart
                                    ? 'bg-brand-yellow text-brand-dark hover:bg-yellow-400'
                                    : 'bg-brand-green hover:bg-brand-greenDark text-white shadow-xs'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>{inCart ? `Add (${inCart.quantity})` : 'Add'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Bill & Payment Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-16">
            <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-green text-white flex items-center justify-center font-black">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-brand-dark">Active POS Bill</h3>
                    <p className="text-[10px] text-brand-muted">
                      Walk-in Customer / Offline Counter
                    </p>
                  </div>
                </div>

                {posCart.length > 0 && (
                  <button
                    onClick={clearPosCart}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Customer Details Form (Optional) */}
              <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-2">
                <div className="text-[10px] font-black uppercase text-brand-muted tracking-wider">
                  Customer Information (Optional)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="w-3 h-3 text-brand-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      className="w-full pl-7 pr-2 py-1.5 bg-white border border-brand-border rounded-lg text-xs font-semibold outline-none focus:border-brand-green"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-3 h-3 text-brand-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile Number"
                      className="w-full pl-7 pr-2 py-1.5 bg-white border border-brand-border rounded-lg text-xs font-semibold outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Notes, Bag count, or Reference..."
                  className="w-full px-2.5 py-1.5 bg-white border border-brand-border rounded-lg text-xs outline-none focus:border-brand-green"
                />
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {posCart.length === 0 ? (
                  <div className="text-center py-10 text-brand-muted space-y-2">
                    <ShoppingBag className="w-9 h-9 mx-auto opacity-30 text-brand-green" />
                    <p className="text-xs font-bold text-brand-dark">No items in POS bill</p>
                    <p className="text-[11px]">Select items from the catalog on the left to add.</p>
                  </div>
                ) : (
                  posCart.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-white text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <h5 className="font-black text-brand-dark truncate">{item.productName}</h5>
                        <p className="text-[10px] text-brand-muted">
                          {item.variantName} × ₹{item.unitPrice}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Qty Stepper */}
                        <div className="flex items-center border border-brand-border rounded-lg overflow-hidden bg-brand-bg">
                          <button
                            onClick={() => updatePosQty(item.productId, item.variantId, -1)}
                            className="p-1 hover:bg-white text-brand-dark"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-brand-green">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updatePosQty(item.productId, item.variantId, 1)}
                            className="p-1 hover:bg-white text-brand-dark"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-black text-brand-dark w-14 text-right">
                          ₹{item.totalPrice}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => removePosItem(item.productId, item.variantId)}
                          className="text-red-400 hover:text-red-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bill Totals & Checkout Button */}
              {posCart.length > 0 && (
                <div className="border-t border-brand-border pt-3 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-brand-muted font-medium">
                      <span>Total Items:</span>
                      <span className="font-bold text-brand-dark">{cartItemsCount} units</span>
                    </div>
                    <div className="flex justify-between text-brand-muted font-medium">
                      <span>Organic Tax (GST Exempt):</span>
                      <span className="font-bold text-emerald-700">₹0 (Exempt)</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-brand-dark pt-1 border-t border-dashed border-brand-border">
                      <span>Grand Total:</span>
                      <span className="text-xl text-brand-green">₹{cartSubtotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-3 bg-brand-green hover:bg-brand-greenDark text-white font-black text-sm rounded-xl shadow-blinkit flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                  >
                    <QrColorIcon />
                    <span>Pay ₹{cartSubtotal} via UPI QR / Link</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales History SubTab */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
          <div className="p-4 border-b border-brand-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-brand-dark">
                Offline & POS Invoices ({offlineSales.length})
              </h3>
              <p className="text-xs text-brand-muted">
                Complete record of in-store counter bills with printable receipts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Bill No</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {offlineSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-brand-muted">
                      No offline sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  offlineSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-brand-bg/50 transition-colors">
                      <td className="py-3 px-4 font-black text-brand-green">{sale.id}</td>
                      <td className="py-3 px-4 text-brand-dark">
                        <div className="font-semibold">
                          {new Date(sale.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-brand-muted">
                          {new Date(sale.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-brand-dark">
                          {sale.customerName || 'Walk-in Guest'}
                        </div>
                        {sale.customerPhone && (
                          <div className="text-[10px] text-brand-muted">{sale.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <span className="text-[11px] text-brand-dark font-medium line-clamp-1">
                          {sale.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                        </span>
                        <span className="text-[10px] text-brand-muted">
                          {sale.items.reduce((sum, i) => sum + i.quantity, 0)} total units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-brand-dark">₹{sale.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{sale.paymentStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-brand-yellowPale text-brand-dark text-[10px] font-black">
                          {sale.orderSource}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setReceiptToView(sale)}
                          className="px-3 py-1.5 bg-brand-bg hover:bg-brand-green hover:text-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark transition-colors inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simulated UPI & QR Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-brand-border shadow-2xl overflow-hidden p-6 space-y-5">
            {!isPaymentSuccess ? (
              <>
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <div>
                      <h4 className="font-black text-brand-dark text-base">
                        Simulated Dynamic UPI QR
                      </h4>
                      <p className="text-[11px] text-brand-muted">Gaon Ki Sugandh POS Counter</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-1 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-bg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Amount Box */}
                <div className="text-center bg-gradient-to-br from-emerald-50 via-brand-yellowPale to-emerald-50 p-4 rounded-2xl border border-brand-green/30">
                  <span className="text-xs font-bold text-brand-muted uppercase">
                    Amount to Collect
                  </span>
                  <div className="text-3xl font-black text-brand-dark tracking-tight mt-0.5">
                    ₹{cartSubtotal}
                  </div>
                  <div className="text-[11px] text-brand-green font-bold mt-1">
                    {cartItemsCount} organic products · Cashless Bill
                  </div>
                </div>

                {/* Simulated QR Visual */}
                <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-brand-border rounded-2xl space-y-3">
                  <div className="relative p-2 bg-white rounded-xl shadow-xs border border-brand-border">
                    <SimulatedQrCanvas amount={cartSubtotal} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-lg bg-white shadow-md border border-brand-border flex items-center justify-center text-xs font-black text-brand-green">
                        🌿
                      </div>
                    </div>
                  </div>

                  {/* UPI Badges */}
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-brand-muted uppercase">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">GPay</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">PhonePe</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">Paytm</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">BHIM UPI</span>
                  </div>
                </div>

                {/* Copy Simulated Link */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-muted block uppercase">
                    Simulate Customer Payment Link:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={`https://gaonkisugandh.com/pay?amount=${cartSubtotal}&merchant=GKS_POS`}
                      className="flex-1 px-3 py-1.5 bg-brand-bg border border-brand-border rounded-xl text-[11px] text-brand-muted select-all font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-brand-bg hover:bg-brand-green hover:text-white border border-brand-border rounded-xl text-xs font-bold text-brand-dark flex items-center gap-1 transition-colors"
                    >
                      {isLinkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isLinkCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary Demo Simulation Action */}
                <div className="pt-2">
                  <button
                    onClick={handleSimulatePaymentSuccess}
                    className="w-full py-3 bg-brand-green hover:bg-brand-greenDark text-white font-black text-sm rounded-2xl shadow-blinkit flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                    <span>⚡ Simulate Successful Payment</span>
                  </button>
                  <p className="text-[10px] text-center text-brand-muted mt-2">
                    Clicking simulates instant customer UPI approval and auto-deducts farm stock.
                  </p>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-dark">Payment Received!</h4>
                  <p className="text-xs text-brand-green font-bold mt-1">
                    Bill #{completedSale?.id} Completed & Paid
                  </p>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Txn Ref: {completedSale?.referenceId}
                  </p>
                </div>

                <div className="bg-brand-bg p-3 rounded-2xl border border-brand-border text-xs text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Amount Received:</span>
                    <span className="font-black text-brand-dark">₹{completedSale?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Customer:</span>
                    <span className="font-bold text-brand-dark">
                      {completedSale?.customerName || 'Walk-in Guest'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Items Sold:</span>
                    <span className="font-bold text-brand-dark">
                      {completedSale?.items.reduce((s, i) => s + i.quantity, 0)} units
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      if (completedSale) setReceiptToView(completedSale);
                    }}
                    className="flex-1 py-2.5 bg-brand-green text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-1.5 hover:bg-brand-greenDark"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                    }}
                    className="flex-1 py-2.5 bg-brand-bg text-brand-dark hover:bg-gray-200 text-xs font-black rounded-xl border border-brand-border"
                  >
                    <span>Start New Bill</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptToView && (
        <PrintableReceiptModal
          sale={receiptToView}
          storeSettings={settings}
          onClose={() => setReceiptToView(null)}
        />
      )}
    </div>
  );
};

// Simulated QR canvas visual using SVG
const SimulatedQrCanvas: React.FC<{ amount: number }> = ({ amount }) => {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      className="rounded-lg bg-white"
    >
      {/* Outer corner finders */}
      <rect x="10" y="10" width="40" height="40" rx="6" fill="#1b4332" />
      <rect x="18" y="18" width="24" height="24" rx="2" fill="white" />
      <rect x="24" y="24" width="12" height="12" rx="1" fill="#1b4332" />

      <rect x="130" y="10" width="40" height="40" rx="6" fill="#1b4332" />
      <rect x="138" y="18" width="24" height="24" rx="2" fill="white" />
      <rect x="144" y="24" width="12" height="12" rx="1" fill="#1b4332" />

      <rect x="10" y="130" width="40" height="40" rx="6" fill="#1b4332" />
      <rect x="18" y="138" width="24" height="24" rx="2" fill="white" />
      <rect x="24" y="144" width="12" height="12" rx="1" fill="#1b4332" />

      {/* Decorative QR matrix pattern */}
      <rect x="60" y="15" width="8" height="8" fill="#1b4332" />
      <rect x="75" y="15" width="8" height="8" fill="#1b4332" />
      <rect x="90" y="25" width="8" height="8" fill="#1b4332" />
      <rect x="105" y="15" width="8" height="8" fill="#1b4332" />
      <rect x="60" y="35" width="8" height="8" fill="#1b4332" />
      <rect x="80" y="45" width="8" height="8" fill="#1b4332" />
      <rect x="100" y="40" width="8" height="8" fill="#1b4332" />

      <rect x="15" y="60" width="8" height="8" fill="#1b4332" />
      <rect x="30" y="70" width="8" height="8" fill="#1b4332" />
      <rect x="45" y="60" width="8" height="8" fill="#1b4332" />
      <rect x="15" y="85" width="8" height="8" fill="#1b4332" />
      <rect x="35" y="100" width="8" height="8" fill="#1b4332" />

      <rect x="135" y="60" width="8" height="8" fill="#1b4332" />
      <rect x="150" y="75" width="8" height="8" fill="#1b4332" />
      <rect x="135" y="90" width="8" height="8" fill="#1b4332" />
      <rect x="155" y="105" width="8" height="8" fill="#1b4332" />

      <rect x="60" y="135" width="8" height="8" fill="#1b4332" />
      <rect x="80" y="145" width="8" height="8" fill="#1b4332" />
      <rect x="100" y="135" width="8" height="8" fill="#1b4332" />
      <rect x="135" y="140" width="8" height="8" fill="#1b4332" />
      <rect x="150" y="155" width="8" height="8" fill="#1b4332" />
      <rect x="70" y="160" width="8" height="8" fill="#1b4332" />
      <rect x="110" y="160" width="8" height="8" fill="#1b4332" />
    </svg>
  );
};

const QrColorIcon: React.FC = () => (
  <QrCode className="w-4 h-4 text-brand-yellow shrink-0" />
);

// Thermal / POS Invoice Modal
const PrintableReceiptModal: React.FC<{
  sale: OfflineSale;
  storeSettings: any;
  onClose: () => void;
}> = ({ sale, storeSettings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-3 bg-brand-bg border-b border-brand-border flex items-center justify-between print:hidden">
          <span className="text-xs font-black text-brand-dark flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5 text-brand-green" />
            <span>Customer Tax Invoice / POS Receipt</span>
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          id="pos-receipt-print-area"
          className="p-6 bg-white overflow-y-auto space-y-4 text-xs font-mono text-gray-800"
        >
          {/* Header */}
          <div className="text-center space-y-0.5 border-b border-dashed border-gray-400 pb-3">
            <h3 className="text-base font-black tracking-tight text-gray-900 uppercase">
              {storeSettings.storeName || 'GAON KI SUGANDH'}
            </h3>
            <p className="text-[10px] text-gray-600 font-sans">
              100% Pure Organic & Traditional Village Harvest
            </p>
            <p className="text-[9px] text-gray-500 font-sans">
              Bundelkhand Agro Hub · WhatsApp: +91 98765 43210
            </p>
            <p className="text-[9px] text-gray-500 font-sans">FSSAI Lic: 12723999000142</p>
          </div>

          {/* Bill Meta */}
          <div className="text-[11px] space-y-1 border-b border-dashed border-gray-400 pb-2.5">
            <div className="flex justify-between">
              <span>INVOICE NO:</span>
              <span className="font-bold">{sale.id}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE & TIME:</span>
              <span>
                {new Date(sale.createdAt).toLocaleDateString('en-IN')}{' '}
                {new Date(sale.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CUSTOMER:</span>
              <span className="font-bold">{sale.customerName || 'Walk-in Guest'}</span>
            </div>
            {sale.customerPhone && (
              <div className="flex justify-between">
                <span>MOBILE:</span>
                <span>{sale.customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>COUNTER / SOURCE:</span>
              <span>{sale.orderSource}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-between text-[10px] font-bold text-gray-600 border-b border-gray-300 pb-1">
              <span className="w-1/2">ITEM</span>
              <span className="w-1/6 text-center">QTY</span>
              <span className="w-1/6 text-right">RATE</span>
              <span className="w-1/6 text-right">TOTAL</span>
            </div>
            {sale.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-[11px] items-start">
                <div className="w-1/2 pr-1">
                  <div className="font-bold text-gray-900 leading-tight">{it.productName}</div>
                  <div className="text-[9px] text-gray-500">{it.variantName}</div>
                </div>
                <div className="w-1/6 text-center">{it.quantity}</div>
                <div className="w-1/6 text-right">₹{it.unitPrice}</div>
                <div className="w-1/6 text-right font-bold">₹{it.totalPrice}</div>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span className="font-bold">₹{sale.totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (Organic Unbranded Exemption):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-300">
              <span>NET PAYABLE:</span>
              <span>₹{sale.totalAmount}</span>
            </div>
          </div>

          {/* Payment Mode Note */}
          <div className="text-[10px] text-gray-600 space-y-0.5 text-center">
            <div>MODE: {sale.paymentMethod}</div>
            {sale.referenceId && <div>REF: {sale.referenceId}</div>}
            <div className="font-bold text-emerald-800 uppercase mt-1">
              ✓ PAYMENT RECEIVED IN FULL
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[9px] text-gray-500 pt-2 border-t border-dashed border-gray-400 font-sans leading-tight">
            <p>Thank you for shopping pure & chemical-free!</p>
            <p>Direct from village farmers to your kitchen table.</p>
            <p className="mt-1 font-mono text-[8px]">--- Gaon Ki Sugandh POS ---</p>
          </div>
        </div>

        {/* Modal Bottom Print Button */}
        <div className="p-3 bg-brand-bg border-t border-brand-border flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 border border-brand-border rounded-xl text-xs font-bold text-brand-dark"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
