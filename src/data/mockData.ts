import { Category, Product, Coupon, StoreSettings, Order } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'oils',
    name: 'Organic Oils',
    hindiName: 'कच्ची घानी तेल',
    icon: 'Droplets',
    image: '/products/mustard-oil.jpg',
    description: 'Cold-pressed in traditional wooden kohlus (lakdi ghani) without heat or chemicals'
  },
  {
    id: 'atta',
    name: 'Atta & Flour',
    hindiName: 'चक्की आटा',
    icon: 'Wheat',
    image: '/products/wheat-atta.jpg',
    description: 'Stone-ground whole grain flour retaining natural wheat germ and bran fibre'
  },
  {
    id: 'dal',
    name: 'Dal & Pulses',
    hindiName: 'दालें और दलहन',
    icon: 'Coins',
    image: '/products/toor-dal.jpg',
    description: 'Unpolished, pesticide-free indigenous pulses rich in natural plant protein'
  },
  {
    id: 'rice',
    name: 'Rice & Grains',
    hindiName: 'चावल और अनाज',
    icon: 'Soup',
    image: '/products/basmati-rice.svg',
    description: 'Aromatic traditional rice varieties, heirloom millets, and unpolished grains'
  },
  {
    id: 'spices',
    name: 'Spices & Masalas',
    hindiName: 'मसाले और जड़ी-बूटी',
    icon: 'Flame',
    image: '/products/turmeric.jpg',
    description: 'Sun-dried, whole and hand-pounded spices packed with natural essential oils'
  },
  {
    id: 'dairy',
    name: 'A2 Cow Ghee & Dairy',
    hindiName: 'देसी गाय घी',
    icon: 'Milk',
    image: '/products/desi-ghee.svg',
    description: 'Bilona churned A2 Gir & Sahiwal cow ghee prepared via traditional Vedic method'
  },
  {
    id: 'essentials',
    name: 'Healthy Essentials',
    hindiName: 'प्राकृतिक मिठास व नमक',
    icon: 'Sparkles',
    image: '/products/wild-honey.svg',
    description: 'Pure chemical-free desi jaggery, raw forest honey, rock salts and seeds'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Cold-Pressed Mustard Oil
  {
    id: 'gks-oil-01',
    name: 'Kacchi Ghani Mustard Oil (Cold-Pressed)',
    hindiName: 'कच्ची घानी सरसों का तेल',
    category: 'oils',
    description: 'Wood-pressed yellow & black mustard seeds. Strong natural pungency, 100% unrefined with natural antioxidants.',
    longDescription: 'Extracted using traditional wooden Kolhu churner at low RPMs (under 40°C), preserving natural pungency, Allyl Isothiocyanate, and Omega-3 fatty acids. No synthetic essence, bleaching, or chemical refining.',
    origin: 'Shekhawati, Rajasthan',
    image: '/products/mustard-oil.jpg',
    variants: [
      { id: 'v-mustard-500ml', name: '500 ml', sku: 'GKS-OIL-MUST-500', sellingPrice: 135, mrp: 165, stock: 24 },
      { id: 'v-mustard-1l', name: '1 Litre', sku: 'GKS-OIL-MUST-1L', sellingPrice: 249, mrp: 299, stock: 42 },
      { id: 'v-mustard-5l', name: '5 Litres Tin', sku: 'GKS-OIL-MUST-5L', sellingPrice: 1199, mrp: 1450, stock: 12 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.9,
    ratingCount: 384,
    shelfLife: '12 Months',
    storageInfo: 'Store in cool, dry place away from direct sunlight.',
    tags: ['Best Seller', 'Cold-Pressed', 'Bawaal Taste']
  },

  // 2. Cold-Pressed Groundnut Oil
  {
    id: 'gks-oil-02',
    name: 'Virgin Groundnut / Peanut Oil (Lakdi Ghani)',
    hindiName: 'लकड़ी घानी मूंगफली तेल',
    category: 'oils',
    description: 'Naturally sweet aroma of roasted peanuts. High smoke point, ideal for everyday deep and shallow frying.',
    longDescription: 'Made from handpicked Saurashtra bold peanuts. Cold-pressed gently without chemical solvents, yielding pure, cholesterol-free cooking oil with natural Vitamin E and heart-healthy phytosterols.',
    origin: 'Junagadh, Gujarat',
    image: '/products/groundnut-oil.jpg',
    variants: [
      { id: 'v-gnd-1l', name: '1 Litre', sku: 'GKS-OIL-GND-1L', sellingPrice: 285, mrp: 340, stock: 35 },
      { id: 'v-gnd-5l', name: '5 Litres Tin', sku: 'GKS-OIL-GND-5L', sellingPrice: 1375, mrp: 1620, stock: 8 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 8,
    rating: 4.8,
    ratingCount: 219,
    shelfLife: '9 Months',
    tags: ['Heart Friendly', 'Zero Cholesterol']
  },

  // 3. Traditional Sesame (Til) Oil
  {
    id: 'gks-oil-03',
    name: 'Cold-Pressed White Sesame Oil (Til Tel)',
    hindiName: 'तिल का तेल (कच्ची घानी)',
    category: 'oils',
    description: 'Rich, earthy nutty flavor. Ideal for traditional tempering, Ayurvedic massage, and winter diets.',
    longDescription: 'Extracted from organically harvested white sesame seeds. Known as the queen of oils in Ayurveda, rich in sesamol antioxidants and calcium support.',
    origin: 'Bundelkhand, Madhya Pradesh',
    image: '/products/sesame-oil.jpg',
    variants: [
      { id: 'v-sesame-500ml', name: '500 ml', sku: 'GKS-OIL-SES-500', sellingPrice: 210, mrp: 260, stock: 18 },
      { id: 'v-sesame-1l', name: '1 Litre', sku: 'GKS-OIL-SES-1L', sellingPrice: 395, mrp: 480, stock: 15 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 5,
    rating: 4.7,
    ratingCount: 94,
    shelfLife: '12 Months',
    tags: ['Ayurvedic', 'Pure Sesame']
  },

  // 4. Cold-Pressed Coconut Oil
  {
    id: 'gks-oil-04',
    name: 'Pure Virgin Coconut Oil (Cold-Pressed)',
    hindiName: 'शुद्ध नारियल तेल',
    category: 'oils',
    description: 'Fresh wet-milled Kerala coconuts. Pure white, heavenly fragrance, edible as well as for hair & skin nourishment.',
    origin: 'Kozhikode, Kerala',
    image: '/products/coconut-oil.jpg',
    variants: [
      { id: 'v-coco-500ml', name: '500 ml Glass Jar', sku: 'GKS-OIL-COCO-500', sellingPrice: 240, mrp: 295, stock: 22 },
      { id: 'v-coco-1l', name: '1 Litre', sku: 'GKS-OIL-COCO-1L', sellingPrice: 450, mrp: 540, stock: 14 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 6,
    rating: 4.9,
    ratingCount: 167,
    shelfLife: '18 Months',
    tags: ['Raw & Virgin', 'Multipurpose']
  },

  // 5. Stone-Ground Sharbati Wheat Atta
  {
    id: 'gks-atta-01',
    name: 'MP Sharbati Whole Wheat Chakki Atta',
    hindiName: 'एमपी शरबती चक्की आटा',
    category: 'atta',
    description: 'Slow stone-ground golden Sharbati wheat. Rotis stay delightfully soft and fluffy for hours without preservatives.',
    longDescription: 'Milled on slow-turning natural stone chakkis so friction heat doesn’t burn the delicate wheat germ nutrients, bran fiber, and B-vitamins. 100% whole grain with zero maida mixing.',
    origin: 'Sehore, Madhya Pradesh',
    image: '/products/wheat-atta.jpg',
    variants: [
      { id: 'v-atta-5kg', name: '5 kg Bag', sku: 'GKS-ATTA-SHAR-5KG', sellingPrice: 285, mrp: 330, stock: 55 },
      { id: 'v-atta-10kg', name: '10 kg Bag', sku: 'GKS-ATTA-SHAR-10KG', sellingPrice: 540, mrp: 640, stock: 30 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 15,
    rating: 4.9,
    ratingCount: 420,
    shelfLife: '3 Months',
    tags: ['Best Seller', 'Stone Ground', 'Zero Maida']
  },

  // 6. Multigrain Diet Atta
  {
    id: 'gks-atta-02',
    name: 'Ancient 9-Grain Vedic Multigrain Atta',
    hindiName: '९-अनाज वैदिक मल्टीग्रेन आटा',
    category: 'atta',
    description: 'Wholesome blend of Sharbati wheat, ragi, jowar, bajra, chana, barley, oats, soya & flax seeds for high fibre & low GI.',
    origin: 'Bhiwani, Haryana',
    image: '/products/multigrain-atta.jpg',
    variants: [
      { id: 'v-multi-2kg', name: '2 kg Pouch', sku: 'GKS-ATTA-MULTI-2KG', sellingPrice: 195, mrp: 240, stock: 26 },
      { id: 'v-multi-5kg', name: '5 kg Bag', sku: 'GKS-ATTA-MULTI-5KG', sellingPrice: 460, mrp: 550, stock: 19 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 8,
    rating: 4.7,
    ratingCount: 135,
    shelfLife: '3 Months',
    tags: ['Diabetic Friendly', 'High Protein']
  },

  // 7. Organic Besan (Gram Flour)
  {
    id: 'gks-atta-03',
    name: 'Stone-Ground Desi Chana Besan',
    hindiName: 'देसी चना शुद्ध बेसन',
    category: 'atta',
    description: 'Ground from 100% unpolished desi brown chana. Super fine aroma, nutty texture, no pea flour adulteration.',
    origin: 'Kota, Rajasthan',
    image: '/products/besan.jpg',
    variants: [
      { id: 'v-besan-500g', name: '500 g', sku: 'GKS-ATTA-BES-500', sellingPrice: 75, mrp: 95, stock: 38 },
      { id: 'v-besan-1kg', name: '1 kg', sku: 'GKS-ATTA-BES-1KG', sellingPrice: 145, mrp: 180, stock: 29 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.8,
    ratingCount: 88,
    shelfLife: '6 Months',
    tags: ['Pure Chana', 'Unadulterated']
  },

  // 8. Organic Toor Dal (Arhar)
  {
    id: 'gks-dal-01',
    name: 'Unpolished Desi Toor Dal (Arhar)',
    hindiName: 'बिना पॉलिश देसी तुवर दाल',
    category: 'dal',
    description: 'Naturally sun-dried split pigeon peas. Zero water/oil/leather polish. Cooks fast with thick authentic dal tadka gravy.',
    longDescription: 'Sourced directly from certified dryland farmer producer organizations in Gulbarga. Unpolished grains keep the outer nutrient layer intact, providing higher digestible fiber and real earthy dal taste.',
    origin: 'Gulbarga, Karnataka',
    image: '/products/toor-dal.jpg',
    variants: [
      { id: 'v-toor-500g', name: '500 g', sku: 'GKS-DAL-TOOR-500', sellingPrice: 95, mrp: 115, stock: 45 },
      { id: 'v-toor-1kg', name: '1 kg', sku: 'GKS-DAL-TOOR-1KG', sellingPrice: 185, mrp: 220, stock: 60 },
      { id: 'v-toor-2kg', name: '2 kg Value Pack', sku: 'GKS-DAL-TOOR-2KG', sellingPrice: 360, mrp: 430, stock: 18 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 12,
    rating: 4.9,
    ratingCount: 310,
    shelfLife: '12 Months',
    tags: ['Best Seller', 'Unpolished', 'High Protein']
  },

  // 9. Organic Moong Dal Dhuli & Chilka
  {
    id: 'gks-dal-02',
    name: 'Organic Green Moong Dal (Split with Chilka)',
    hindiName: 'हरी मूंग दाल (छिलका)',
    category: 'dal',
    description: 'Easy to digest and soothing on the stomach. Unpolished small grain moong rich in iron and folate.',
    origin: 'Indore, Madhya Pradesh',
    image: '/products/moong-dal.jpg',
    variants: [
      { id: 'v-moong-500g', name: '500 g', sku: 'GKS-DAL-MNG-500', sellingPrice: 88, mrp: 105, stock: 32 },
      { id: 'v-moong-1kg', name: '1 kg', sku: 'GKS-DAL-MNG-1KG', sellingPrice: 168, mrp: 200, stock: 40 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 8,
    rating: 4.8,
    ratingCount: 142,
    shelfLife: '12 Months',
    tags: ['Light & Wholesome', 'Easy Digest']
  },

  // 10. Organic Masoor Malka
  {
    id: 'gks-dal-03',
    name: 'Organic Red Masoor Dal (Malka)',
    hindiName: 'लाल मसूर दाल मलका',
    category: 'dal',
    description: 'Creamy split orange lentils. Melts easily into comforting soups, khichdi, and fragrant curries.',
    origin: 'Bundelkhand, Uttar Pradesh',
    image: '/products/masoor-dal.jpg',
    variants: [
      { id: 'v-masoor-500g', name: '500 g', sku: 'GKS-DAL-MAS-500', sellingPrice: 72, mrp: 90, stock: 25 },
      { id: 'v-masoor-1kg', name: '1 kg', sku: 'GKS-DAL-MAS-1KG', sellingPrice: 139, mrp: 170, stock: 35 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 7,
    rating: 4.7,
    ratingCount: 96,
    shelfLife: '12 Months',
    tags: ['Quick Cooking', 'Iron Rich']
  },

  // 11. Organic Chana Dal
  {
    id: 'gks-dal-04',
    name: 'Unpolished Desi Chana Dal (Bengal Gram)',
    hindiName: 'देसी चना दाल (अनपॉलिश्ड)',
    category: 'dal',
    description: 'Bold, sweet-tasting split chickpeas. Ideal for Puran Poli, dhokla, vadas, and classic North Indian dal fry.',
    origin: 'Akola, Maharashtra',
    image: '/products/chana-dal.jpg',
    variants: [
      { id: 'v-chana-500g', name: '500 g', sku: 'GKS-DAL-CHN-500', sellingPrice: 68, mrp: 85, stock: 40 },
      { id: 'v-chana-1kg', name: '1 kg', sku: 'GKS-DAL-CHN-1KG', sellingPrice: 129, mrp: 160, stock: 28 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.8,
    ratingCount: 110,
    shelfLife: '12 Months',
    tags: ['Hearty Texture', 'Zero Polish']
  },

  // 12. Traditional Himalayan Basmati Rice
  {
    id: 'gks-rice-01',
    name: 'Traditional Aged Himalayan Basmati Rice',
    hindiName: 'हिमालयन बासमती चावल (२ वर्ष पुराना)',
    category: 'rice',
    description: '2-year naturally matured extra-long grain basmati. Non-sticky, delicate aroma that fills the whole kitchen.',
    origin: 'Dehradun Valley, Uttarakhand',
    image: '/products/basmati-rice.svg',
    variants: [
      { id: 'v-rice-1kg', name: '1 kg Pouch', sku: 'GKS-RICE-BAS-1KG', sellingPrice: 175, mrp: 215, stock: 40 },
      { id: 'v-rice-5kg', name: '5 kg Bag', sku: 'GKS-RICE-BAS-5KG', sellingPrice: 820, mrp: 990, stock: 22 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.9,
    ratingCount: 260,
    shelfLife: '24 Months',
    tags: ['Aged 2 Years', 'Royal Basmati', 'Festive']
  },

  // 13. Organic Brown Rice
  {
    id: 'gks-rice-02',
    name: 'Unpolished Whole Grain Brown Rice',
    hindiName: 'ब्राउन राइस (अनपॉलिश्ड)',
    category: 'rice',
    description: 'Retains wholesome bran coat and germ. Chewy nutty bite with low glycemic index and dietary fibre.',
    origin: 'Burdwan, West Bengal',
    image: '/products/brown-rice.jpg',
    variants: [
      { id: 'v-brown-1kg', name: '1 kg Pouch', sku: 'GKS-RICE-BRN-1KG', sellingPrice: 125, mrp: 155, stock: 16 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 5,
    rating: 4.6,
    ratingCount: 78,
    shelfLife: '12 Months',
    tags: ['Low GI', 'High Fiber']
  },

  // 14. Organic Lakadong Turmeric Powder (Haldi)
  {
    id: 'gks-spice-01',
    name: 'High Curcumin Lakadong Turmeric Powder',
    hindiName: 'लाकाडोंग शुद्ध हल्दी पाउडर (७%+ करक्यूमिन)',
    category: 'spices',
    description: 'Sourced from the hills of Meghalaya. Boasts 7.5%+ natural curcumin (3x higher than ordinary haldi) for maximum immunity.',
    longDescription: 'Lakadong turmeric is globally renowned for its exceptional deep golden hue, distinctive aroma, and therapeutic curcumin density. Zero starch, artificial dyes, or lead chromate polishing.',
    origin: 'Jaintia Hills, Meghalaya',
    image: '/products/turmeric.jpg',
    variants: [
      { id: 'v-turmeric-100g', name: '100 g Zipper', sku: 'GKS-SPICE-TUR-100', sellingPrice: 65, mrp: 80, stock: 50 },
      { id: 'v-turmeric-250g', name: '250 g Zipper', sku: 'GKS-SPICE-TUR-250', sellingPrice: 145, mrp: 180, stock: 35 },
      { id: 'v-turmeric-500g', name: '500 g Zipper', sku: 'GKS-SPICE-TUR-500', sellingPrice: 270, mrp: 330, stock: 15 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 5.0,
    ratingCount: 512,
    shelfLife: '18 Months',
    tags: ['7.5% Curcumin', 'Golden Glow', 'Superfood']
  },

  // 15. Organic Coriander Powder (Dhaniya)
  {
    id: 'gks-spice-02',
    name: 'Stone-Pounded Green Coriander Powder',
    hindiName: 'हाथ कुटा हरा धनिया पाउडर',
    category: 'spices',
    description: 'Made from whole Parrot green seeds with retained volatile oils. Vibrant fresh scent and citrusy warmth.',
    origin: 'Ramganj Mandi, Rajasthan',
    image: '/products/coriander.svg',
    variants: [
      { id: 'v-cor-200g', name: '200 g', sku: 'GKS-SPICE-COR-200', sellingPrice: 62, mrp: 78, stock: 30 },
      { id: 'v-cor-500g', name: '500 g', sku: 'GKS-SPICE-COR-500', sellingPrice: 140, mrp: 175, stock: 24 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 8,
    rating: 4.8,
    ratingCount: 120,
    shelfLife: '12 Months',
    tags: ['Stone Pounded', 'Aromatic']
  },

  // 16. Whole Cumin Seeds (Jeera)
  {
    id: 'gks-spice-03',
    name: 'Unpolished Whole Cumin Seeds (Jeera)',
    hindiName: 'बिना पॉलिश साबुत जीरा',
    category: 'spices',
    description: 'Sun-dried earthy cumin seeds with intense crackle and robust aroma during tadka.',
    origin: 'Unjha, Gujarat',
    image: '/products/jeera.svg',
    variants: [
      { id: 'v-jeera-200g', name: '200 g', sku: 'GKS-SPICE-JEE-200', sellingPrice: 110, mrp: 135, stock: 35 },
      { id: 'v-jeera-500g', name: '500 g', sku: 'GKS-SPICE-JEE-500', sellingPrice: 255, mrp: 310, stock: 18 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 6,
    rating: 4.8,
    ratingCount: 175,
    shelfLife: '18 Months',
    tags: ['Fragrant Tadka', 'Clean Seeds']
  },

  // 17. Kashmiri Lal Mirch Powder
  {
    id: 'gks-spice-04',
    name: 'Stemless Pure Kashmiri Red Chilli Powder',
    hindiName: 'कश्मीरी लाल मिर्च पाउडर',
    category: 'spices',
    description: 'Mild heat with brilliant natural crimson color. Cold pulverized with seeds removed for soothing richness.',
    origin: 'Pampore, Kashmir',
    image: '/products/red-chilli.svg',
    variants: [
      { id: 'v-chilli-100g', name: '100 g', sku: 'GKS-SPICE-CHL-100', sellingPrice: 79, mrp: 99, stock: 40 },
      { id: 'v-chilli-250g', name: '250 g', sku: 'GKS-SPICE-CHL-250', sellingPrice: 185, mrp: 230, stock: 25 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.9,
    ratingCount: 290,
    shelfLife: '12 Months',
    tags: ['Natural Red Color', 'Mild Heat']
  },

  // 18. A2 Vedic Desi Gir Cow Ghee (Bilona Churned)
  {
    id: 'gks-dairy-01',
    name: 'A2 Vedic Gir Cow Cultured Bilona Ghee',
    hindiName: 'ए२ गिर गाय बिलोना देसी घी',
    category: 'dairy',
    description: 'Made from curd churned with wooden bilona in mud pots, then simmered over slow cow dung embers.',
    longDescription: 'Crafted using the ancient five-step Vedic Bilona method from free-grazing, grass-fed Indian Gir cows. Danedaar golden texture with rich nostalgic aroma of village cooking. Contains beneficial A2 beta-casein proteins and butyric acid.',
    origin: 'Gir Forest, Gujarat',
    image: '/products/desi-ghee.svg',
    variants: [
      { id: 'v-ghee-500ml', name: '500 ml Glass Jar', sku: 'GKS-GHEE-A2-500', sellingPrice: 790, mrp: 950, stock: 14 },
      { id: 'v-ghee-1l', name: '1 Litre Glass Jar', sku: 'GKS-GHEE-A2-1L', sellingPrice: 1490, mrp: 1780, stock: 9 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 5,
    rating: 5.0,
    ratingCount: 640,
    shelfLife: '12 Months',
    tags: ['Bilona Method', 'A2 Certified', 'Danedaar Ghee']
  },

  // 19. Organic Desi Jaggery (Gur)
  {
    id: 'gks-ess-01',
    name: 'Chemical-Free Desi Gur (Sugarcane Jaggery Powder)',
    hindiName: 'देसी गुड़ पाउडर (सल्फर मुक्त)',
    category: 'essentials',
    description: 'Purified with natural plant mucilage (bhindi extract) instead of hydros/sulphur chemicals. Rich caramel sweetness.',
    origin: 'Muzaffarnagar, Uttar Pradesh',
    image: '/products/jaggery.svg',
    variants: [
      { id: 'v-gur-500g', name: '500 g Pouch', sku: 'GKS-ESS-GUR-500', sellingPrice: 65, mrp: 80, stock: 35 },
      { id: 'v-gur-1kg', name: '1 kg Pouch', sku: 'GKS-ESS-GUR-1KG', sellingPrice: 120, mrp: 150, stock: 48 },
    ],
    isFeatured: true,
    isAvailable: true,
    lowStockThreshold: 10,
    rating: 4.8,
    ratingCount: 220,
    shelfLife: '9 Months',
    tags: ['Sulphur Free', 'Natural Sweetener']
  },

  // 20. Raw Wild Forest Honey
  {
    id: 'gks-ess-02',
    name: 'Raw Unprocessed Wild Forest Honey',
    hindiName: 'कच्चा जंगली शहद (अनफिल्टर्ड)',
    category: 'essentials',
    description: 'Ethically harvested from wild bee hives in deep forests. Unheated, unpasteurized, rich in bee pollen and enzymes.',
    origin: 'Sundarbans, West Bengal',
    image: '/products/wild-honey.svg',
    variants: [
      { id: 'v-honey-350g', name: '350 g Glass Jar', sku: 'GKS-ESS-HNY-350', sellingPrice: 260, mrp: 320, stock: 18 },
      { id: 'v-honey-500g', name: '500 g Glass Jar', sku: 'GKS-ESS-HNY-500', sellingPrice: 380, mrp: 460, stock: 12 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 6,
    rating: 4.9,
    ratingCount: 154,
    shelfLife: '24 Months',
    tags: ['Raw & Unheated', 'Pure Nectar']
  },

  // 21. Natural Rock Salt (Sendha Namak)
  {
    id: 'gks-ess-03',
    name: 'Himalayan Pink Rock Salt (Sendha Namak)',
    hindiName: 'सेंधा नमक (पिंक साल्ट)',
    category: 'essentials',
    description: 'Mined from ancient mineral deposits. Contains 84+ trace minerals, no anti-caking additives or bleaching.',
    origin: 'Himalayan Foothills',
    image: '/products/pink-salt.svg',
    variants: [
      { id: 'v-salt-1kg', name: '1 kg Pouch', sku: 'GKS-ESS-SLT-1KG', sellingPrice: 85, mrp: 110, stock: 50 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 12,
    rating: 4.8,
    ratingCount: 195,
    shelfLife: '36 Months',
    tags: ['84 Trace Minerals', 'Fasting Approved']
  },

  // 22. Roasted Flax Seeds (Alsi)
  {
    id: 'gks-ess-04',
    name: 'Lightly Roasted Golden Flax Seeds (Alsi)',
    hindiName: 'भुनी हुई अलसी (ओमेगा-३ समृद्ध)',
    category: 'essentials',
    description: 'Crisp crunchy superseed loaded with plant-based Omega-3 ALA, lignans, and soluble dietary fibre.',
    origin: 'Malwa, Madhya Pradesh',
    image: '/products/flax-seeds.svg',
    variants: [
      { id: 'v-flax-250g', name: '250 g Zipper', sku: 'GKS-ESS-FLX-250', sellingPrice: 70, mrp: 90, stock: 3 },
    ],
    isFeatured: false,
    isAvailable: true,
    lowStockThreshold: 5,
    rating: 4.7,
    ratingCount: 65,
    shelfLife: '9 Months',
    tags: ['Omega-3 Rich', 'Crunchy Snack']
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'SUGANDH50',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 399,
    description: 'Flat ₹50 OFF on orders above ₹399',
    isActive: true
  },
  {
    code: 'ORGANIC100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 699,
    description: 'Flat ₹100 OFF on orders above ₹699',
    isActive: true
  },
  {
    code: 'SHUDDHA20',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 150,
    minOrderValue: 499,
    description: '20% OFF (Up to ₹150) on festive staples',
    isActive: true
  },
  {
    code: 'FIRSTFREE',
    discountType: 'flat',
    discountValue: 30,
    minOrderValue: 199,
    description: 'Free Delivery on your grocery cart',
    isActive: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Gaon Ki Sugandh',
  tagline: 'Gaon ki shuddhta, har ghar tak.',
  logoText: 'Gaon Ki Sugandh',
  contactNumber: '+91 98765 43210',
  supportEmail: 'care@gaonkisugandh.com',
  storeAddress: 'Village Sourcing Depot #4, Highway Junction, Gurugram, Haryana 122001',
  openingHours: '6:00 AM – 11:30 PM (7 Days a week)',
  deliveryFee: 30,
  freeDeliveryThreshold: 499,
  handlingFee: 5,
  minimumOrderValue: 99,
  serviceablePincodes: ['122001', '122002', '122018', '122051', '110001', '110016', '110070', '201301', '560001', '400001'],
  estimatedDeliveryTime: '12-15 Mins',
  currencySymbol: '₹',
  promoBannerText: 'GAON KI SHUDDHTA, HAR GHAR TAK',
  promoBannerSubtext: 'Direct farm cold-pressed oils, stone-milled flours & desi ghee',
  promoBannerDiscount: 'UP TO 35% OFF',
  promoBannerCode: 'SUGANDH50',
  demoWhatsAppNumber: '+91 98765 43210'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'GKS-91042',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    customer: {
      name: 'Priya Sharma',
      phone: '9811234567',
      email: 'priya.s@example.com',
      addressLine1: 'Tower B, Flat 704, Silver Oaks Apartments',
      addressLine2: 'DLF Phase 1',
      landmark: 'Near Qutub Plaza',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      addressType: 'Home'
    },
    items: [
      {
        productId: 'gks-oil-01',
        productName: 'Kacchi Ghani Mustard Oil (Cold-Pressed)',
        variantId: 'v-mustard-1l',
        variantName: '1 Litre',
        image: '/products/mustard-oil.jpg',
        sellingPrice: 249,
        mrp: 299,
        quantity: 1,
        maxStock: 42,
        sku: 'GKS-OIL-MUST-1L',
        category: 'oils'
      },
      {
        productId: 'gks-atta-01',
        productName: 'MP Sharbati Whole Wheat Chakki Atta',
        variantId: 'v-atta-5kg',
        variantName: '5 kg Bag',
        image: '/products/wheat-atta.jpg',
        sellingPrice: 285,
        mrp: 330,
        quantity: 1,
        maxStock: 55,
        sku: 'GKS-ATTA-SHAR-5KG',
        category: 'atta'
      }
    ],
    itemTotal: 534,
    deliveryFee: 0,
    handlingFee: 5,
    couponDiscount: 50,
    couponCode: 'SUGANDH50',
    totalAmount: 489,
    totalSavings: 145,
    paymentMethod: 'Demo UPI',
    paymentStatus: 'Paid (Demo)',
    status: 'Out for Delivery',
    statusHistory: [
      { status: 'Order Placed', timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 36 * 60 * 1000).toISOString() },
      { status: 'Preparing', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
      { status: 'Ready for Dispatch', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), note: 'Delivery partner Ramesh is on the way.' }
    ],
    deliveryEstimateMinutes: 8,
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 11223',
      vehicleNumber: 'HR-26-EQ-4491'
    }
  },
  {
    id: 'GKS-91041',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    customer: {
      name: 'Vikram Malhotra',
      phone: '9920198765',
      email: 'vikram.m@example.com',
      addressLine1: 'B-142, Freedom Fighters Enclave',
      landmark: 'Opposite Community Park',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      addressType: 'Home'
    },
    items: [
      {
        productId: 'gks-dairy-01',
        productName: 'A2 Vedic Gir Cow Cultured Bilona Ghee',
        variantId: 'v-ghee-1l',
        variantName: '1 Litre Glass Jar',
        image: '/products/desi-ghee.svg',
        sellingPrice: 1490,
        mrp: 1780,
        quantity: 1,
        maxStock: 9,
        sku: 'GKS-GHEE-A2-1L',
        category: 'dairy'
      },
      {
        productId: 'gks-spice-01',
        productName: 'High Curcumin Lakadong Turmeric Powder',
        variantId: 'v-turmeric-250g',
        variantName: '250 g Zipper',
        image: '/products/turmeric.jpg',
        sellingPrice: 145,
        mrp: 180,
        quantity: 1,
        maxStock: 35,
        sku: 'GKS-SPICE-TUR-250',
        category: 'spices'
      }
    ],
    itemTotal: 1635,
    deliveryFee: 0,
    handlingFee: 5,
    couponDiscount: 100,
    couponCode: 'ORGANIC100',
    totalAmount: 1540,
    totalSavings: 425,
    paymentMethod: 'Demo Card',
    paymentStatus: 'Paid (Demo)',
    status: 'Delivered',
    statusHistory: [
      { status: 'Order Placed', timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString() },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 170 * 60 * 1000).toISOString() },
      { status: 'Preparing', timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString() },
      { status: 'Ready for Dispatch', timestamp: new Date(Date.now() - 130 * 60 * 1000).toISOString() },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString() },
      { status: 'Delivered', timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(), note: 'Delivered safely at doorstep.' }
    ],
    deliveryEstimateMinutes: 0
  }
];
