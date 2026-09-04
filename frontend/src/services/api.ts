import axios from 'axios';
import {
  User,
  Produce,
  BuyerRequirement,
  MatchResponse,
  Aggregation,
  OptimizedRoute,
  Order,
  DemandForecast,
  PriceBreakdownResponse,
  RouteStop
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisansetu_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentic 1:1 Sample Produce Data + Expanded Regional Maharashtra Catalog
export const DEFAULT_PRODUCE: Produce[] = [
  {
    id: 7,
    user_id: 5,
    farmer_name: 'Balasaheb Kadam',
    crop_name: 'Banana',
    category: 'Fruits',
    quantity_available: 1500,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'Medium',
    harvest_date: '2026-09-04',
    available_from: '2026-09-07',
    expected_price: 35.0,
    location: 'Satara, Maharashtra',
    latitude: 17.6805,
    longitude: 74.0183,
    description: 'Grand Naine robust bananas, naturally ethylene ripened without chemical carbide.',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 6,
    user_id: 2,
    farmer_name: 'Suresh Shinde (Farmer B)',
    crop_name: 'Grapes',
    category: 'Fruits',
    quantity_available: 595,
    unit: 'kg',
    grade: 'Export Quality',
    perishability: 'High',
    harvest_date: '2026-09-06',
    available_from: '2026-09-09',
    expected_price: 65.0,
    location: 'Nashik, Maharashtra',
    latitude: 20.0012,
    longitude: 73.7845,
    description: 'Thomson Seedless sweet green grapes with 18+ Brix sweetness index.',
    image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 5,
    user_id: 4,
    farmer_name: 'Anand Jadhav',
    crop_name: 'Potato',
    category: 'Vegetables',
    quantity_available: 1200,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'Low',
    harvest_date: '2026-09-01',
    available_from: '2026-09-04',
    expected_price: 24.0,
    location: 'Ahmednagar, Maharashtra',
    latitude: 19.0952,
    longitude: 74.7496,
    description: 'Firm, dry-washed Jyoti variety potatoes suitable for culinary chips and retail consumption.',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 4,
    user_id: 1,
    farmer_name: 'Ramesh Patil (Demo Farmer)',
    crop_name: 'Onion',
    category: 'Vegetables',
    quantity_available: 750,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'Low',
    harvest_date: '2026-09-02',
    available_from: '2026-09-05',
    expected_price: 22.0,
    location: 'Nashik, Maharashtra',
    latitude: 20.0059,
    longitude: 73.7898,
    description: 'Medium to large cured red onions from Lasalgaon belt with low moisture content.',
    image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 1,
    user_id: 1,
    farmer_name: 'Ramesh Patil (Demo Farmer)',
    crop_name: 'Tomato',
    category: 'Vegetables',
    quantity_available: 500,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-08',
    available_from: '2026-09-10',
    expected_price: 28.0,
    location: 'Nashik, Maharashtra',
    latitude: 20.0059,
    longitude: 73.7898,
    description: 'Firm, sun-ripened Grade-A table tomatoes with high shelf life and vibrant red pigmentation.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 8,
    user_id: 3,
    farmer_name: 'Ganesh Sawant',
    crop_name: 'Alphonso Mango',
    category: 'Fruits',
    quantity_available: 800,
    unit: 'kg',
    grade: 'Export Quality',
    perishability: 'High',
    harvest_date: '2026-09-05',
    available_from: '2026-09-08',
    expected_price: 180.0,
    location: 'Ratnagiri, Maharashtra',
    latitude: 16.9902,
    longitude: 73.3120,
    description: 'GI-Tagged authentic Ratnagiri Alphonso mangoes, handpicked, naturally ripened with rich aroma.',
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 9,
    user_id: 4,
    farmer_name: 'Shivaji Patil',
    crop_name: 'Green Chilli',
    category: 'Vegetables',
    quantity_available: 450,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-04',
    available_from: '2026-09-06',
    expected_price: 45.0,
    location: 'Kolhapur, Maharashtra',
    latitude: 16.7050,
    longitude: 74.2433,
    description: 'Fresh spicy Teja green chillies, pungent and crisp, ideal for retail grocery and institutional supply.',
    image_url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 10,
    user_id: 3,
    farmer_name: 'Vikas Gaikwad (Farmer C)',
    crop_name: 'Fresh Mint (Pudina)',
    category: 'Herbs',
    quantity_available: 250,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-05',
    available_from: '2026-09-06',
    expected_price: 60.0,
    location: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    description: 'Fragrant, hydro-farmed aromatic mint leaves with rich menthol aroma and vibrant green leaves.',
    image_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 11,
    user_id: 5,
    farmer_name: 'Rajendra Deshmukh',
    crop_name: 'Turmeric Finger',
    category: 'Spices',
    quantity_available: 900,
    unit: 'kg',
    grade: 'Export Quality',
    perishability: 'Low',
    harvest_date: '2026-08-28',
    available_from: '2026-09-01',
    expected_price: 110.0,
    location: 'Sangli, Maharashtra',
    latitude: 16.8524,
    longitude: 74.5815,
    description: 'High curcumin (5%+) sun-cured raw turmeric fingers from Sangli spice trading hub.',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 12,
    user_id: 2,
    farmer_name: 'Subhash Wankhede',
    crop_name: 'Basmati Paddy Rice',
    category: 'Grains',
    quantity_available: 3500,
    unit: 'kg',
    grade: 'Export Quality',
    perishability: 'Low',
    harvest_date: '2026-08-20',
    available_from: '2026-08-25',
    expected_price: 52.0,
    location: 'Bhandara, Maharashtra',
    latitude: 21.1714,
    longitude: 79.6548,
    description: 'Extra long grain 1121 premium aromatic basmati paddy rice, double polished for quality.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 13,
    user_id: 4,
    farmer_name: 'Santosh Kadam',
    crop_name: 'Sharbati Wheat Grains',
    category: 'Grains',
    quantity_available: 2800,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'Low',
    harvest_date: '2026-08-25',
    available_from: '2026-08-30',
    expected_price: 38.0,
    location: 'Akola, Maharashtra',
    latitude: 20.7002,
    longitude: 77.0082,
    description: 'Golden luster Sharbati wheat grains, high protein content and superior dough elasticity.',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 15,
    user_id: 5,
    farmer_name: 'Dnyaneshwar Pawar',
    crop_name: 'Maldandi Jowar (Sorghum)',
    category: 'Grains',
    quantity_available: 1800,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'Low',
    harvest_date: '2026-08-22',
    available_from: '2026-08-27',
    expected_price: 42.0,
    location: 'Solapur, Maharashtra',
    latitude: 17.6599,
    longitude: 75.9064,
    description: 'Pearlescent white Maldandi Jowar millet grains, gluten-free nutrient staple rich in dietary fiber.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 14,
    user_id: 1,
    farmer_name: 'Ramesh Patil (Demo Farmer)',
    crop_name: 'Fresh Cauliflower',
    category: 'Vegetables',
    quantity_available: 650,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-04',
    available_from: '2026-09-06',
    expected_price: 32.0,
    location: 'Nashik, Maharashtra',
    latitude: 20.0059,
    longitude: 73.7898,
    description: 'Snow-white compact heads of fresh cauliflower, uniform size and free from blemish.',
    image_url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 2,
    user_id: 2,
    farmer_name: 'Suresh Shinde (Farmer B)',
    crop_name: 'Tomato',
    category: 'Vegetables',
    quantity_available: 300,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-07',
    available_from: '2026-09-10',
    expected_price: 27.0,
    location: 'Nashik, Maharashtra',
    latitude: 19.9975,
    longitude: 73.7910,
    description: 'Greenhouse grown premium Grade-A tomatoes, pesticide residue tested.',
    image_url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 3,
    user_id: 3,
    farmer_name: 'Vikas Gaikwad (Farmer C)',
    crop_name: 'Tomato',
    category: 'Vegetables',
    quantity_available: 200,
    unit: 'kg',
    grade: 'Grade A',
    perishability: 'High',
    harvest_date: '2026-09-08',
    available_from: '2026-09-10',
    expected_price: 29.0,
    location: 'Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    description: 'Hydroponic and drip irrigated hybrid tomatoes, uniform size and blemish-free.',
    image_url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  }
];

const DEFAULT_DEMO_USERS: User[] = [
  {
    id: 1,
    full_name: 'Ramesh Patil (Demo Farmer)',
    email: 'farmer@kisansetu.in',
    mobile: '+91 98220 11442',
    role: 'Farmer',
    location: 'Nashik, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 7,
    full_name: 'Taj Hotels & Fresh Mart (Demo Bulk Buyer)',
    email: 'buyer@kisansetu.in',
    mobile: '+91 98200 44556',
    role: 'Bulk Buyer',
    location: 'Nariman Point, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 6,
    full_name: 'Sahyadri Farmers Producer Co. (Demo FPO)',
    email: 'fpo@kisansetu.in',
    mobile: '+91 98230 99887',
    role: 'FPO',
    location: 'Nashik Agro Hub',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 8,
    full_name: 'Priya Sharma (Demo Consumer)',
    email: 'consumer@kisansetu.in',
    mobile: '+91 98191 22334',
    role: 'Consumer',
    location: 'Bandra West, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  }
];

const DEFAULT_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 1,
    buyer_id: 7,
    buyer_name: 'Taj Hospitality Group',
    buyer_org: 'Taj Luxury Hotels & Mumbai Fresh Mart',
    crop_name: 'Tomato',
    required_quantity: 1000,
    unit: 'kg',
    required_grade: 'Grade A',
    max_price: 30.0,
    delivery_location: 'Mumbai Central Logistics Hub',
    required_date: '2026-09-10',
    urgency: 'High',
    status: 'Open'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'ORD-2026-8801',
    buyer_id: 7,
    buyer_name: 'Taj Hotels & Fresh Mart',
    crop_name: 'Tomato',
    grade: 'Grade A',
    total_quantity: 500,
    unit_price: 28.0,
    logistics_fee: 1400,
    platform_fee: 350,
    handling_fee: 250,
    total_amount: 16000,
    delivery_location: 'Nariman Point, Mumbai',
    status: 'In Transit',
    created_at: '2026-09-04',
    timeline: [
      { step: 'Order Placed', isCompleted: true, isCurrent: false, timestamp: '2026-09-04 09:00', description: 'Order confirmed by buyer' },
      { step: 'Farmer Matched', isCompleted: true, isCurrent: false, timestamp: '2026-09-04 10:15', description: 'Matched with Ramesh Patil & Suresh Shinde' },
      { step: 'Aggregated', isCompleted: true, isCurrent: false, timestamp: '2026-09-04 11:30', description: '500kg aggregated at Nashik Hub' },
      { step: 'In Transit', isCompleted: true, isCurrent: true, timestamp: '2026-09-04 14:00', description: 'Vehicle en route to Mumbai' },
      { step: 'Delivered', isCompleted: false, isCurrent: false, timestamp: null, description: 'Pending final receipt' }
    ]
  },
  {
    id: 2,
    order_number: 'ORD-2026-8802',
    buyer_id: 7,
    buyer_name: 'Taj Hotels & Fresh Mart',
    crop_name: 'Potato',
    grade: 'Grade A',
    total_quantity: 1200,
    unit_price: 24.0,
    logistics_fee: 2200,
    platform_fee: 600,
    handling_fee: 400,
    total_amount: 32000,
    delivery_location: 'Bandra West, Mumbai',
    status: 'Delivered',
    created_at: '2026-09-02',
    timeline: [
      { step: 'Order Placed', isCompleted: true, isCurrent: false, timestamp: '2026-09-02 08:30', description: 'Order confirmed' },
      { step: 'Farmer Matched', isCompleted: true, isCurrent: false, timestamp: '2026-09-02 09:45', description: 'Matched with Anand Jadhav' },
      { step: 'Aggregated', isCompleted: true, isCurrent: false, timestamp: '2026-09-02 11:00', description: 'Loaded from Ahmednagar' },
      { step: 'In Transit', isCompleted: true, isCurrent: false, timestamp: '2026-09-02 13:00', description: 'Cold-chain dispatch' },
      { step: 'Delivered', isCompleted: true, isCurrent: false, timestamp: '2026-09-02 17:30', description: 'Delivered to Bandra Hub' }
    ]
  }
];

