import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { 
  Plus, 
  Search, 
  Edit, 
  Edit3,
  Trash2, 
  Star, 
  Check, 
  X, 
  Eye, 
  Package, 
  Image as ImageIcon,
  AlertCircle,
  Type
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, renameProduct, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Quick Rename Modal state
  const [renamingProduct, setRenamingProduct] = useState<Product | null>(null);
  const [renameEnglish, setRenameEnglish] = useState('');
  const [renameHindi, setRenameHindi] = useState('');

  // Inline rename state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEnglish, setInlineEnglish] = useState('');
  const [inlineHindi, setInlineHindi] = useState('');

  // Form state for Add/Edit
  const [formData, setFormData] = useState<{
    name: string;
    hindiName: string;
    category: CategoryId;
    origin: string;
    description: string;
    image: string;
    isFeatured: boolean;
    isAvailable: boolean;
    lowStockThreshold: number;
    variants: ProductVariant[];
  }>({
    name: '',
    hindiName: '',
    category: 'oils',
    origin: 'Bundelkhand, MP',
    description: '',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 10,
    variants: [
      { id: 'v1', name: '1 Litre', sku: 'GKS-OIL-NEW-1L', sellingPrice: 250, mrp: 300, stock: 25 }
    ]
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      hindiName: '',
      category: 'oils',
      origin: 'Rajasthan / MP',
      description: '100% pure organic village harvest.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      isFeatured: false,
      isAvailable: true,
      lowStockThreshold: 10,
      variants: [
        { id: `v-${Date.now()}`, name: '1 Litre', sku: `GKS-NEW-${Math.floor(100+Math.random()*900)}`, sellingPrice: 250, mrp: 300, stock: 30 }
      ]
    });
    setEditingProduct(null);
    setIsAddingNew(true);
  };

  const openEditModal = (p: Product) => {
    setFormData({
      name: p.name,
      hindiName: p.hindiName,
      category: p.category,
      origin: p.origin,
      description: p.description,
      image: p.image,
      isFeatured: p.isFeatured,
      isAvailable: p.isAvailable,
      lowStockThreshold: p.lowStockThreshold,
      variants: [...p.variants]
    });
    setEditingProduct(p);
    setIsAddingNew(false);
  };

  // Quick Rename Handlers
  const openRenameModal = (p: Product) => {
    setRenamingProduct(p);
    setRenameEnglish(p.name);
    setRenameHindi(p.hindiName);
  };

  const handleSaveRenameModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingProduct) return;
    if (!renameEnglish.trim()) {
      showToast('Product name cannot be empty', 'warning');
      return;
    }
    renameProduct(renamingProduct.id, renameEnglish, renameHindi);
    setRenamingProduct(null);
  };

  // Inline rename handlers
  const startInlineEditing = (p: Product) => {
    setInlineEditingId(p.id);
    setInlineEnglish(p.name);
    setInlineHindi(p.hindiName);
  };

  const saveInlineRename = (id: string) => {
    if (!inlineEnglish.trim()) {
      showToast('Product name cannot be empty', 'warning');
      return;
    }
    renameProduct(id, inlineEnglish, inlineHindi);
    setInlineEditingId(null);
  };

  const cancelInlineRename = () => {
    setInlineEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        ...formData,
        rating: 4.8,
        ratingCount: 15,
        shelfLife: '12 Months'
      });
      setIsAddingNew(false);
    }
  };

  const addVariantField = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          id: `v-${Date.now()}`,
          name: '500 ml',
          sku: `GKS-VAR-${Math.floor(100+Math.random()*900)}`,
          sellingPrice: 150,
          mrp: 180,
          stock: 20
        }
      ]
    });
  };

  const updateVariantField = (index: number, key: keyof ProductVariant, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariantField = (index: number) => {
    if (formData.variants.length === 1) {
      showToast('A product must have at least one variant', 'warning');
      return;
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  // Filter
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Product Catalogue
          </h2>
          <p className="text-xs text-brand-muted">
            Manage organic grocery products, variants, selling prices, and featured items ({products.length} total).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-8 pr-3 py-2 bg-white border border-brand-border rounded-xl text-xs outline-none focus:border-brand-green w-44 sm:w-52"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-brand-green cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Add Product Button */}
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Variants & Pricing</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                const isLow = p.variants.some((v) => v.stock <= p.lowStockThreshold);

                return (
                  <tr key={p.id} className="hover:bg-brand-bg/40 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-12 h-12 rounded-xl object-contain bg-white border border-brand-border shrink-0 p-1 shadow-2xs" 
                        />
                        {inlineEditingId === p.id ? (
                          <div className="space-y-1 min-w-[210px] bg-white p-2 rounded-xl border-2 border-brand-green shadow-md">
                            <label className="text-[9px] uppercase font-bold text-brand-green block">Rename Product</label>
                            <input
                              type="text"
                              value={inlineEnglish}
                              onChange={(e) => setInlineEnglish(e.target.value)}
                              placeholder="English name"
                              className="w-full px-2 py-1 border border-brand-border rounded-lg text-xs font-bold text-brand-dark outline-none focus:border-brand-green"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveInlineRename(p.id);
                                if (e.key === 'Escape') cancelInlineRename();
                              }}
                            />
                            <input
                              type="text"
                              value={inlineHindi}
                              onChange={(e) => setInlineHindi(e.target.value)}
                              placeholder="Hindi subtitle / name"
                              className="w-full px-2 py-0.5 border border-brand-border rounded-lg text-[10px] font-semibold text-brand-dark outline-none focus:border-brand-green"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveInlineRename(p.id);
                                if (e.key === 'Escape') cancelInlineRename();
                              }}
                            />
                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                onClick={() => saveInlineRename(p.id)}
                                className="px-2.5 py-1 bg-brand-green text-white text-[10px] font-bold rounded-md hover:bg-brand-greenDark flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={cancelInlineRename}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="min-w-0 max-w-[210px] group/item">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-brand-dark block truncate text-xs" title={p.name}>
                                {p.name}
                              </span>
                              <button
                                onClick={() => startInlineEditing(p)}
                                className="opacity-0 group-hover/item:opacity-100 text-brand-muted hover:text-brand-green transition-all p-0.5 rounded hover:bg-brand-greenLight/50"
                                title="Quick rename inline"
                              >
                                <Edit3 className="w-3 h-3 text-brand-green" />
                              </button>
                            </div>
                            <span className="text-[10px] text-brand-green block font-semibold">{p.hindiName}</span>
                            {p.isFeatured && (
                              <span className="inline-block text-[9px] font-black bg-brand-yellow text-brand-dark px-1.5 py-0.2 rounded mt-0.5">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-brand-muted bg-brand-bg px-2 py-0.5 rounded border border-brand-border">
                        {p.category}
                      </span>
                    </td>

                    {/* Origin */}
                    <td className="py-3 px-4 text-brand-muted">
                      {p.origin}
                    </td>

                    {/* Variants */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {p.variants.map((v) => (
                          <div key={v.id} className="text-[11px] flex items-center gap-2">
                            <span className="font-bold text-brand-dark">{v.name}:</span>
                            <span className="font-black text-brand-green">₹{v.sellingPrice}</span>
                            <span className="line-through text-brand-lightMuted text-[10px]">₹{v.mrp}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span className={`font-black ${isLow ? 'text-red-600' : 'text-brand-dark'}`}>
                        {totalStock} units
                      </span>
                      {isLow && (
                        <span className="block text-[9px] font-bold text-red-500">
                          Low Stock Alert!
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct({ ...p, isAvailable: !p.isAvailable })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          p.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                        }`}
                      >
                        {p.isAvailable ? 'In Store' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openRenameModal(p)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 border border-amber-200"
                          title="Change Product Name"
                        >
                          <Type className="w-3 h-3" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-brand-greenLight text-brand-green rounded-lg transition-colors border border-transparent hover:border-brand-border"
                          title="Full Edit (Pricing, Variants, Images)"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-brand-border my-auto">
            {/* Header */}
            <div className="px-5 py-4 border-b border-brand-border bg-brand-bg flex items-center justify-between">
              <h3 className="text-base font-black text-brand-dark">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Organic Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              {/* Product Title Section with prominent rename highlighting */}
              <div className="p-3.5 bg-brand-yellow/10 border border-brand-yellow/50 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-brand-yellow text-brand-dark px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                    <Type className="w-3 h-3" /> Product Name / Title (उत्पाद का नाम)
                  </span>
                  <span className="text-[10px] text-brand-muted font-medium">
                    Changes apply instantly across storefront & receipts
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-brand-dark mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cold-Pressed Sesame Oil"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-dark bg-white outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-dark mb-1">Hindi Subtitle / Name (हिंदी नाम)</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. कच्ची घानी तिल का तेल"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold text-brand-dark bg-white outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-semibold outline-none focus:border-brand-green bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Farm Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Bundelkhand, MP"
                    className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Low-Stock Alert Threshold (Units)</label>
                <input
                  type="number"
                  min={1}
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Image URL (Food Photography)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green text-[11px]"
                  />
                  <img src={formData.image} alt="Preview" className="w-9 h-9 rounded-lg object-cover bg-gray-100 border border-brand-border shrink-0" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
                />
              </div>

              {/* Variants Section */}
              <div className="border border-brand-border rounded-2xl p-3 bg-brand-bg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-dark uppercase tracking-wider text-[11px]">
                    Pack Sizes & Pricing ({formData.variants.length})
                  </span>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="text-[11px] font-bold text-brand-green hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Size Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-brand-border">
                      <div className="col-span-3">
                        <label className="text-[10px] text-brand-muted block font-semibold">Size</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => updateVariantField(idx, 'name', e.target.value)}
                          placeholder="1 L / 5 kg"
                          className="w-full px-2 py-1 border border-brand-border rounded-lg text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-brand-muted block font-semibold">Selling ₹</label>
                        <input
                          type="number"
                          value={v.sellingPrice}
                          onChange={(e) => updateVariantField(idx, 'sellingPrice', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-brand-border rounded-lg text-xs font-bold text-brand-green outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-brand-muted block font-semibold">MRP ₹</label>
                        <input
                          type="number"
                          value={v.mrp}
                          onChange={(e) => updateVariantField(idx, 'mrp', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-brand-border rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-brand-muted block font-semibold">Stock Qty</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariantField(idx, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-brand-border rounded-lg text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => removeVariantField(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-brand-green w-4 h-4 rounded"
                  />
                  <span className="font-bold text-brand-dark">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="accent-brand-green w-4 h-4 rounded"
                  />
                  <span className="font-bold text-brand-dark">Available to Buy</span>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Rename Product Modal */}
      {renamingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-brand-border animate-scale-up">
            <div className="px-5 py-4 border-b border-brand-border bg-brand-bg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-yellow/30 flex items-center justify-center text-brand-green">
                  <Type className="w-4 h-4 font-black" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-brand-dark">Change Product Name</h3>
                  <p className="text-[10px] text-brand-muted">उत्पाद का नाम और हिंदी टाइटल बदलें</p>
                </div>
              </div>
              <button
                onClick={() => setRenamingProduct(null)}
                className="w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRenameModal} className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-2xl border border-brand-border">
                <img
                  src={renamingProduct.image}
                  alt={renamingProduct.name}
                  className="w-14 h-14 object-contain bg-white rounded-xl border border-brand-border p-1 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">Current Name</span>
                  <p className="text-xs font-bold text-brand-dark truncate">{renamingProduct.name}</p>
                  <p className="text-[11px] font-semibold text-brand-green">{renamingProduct.hindiName}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark text-xs mb-1">
                  New Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={renameEnglish}
                  onChange={(e) => setRenameEnglish(e.target.value)}
                  placeholder="e.g. Cold-Pressed Sesame Oil"
                  className="w-full px-3 py-2 border-2 border-brand-border focus:border-brand-green rounded-xl text-xs font-bold text-brand-dark outline-none transition-colors"
                  autoFocus
                />
                <span className="text-[10px] text-brand-muted mt-1 block">
                  This title appears on storefront cards, search results, and checkout.
                </span>
              </div>

              <div>
                <label className="block font-bold text-brand-dark text-xs mb-1">
                  Hindi Subtitle / Name (हिंदी नाम)
                </label>
                <input
                  type="text"
                  value={renameHindi}
                  onChange={(e) => setRenameHindi(e.target.value)}
                  placeholder="e.g. कच्ची घानी शुद्ध तिल का तेल"
                  className="w-full px-3 py-2 border-2 border-brand-border focus:border-brand-green rounded-xl text-xs font-semibold text-brand-dark outline-none transition-colors"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong className="font-bold">Instant Storewide Sync:</strong> Renaming immediately updates customer views, active cart items, and order receipts without page refresh.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setRenamingProduct(null)}
                  className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-bold rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save New Name</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
