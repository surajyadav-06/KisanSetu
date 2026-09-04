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
  PriceBreakdownResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisansetu_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  getDemoUsers: async () => {
    const res = await api.get<{ success: boolean; users: User[] }>('/auth/demo-users');
    return res.data.users;
  },
  login: async (email: string, password = 'password123') => {
    const res = await api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
      email,
      password
    });
    if (res.data.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
    }
    return res.data;
  },
  register: async (data: Partial<User> & { password?: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
    }
    return res.data;
  }
};

export const produceService = {
  getMarketplace: async (params?: { category?: string; location?: string; grade?: string; search?: string; maxPrice?: number }) => {
    const res = await api.get<{ success: boolean; count: number; data: Produce[] }>('/marketplace', { params });
    return res.data.data;
  },
  getFarmerProduce: async (userId?: number) => {
    const res = await api.get<{ success: boolean; count: number; data: Produce[] }>('/produce', {
      params: { userId }
    });
    return res.data.data;
  },
  getFarmerMetrics: async (userId?: number) => {
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
    return res.data;
  },
  addProduce: async (data: Partial<Produce>) => {
    const res = await api.post<{ success: boolean; message: string; data: Produce }>('/produce', data);
    return res.data;
  }
};

export const buyerService = {
  getRequirements: async (buyerId?: number) => {
    const res = await api.get<{ success: boolean; count: number; data: BuyerRequirement[] }>('/buyer/requirements', {
      params: { buyerId }
    });
    return res.data.data;
  },
  createRequirement: async (data: Partial<BuyerRequirement>) => {
    const res = await api.post<{ success: boolean; message: string; data: BuyerRequirement }>('/buyer/requirements', data);
    return res.data;
  },
  getMatches: async (requirementId: number | string) => {
    const res = await api.get<MatchResponse>(`/matches/${requirementId}`);
    return res.data;
  }
};

export const aggregationService = {
  createAggregatedOrder: async (payload: {
    requirement_id?: number;
    buyer_id?: number;
    buyer_name?: string;
    selected_matches: any[];
  }) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      aggregationId: number;
      orderId: number;
      routeId: number;
      orderNumber: string;
      totalQuantity: number;
      averagePrice: number;
      farmerCount: number;
      totalOrderAmount: number;
    }>('/aggregation/create', payload);
    return res.data;
  },
  getAggregations: async () => {
    const res = await api.get<{ success: boolean; data: Aggregation[] }>('/aggregations');
    return res.data.data;
  }
};

export const logisticsService = {
  optimizeRoute: async (orderId?: string | number, stops?: any[]) => {
    const res = await api.post<{ success: boolean; data: OptimizedRoute }>('/routes/optimize', { orderId, stops });
    return res.data.data;
  },
  getLatestRoute: async () => {
    const res = await api.get<{ success: boolean; data: OptimizedRoute }>('/routes/latest');
    return res.data.data;
  }
};

export const demandService = {
  getForecast: async (crop = 'Tomato', days = 14) => {
    const res = await api.get<DemandForecast>('/demand/forecast', { params: { crop, days } });
    return res.data;
  },
  getAllInsights: async () => {
    const res = await api.get<{ success: boolean; data: any[] }>('/demand/insights');
    return res.data.data;
  }
};

export const priceService = {
  getPriceBreakdown: async (crop = 'Tomato') => {
    const res = await api.get<PriceBreakdownResponse>(`/price-breakdown/${crop}`);
    return res.data;
  }
};

export const orderService = {
  getOrders: async (buyerId?: number) => {
    const res = await api.get<{ success: boolean; count: number; data: Order[] }>('/orders', { params: { buyerId } });
    return res.data.data;
  },
  getOrderById: async (id: number | string) => {
    const res = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return res.data.data;
  },
  updateStatus: async (id: number | string, status: string) => {
    const res = await api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, { status });
    return res.data;
  },
  createConsumerOrder: async (data: any) => {
    const res = await api.post<{ success: boolean; message: string; orderId: number; orderNumber: string; totalAmount: number }>('/orders/consumer', data);
    return res.data;
  },
  cancelOrder: async (id: number | string) => {
    const res = await api.post<{ success: boolean; message: string; data: Order; restoredQuantity: number }>(`/orders/${id}/cancel`);
    return res.data;
  }
};

export const demoService = {
  resetDemoData: async () => {
    const res = await api.post<{ success: boolean; message: string }>('/demo/reset');
    return res.data;
  }
};
