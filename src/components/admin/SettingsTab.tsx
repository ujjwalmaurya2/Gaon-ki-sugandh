import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';
import { Save, Store, Truck, Bell, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [pincodesString, setPincodesString] = useState(settings.serviceablePincodes.join(', '));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse PIN codes
    const parsedPins = pincodesString
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    updateSettings({
      ...form,
      serviceablePincodes: parsedPins,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
            Store & Business Settings
          </h2>
          <p className="text-xs text-brand-muted">
            Configure delivery charges, thresholds, promotional banner copy, and serviceable PIN codes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-black rounded-xl shadow-blinkit flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Section 1: Brand & Identity */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2.5">
            <Store className="w-4 h-4 text-brand-green" />
            <h3 className="text-sm font-black text-brand-dark">Brand & Store Identity</h3>
          </div>

          <div>
            <label className="block font-bold text-brand-dark mb-1">Store Name</label>
            <input
              type="text"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-dark mb-1">Brand Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-dark mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-dark mb-1">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-dark mb-1">Depot Sourcing Address</label>
            <input
              type="text"
              value={form.storeAddress}
              onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
              className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-dark mb-1">Operating Hours</label>
            <input
              type="text"
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
            />
          </div>
        </div>

        {/* Section 2: Delivery & Pricing Parameters */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2.5">
            <Truck className="w-4 h-4 text-brand-green" />
            <h3 className="text-sm font-black text-brand-dark">Fulfillment & Charges</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-dark mb-1">Delivery Charge (₹)</label>
              <input
                type="number"
                min={0}
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-green outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-dark mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                min={0}
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-green outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-dark mb-1">Handling Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={form.handlingFee}
                onChange={(e) => setForm({ ...form, handlingFee: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-dark mb-1">Estimated Delivery Time Tag</label>
              <input
                type="text"
                value={form.estimatedDeliveryTime}
                onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-dark mb-1">
              Serviceable PIN Codes (Comma-separated)
            </label>
            <textarea
              rows={3}
              value={pincodesString}
              onChange={(e) => setPincodesString(e.target.value)}
              placeholder="122001, 122002, 122018, 110001, 110016, 201301"
              className="w-full px-3 py-2 border border-brand-border rounded-xl font-mono text-[11px] outline-none focus:border-brand-green"
            />
            <p className="text-[10px] text-brand-muted mt-1">
              Customers typing any of these PIN codes will pass validation during checkout and location selection.
            </p>
          </div>
        </div>

        {/* Section 3: Homepage Promotional Banner */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-brand-border space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2.5">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <h3 className="text-sm font-black text-brand-dark">Homepage Promotional Banner & Offer</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-dark mb-1">Banner Headline</label>
              <input
                type="text"
                value={form.promoBannerText}
                onChange={(e) => setForm({ ...form, promoBannerText: e.target.value })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-dark mb-1">Banner Discount Badge</label>
              <input
                type="text"
                value={form.promoBannerDiscount}
                onChange={(e) => setForm({ ...form, promoBannerDiscount: e.target.value })}
                placeholder="UP TO 35% OFF"
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold text-brand-green outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-dark mb-1">Subtext / Marketing Copy</label>
              <input
                type="text"
                value={form.promoBannerSubtext}
                onChange={(e) => setForm({ ...form, promoBannerSubtext: e.target.value })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-dark mb-1">Linked Promo Coupon Code</label>
              <input
                type="text"
                value={form.promoBannerCode}
                onChange={(e) => setForm({ ...form, promoBannerCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-brand-border rounded-xl font-bold uppercase text-brand-green outline-none focus:border-brand-green"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
