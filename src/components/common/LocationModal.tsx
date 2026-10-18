import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    deliveryLocation, 
    setDeliveryLocation,
    isPincodeServiceable,
    settings,
    showToast
  } = useStore();

  const [pincodeInput, setPincodeInput] = useState(deliveryLocation.pincode);
  const [addressInput, setAddressInput] = useState(deliveryLocation.address);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'serviceable' | 'unserviceable'>('idle');

  if (!isLocationModalOpen) return null;

  const handleVerify = () => {
    if (pincodeInput.trim().length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'warning');
      return;
    }
    const serviceable = isPincodeServiceable(pincodeInput);
    setVerificationStatus(serviceable ? 'serviceable' : 'unserviceable');
  };

  const handleSave = () => {
    if (!isPincodeServiceable(pincodeInput)) {
      showToast('Please select a serviceable PIN code to proceed', 'warning');
      return;
    }
    setDeliveryLocation({
      address: addressInput.trim() || 'Sector 28, Gurugram',
      pincode: pincodeInput.trim(),
    });
    setIsLocationModalOpen(false);
    showToast(`Delivery location set to ${pincodeInput}`, 'success');
  };

  const popularZones = [
    { name: 'DLF Phase 1, Gurugram', pin: '122002' },
    { name: 'Cyber City / Sector 24, Gurugram', pin: '122001' },
    { name: 'Hauz Khas, New Delhi', pin: '110016' },
    { name: 'Connaught Place, Central Delhi', pin: '110001' },
    { name: 'Sector 62, Noida', pin: '201301' },
  ];

  return (
    <div 
      onClick={() => setIsLocationModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-brand-border"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-greenLight flex items-center justify-center text-brand-green">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-dark leading-tight">Choose Delivery Location</h3>
              <p className="text-xs text-brand-muted">Check organic delivery availability</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-brand-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
              Enter 6-Digit Delivery PIN Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => {
                  setPincodeInput(e.target.value.replace(/\D/g, ''));
                  setVerificationStatus('idle');
                }}
                placeholder="e.g. 122002"
                className="flex-1 px-3.5 py-2.5 border border-brand-border focus:border-brand-green rounded-xl text-sm font-semibold tracking-wide outline-none"
              />
              <button
                type="button"
                onClick={handleVerify}
                className="px-4 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-bold rounded-xl transition-colors"
              >
                Check
              </button>
            </div>

            {/* Status indicator */}
            {verificationStatus === 'serviceable' && (
              <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Great news! We deliver in <strong>{settings.estimatedDeliveryTime}</strong> to this area.</span>
              </div>
            )}
            {verificationStatus === 'unserviceable' && (
              <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Currently out of reach for instant delivery. Pick from serviceable demo zones below:</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
              Locality / Society Name
            </label>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="e.g. DLF Phase 1, Sector 28"
              className="w-full px-3.5 py-2.5 border border-brand-border focus:border-brand-green rounded-xl text-sm outline-none"
            />
          </div>

          {/* Quick Serviceable Hubs */}
          <div>
            <span className="text-xs font-bold text-brand-muted block mb-2">
              Select Demo Serviceable Zones:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {popularZones.map((zone) => (
                <button
                  key={zone.pin}
                  type="button"
                  onClick={() => {
                    setPincodeInput(zone.pin);
                    setAddressInput(zone.name);
                    setVerificationStatus('serviceable');
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    pincodeInput === zone.pin
                      ? 'border-brand-green bg-brand-greenLight text-brand-green font-bold'
                      : 'border-brand-border hover:bg-gray-50 text-brand-dark'
                  }`}
                >
                  <p className="font-semibold truncate">{zone.name}</p>
                  <p className="text-[10px] text-brand-muted">PIN: {zone.pin} • Instant delivery</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-bg border-t border-brand-border flex gap-2">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(false)}
            className="flex-1 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-brand-muted hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};