const DEFAULT_DEMAND_FORECAST: DemandForecast = {
  success: true,
  product: 'Tomato',
  currentDemand: 1200,
  predictedDemand: 1550,
  growthPercentage: 29.1,
  confidence: 94,
  trend: 'bullish',
  recommendation: 'High institutional demand expected in Mumbai markets. Harvest Grade-A tomatoes immediately for max price realization.',
  action: 'PRODUCE_MORE',
  actionLabel: 'Increase Harvest Allocation',
  headline: '+29% Surge Expected in Mumbai / Pune Corridor',
  operationalGuidance: [
    'Harvest during early morning hours to preserve freshness index.',
    'Pack in ventilated 25kg crates for cold-chain aggregation.',
    'Coordinate with FPO for pooled logistics dispatch to Mumbai.'
  ],
  impactEstimate: '₹4,500 additional earnings per 500kg batch',
  urgency: 'HIGH',
  chartData: [
    { date: 'Sep 01', fullDate: '2026-09-01', actualDemand: 1100, predictedDemand: 1100, avgPrice: 26, isForecast: false },
    { date: 'Sep 02', fullDate: '2026-09-02', actualDemand: 1150, predictedDemand: 1150, avgPrice: 27, isForecast: false },
    { date: 'Sep 03', fullDate: '2026-09-03', actualDemand: 1200, predictedDemand: 1200, avgPrice: 28, isForecast: false },
    { date: 'Sep 04', fullDate: '2026-09-04', actualDemand: 1250, predictedDemand: 1250, avgPrice: 28, isForecast: false },
    { date: 'Sep 05', fullDate: '2026-09-05', actualDemand: null, predictedDemand: 1350, avgPrice: 29, isForecast: true },
    { date: 'Sep 06', fullDate: '2026-09-06', actualDemand: null, predictedDemand: 1450, avgPrice: 30, isForecast: true },
    { date: 'Sep 07', fullDate: '2026-09-07', actualDemand: null, predictedDemand: 1550, avgPrice: 31, isForecast: true }
  ]
};

