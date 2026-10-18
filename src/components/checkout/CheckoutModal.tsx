import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerDetails, PaymentMethod } from '../../types';
import { 
  X, 
  MapPin, 
  User, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    cartSavings, 
    appliedCoupon, 
    settings, 
    deliveryLocation,
    isPincodeServiceable,
    createOrder,
    showToast,
    setTrackingOrderId
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Customer form state
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: 'Pooja Verma',
    phone: '9876543210',
    email: 'pooja.verma@example.com',
    addressLine1: 'Flat 402, Lotus Greens, Sector 28',
    addressLine2: 'Phase 1',
    landmark: 'Opposite Central Park',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: deliveryLocation.pincode,
    addressType: 'Home'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Demo UPI');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Bill calculations
  const deliveryFee = cartTotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const handlingFee = settings.handlingFee;

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

  // Validation
  const validateStep1 = () => {
    if (!customer.name.trim()) {
      showToast('Please enter your full name', 'warning');
      return false;
    }
    if (!customer.phone.trim() || customer.phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'warning');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!customer.addressLine1.trim()) {
      showToast('Please enter house/flat and street address', 'warning');
      return false;
    }
    if (!isPincodeServiceable(customer.pincode)) {
      showToast(`PIN code ${customer.pincode} is currently not in our quick delivery zone`, 'warning');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const placed = createOrder(customer, paymentMethod);
      setIsSubmitting(false);

      if (placed) {
        setIsCheckoutOpen(false);

        // Fire festive confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0C831F', '#F8CB46', '#086518', '#FFD700']
          });
        } catch (e) {
          // ignore if canvas not supported
        }

        // Open live order tracking
        setTrackingOrderId(placed.id);
      }
    }, 600);
  };

  return (
    <div 
      onClick={() => setIsCheckoutOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-brand-border my-auto"
      >
        {/* Header with Steps */}
        <div className="px-5 py-4 border-b border-brand-border bg-brand-bg flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-green">
                Step {step} of 4
              </span>
              <h3 className="text-sm sm:text-base font-black text-brand-dark leading-tight">
                {step === 1 && 'Customer Contact Details'}
                {step === 2 && 'Delivery Address & PIN'}
                {step === 3 && 'Payment Method (Demo)'}
                {step === 4 && 'Review & Place Demo Order'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="bg-brand-green h-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Pooja Verma"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Mobile Number (for delivery updates) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-brand-border bg-brand-bg text-xs font-bold text-brand-dark">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="flex-1 px-3.5 py-2.5 border border-brand-border rounded-r-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="pooja.verma@example.com"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                />
              </div>

              <div className="p-3 bg-brand-yellowPale rounded-xl border border-brand-yellow/40 flex items-center gap-2 text-xs text-brand-dark">
                <Sparkles className="w-4 h-4 text-brand-green shrink-0" />
                <span>We simulate WhatsApp order updates for this number instantly!</span>
              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  House / Flat No. & Apartment Name *
                </label>
                <input
                  type="text"
                  value={customer.addressLine1}
                  onChange={(e) => setCustomer({ ...customer, addressLine1: e.target.value })}
                  placeholder="Flat 402, Lotus Greens"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Street / Area / Sector *
                </label>
                <input
                  type="text"
                  value={customer.addressLine2 || ''}
                  onChange={(e) => setCustomer({ ...customer, addressLine2: e.target.value })}
                  placeholder="Sector 28, Phase 1"
                  className="w-full px-3.5 py-2.5 border border-brand-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                    Delivery PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 border border-brand-border rounded-xl text-xs sm:text-sm font-bold tracking-wider outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Serviceable Check Pill */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Serviceable in {settings.estimatedDeliveryTime}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">PIN: {customer.pincode}</span>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>DEMO PAYMENT MODE:</strong> No real money will be charged. Select any simulated option to test.
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Demo UPI */}
                <div 
                  onClick={() => setPaymentMethod('Demo UPI')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Demo UPI'
                      ? 'border-brand-green bg-brand-greenLight/50 shadow-xs'
                      : 'border-brand-border hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-green shadow-xs">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-brand-dark">Instant UPI (Demo)</h4>
                        <p className="text-[11px] text-brand-muted">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'Demo UPI'}
                      onChange={() => setPaymentMethod('Demo UPI')}
                      className="accent-brand-green w-4 h-4"
                    />
                  </div>

                  {paymentMethod === 'Demo UPI' && (
                    <div className="mt-3 pt-3 border-t border-brand-green/20 flex gap-2">
                      {['gpay', 'phonepe', 'paytm'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setUpiOption(app as any)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase border text-center transition-colors ${
                            upiOption === app
                              ? 'bg-brand-green text-white border-brand-green'
                              : 'bg-white text-brand-dark border-brand-border'
                          }`}
                        >
                          {app === 'gpay' ? 'GPay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Demo Card */}
                <div 
                  onClick={() => setPaymentMethod('Demo Card')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Demo Card'
                      ? 'border-brand-green bg-brand-greenLight/50 shadow-xs'
                      : 'border-brand-border hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-green shadow-xs">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-brand-dark">Credit / Debit Card (Demo)</h4>
                        <p className="text-[11px] text-brand-muted">Visa, Mastercard, RuPay (Simulated)</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'Demo Card'}
                      onChange={() => setPaymentMethod('Demo Card')}
                      className="accent-brand-green w-4 h-4"
                    />
                  </div>
                </div>

                {/* Demo Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-green bg-brand-greenLight/50 shadow-xs'
                      : 'border-brand-border hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-green shadow-xs">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-brand-dark">Cash on Delivery (Demo)</h4>
                        <p className="text-[11px] text-brand-muted">Pay cash or UPI to delivery agent at door</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-brand-green w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Place Order */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Order Items Preview */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-dark block mb-1.5">
                  Items to Deliver ({cart.length})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 bg-brand-bg p-2.5 rounded-xl border border-brand-border">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-brand-dark truncate max-w-[220px]">
                        {item.quantity}x {item.productName} ({item.variantName})
                      </span>
                      <span className="font-black text-brand-dark shrink-0">
                        ₹{item.sellingPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Review */}
              <div className="p-3 bg-brand-bg rounded-xl border border-brand-border text-xs">
                <span className="font-black text-brand-dark block mb-1">Delivering to:</span>
                <p className="text-brand-dark font-medium">{customer.name} • {customer.phone}</p>
                <p className="text-brand-muted">{customer.addressLine1}, {customer.addressLine2}, {customer.city} ({customer.pincode})</p>
                <div className="mt-1 flex items-center gap-1 text-brand-green font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated delivery in {settings.estimatedDeliveryTime}</span>
                </div>
              </div>

              {/* Bill Details */}
              <div className="bg-white p-3 rounded-xl border border-brand-border space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Item Total</span>
                  <span className="font-bold text-brand-dark">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Delivery Charge</span>
                  <span>{deliveryFee === 0 ? <strong className="text-brand-green">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Handling Fee</span>
                  <span className="font-bold text-brand-dark">₹{handlingFee}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-brand-green font-bold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="border-t border-brand-border pt-1.5 flex justify-between text-sm font-black text-brand-dark">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-green font-black">₹{finalPayable}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                Mode: {paymentMethod} • Ready to Place Demo Order
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-brand-bg border-t border-brand-border flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] text-brand-muted block uppercase font-bold">Total Amount</span>
            <span className="text-base font-black text-brand-dark">₹{finalPayable}</span>
          </div>

          <div className="flex gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="px-6 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-blinkit flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <>
                    <span>Place Demo Order</span>
                    <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
