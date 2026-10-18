import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DashboardTab } from './DashboardTab';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { InventoryTab } from './InventoryTab';
import { CouponsTab } from './CouponsTab';
import { WhatsAppTab } from './WhatsAppTab';
import { SettingsTab } from './SettingsTab';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Boxes, 
  Tag, 
  MessageSquare, 
  Settings, 
  ArrowLeft, 
  RotateCcw, 
  Menu, 
  X,
  ShieldCheck,
  Store,
  Sparkles
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { setActiveView, resetAllDemoData, settings, orders, products } = useStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Count low stock for badge
  const lowStockCount = products.reduce((count, p) => {
    return p.variants.some((v) => v.stock <= p.lowStockThreshold) ? count + 1 : count;
  }, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: orders.length > 0 ? orders.length : undefined
    },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: <Boxes className="w-4 h-4" />,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    { id: 'coupons', label: 'Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp Bot', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo products, inventory, orders, and coupons to their default initial state?')) {
      resetAllDemoData();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col antialiased">
      {/* Admin Top Bar */}
      <header className="bg-brand-green text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-brand-greenDark shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-yellow text-brand-dark flex items-center justify-center font-black text-sm shadow-xs">
              🌿
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                <span>{settings.storeName}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.2 bg-brand-yellow text-brand-dark rounded">
                  Super Admin
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Reset Demo Data button */}
          <button
            onClick={handleResetData}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reset all demo data to default clean seed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>

          {/* Return to Customer Store */}
          <button
            onClick={() => setActiveView('store')}
            className="px-3.5 py-1.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Store className="w-4 h-4" />
            <span>View Customer Store</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 space-y-1">
          <div className="p-3 bg-white rounded-2xl border border-brand-border space-y-1 shadow-xs">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase text-brand-muted tracking-wider">
              Management
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-green text-white shadow-blinkit'
                      : 'text-brand-dark hover:bg-brand-bg hover:text-brand-green'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-greenLight text-brand-green')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Demo Info Card */}
          <div className="p-4 bg-brand-yellowPale rounded-2xl border border-brand-yellow/50 mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-brand-dark font-black">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Browser-Local Demo</span>
            </div>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              All inventory decrements, order statuses, product changes, and coupons persist in your browser's localStorage.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-xs flex">
            <div className="w-64 bg-white h-full p-4 space-y-2 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-3">
                  <span className="font-black text-brand-dark text-sm">Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-brand-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.id
                          ? 'bg-brand-green text-white'
                          : 'text-brand-dark hover:bg-brand-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-brand-yellow text-brand-dark">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border">
                <button
                  onClick={() => {
                    setActiveView('store');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-brand-yellow text-brand-dark text-xs font-black rounded-xl text-center"
                >
                  View Storefront
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Tab View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardTab onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'coupons' && <CouponsTab />}
          {activeTab === 'whatsapp' && <WhatsAppTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};
