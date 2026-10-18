# Gaon Ki Sugandh (गाँव की सुगंध)
### Blinkit-Inspired Organic Grocery Quick-Commerce Demo

> **"Gaon ki shuddhta, har ghar tak."**
> A modern, mobile-first quick-commerce online grocery shopping demonstration for premium Indian cold-pressed oils, stone-milled flours, unpolished pulses, aged basmati rice, Vedic A2 Gir cow ghee, and healthy staples.

---

## 🌟 Key Highlights & Architecture

### 1. Brand Identity & Visual Language
- **Blinkit-Inspired Palette**: Primary Green (`#0C831F`), Deep Green (`#086518`), Vibrant Yellow (`#F8CB46`), Pale Yellow (`#FFFBEA`), and clean high-contrast typography.
- **Animated AI Category Badges**: Custom-crafted interactive animated SVG badges with floating seeds, golden bubbling oil drops, wafting aroma steam, spinning grains, and sparkling star particles for all 8 categories.
- **Realistic White-Background Packshots**: High-fidelity e-commerce studio packshot photography on clean, isolated `#FFFFFF` backgrounds matching every product title (bottles, jars, and stand-up pouches).
- **Mobile-First UX**: Compact quick-commerce cards, sticky bottom cart pill (`[2 items • ₹499] [View Cart ➔]`), category navigation strip, and bottom navigation bar.
- **22+ Realistic Organic Products**: Complete catalogue of cold-pressed oils (Mustard, Groundnut, Sesame, Coconut), stone-ground flours (Sharbati Wheat, Multigrain, Besan), unpolished dals (Toor, Moong, Masoor, Chana), aged Himalayan Basmati rice, A2 Gir cow bilona ghee, and chemical-free desi jaggery.
- **Dynamic Variant Selector**: Pack sizes (e.g. 500ml / 1L / 5L or 1kg / 5kg) selectable directly from product cards or details modal.

---

### 2. Live Inventory & Synchronized State Engine
- **Core Demonstration Feature**: When a customer places a demo order, inventory stock immediately decrements across all matching product variants.
- **Stock Movement Audit Trail**: Every stock change (initial seed, order deduction, order cancellation restock, manual adjustment) is recorded in an immutable chronological audit trail in the Admin Panel.
- **Order Cancellation Restock**: Cancelling an order in Super Admin automatically restores the exact quantities back to available inventory without duplicate restorations.
- **Zero Real Backend Required**: Completely persistent using browser `localStorage`. Includes a one-click **"Reset Demo Data"** action to return to the pristine initial state anytime.

---

### 3. Multi-Step Demo Checkout & Order Fulfillment
- **Step 1**: Customer Contact Info (Name, Phone number, Email)
- **Step 2**: Delivery Address with instant 6-digit PIN code serviceability validation (against editable serviceable zones in Store Settings)
- **Step 3**: Demo Payment Mode (Simulated Google Pay / PhonePe UPI QR code, Simulated Credit/Debit Card, and Cash on Delivery)
- **Step 4**: Review Order & Bill Summary
- **Step 5**: Festive confetti celebration, unique Order ID generation (e.g., `#GKS-91042`), and direct link to live tracking.

---

### 4. Real-Time Order Tracking Timeline
- Dynamic step-by-step progress timeline:
  1. **Order Placed**
  2. **Confirmed**
  3. **Packing & Quality Check**
  4. **Ready for Dispatch**
  5. **Out for Delivery**
  6. **Delivered** *(or Cancelled)*
- When an admin updates an order's status in the Super Admin dashboard, the customer's tracking screen reflects the change instantly!
- Includes assigned delivery partner details (`Ramesh Kumar 🛵 9876543210`).

---

### 5. Super Admin Dashboard (`/admin` or Toggle in Header)
1. **Performance Dashboard**: Real-time KPI tiles (Today's Sales ₹, Today's Orders, Lifetime Orders, Active Products, Low-Stock Alerts, Best Sellers).
2. **Order Management**: Filter by status, search by customer/order ID, live status changer dropdown, printable tax invoice modal, order cancellation with auto-restock.
3. **Product Catalogue Management & Quick Rename**: Add new products, edit titles/descriptions/images/variants, toggle featured or visibility in store, delete with confirmation. Includes a 3-way Product Renaming system (inline row edit with 1-click Save/Cancel, dedicated Rename modal with Hindi subtitle support, and full edit modal).
4. **Inventory Engine**: Quick adjusters (`-1`, `+1`, `+5`, `+10`), set exact quantity modal, low-stock warning banners, bulk restock action, and chronological movement logs.
5. **Coupons Engine**: Create discount codes (`SUGANDH50`, `ORGANIC100`, `SHUDDHA20`, `FIRSTFREE`), set minimum cart thresholds, and activate/deactivate.
6. **WhatsApp Notification Simulator**: WhatsApp-style chat interface displaying transactional order receipts, formatted with bold text and emojis, with a one-click *"Open in WhatsApp"* action via `wa.me`.
7. **Store Settings**: Editable store name, tagline, address, delivery fee, free delivery threshold, serviceable PIN codes list, and homepage promotional banner copy.

---

## 🚀 How to Run Locally

### 1. Navigate to the project directory
```bash
cd "C:\Users\ujjwa\.gemini\antigravity\scratch\gaon-ki-sugandh"
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Open in Browser
Visit: `http://localhost:5173/` (or port assigned by Vite)
- Toggle to **Super Admin** anytime using the top bar badge or the bottom navigation.
- Toggle back to **Customer Storefront** using the top yellow button in Admin.