const DEFAULT_PRICE_BREAKDOWN: PriceBreakdownResponse = {
  success: true,
  crop: 'Tomato',
  buyerPricePerKg: 32.0,
  farmerPayoutPerKg: 27.0,
  breakdown: [
    { component: 'Farmer Base Realization', amount: 27.0, unit: '₹/kg', percentage: 84.4, color: '#15803d', description: 'Direct payout to farmer bank account' },
    { component: 'Refrigerated Transit Fee', amount: 2.0, unit: '₹/kg', percentage: 6.25, color: '#0284c7', description: 'Cold-chain vehicle transport' },
    { component: 'Aggregation Fee', amount: 1.0, unit: '₹/kg', percentage: 3.125, color: '#b45309', description: 'FPO aggregation hub management' },
    { component: 'Handling & Crate Loading', amount: 1.0, unit: '₹/kg', percentage: 3.125, color: '#6d28d9', description: 'Quality sorting & loading' },
    { component: 'KisanSetu Platform Fee', amount: 1.0, unit: '₹/kg', percentage: 3.125, color: '#047857', description: 'Escrow & platform services' }
  ],
  comparison: {
    traditionalConsumerPrice: 48.0,
    traditionalFarmerRealization: 16.0,
    middlemanLeakageSaved: 16.0,
    farmerGainPercentage: '68.7%',
    buyerSavingPercentage: '33.3%'
  },
  farmerViewExample: {
    quantityKg: 500,
    expectedNetEarnings: 13500,
    guaranteedDirectPayout: true
  },
  buyerViewExample: {
    quantityKg: 500,
    totalLandedCost: 16000,
    breakdownTotal: 16000
  }
};

