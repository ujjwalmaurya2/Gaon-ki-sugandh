import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Clock, 
  MapPin, 
  Phone,
  FileText
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder, setTrackingOrderId } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const statuses: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Preparing',
    'Ready for Dispatch',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Order Management
          </h2>
          <p className="text-xs text-brand-muted">
            Manage live grocery fulfillment, update statuses, print invoices, and handle cancellations.
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
              placeholder="Search by ID or customer..."
              className="pl-8 pr-3 py-2 bg-white border border-brand-border rounded-xl text-xs outline-none focus:border-brand-green w-48 sm:w-60"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-brand-green cursor-pointer"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            No orders match the selected search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-brand-muted font-bold uppercase tracking-wider text-[10px] border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Bill Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Update Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-brand-bg/40 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-brand-dark block">#{order.id}</span>
                        <span className="text-[10px] text-brand-muted">
                          {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })},{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-dark block">{order.customer.name}</span>
                        <span className="text-[10px] text-brand-muted block">{order.customer.phone}</span>
                        <span className="text-[10px] text-brand-muted truncate max-w-[140px] block">
                          {order.customer.city} ({order.customer.pincode})
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-brand-dark">
                        <div className="max-w-[200px]">
                          {order.items.slice(0, 2).map((it, idx) => (
                            <p key={idx} className="truncate text-[11px] font-medium text-brand-muted">
                              {it.quantity}x {it.productName}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-[10px] font-bold text-brand-green">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Bill Total */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-black text-brand-dark block">₹{order.totalAmount}</span>
                        {order.couponCode && (
                          <span className="text-[9px] font-bold text-brand-green bg-brand-greenLight px-1.5 py-0.2 rounded">
                            {order.couponCode}
                          </span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-brand-dark block">{order.paymentMethod}</span>
                        <span className={`text-[10px] font-bold ${
                          order.paymentStatus === 'Refunded (Demo)' ? 'text-red-600' : 'text-emerald-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Live Status Updater Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          disabled={order.status === 'Cancelled'}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer outline-none transition-colors ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 border-red-300 text-red-700 cursor-not-allowed'
                              : order.status === 'Out for Delivery'
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-black'
                              : 'bg-brand-bg border-brand-border text-brand-dark'
                          }`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice Preview */}
                          <button
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="p-1.5 hover:bg-gray-100 text-brand-muted hover:text-brand-dark rounded-lg transition-colors"
                            title="View / Print Demo Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Track in Customer View */}
                          <button
                            onClick={() => setTrackingOrderId(order.id)}
                            className="p-1.5 hover:bg-brand-greenLight text-brand-green rounded-lg transition-colors"
                            title="View live customer tracking screen"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Cancel Order */}
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel demo order #${order.id}? This will automatically restore product stock.`)) {
                                  cancelOrder(order.id, true);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                              title="Cancel order and restock inventory"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-brand-border">
            {/* Invoice Header */}
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-brand-green" />
                <h3 className="text-sm font-black text-brand-dark">Demo Tax Invoice #{selectedOrderForInvoice.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Paper Body */}
            <div className="p-6 text-xs space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Store & Customer Info */}
              <div className="flex justify-between border-b border-brand-border pb-4">
                <div>
                  <h4 className="font-black text-brand-green text-sm">Gaon Ki Sugandh</h4>
                  <p className="text-brand-muted text-[10px]">Village Sourcing Hub, DLF Sector 28</p>
                  <p className="text-brand-muted text-[10px]">GSTIN: 07AAAAA0000A1Z5 (Demo)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-dark">Invoice: #{selectedOrderForInvoice.id}</p>
                  <p className="text-brand-muted text-[10px]">
                    Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-brand-green font-bold text-[10px]">{selectedOrderForInvoice.status}</p>
                </div>
              </div>

              {/* Customer details */}
              <div className="text-[11px]">
                <p className="font-bold text-brand-dark">Billed & Delivered To:</p>
                <p className="font-semibold text-brand-dark">{selectedOrderForInvoice.customer.name}</p>
                <p className="text-brand-muted">{selectedOrderForInvoice.customer.addressLine1}, {selectedOrderForInvoice.customer.city} ({selectedOrderForInvoice.customer.pincode})</p>
                <p className="text-brand-muted">Phone: {selectedOrderForInvoice.customer.phone}</p>
              </div>

              {/* Line Items */}
              <table className="w-full text-left text-[11px] border border-brand-border rounded-lg overflow-hidden">
                <thead className="bg-brand-bg font-bold text-brand-muted border-b border-brand-border">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {selectedOrderForInvoice.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium text-brand-dark">
                        {it.productName} ({it.variantName})
                      </td>
                      <td className="p-2 text-center text-brand-muted">{it.quantity}</td>
                      <td className="p-2 text-right text-brand-muted">₹{it.sellingPrice}</td>
                      <td className="p-2 text-right font-bold text-brand-dark">₹{it.sellingPrice * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="space-y-1 text-right text-xs pt-2">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderForInvoice.itemTotal}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Delivery Fee:</span>
                  <span>₹{selectedOrderForInvoice.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Handling Fee:</span>
                  <span>₹{selectedOrderForInvoice.handlingFee}</span>
                </div>
                {selectedOrderForInvoice.couponDiscount > 0 && (
                  <div className="flex justify-between text-brand-green font-bold">
                    <span>Coupon Discount ({selectedOrderForInvoice.couponCode}):</span>
                    <span>-₹{selectedOrderForInvoice.couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-brand-dark border-t border-brand-border pt-1">
                  <span>Total Paid ({selectedOrderForInvoice.paymentMethod}):</span>
                  <span className="text-brand-green font-black">₹{selectedOrderForInvoice.totalAmount}</span>
                </div>
              </div>

              <div className="text-[10px] text-center text-brand-muted border-t border-dashed border-brand-border pt-3">
                Gaon ki shuddhta, har ghar tak. Thank you for shopping with Gaon Ki Sugandh!
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-brand-bg border-t border-brand-border flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
