export type UserRole = 'Farmer' | 'FPO' | 'Consumer' | 'Bulk Buyer';

export interface User {
  id: number;
  full_name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  location: string;
  avatar?: string;
}

export interface Produce {
  id: number;
  user_id: number;
  farmer_name?: string;
  crop_name: string;
  category: string;
  quantity_available: number;
  unit: string;
  grade: 'Grade A' | 'Grade B' | 'Standard' | 'Export Quality';
  perishability?: 'Low' | 'Medium' | 'High';
  harvest_date?: string;
  available_from?: string;
  expected_price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  image_url?: string;
  status: 'Available' | 'Partially Allocated' | 'Allocated' | 'Sold Out';
  created_at?: string;
}

export interface BuyerRequirement {
  id: number;
  buyer_id: number;
  buyer_name?: string;
  buyer_org?: string;
  crop_name: string;
  required_quantity: number;
  unit: string;
  required_grade: string;
  max_price: number;
  delivery_location: string;
  required_date: string;
  urgency: string;
  status: 'Open' | 'Matching' | 'Fulfilled' | 'Closed';
  created_at?: string;
}

export interface MatchCompatibility {
  productCompatibility: string;
  gradeMatch: string;
  priceViability: string;
  locationProximity: string;
}

export interface MatchItem {
  produceId: number;
  farmerId: number;
  farmerName: string;
  location: string;
  crop: string;
  availableQuantity: number;
  allocatedQuantity: number;
  unit: string;
  grade: string;
  expectedPrice: number;
  matchScore: number;
  compatibility: MatchCompatibility;
}

export interface MatchResponse {
  success: boolean;
  requirement: BuyerRequirement;
  totalMatchedQuantity: number;
  requiredQuantity: number;
  fulfillmentPercentage: number;
  isFullyFulfillable: boolean;
  matches: MatchItem[];
}

export interface AggregationItem {
  id?: number;
  produce_id: number;
  farmer_id: number;
  farmer_name: string;
  location: string;
  allocated_quantity: number;
  unit_price: number;
  grade: string;
  match_score: number;
}

export interface Aggregation {
  id: number;
  requirement_id?: number;
  buyer_id: number;
  crop_name: string;
  total_quantity: number;
  average_price: number;
  farmer_count: number;
  hub_location: string;
  delivery_destination: string;
  status: string;
  created_at: string;
  items?: AggregationItem[];
}

export interface RouteStop {
  stopOrder: number;
  stopType: 'PICKUP' | 'HUB' | 'DELIVERY';
  locationName: string;
  farmerName: string;
  cropName: string;
  quantityKg: number;
  lat: number;
  lng: number;
  arrivalWindow: string;
  action: string;
  status: string;
}

export interface TransporterOption {
  id: string;
  transporterName: string;
  vehicleType: string;
  capacityKg: number;
  fare: number;
  unitFare: string;
  eta: string;
  pickupCluster: string;
  destination: string;
  coolingType: string;
  isRecommended: boolean;
  recommendationReason: string;
}

export interface OptimizedRoute {
  routeId: string;
  orderId: string;
  vehicle: {
    model: string;
    registration: string;
    driverName: string;
    capacityKg: number;
    loadedKg: number;
    utilizationPercentage: number;
    temperatureSetting: string;
  };
  metrics: {
    estimatedDistanceKm: number;
    totalCorridorDistanceKm: number;
    estimatedDurationText: string;
    estimatedLogisticsCost: number;
    unitLogisticsCost: number;
    co2SavedKg: number;
    fuelEfficiencyScore: string;
  };
  transporterOptions?: TransporterOption[];
  recommendedTransporter?: TransporterOption;
  summary: string;
  stops: RouteStop[];
  polylineCoordinates: [number, number][];
}

export interface OrderTimelineItem {
  step: string;
  isCompleted: boolean;
  isCurrent: boolean;
  timestamp: string | null;
  description: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  buyer_name: string;
  produce_id?: number;
  aggregation_id?: number;
  crop_name: string;
  grade: string;
  total_quantity: number;
  unit_price: number;
  logistics_fee: number;
  platform_fee: number;
  handling_fee: number;
  total_amount: number;
  delivery_location: string;
  status: 'Placed' | 'Matched' | 'Aggregated' | 'Route Planned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Cancelled';
  estimated_delivery?: string;
  created_at?: string;
  timeline?: OrderTimelineItem[];
}

export interface DemandChartPoint {
  date: string;
  fullDate: string;
  actualDemand: number | null;
  predictedDemand: number | null;
  avgPrice: number;
  isForecast: boolean;
}

export interface DemandForecast {
  success: boolean;
  product: string;
  currentDemand: number;
  predictedDemand: number;
  growthPercentage: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'stable';
  recommendation: string;
  action: 'PRODUCE_MORE' | 'HOLD_SUPPLY' | 'MAINTAIN_PACE';
  actionLabel: string;
  headline: string;
  operationalGuidance: string[];
  impactEstimate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  chartData: DemandChartPoint[];
}

export interface PriceBreakdownItem {
  component: string;
  amount: number;
  unit: string;
  percentage: number;
  color: string;
  description: string;
}

export interface PriceBreakdownResponse {
  success: boolean;
  crop: string;
  buyerPricePerKg: number;
  farmerPayoutPerKg: number;
  breakdown: PriceBreakdownItem[];
  comparison: {
    traditionalConsumerPrice: number;
    traditionalFarmerRealization: number;
    middlemanLeakageSaved: number;
    farmerGainPercentage: string;
    buyerSavingPercentage: string;
  };
  farmerViewExample: {
    quantityKg: number;
    expectedNetEarnings: number;
    guaranteedDirectPayout: boolean;
  };
  buyerViewExample: {
    quantityKg: number;
    totalLandedCost: number;
    breakdownTotal: number;
  };
}