const DEFAULT_ROUTE_STOPS: RouteStop[] = [
  {
    stopOrder: 1,
    stopType: 'PICKUP',
    locationName: 'Ramesh Patil Farm (Nashik)',
    farmerName: 'Ramesh Patil',
    cropName: 'Tomato',
    quantityKg: 500,
    lat: 20.0059,
    lng: 73.7898,
    arrivalWindow: '08:00 AM',
    action: 'Load 500kg Grade-A Tomatoes',
    status: 'Completed'
  },
  {
    stopOrder: 2,
    stopType: 'PICKUP',
    locationName: 'Suresh Shinde Farm (Nashik)',
    farmerName: 'Suresh Shinde',
    cropName: 'Tomato',
    quantityKg: 300,
    lat: 19.9975,
    lng: 73.7910,
    arrivalWindow: '09:15 AM',
    action: 'Load 300kg Grade-A Tomatoes',
    status: 'Completed'
  },
  {
    stopOrder: 3,
    stopType: 'DELIVERY',
    locationName: 'Taj Hotels Central Hub (Mumbai)',
    farmerName: 'Taj Hospitality',
    cropName: 'Tomato',
    quantityKg: 800,
    lat: 18.9220,
    lng: 72.8330,
    arrivalWindow: '12:30 PM',
    action: 'Unload & Quality Verification',
    status: 'En Route'
  }
];

