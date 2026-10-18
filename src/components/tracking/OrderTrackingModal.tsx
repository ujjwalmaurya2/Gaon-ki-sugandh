import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Package, 
  Bike, 
  CheckCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { 
    trackingOrderId, 
    setTrackingOrderId, 
    orders, 
    getOrderById,
    settings 
  } = useStore();

  const [searchIdInput, setSearchIdInput] = useState('');

  if (!trackingOrderId) return null;

  const currentOrder = getOrderById(trackingOrderId) || orders[0];

  if (!currentOrder) return null;

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Order Placed', label: 'Order Placed', desc: 'Received & verified' },
    { key: 'Confirmed', label: 'Order Confirmed', desc: 'Farm warehouse notified' },
    { key: 'Preparing', label: 'Packing & Quality Check', desc: 'Safe tamper-proof packing' },
    { key: 'Ready for Dispatch', label: 'Ready for Dispatch', desc: 'Handed to delivery partner' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Partner on the way to your door' },
    { key: 'Delivered', label: 'Delivered', desc: 'Package received safely' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = getStepIndex(currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-brand-border my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-border bg-brand-green text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-brand-yellow font-black">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black">Order #{currentOrder.id}</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-yellow text-brand-dark">
                  {currentOrder.status}
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                Placed on {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTrackingOrderId(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Lookup another order bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value.toUpperCase())}
                placeholder="Track another Order ID (e.g. GKS-91042)"
                className="w-full pl-9 pr-3 py-2 border border-brand-border rounded-xl text-xs font-semibold outline-none focus:border-brand-green"
              />
            </div>
            <button
              onClick={() => {
                const found = getOrderById(searchIdInput.trim());
                if (found) {
                  setTrackingOrderId(found.id);
                  setSearchIdInput('');
                }
              }}
              className="px-3.5 py-2 bg-brand-bg hover:bg-brand-greenLight border border-brand-border rounded-xl text-xs font-bold text-brand-green transition-colors"
            >
              Lookup
            </button>
          </div>

          {/* Delivery Estimate Card */}
          {currentOrder.status !== 'Cancelled' && currentOrder.status !== 'Delivered' && (
            <div className="p-4 bg-brand-yellowPale rounded-2xl border border-brand-yellow flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-brand-greenDark tracking-wider">
                  Estimated Arrival
                </span>
                <h4 className="text-lg font-black text-brand-dark flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-brand-green animate-pulse" />
                  <span>Arriving in {settings.estimatedDeliveryTime}</span>
                </h4>
                <p className="text-xs text-brand-muted mt-0.5 font-medium">
                  Freshly picked from our local depot hub
                </p>
              </div>

              {currentOrder.deliveryPartner && (
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted block font-semibold">Delivery Partner</span>
                  <p className="text-xs font-black text-brand-dark">{currentOrder.deliveryPartner.name}</p>
                  <a 
                    href={`tel:${currentOrder.deliveryPartner.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green hover:underline mt-0.5"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {currentOrder.status === 'Cancelled' && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-xs font-medium flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">This demo order was marked as Cancelled.</p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  All items have been restored to available inventory. Refund status: {currentOrder.paymentStatus}.
                </p>
              </div>
            </div>
          )}

          {/* Live Progress Timeline */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-4">
              Live Order Progress
            </h4>

            <div className="space-y-4 pl-2">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st.key} className="flex items-start gap-3 relative">
                    {/* Vertical connecting line */}
                    {idx < steps.length - 1 && (
                      <div 
                        className={`absolute left-3.5 top-7 w-0.5 h-7 -translate-x-1/2 transition-colors ${
                          currentStepIndex > idx ? 'bg-brand-green' : 'bg-gray-200'
                        }`} 
                      />
                    )}

                    {/* Step Icon Node */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                      isPassed 
                        ? 'bg-brand-green text-white shadow-xs' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                    </div>

                    {/* Step text */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-black ${isPassed ? 'text-brand-dark' : 'text-gray-400'}`}>
                          {st.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-brand-green bg-brand-greenLight px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Items Card */}
          <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-brand-dark border-b border-brand-border pb-2">
              <span>Order Summary</span>
              <span>Total: ₹{currentOrder.totalAmount}</span>
            </div>

            <div className="space-y-2">
              {currentOrder.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-white" />
                    <div>
                      <p className="font-bold text-brand-dark truncate max-w-[200px]">{item.productName}</p>
                      <p className="text-[10px] text-brand-muted">{item.quantity} x {item.variantName}</p>
                    </div>
                  </div>
                  <span className="font-black text-brand-dark">₹{item.sellingPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border pt-2 text-[11px] space-y-1 text-brand-muted">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-brand-dark">{currentOrder.paymentMethod} ({currentOrder.paymentStatus})</span>
              </div>
              <div className="flex justify-between">
                <span>Deliver to:</span>
                <span className="font-bold text-brand-dark text-right truncate max-w-[220px]">
                  {currentOrder.customer.addressLine1}, {currentOrder.customer.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-brand-border flex items-center justify-between">
          <p className="text-[11px] text-brand-muted">
            Status synchronizes instantly with Admin controls.
          </p>
          <button
            onClick={() => setTrackingOrderId(null)}
            className="px-5 py-2 bg-brand-green text-white text-xs font-black rounded-xl hover:bg-brand-greenDark transition-colors"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
