import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  CustomerDetails, 
  PaymentMethod, 
  Coupon, 
  StoreSettings, 
  InventoryMovementLog, 
  WhatsAppNotification,
  CategoryId
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_COUPONS, 
  INITIAL_SETTINGS, 
  INITIAL_ORDERS 
} from '../data/mockData';
import { 
  parseNavFromQuery, 
  serializeNavToQuery, 
  NavigationParams 
} from '../utils/navigation';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation
  navigateBack: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  renameProduct: (productId: string, newName: string, newHindiName?: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variantId?: string, qty?: number) => boolean;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => boolean;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartMrpTotal: number;
  cartSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (customer: CustomerDetails, paymentMethod: PaymentMethod) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, shouldRestock?: boolean) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Inventory
  inventoryLogs: InventoryMovementLog[];
  adjustStock: (productId: string, variantId: string, change: number, reason: InventoryMovementLog['reason']) => void;
  setExactStock: (productId: string, variantId: string, exactStock: number) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // WhatsApp Notifications
  notifications: WhatsAppNotification[];

  // Delivery & Location
  deliveryLocation: { address: string; pincode: string };
  setDeliveryLocation: (loc: { address: string; pincode: string }) => void;
  isPincodeServiceable: (pincode: string) => boolean;

  // UI state
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  proceedToCheckout: () => void;
  completeOrderAndTrack: (orderId: string) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;

  // System
  resetAllDemoData: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'gks_products_v1',
  CART: 'gks_cart_v1',
  ORDERS: 'gks_orders_v1',
  INVENTORY_LOGS: 'gks_inv_logs_v1',
  COUPONS: 'gks_coupons_v1',
  SETTINGS: 'gks_settings_v1',
  NOTIFICATIONS: 'gks_notifs_v1',
  LOCATION: 'gks_location_v1',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      // Migrate images if any product still points to unsplash or external url
      return parsed.map((p) => {
        const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === p.id);
        if (initialMatch && (p.image.includes('unsplash.com') || !p.image.startsWith('/products/'))) {
          return {
            ...p,
            image: initialMatch.image,
            hindiName: p.hindiName || initialMatch.hindiName,
          };
        }
        return p;
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (!saved) return [];
    try {
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map((c) => {
        const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === c.productId);
        if (initialMatch && (c.image.includes('unsplash.com') || !c.image.startsWith('/products/'))) {
          return { ...c, image: initialMatch.image };
        }
        return c;
      });
    } catch {
      return [];
    }
  });

  // 3. Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 4. Inventory Logs
  const [inventoryLogs, setInventoryLogs] = useState<InventoryMovementLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-seed-1',
        timestamp: new Date().toISOString(),
        productId: 'gks-oil-01',
        productName: 'Kacchi Ghani Mustard Oil (Cold-Pressed)',
        variantName: '1 Litre',
        sku: 'GKS-OIL-MUST-1L',
        change: 42,
        resultingStock: 42,
        reason: 'Initial Seed'
      }
    ];
  });

  // 5. Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 6. Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  // 8. Location
  const [deliveryLocation, setDeliveryLocation] = useState<{ address: string; pincode: string }>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    return saved ? JSON.parse(saved) : { address: 'DLF Phase 1, Sector 28', pincode: '122002' };
  });

  // 9. Navigation & Modals UI state (initialized synchronously from URL query parameters)
  const initialNav = useRef(parseNavFromQuery(window.location.search)).current;

  const [activeView, setActiveViewState] = useState<'store' | 'admin'>(initialNav.view);
  const [selectedCategory, setSelectedCategoryState] = useState<CategoryId | 'all'>(initialNav.category);
  const [searchQuery, setSearchQueryState] = useState(initialNav.q);
  const [selectedProductForDetail, setSelectedProductForDetailState] = useState<Product | null>(() => {
    if (initialNav.productId) {
      return products.find((p) => p.id === initialNav.productId) || null;
    }
    return null;
  });
  const [isCartOpen, setIsCartOpenState] = useState(initialNav.cart);
  const [isCheckoutOpen, setIsCheckoutOpenState] = useState(initialNav.checkout);
  const [trackingOrderId, setTrackingOrderIdState] = useState<string | null>(initialNav.trackingId);
  const [isLocationModalOpen, setIsLocationModalOpenState] = useState(initialNav.location);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // References to prevent feedback loops and race conditions during popstate
  const isPopNavRef = useRef(false);
  const navIndexRef = useRef(window.history.state?.gks_nav || 0);
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;
  const productsRef = useRef(products);
  productsRef.current = products;
  const cartRef = useRef(cart);
  cartRef.current = cart;

  // Snapshot of current navigation parameters
  const getCurrentParams = useCallback((): NavigationParams => {
    return {
      view: activeView,
      category: selectedCategory,
      q: searchQuery,
      productId: selectedProductForDetail?.id || null,
      cart: isCartOpen,
      checkout: isCheckoutOpen,
      trackingId: trackingOrderId,
      location: isLocationModalOpen,
    };
  }, [
    activeView,
    selectedCategory,
    searchQuery,
    selectedProductForDetail,
    isCartOpen,
    isCheckoutOpen,
    trackingOrderId,
    isLocationModalOpen,
  ]);

  // Initial history stack setup: ensure base Home exists so Back doesn't immediately exit
  useEffect(() => {
    const isSubRoute =
      Boolean(initialNav.productId) ||
      initialNav.cart ||
      initialNav.checkout ||
      Boolean(initialNav.trackingId) ||
      initialNav.location ||
      initialNav.category !== 'all' ||
      Boolean(initialNav.q) ||
      initialNav.view === 'admin';

    if (isSubRoute && (!window.history.state || typeof window.history.state.gks_nav !== 'number')) {
      // Direct landing on sub-route (e.g. WhatsApp product link or page refresh)
      // 1. Establish Home as base history entry (index 0)
      window.history.replaceState(
        { gks_nav: 0, isRoot: true, view: 'store', category: 'all', q: '' },
        '',
        window.location.pathname
      );
      // 2. Push landing state on top (index 1) so pressing Back gracefully returns to Home!
      navIndexRef.current = 1;
      const subUrl = serializeNavToQuery(initialNav);
      window.history.pushState(
        { ...initialNav, gks_nav: 1 },
        '',
        subUrl
      );
    } else if (!window.history.state || typeof window.history.state.gks_nav !== 'number') {
      window.history.replaceState(
        { gks_nav: 0, isRoot: true, ...initialNav },
        '',
        window.location.pathname
      );
    }
  }, []);

  // Popstate event handler for Android Back button, gestures, and browser back/forward
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      isPopNavRef.current = true;
      const params = parseNavFromQuery(window.location.search);
      navIndexRef.current = e.state?.gks_nav || 0;

      setActiveViewState(params.view);
      setSelectedCategoryState(params.category);
      setSearchQueryState(params.q);
      searchQueryRef.current = params.q;

      if (params.productId) {
        const found = productsRef.current.find((p) => p.id === params.productId) || null;
        setSelectedProductForDetailState(found);
      } else {
        setSelectedProductForDetailState(null);
      }

      if (params.cart && cartRef.current.length === 0) {
        setIsCartOpenState(false);
      } else {
        setIsCartOpenState(params.cart);
      }
      setIsCheckoutOpenState(params.checkout);
      setTrackingOrderIdState(params.trackingId);
      setIsLocationModalOpenState(params.location);

      // Restore scroll position if saved
      if (
        e.state?.scrollY !== undefined &&
        !params.productId &&
        !params.cart &&
        !params.checkout
      ) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: e.state.scrollY, behavior: 'instant' });
        });
      }

      setTimeout(() => {
        isPopNavRef.current = false;
      }, 50);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Desktop Escape key support to dismiss open drawers/modals via browser history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (
          isCartOpen ||
          selectedProductForDetail ||
          isCheckoutOpen ||
          trackingOrderId ||
          isLocationModalOpen
        ) {
          e.preventDefault();
          window.history.back();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCartOpen,
    selectedProductForDetail,
    isCheckoutOpen,
    trackingOrderId,
    isLocationModalOpen,
  ]);

  // Synchronized navigation setters
  const setSelectedProductForDetail = useCallback((product: Product | null) => {
    if (isPopNavRef.current) {
      setSelectedProductForDetailState(product);
      return;
    }

    if (product) {
      setSelectedProductForDetailState(product);
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        productId: product.id,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current, scrollY: window.scrollY },
        '',
        serializeNavToQuery(nextParams)
      );
    } else {
      setSelectedProductForDetailState(null);
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('product')) {
        if (navIndexRef.current > 0) {
          window.history.back();
        } else {
          const nextParams: NavigationParams = { ...getCurrentParams(), productId: null };
          window.history.replaceState(
            { ...nextParams, gks_nav: 0 },
            '',
            serializeNavToQuery(nextParams)
          );
        }
      }
    }
  }, [getCurrentParams]);

  const setIsCartOpen = useCallback((open: boolean) => {
    if (isPopNavRef.current) {
      setIsCartOpenState(open);
      return;
    }

    if (open) {
      setIsCartOpenState(true);
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        cart: true,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current, scrollY: window.scrollY },
        '',
        serializeNavToQuery(nextParams)
      );
    } else {
      setIsCartOpenState(false);
      const sp = new URLSearchParams(window.location.search);
      // Safety: Only pop history if cart query exists AND we are not transitioning to checkout or tracking
      if (sp.has('cart') && !sp.has('checkout') && !sp.has('tracking')) {
        if (navIndexRef.current > 0) {
          window.history.back();
        } else {
          const nextParams: NavigationParams = { ...getCurrentParams(), cart: false };
          window.history.replaceState(
            { ...nextParams, gks_nav: 0 },
            '',
            serializeNavToQuery(nextParams)
          );
        }
      }
    }
  }, [getCurrentParams]);

  const setIsCheckoutOpen = useCallback((open: boolean) => {
    if (isPopNavRef.current) {
      setIsCheckoutOpenState(open);
      return;
    }

    if (open) {
      setIsCartOpenState(false);
      setIsCheckoutOpenState(true);
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        cart: false,
        checkout: true,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current },
        '',
        serializeNavToQuery(nextParams)
      );
    } else {
      setIsCheckoutOpenState(false);
      const sp = new URLSearchParams(window.location.search);
      // Safety: Only pop history if checkout query exists AND we are not transitioning to tracking
      if (sp.has('checkout') && !sp.has('tracking')) {
        if (navIndexRef.current > 0) {
          window.history.back();
        } else {
          const nextParams: NavigationParams = { ...getCurrentParams(), checkout: false };
          window.history.replaceState(
            { ...nextParams, gks_nav: 0 },
            '',
            serializeNavToQuery(nextParams)
          );
        }
      }
    }
  }, [getCurrentParams]);

  // Direct, atomic transition from Cart to Checkout without history.back() race conditions
  const proceedToCheckout = useCallback(() => {
    if (isPopNavRef.current) {
      setIsCartOpenState(false);
      setIsCheckoutOpenState(true);
      return;
    }

    setIsCartOpenState(false);
    setIsCheckoutOpenState(true);
    const nextParams: NavigationParams = {
      ...getCurrentParams(),
      cart: false,
      checkout: true,
    };
    navIndexRef.current += 1;
    window.history.pushState(
      { ...nextParams, gks_nav: navIndexRef.current },
      '',
      serializeNavToQuery(nextParams)
    );
  }, [getCurrentParams]);

  // Direct, atomic transition from Checkout to Live Order Tracking
  const completeOrderAndTrack = useCallback((orderId: string) => {
    if (isPopNavRef.current) {
      setIsCheckoutOpenState(false);
      setIsCartOpenState(false);
      setTrackingOrderIdState(orderId);
      return;
    }

    setIsCheckoutOpenState(false);
    setIsCartOpenState(false);
    setTrackingOrderIdState(orderId);
    const nextParams: NavigationParams = {
      ...getCurrentParams(),
      cart: false,
      checkout: false,
      trackingId: orderId,
    };
    navIndexRef.current = 0;
    window.history.replaceState(
      { ...nextParams, gks_nav: 0 },
      '',
      serializeNavToQuery(nextParams)
    );
  }, [getCurrentParams]);

  const setTrackingOrderId = useCallback((orderId: string | null) => {
    if (isPopNavRef.current) {
      setTrackingOrderIdState(orderId);
      return;
    }

    if (orderId) {
      setIsCheckoutOpenState(false);
      setIsCartOpenState(false);
      setTrackingOrderIdState(orderId);
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        cart: false,
        checkout: false,
        trackingId: orderId,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current },
        '',
        serializeNavToQuery(nextParams)
      );
    } else {
      setTrackingOrderIdState(null);
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('tracking')) {
        if (navIndexRef.current > 0) {
          window.history.back();
        } else {
          const nextParams: NavigationParams = { ...getCurrentParams(), trackingId: null };
          window.history.replaceState(
            { ...nextParams, gks_nav: 0 },
            '',
            serializeNavToQuery(nextParams)
          );
        }
      }
    }
  }, [getCurrentParams]);

  const setIsLocationModalOpen = useCallback((open: boolean) => {
    if (isPopNavRef.current) {
      setIsLocationModalOpenState(open);
      return;
    }

    if (open) {
      setIsLocationModalOpenState(true);
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        location: true,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current },
        '',
        serializeNavToQuery(nextParams)
      );
    } else {
      setIsLocationModalOpenState(false);
      const sp = new URLSearchParams(window.location.search);
      if (sp.has('location')) {
        if (navIndexRef.current > 0) {
          window.history.back();
        } else {
          const nextParams: NavigationParams = { ...getCurrentParams(), location: false };
          window.history.replaceState(
            { ...nextParams, gks_nav: 0 },
            '',
            serializeNavToQuery(nextParams)
          );
        }
      }
    }
  }, [getCurrentParams]);

  const setSelectedCategory = useCallback((category: CategoryId | 'all') => {
    if (isPopNavRef.current) {
      setSelectedCategoryState(category);
      return;
    }

    if (category === selectedCategory) return;

    setSelectedCategoryState(category);
    setSelectedProductForDetailState(null);
    setSearchQueryState('');
    searchQueryRef.current = '';

    const nextParams: NavigationParams = {
      ...getCurrentParams(),
      category,
      q: '',
      productId: null,
      view: 'store',
    };
    navIndexRef.current += 1;
    window.history.pushState(
      { ...nextParams, gks_nav: navIndexRef.current, scrollY: window.scrollY },
      '',
      serializeNavToQuery(nextParams)
    );
  }, [selectedCategory, getCurrentParams]);

  const setSearchQuery = useCallback((query: string) => {
    if (isPopNavRef.current) {
      setSearchQueryState(query);
      return;
    }

    const prevQuery = searchQueryRef.current;
    setSearchQueryState(query);
    searchQueryRef.current = query;

    const trimmed = query.trim();
    const prevTrimmed = prevQuery.trim();

    if (!prevTrimmed && trimmed) {
      // First keystroke starting a search: push history
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        q: query,
        productId: null,
      };
      navIndexRef.current += 1;
      window.history.pushState(
        { ...nextParams, gks_nav: navIndexRef.current, scrollY: window.scrollY },
        '',
        serializeNavToQuery(nextParams)
      );
    } else if (trimmed) {
      // Continuous typing: replace history state to avoid clutter
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        q: query,
      };
      window.history.replaceState(
        { ...nextParams, gks_nav: navIndexRef.current },
        '',
        serializeNavToQuery(nextParams)
      );
    } else if (!trimmed && prevTrimmed) {
      // Cleared search query
      const nextParams: NavigationParams = {
        ...getCurrentParams(),
        q: '',
      };
      window.history.replaceState(
        { ...nextParams, gks_nav: navIndexRef.current },
        '',
        serializeNavToQuery(nextParams)
      );
    }
  }, [getCurrentParams]);

  const setActiveView = useCallback((view: 'store' | 'admin') => {
    if (isPopNavRef.current) {
      setActiveViewState(view);
      return;
    }

    if (view === activeView) return;

    setActiveViewState(view);
    const nextParams: NavigationParams = {
      ...getCurrentParams(),
      view,
      cart: false,
      checkout: false,
      trackingId: null,
      location: false,
    };
    navIndexRef.current += 1;
    window.history.pushState(
      { ...nextParams, gks_nav: navIndexRef.current, scrollY: window.scrollY },
      '',
      serializeNavToQuery(nextParams)
    );
  }, [activeView, getCurrentParams]);

  const navigateBack = useCallback(() => {
    if (window.history.length > 1 && navIndexRef.current > 0) {
      window.history.back();
    } else {
      // Fallback directly to Home
      setActiveViewState('store');
      setSelectedCategoryState('all');
      setSearchQueryState('');
      searchQueryRef.current = '';
      setSelectedProductForDetailState(null);
      setIsCartOpenState(false);
      setIsCheckoutOpenState(false);
      setTrackingOrderIdState(null);
      setIsLocationModalOpenState(false);
      navIndexRef.current = 0;
      window.history.replaceState(
        { gks_nav: 0, isRoot: true, view: 'store', category: 'all', q: '' },
        '',
        window.location.pathname
      );
    }
  }, []);

  // 10. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  // Product helpers
  const getProductById = (id: string) => products.find((p) => p.id === id);

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = `gks-custom-${Date.now().toString().slice(-5)}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}"`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.name}"`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const existing = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // also remove from cart
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    showToast(`Removed "${existing?.name || 'product'}"`, 'info');
  };

  const renameProduct = (productId: string, newName: string, newHindiName?: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      showToast('Product name cannot be empty', 'warning');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          name: trimmed,
          hindiName: newHindiName !== undefined ? newHindiName.trim() : p.hindiName,
        };
      })
    );

    // Also update any cart items
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        return { ...item, productName: trimmed };
      })
    );

    showToast(`Product renamed to "${trimmed}"`, 'success');
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const cartSavings = Math.max(0, cartMrpTotal - cartTotal);

  // Cart Actions
  const addToCart = (product: Product, variantId?: string, qty: number = 1): boolean => {
    const variant = variantId 
      ? product.variants.find((v) => v.id === variantId) || product.variants[0]
      : product.variants[0];

    if (!variant) return false;

    if (variant.stock <= 0) {
      showToast(`Sorry, ${product.name} (${variant.name}) is out of stock!`, 'warning');
      return false;
    }

    let isAdded = false;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty + qty > variant.stock) {
          showToast(`Only ${variant.stock} available in stock!`, 'warning');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + qty,
          maxStock: variant.stock,
        };
        isAdded = true;
        return updated;
      } else {
        if (qty > variant.stock) {
          showToast(`Only ${variant.stock} available in stock!`, 'warning');
          return prev;
        }
        isAdded = true;
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            variantName: variant.name,
            image: product.image,
            sellingPrice: variant.sellingPrice,
            mrp: variant.mrp,
            quantity: qty,
            maxStock: variant.stock,
            sku: variant.sku,
            category: product.category,
          },
        ];
      }
    });

    if (isAdded) {
      showToast(`Added ${product.name} (${variant.name}) to cart`, 'success');
    }
    return isAdded;
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return true;
    }

    // check current stock from products
    const prod = products.find((p) => p.id === productId);
    const variant = prod?.variants.find((v) => v.id === variantId);
    const availableStock = variant ? variant.stock : 999;

    if (quantity > availableStock) {
      showToast(`Max available stock is ${availableStock}`, 'warning');
      return false;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity, maxStock: availableStock };
        }
        return item;
      })
    );
    return true;
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This coupon has expired or is inactive' };
    }
    if (cartTotal < found.minOrderValue) {
      return {
        success: false,
        message: `Add ₹${found.minOrderValue - cartTotal} more to apply ${found.code}`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return { success: true, message: `Applied ${found.code}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Created coupon ${newCoupon.code}`, 'success');
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Inventory Management
  const adjustStock = (
    productId: string, 
    variantId: string, 
    change: number, 
    reason: InventoryMovementLog['reason']
  ) => {
    let resultingStock = 0;
    let prodName = '';
    let varName = '';
    let skuCode = '';

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        prodName = p.name;
        const updatedVariants = p.variants.map((v) => {
          if (v.id !== variantId) return v;
          varName = v.name;
          skuCode = v.sku;
          const nextStock = Math.max(0, v.stock + change);
          resultingStock = nextStock;
          return { ...v, stock: nextStock };
        });
        return { ...p, variants: updatedVariants };
      })
    );

    // Record movement log
    const logItem: InventoryMovementLog = {
      id: 'log-' + Date.now().toString() + Math.random().toString(36).substring(2, 4),
      timestamp: new Date().toISOString(),
      productId,
      productName: prodName,
      variantName: varName,
      sku: skuCode,
      change,
      resultingStock,
      reason,
    };

    setInventoryLogs((prev) => [logItem, ...prev]);
    showToast(`Inventory updated: ${varName} is now ${resultingStock}`, 'info');
  };

  const setExactStock = (productId: string, variantId: string, exactStock: number) => {
    const nonNegative = Math.max(0, exactStock);
    let diff = 0;
    let prodName = '';
    let varName = '';
    let skuCode = '';

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        prodName = p.name;
        const updatedVariants = p.variants.map((v) => {
          if (v.id !== variantId) return v;
          diff = nonNegative - v.stock;
          varName = v.name;
          skuCode = v.sku;
          return { ...v, stock: nonNegative };
        });
        return { ...p, variants: updatedVariants };
      })
    );

    const logItem: InventoryMovementLog = {
      id: 'log-' + Date.now().toString(),
      timestamp: new Date().toISOString(),
      productId,
      productName: prodName,
      variantName: varName,
      sku: skuCode,
      change: diff,
      resultingStock: nonNegative,
      reason: 'Manual Adjustment',
    };

    setInventoryLogs((prev) => [logItem, ...prev]);
    showToast(`Stock updated to ${nonNegative}`, 'success');
  };

  // Order Placement (DEMO)
  const createOrder = (
    customer: CustomerDetails, 
    paymentMethod: PaymentMethod
  ): Order | null => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return null;
    }

    // Calculate fees
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

    const totalAmount = Math.max(0, cartTotal + deliveryFee + handlingFee - couponDiscount);
    const totalSavings = cartSavings + couponDiscount + (cartTotal >= settings.freeDeliveryThreshold ? settings.deliveryFee : 0);

    const orderId = `GKS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      itemTotal: cartTotal,
      deliveryFee,
      handlingFee,
      couponDiscount,
      couponCode: appliedCoupon?.code,
      totalAmount,
      totalSavings,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Paid (Demo)',
      status: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Demo order placed via ${paymentMethod}`,
        },
      ],
      deliveryEstimateMinutes: 14,
      deliveryPartner: {
        name: 'Ramesh Kumar',
        phone: '+91 98765 11223',
        vehicleNumber: 'HR-26-EQ-4491',
      },
    };

    // 1. Decrement Stock from Product catalogue and log movement
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItemsForProd = cart.filter((c) => c.productId === prod.id);
        if (cartItemsForProd.length === 0) return prod;

        const updatedVariants = prod.variants.map((v) => {
          const match = cartItemsForProd.find((c) => c.variantId === v.id);
          if (!match) return v;
          const newStock = Math.max(0, v.stock - match.quantity);

          // Add to inventory movement logs
          const logItem: InventoryMovementLog = {
            id: 'log-' + Date.now().toString() + Math.random().toString(36).substring(2, 4),
            timestamp: new Date().toISOString(),
            productId: prod.id,
            productName: prod.name,
            variantName: v.name,
            sku: v.sku,
            change: -match.quantity,
            resultingStock: newStock,
            reason: 'Demo Order Deduction',
            referenceId: orderId,
          };
          setInventoryLogs((logs) => [logItem, ...logs]);

          return { ...v, stock: newStock };
        });

        return { ...prod, variants: updatedVariants };
      })
    );

    // 2. Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Generate WhatsApp notification record
    const itemsSummary = cart.map((i) => `• ${i.quantity}x ${i.productName} (${i.variantName})`).join('\n');
    const waText = `🌿 *GAON KI SUGANDH — Order Confirmed!*\n\nNamaste ${customer.name} ji,\nYour order *#${orderId}* has been placed successfully!\n\n📦 *Order Items:*\n${itemsSummary}\n\n💰 *Total Amount:* ₹${totalAmount}\n💳 *Payment Mode:* ${paymentMethod} (${paymentMethod === 'Cash on Delivery' ? 'Pay on Delivery' : 'Paid Demo'})\n📍 *Delivery To:* ${customer.addressLine1}, ${customer.city} (${customer.pincode})\n⚡ *Estimated Delivery:* 12-15 Mins\n\n_Gaon ki shuddhta, har ghar tak._\nThank you for choosing Gaon Ki Sugandh!`;

    const newNotif: WhatsAppNotification = {
      id: 'wa-' + Date.now().toString(),
      timestamp: new Date().toISOString(),
      orderId,
      customerPhone: customer.phone,
      customerName: customer.name,
      totalAmount,
      messageText: waText,
      isSimulatedDelivered: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 4. Clear cart and applied coupon
    clearCart();
    setAppliedCoupon(null);
    setLastPlacedOrder(newOrder);

    showToast(`🎉 Order #${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    let orderToCancel: Order | undefined;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
          orderToCancel = order;
        }

        const updatedHistory = [
          ...order.statusHistory,
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status} by Admin`,
          },
        ];

        return {
          ...order,
          status,
          statusHistory: updatedHistory,
          paymentStatus: status === 'Cancelled' && order.paymentStatus === 'Paid (Demo)' ? 'Refunded (Demo)' : order.paymentStatus,
        };
      })
    );

    // If cancelled, restore stock!
    if (status === 'Cancelled' && orderToCancel) {
      orderToCancel.items.forEach((item) => {
        adjustStock(item.productId, item.variantId, item.quantity, 'Order Cancellation Restock');
      });
      showToast(`Order #${orderId} cancelled & stock restored!`, 'info');
    } else {
      showToast(`Order #${orderId} marked as ${status}`, 'success');
    }
  };

  const cancelOrder = (orderId: string, shouldRestock: boolean = true) => {
    updateOrderStatus(orderId, 'Cancelled', shouldRestock ? 'Cancelled by user/admin with inventory restock' : 'Cancelled without restock');
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated', 'success');
  };

  // Serviceable PIN code check
  const isPincodeServiceable = (pincode: string) => {
    const trimmed = pincode.trim();
    return settings.serviceablePincodes.includes(trimmed);
  };

  // Reset demo state
  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.LOCATION);

    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setSettings(INITIAL_SETTINGS);
    setNotifications([]);
    setAppliedCoupon(null);
    setDeliveryLocation({ address: 'DLF Phase 1, Sector 28', pincode: '122002' });
    setInventoryLogs([
      {
        id: 'log-seed-1',
        timestamp: new Date().toISOString(),
        productId: 'gks-oil-01',
        productName: 'Kacchi Ghani Mustard Oil (Cold-Pressed)',
        variantName: '1 Litre',
        sku: 'GKS-OIL-MUST-1L',
        change: 42,
        resultingStock: 42,
        reason: 'Initial Seed'
      }
    ]);
    showToast('✨ All demo data reset to default seed state!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        renameProduct,
        getProductById,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartMrpTotal,
        cartSavings,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        inventoryLogs,
        adjustStock,
        setExactStock,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponActive,
        settings,
        updateSettings,
        notifications,
        deliveryLocation,
        setDeliveryLocation,
        isPincodeServiceable,
        navigateBack,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCheckoutOpen,
        setIsCheckoutOpen,
        proceedToCheckout,
        completeOrderAndTrack,
        trackingOrderId,
        setTrackingOrderId,
        isLocationModalOpen,
        setIsLocationModalOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        toasts,
        showToast,
        resetAllDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