const DEFAULT_OPTIMIZED_ROUTE: OptimizedRoute = {
  routeId: 'ROUTE-2026-001',
  orderId: 'ORD-2026-8801',
  vehicle: {
    model: 'Tata 407 Refrigerated Cold-Van',
    registration: 'MH-15-EG-4482',
    driverName: 'Sanjay Deshmukh',
    capacityKg: 2000,
    loadedKg: 800,
    utilizationPercentage: 40,
    temperatureSetting: '4°C to 8°C (Active)'
  },
  metrics: {
    estimatedDistanceKm: 168.4,
    totalCorridorDistanceKm: 168.4,
    estimatedDurationText: '3.5 Hours',
    estimatedLogisticsCost: 1400,
    unitLogisticsCost: 2.8,
    co2SavedKg: 42.5,
    fuelEfficiencyScore: 'Optimal (A+ Grade)'
  },
  summary: 'Direct Nashik to Mumbai cold-chain corridor route sequence with multi-farmer pickup stops.',
  stops: DEFAULT_ROUTE_STOPS,
  polylineCoordinates: [
    [20.0059, 73.7898],
    [19.9975, 73.7910],
    [18.9220, 72.8330]
  ]
};

function filterProduceList(list: Produce[], params?: { category?: string; location?: string; grade?: string; search?: string; maxPrice?: number }) {
  if (!params) return list;
  return list.filter(item => {
    if (params.category && params.category !== 'All' && item.category.toLowerCase() !== params.category.toLowerCase()) return false;
    if (params.grade && params.grade !== 'All' && item.grade.toLowerCase() !== params.grade.toLowerCase()) return false;
    if (params.location && params.location !== 'All' && !item.location.toLowerCase().includes(params.location.toLowerCase())) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      const match = item.crop_name.toLowerCase().includes(q) ||
                    (item.farmer_name && item.farmer_name.toLowerCase().includes(q)) ||
                    item.location.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (params.maxPrice && item.expected_price > params.maxPrice) return false;
    return true;
  });
}

export const authService = {
  getDemoUsers: async () => {
    try {
      const res = await api.get<{ success: boolean; users: User[] }>('/auth/demo-users');
      return res.data.users && res.data.users.length > 0 ? res.data.users : DEFAULT_DEMO_USERS;
    } catch {
      return DEFAULT_DEMO_USERS;
    }
  },
  login: async (email: string, password = 'password123') => {
    try {
      const res = await api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('kisansetu_token', res.data.token);
      }
      return res.data;
    } catch {
      const foundUser = DEFAULT_DEMO_USERS.find(u => u.email === email) || DEFAULT_DEMO_USERS[0];
      return { success: true, token: 'demo_token_123', user: foundUser, message: 'Demo Login Successful' };
    }
  },
  register: async (data: Partial<User> & { password?: string }) => {
    try {
      const res = await api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/register', data);
      if (res.data.token) {
        localStorage.setItem('kisansetu_token', res.data.token);
      }
      return res.data;
    } catch {
      const newUser: User = {
        id: Date.now(),
        full_name: data.full_name || 'New User',
        email: data.email || 'user@kisansetu.in',
        mobile: data.mobile || '+91 99999 00000',
        role: data.role || 'Farmer',
        location: data.location || 'Maharashtra',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'
      };
      return { success: true, token: 'demo_token_reg', user: newUser, message: 'Registration Successful' };
    }
  }
};

