import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveView } = useStore();

  return (
    <footer className="bg-white border-t border-brand-border pt-10 pb-20 sm:pb-12 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-brand-border">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-brand-yellow font-black">
                🌿
              </div>
              <span className="text-xl font-black text-brand-green">Gaon Ki Sugandh</span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              "{settings.tagline}"
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              Bringing traditional Indian cold-pressed oils, unpolished dals, stone-milled flours, and farm-fresh organic essentials directly to your kitchen.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setActiveView('admin')}
                className="text-[11px] font-bold text-brand-green hover:underline flex items-center gap-1"
              >
                ⚙️ Switch to Super Admin Dashboard
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li className="hover:text-brand-green cursor-pointer">Cold-Pressed Oils (कच्ची घानी)</li>
              <li className="hover:text-brand-green cursor-pointer">Stone-Ground Chakki Atta</li>
              <li className="hover:text-brand-green cursor-pointer">Unpolished Indigenous Dals</li>
              <li className="hover:text-brand-green cursor-pointer">Aged Himalayan Basmati Rice</li>
              <li className="hover:text-brand-green cursor-pointer">A2 Vedic Gir Cow Ghee</li>
              <li className="hover:text-brand-green cursor-pointer">Chemical-Free Desi Jaggery</li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-3">
              Store & Delivery Details
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-muted">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <span>{settings.openingHours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <span>{settings.contactNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <span>{settings.supportEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.storeAddress}</span>
              </li>
            </ul>
          </div>

          {/* Guarantees & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-3">
              Policies & Help
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li className="hover:text-brand-green cursor-pointer">Instant Replacement Guarantee</li>
              <li className="hover:text-brand-green cursor-pointer">Fast Doorstep Delivery Promise</li>
              <li className="hover:text-brand-green cursor-pointer">Terms of Service & Privacy</li>
              <li className="hover:text-brand-green cursor-pointer">Farmer Sourcing Clusters</li>
              <li className="hover:text-brand-green cursor-pointer">Quality Lab Testing Reports</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-muted gap-2 text-center sm:text-left">
          <p>© 2026 Gaon Ki Sugandh. All rights reserved. Built with pride for pure Indian groceries.</p>
          <div className="flex items-center gap-2 bg-brand-yellowPale px-3 py-1 rounded-full border border-brand-yellow/50 text-[10px] text-brand-dark font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>Interactive Client Demo • No real payment processed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
