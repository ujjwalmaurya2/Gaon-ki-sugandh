export type CategoryId = 
  | 'oils'
  | 'atta'
  | 'dal'
  | 'rice'
  | 'spices'
  | 'essentials'
  | 'dairy';

export interface Category {
  id: CategoryId;
  name: string;
  hindiName: string;
  icon: string;
  image: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "500 ml", "1 L", "5 L", "1 kg", "5 kg"
  sku: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
  discountPercent?: number; // Configured manual discount % (e.g. 50, 30, 10)
  showDiscountBadge?: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: CategoryId;
  description: string;
  longDescription?: string;
  origin: string; // e.g., "Bundelkhand, MP" or "Bikaner, Rajasthan"
  image: string;
  variants: ProductVariant[];
  selectedVariantId?: string;
  isFeatured: boolean;
  isAvailable: boolean;
  lowStockThreshold: number;
  rating: number;
  ratingCount: number;
  shelfLife?: string;
  storageInfo?: string;
  tags?: string[];
}

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  image: string;
  sellingPrice: number;
  mrp: number;
  quantity: number;
  maxStock: number;
  sku: string;
  category: CategoryId;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Dispatch'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Other';
}

export type PaymentMethod = 'Demo UPI' | 'Demo Card' | 'Cash on Delivery';

export interface Order {
  id: string; // e.g. "GKS-82914"
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  couponDiscount: number;
  couponCode?: string;
  totalAmount: number;
  totalSavings: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid (Demo)' | 'Pending COD' | 'Refunded (Demo)';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  deliveryEstimateMinutes: number;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  notes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

export interface InventoryMovementLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  change: number; // +10 or -2
  resultingStock: number;
  reason: 'Initial Seed' | 'Demo Order Deduction' | 'Order Cancellation Restock' | 'Manual Adjustment' | 'Bulk Restock';
  referenceId?: string; // Order ID if applicable
}

export interface WhatsAppNotification {
  id: string;
  timestamp: string;
  orderId: string;
  customerPhone: string;
  customerName: string;
  totalAmount: number;
  messageText: string;
  isSimulatedDelivered: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  contactNumber: string;
  supportEmail: string;
  storeAddress: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  handlingFee: number;
  minimumOrderValue: number;
  serviceablePincodes: string[]; // e.g. ["110001", "122001", "122002", "122018", "201301", "560001", "400001"]
  estimatedDeliveryTime: string; // e.g. "12-15 Mins"
  currencySymbol: string;
  promoBannerText: string;
  promoBannerSubtext: string;
  promoBannerDiscount: string;
  promoBannerCode: string;
  demoWhatsAppNumber: string;
}

export interface OfflineSaleItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sellingPrice: number;
  unitPrice: number;
  totalPrice?: number;
  mrp: number;
  quantity: number;
  image?: string;
  category?: CategoryId;
}

export interface OfflineSale {
  id: string; // e.g. "POS-8421"
  createdAt: string; // ISO string
  customerName: string; // "Walk-in Customer" or entered name
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
  items: OfflineSaleItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'UPI / QR (Online)' | 'Cash' | 'Card' | string;
  paymentStatus: 'Paid (Simulated)' | 'Pending';
  orderSource: 'Offline / POS';
  referenceId?: string; // Simulated UPI ref e.g. "UPI-DEMO-94812"
}

export interface BumperOffer {
  id: string; // e.g. "OFFER-01"
  title: string;
  subtitle?: string;
  description?: string;
  bannerImage?: string;
  bannerGradient?: string;
  offerType: 'percentage' | 'fixed' | 'special_price' | 'percent' | 'flat' | 'bogo' | 'bundle';
  discountValue: number; // e.g. 25 (%) or 100 (₹)
  minCartValue?: number;
  minOrderValue?: number;
  applicableProductIds?: string[];
  applicableCategories?: (CategoryId | 'all')[];
  startDate: string; // ISO date string or YYYY-MM-DD
  endDate: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'inactive';
  badgeText: string; // e.g. "BUMPER OFFER", "LIMITED TIME DEAL"
  ctaLabel: string; // e.g. "Shop Offer"
  targetCategory?: CategoryId | 'all';
  isSpotlight?: boolean;
}