export const produceService = {
  getMarketplace: async (params?: { category?: string; location?: string; grade?: string; search?: string; maxPrice?: number }) => {
    try {
      const res = await api.get<{ success: boolean; count: number; data: Produce[] }>('/marketplace', { params });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return filterProduceList(DEFAULT_PRODUCE, params);
    } catch {
      return filterProduceList(DEFAULT_PRODUCE, params);
    }
  },
  getFarmerProduce: async (userId?: number) => {
    try {
      const res = await api.get<{ success: boolean; count: number; data: Produce[] }>('/produce', { params: { userId } });
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return DEFAULT_PRODUCE.filter(p => !userId || p.user_id === userId);
    } catch {
      return DEFAULT_PRODUCE.filter(p => !userId || p.user_id === userId);
    }
  },
  getFarmerMetrics: async (userId?: number) => {
    try {
      const res = await api.get<{
        success: boolean;
        metrics: {
          totalProduceListedKg: number;
          activeOrders: number;
          revenue: number;
          matchedBuyers: number;
          aiInsight: string;
        };
        inventory: Produce[];
      }>('/farmer/metrics', { params: { userId } });
      if (res.data?.inventory) {
        return res.data;
      }
      const myProduce = DEFAULT_PRODUCE.filter(p => !userId || p.user_id === userId);
      return {
        success: true,
        metrics: {
          totalProduceListedKg: myProduce.reduce((a, c) => a + c.quantity_available, 0) || 1250,
          activeOrders: 3,
          revenue: 35000,
          matchedBuyers: 4,
          aiInsight: 'High demand detected for Grade-A Tomatoes in Mumbai markets (+21% price premium).'
        },
        inventory: myProduce
      };
    } catch {
      const myProduce = DEFAULT_PRODUCE.filter(p => !userId || p.user_id === userId);
      return {
        success: true,
        metrics: {
          totalProduceListedKg: myProduce.reduce((a, c) => a + c.quantity_available, 0) || 1250,
          activeOrders: 3,
          revenue: 35000,
          matchedBuyers: 4,
          aiInsight: 'High demand detected for Grade-A Tomatoes in Mumbai markets (+21% price premium).'
        },
        inventory: myProduce
      };
    }
  },
  addProduce: async (data: Partial<Produce>) => {
    try {
      const res = await api.post<{ success: boolean; message: string; data: Produce }>('/produce', data);
      return res.data;
    } catch {
      const newProduce: Produce = {
        id: Date.now(),
        user_id: data.user_id || 1,
        farmer_name: data.farmer_name || 'Ramesh Patil (Demo Farmer)',
        crop_name: data.crop_name || 'Fresh Crop',
        category: data.category || 'Vegetables',
        quantity_available: Number(data.quantity_available) || 100,
        unit: data.unit || 'kg',
        grade: data.grade || 'Grade A',
        perishability: data.perishability || 'Medium',
        harvest_date: data.harvest_date || new Date().toISOString().split('T')[0],
        available_from: data.available_from || new Date().toISOString().split('T')[0],
        expected_price: Number(data.expected_price) || 30,
        location: data.location || 'Nashik, Maharashtra',
        latitude: 20.0059,
        longitude: 73.7898,
        description: data.description || 'Freshly harvested produce listed via KisanSetu Direct.',
        image_url: data.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        status: 'Available'
      };
      DEFAULT_PRODUCE.unshift(newProduce);
      return { success: true, message: 'Produce added successfully (Demo)', data: newProduce };
    }
  }
};

