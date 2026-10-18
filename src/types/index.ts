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
