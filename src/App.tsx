import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FloatingCartBar } from './components/common/FloatingCartBar';
import { CartDrawer } from './components/common/CartDrawer';
import { LocationModal } from './components/common/LocationModal';
import { ToastContainer } from './components/common/Toast';
import { StoreView } from './components/store/StoreView';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { AdminLayout } from './components/admin/AdminLayout';

const MainApp: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-dark">
      <ToastContainer />

      {activeView === 'admin' ? (
        <AdminLayout />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <StoreView />
          </main>
          <FloatingCartBar />
          <BottomNav />
        </>
      )}

      {/* Global Modals */}
      <CartDrawer />
      <LocationModal />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderTrackingModal />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