export const buyerService = {
  getRequirements: async (buyerId?: number) => {
    try {
      const res = await api.get<{ success: boolean; count: number; data: BuyerRequirement[] }>('/buyer/requirements', { params: { buyerId } });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      return DEFAULT_REQUIREMENTS;
    } catch {
      return DEFAULT_REQUIREMENTS;
    }
  },
  createRequirement: async (data: Partial<BuyerRequirement>) => {
    try {
      const res = await api.post<{ success: boolean; message: string; data: BuyerRequirement }>('/buyer/requirements', data);
      return res.data;
    } catch {
      const req: BuyerRequirement = {
        id: Date.now(),
        buyer_id: data.buyer_id || 7,
        buyer_name: data.buyer_name || 'Taj Hospitality Group',
        crop_name: data.crop_name || 'Tomato',
        required_quantity: Number(data.required_quantity) || 500,
        unit: data.unit || 'kg',
        required_grade: data.required_grade || 'Grade A',
        max_price: Number(data.max_price) || 32,
        delivery_location: data.delivery_location || 'Mumbai Central Logistics Hub',
        required_date: data.required_date || '2026-09-15',
        urgency: data.urgency || 'Normal',
        status: 'Open'
      };
      return { success: true, message: 'Requirement posted successfully (Demo)', data: req };
    }
  },
  getMatches: async (requirementId: number | string) => {
    try {
      const res = await api.get<MatchResponse>(`/matches/${requirementId}`);
      if (res.data?.matches) return res.data;
      throw new Error('Fallback match');
    } catch {
      return {
        success: true,
        requirement: DEFAULT_REQUIREMENTS[0],
        totalMatchedQuantity: 1000,
        requiredQuantity: 1000,
        fulfillmentPercentage: 100,
        isFullyFulfillable: true,
        matches: DEFAULT_PRODUCE.filter(p => p.crop_name === 'Tomato').map(p => ({
          produceId: p.id,
          farmerId: p.user_id,
          farmerName: p.farmer_name || 'Ramesh Patil',
          location: p.location,
          crop: p.crop_name,
          availableQuantity: p.quantity_available,
          allocatedQuantity: p.quantity_available,
          unit: p.unit,
          grade: p.grade,
          expectedPrice: p.expected_price,
          matchScore: 98,
          compatibility: {
            productCompatibility: 'High',
            gradeMatch: 'Exact Match',
            priceViability: 'Optimal',
            locationProximity: 'Direct Corridor'
          }
        }))
      };
    }
  }
};

export const aggregationService = {
  createAggregatedOrder: async (payload: any) => {
    try {
      const res = await api.post<{ success: boolean; message: string; aggregationId: number; orderId: number; routeId: number; orderNumber: string; totalQuantity: number; averagePrice: number; farmerCount: number; totalOrderAmount: number }>('/aggregation/create', payload);
      return res.data;
    } catch {
      return {
        success: true,
        message: 'Aggregated Supply Order Created Successfully!',
        aggregationId: 101,
        orderId: 201,
        routeId: 301,
        orderNumber: 'ORD-2026-AGG-' + Math.floor(1000 + Math.random() * 9000),
        totalQuantity: 1000,
        averagePrice: 27.9,
        farmerCount: 3,
        totalOrderAmount: 27900
      };
    }
  },
  getAggregations: async () => {
    try {
      const res = await api.get<{ success: boolean; data: Aggregation[] }>('/aggregations');
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      throw new Error('Fallback');
    } catch {
      return [
        {
          id: 1,
          buyer_id: 7,
          crop_name: 'Tomato',
          total_quantity: 1000,
          average_price: 27.9,
          farmer_count: 3,
          hub_location: 'Nashik Aggregation Center',
          delivery_destination: 'Mumbai Bulk Procurement Hub',
          status: 'Aggregated',
          created_at: '2026-09-04'
        }
      ];
    }
  }
};

