import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Search,
  Sliders,
  History
} from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { 
    products, 
    adjustStock, 
    setExactStock, 
    inventoryLogs, 
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [editingStockItem, setEditingStockItem] = useState<{
    productId: string;
    variantId: string;
    name: string;
    currentStock: number;
  } | null>(null);

  const [exactStockInput, setExactStockInput] = useState<number>(0);

  // Flatten products into variant rows
  const allInventoryRows = products.flatMap((product) =>
    product.variants.map((v) => ({
      productId: product.id,
      productName: product.name,
      category: product.category,
      variantId: v.id,
      variantName: v.name,
      sku: v.sku,
      stock: v.stock,
      lowStockThreshold: product.lowStockThreshold,
      sellingPrice: v.sellingPrice,
      image: product.image,
    }))
  );

  const filteredRows = allInventoryRows.filter(
    (row) =>
      row.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.variantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockRows = allInventoryRows.filter(
    (row) => row.stock <= row.lowStockThreshold
  );

  const handleOpenSetExact = (row: typeof allInventoryRows[0]) => {
    setEditingStockItem({
      productId: row.productId,
      variantId: row.variantId,
      name: `${row.productName} (${row.variantName})`,
      currentStock: row.stock,
    });
    setExactStockInput(row.stock);
  };

  const handleSaveExact = () => {
    if (!editingStockItem) return;
    setExactStock(editingStockItem.productId, editingStockItem.variantId, exactStockInput);
    setEditingStockItem(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Inventory & Stock Engine
          </h2>
          <p className="text-xs text-brand-muted">
            Live stock movements synchronized with customer orders and immediate storefront updates.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-brand-bg p-1 rounded-xl border border-brand-border">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-brand-green text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            Active Stock ({allInventoryRows.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-brand-green text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Movement Logs ({inventoryLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockRows.length > 0 && activeTab === 'inventory' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900">
                {lowStockRows.length} Product Variants Reached Low-Stock Threshold!
              </h4>
              <p className="text-[11px] text-amber-800">
                Replenish units below to avoid customer stock-outs on the storefront.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              // Quick bulk restock all low stock items by +20
              lowStockRows.forEach((r) => {
                adjustStock(r.productId, r.variantId, 20, 'Bulk Restock');
              });
              showToast('Restocked all low items with +20 units', 'success');
            }}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs shrink-0"
          >
            Restock All (+20)
          </button>
        </div>
      )}

      {/* Main Content: Inventory Table OR History Log */}
      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, variant, or SKU..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-brand-border rounded-xl text-xs outline-none focus:border-brand-green"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                  <tr>
                    <th className="py-3 px-4">Item & Variant</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Threshold</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-center">Quick Adjust</th>
                    <th className="py-3 px-4 text-right">Set Exact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredRows.map((row) => {
                    const isOut = row.stock <= 0;
                    const isLow = row.stock > 0 && row.stock <= row.lowStockThreshold;

                    return (
                      <tr key={`${row.productId}-${row.variantId}`} className="hover:bg-brand-bg/40 transition-colors">
                        {/* Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={row.image} alt={row.productName} className="w-9 h-9 rounded-lg object-cover bg-brand-bg shrink-0" />
                            <div>
                              <p className="font-bold text-brand-dark leading-tight">{row.productName}</p>
                              <span className="inline-block text-[10px] font-semibold text-brand-green bg-brand-greenLight px-1.5 py-0.2 rounded mt-0.5">
                                {row.variantName} • ₹{row.sellingPrice}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-4 font-mono text-[11px] text-brand-muted">
                          {row.sku}
                        </td>

                        {/* Current Stock */}
                        <td className="py-3 px-4">
                          <span className={`text-sm font-black ${
                            isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-brand-dark'
                          }`}>
                            {row.stock} units
                          </span>
                        </td>

                        {/* Threshold */}
                        <td className="py-3 px-4 text-brand-muted font-medium">
                          {row.lowStockThreshold} units
                        </td>

                        {/* Badge */}
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          )}
                        </td>

                        {/* Quick Adjust Buttons */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => adjustStock(row.productId, row.variantId, -1, 'Manual Adjustment')}
                              disabled={row.stock <= 0}
                              className="px-2 py-1 bg-brand-bg hover:bg-gray-200 disabled:opacity-30 rounded-lg text-xs font-black transition-colors"
                              title="Decrease 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => adjustStock(row.productId, row.variantId, 1, 'Manual Adjustment')}
                              className="px-2 py-1 bg-brand-greenLight hover:bg-emerald-100 text-brand-green rounded-lg text-xs font-black transition-colors"
                              title="Add 1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => adjustStock(row.productId, row.variantId, 5, 'Manual Adjustment')}
                              className="px-2 py-1 bg-brand-greenLight hover:bg-emerald-100 text-brand-green rounded-lg text-xs font-black transition-colors"
                              title="Add 5"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => adjustStock(row.productId, row.variantId, 10, 'Manual Adjustment')}
                              className="px-2 py-1 bg-brand-green hover:bg-brand-greenDark text-white rounded-lg text-xs font-black transition-colors"
                              title="Add 10"
                            >
                              +10
                            </button>
                          </div>
                        </td>

                        {/* Set Exact Button */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenSetExact(row)}
                            className="px-2.5 py-1 text-xs font-bold text-brand-muted hover:text-brand-dark bg-brand-bg hover:bg-gray-200 border border-brand-border rounded-lg transition-colors"
                          >
                            Set Exact
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* HISTORY TAB */
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
          <div className="p-4 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-sm font-black text-brand-dark">Stock Movement Audit Trail</h3>
            <span className="text-xs text-brand-muted">Showing all chronological stock adjustments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Item & Variant</th>
                  <th className="py-3 px-4">Reason / Order Ref</th>
                  <th className="py-3 px-4">Stock Change</th>
                  <th className="py-3 px-4 text-right">Resulting Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {inventoryLogs.map((log) => {
                  const isPositive = log.change > 0;
                  return (
                    <tr key={log.id} className="hover:bg-brand-bg/40 transition-colors">
                      <td className="py-3 px-4 text-brand-muted text-[11px]">
                        {new Date(log.timestamp).toLocaleDateString()}{' '}
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-brand-dark block">{log.productName}</span>
                        <span className="text-[10px] text-brand-muted">{log.variantName} ({log.sku})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-brand-dark block">{log.reason}</span>
                        {log.referenceId && (
                          <span className="text-[10px] text-brand-green font-bold block">
                            Order #{log.referenceId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-black ${
                          isPositive ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isPositive ? `+${log.change}` : log.change}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-brand-dark">
                        {log.resultingStock} units
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Set Exact Stock Modal */}
      {editingStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-brand-border">
            <h3 className="text-sm font-black text-brand-dark">Set Exact Available Inventory</h3>
            <p className="text-xs text-brand-muted">{editingStockItem.name}</p>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Enter New Quantity
              </label>
              <input
                type="number"
                min={0}
                value={exactStockInput}
                onChange={(e) => setExactStockInput(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-base font-black text-brand-green outline-none focus:border-brand-green"
              />
              <span className="text-[10px] text-brand-muted block mt-1">
                Currently in stock: {editingStockItem.currentStock} units
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStockItem(null)}
                className="px-3.5 py-1.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveExact}
                className="px-4 py-1.5 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-bold"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
