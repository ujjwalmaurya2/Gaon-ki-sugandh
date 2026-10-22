import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  IndianRupee, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  Receipt,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DashboardTab: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { orders, products, setTrackingOrderId, offlineSales, offers } = useStore();

  // Metrics calculation
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  
  // Today's orders (demo filter)
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const todaySales = todayOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);

  // Low stock products count
  const lowStockCount = products.reduce((count, prod) => {
    const hasLow = prod.variants.some((v) => v.stock <= prod.lowStockThreshold);
    return hasLow ? count + 1 : count;
  }, 0);

  // Active products count
  const activeProductsCount = products.filter((p) => p.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Store Performance Overview
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            Real-time overview of demo orders, quick-commerce fulfillment, and farm inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Quick-Commerce Hub
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs hover:border-brand-green transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted uppercase">Today's Sales</span>
            <div className="w-9 h-9 rounded-xl bg-brand-greenLight flex items-center justify-center text-brand-green">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark">₹{todaySales}</h3>
            <p className="text-[11px] text-brand-green font-bold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{todayOrders.length} orders placed today</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs hover:border-brand-green transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted uppercase">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-brand-yellowPale flex items-center justify-center text-brand-dark">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark">{totalOrders}</h3>
            <p className="text-[11px] text-brand-muted font-medium mt-0.5">
              Lifetime sales: ₹{totalSales}
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs hover:border-brand-green transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted uppercase">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark">{activeProductsCount}</h3>
            <p className="text-[11px] text-blue-600 font-bold mt-0.5">
              Across 7 organic categories
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-xs hover:border-red-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted uppercase">Low Stock Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-xl sm:text-2xl font-black ${lowStockCount > 0 ? 'text-red-600' : 'text-brand-dark'}`}>
              {lowStockCount}
            </h3>
            <p className="text-[11px] text-red-600 font-bold mt-0.5 flex items-center gap-1">
              <span>View inventory restock list</span>
              <ArrowUpRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Banners for Demo Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* POS Quick Access */}
        <div 
          onClick={() => onNavigate('pos')}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border border-brand-green/30 shadow-xs hover:border-brand-green hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-green text-white flex items-center justify-center font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-brand-dark">Offline Sales & Quick POS</h4>
                <span className="px-1.5 py-0.2 rounded bg-brand-greenLight text-brand-green text-[10px] font-black uppercase">
                  {offlineSales.length} bills
                </span>
              </div>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Instant counter billing, simulated UPI QR code payments & printed tax receipts.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-green shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Bumper Offers Quick Access */}
        <div 
          onClick={() => onNavigate('offers')}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50 border border-amber-300/50 shadow-xs hover:border-amber-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-yellow text-brand-dark flex items-center justify-center font-black shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-brand-dark">Bumper Offers & Promotions</h4>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                  {offers.filter(o => o.status === 'active').length} live
                </span>
              </div>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Manage promotional banners, category percentage discounts & storefront spotlights.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-brand-dark">Recent Customer Orders</h3>
            <p className="text-xs text-brand-muted">Orders update automatically when placed in store</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-brand-muted text-xs">
            No orders placed yet. Place a demo order on the storefront to test!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {orders.slice(0, 5).map((order) => {
                  let statusBg = 'bg-brand-greenLight text-brand-green';
                  if (order.status === 'Cancelled') statusBg = 'bg-red-50 text-red-700';
                  else if (order.status === 'Out for Delivery') statusBg = 'bg-brand-yellowPale text-brand-dark font-black';

                  return (
                    <tr key={order.id} className="hover:bg-brand-bg/50 transition-colors">
                      <td className="py-3 px-4 font-black text-brand-dark">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-dark">
                        {order.customer.name}
                        <span className="block text-[10px] text-brand-muted">{order.customer.phone}</span>
                      </td>
                      <td className="py-3 px-4 text-brand-muted">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-4 font-black text-brand-dark">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-medium text-brand-muted">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setTrackingOrderId(order.id)}
                          className="px-2.5 py-1 bg-brand-bg hover:bg-brand-greenLight text-brand-green border border-brand-border rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Featured Best Sellers Preview */}
      <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
        <h3 className="text-base font-black text-brand-dark mb-1">Organic Best Sellers</h3>
        <p className="text-xs text-brand-muted mb-4">Top moving staple items across the region</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.filter((p) => p.isFeatured).slice(0, 3).map((prod) => (
            <div key={prod.id} className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border">
              <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-white shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-brand-dark truncate">{prod.name}</h4>
                <p className="text-[10px] text-brand-muted font-medium">{prod.origin}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-brand-green">₹{prod.variants[0]?.sellingPrice}</span>
                  <span className="text-[10px] text-brand-muted">Stock: {prod.variants[0]?.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