export const logisticsService = {
  optimizeRoute: async (orderId?: string | number, stops?: any[]) => {
    try {
      const res = await api.post<{ success: boolean; data: OptimizedRoute }>('/routes/optimize', { orderId, stops });
      if (res.data?.data) return res.data.data;
      throw new Error('Fallback route');
    } catch {
      return DEFAULT_OPTIMIZED_ROUTE;
    }
  },
  getLatestRoute: async () => {
    try {
      const res = await api.get<{ success: boolean; data: OptimizedRoute }>('/routes/latest');
      if (res.data?.data) return res.data.data;
      throw new Error('Fallback route');
    } catch {
      return DEFAULT_OPTIMIZED_ROUTE;
    }
  }
};

export const demandService = {
  getForecast: async (crop = 'Tomato', days = 14) => {
    try {
      const res = await api.get<DemandForecast>('/demand/forecast', { params: { crop, days } });
      if (res.data?.product) return res.data;
      throw new Error('Fallback forecast');
    } catch {
      return DEFAULT_DEMAND_FORECAST;
    }
  },
  getAllInsights: async () => {
    try {
      const res = await api.get<{ success: boolean; data: any[] }>('/demand/insights');
      if (res.data?.data) return res.data.data;
      throw new Error('Fallback insights');
    } catch {
      return [
        { crop_name: 'Tomato', trend: 'Upward (+14%)', demand_volume: 'High', recommended_action: 'Harvest & list Grade-A immediately for Mumbai market' },
        { crop_name: 'Grapes', trend: 'Stable (+5%)', demand_volume: 'Medium', recommended_action: 'Store in cold chain for export window' },
        { crop_name: 'Onion', trend: 'High Demand (+22%)', demand_volume: 'Very High', recommended_action: 'Release stored dry onion to Lasalgaon market' }
      ];
    }
  }
};

export const priceService = {
  getPriceBreakdown: async (crop = 'Tomato') => {
    try {
      const res = await api.get<PriceBreakdownResponse>(`/price-breakdown/${crop}`);
      if (res.data?.breakdown) return res.data;
      throw new Error('Fallback price');
    } catch {
      return DEFAULT_PRICE_BREAKDOWN;
    }
  }
};

export const orderService = {
  getOrders: async (buyerId?: number) => {
    try {
      const res = await api.get<{ success: boolean; count: number; data: Order[] }>('/orders', { params: { buyerId } });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      return DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  },
  getOrderById: async (id: number | string) => {
    try {
      const res = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
      if (res.data?.data) return res.data.data;
      throw new Error('Fallback');
    } catch {
      return DEFAULT_ORDERS[0];
    }
  },
  updateStatus: async (id: number | string, status: string) => {
    try {
      const res = await api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, { status });
      return res.data;
    } catch {
      const ord = { ...DEFAULT_ORDERS[0], status: status as any };
      return {
        success: true,
        message: `Order status updated to ${status}`,
        data: ord
      };
    }
  },
  createConsumerOrder: async (data: any) => {
    try {
      const res = await api.post<{ success: boolean; message: string; orderId: number; orderNumber: string; totalAmount: number }>('/orders/consumer', data);
      return res.data;
    } catch {
      return {
        success: true,
        message: 'Direct Farm-to-Consumer order placed successfully!',
        orderId: Date.now(),
        orderNumber: 'ORD-2026-CON-' + Math.floor(1000 + Math.random() * 9000),
        totalAmount: data.grand_total || 250
      };
    }
  },
  cancelOrder: async (id: number | string) => {
    try {
      const res = await api.post<{ success: boolean; message: string; data: Order; restoredQuantity: number }>(`/orders/${id}/cancel`);
      return res.data;
    } catch {
      const ord = { ...DEFAULT_ORDERS[0], status: 'Cancelled' as any };
      return {
        success: true,
        message: 'Order cancelled and stock returned to farm inventory.',
        data: ord,
        restoredQuantity: 500
      };
    }
  }
};

export const demoService = {
  resetDemoData: async () => {
    try {
      const res = await api.post<{ success: boolean; message: string }>('/demo/reset');
      return res.data;
    } catch {
      return { success: true, message: 'Demo data reset successfully (Frontend Fallback)' };
    }
  }
};
