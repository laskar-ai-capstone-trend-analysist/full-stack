// src/lib/api.ts
import axios from 'axios';
import {
  Product,
  Category,
  Review,
  SentimentData,
  ApiResponse,
  RecommendedProduct,
  ReviewSummary,
} from './types';
import { debug } from './debug';
import { errorLogger } from './errorLogger';
import { performanceMonitor } from './performance';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

console.log('🔧 API_BASE_URL:', API_BASE_URL); // Debug log

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increase timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const requestId = `${config.method?.toUpperCase()}_${config.url}_${Date.now()}`;
    debug.apiCall(config.method || 'GET', config.url || '', config.data);
    performanceMonitor.start(`api-${requestId}`);

    // Add request ID to config for response tracking
    config.metadata = { requestId };
    return config;
  },
  (error) => {
    debug.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    const requestId = response.config.metadata?.requestId;
    if (requestId) {
      const duration = performanceMonitor.end(`api-${requestId}`) || 0;
      debug.apiResponse(
        response.config.method || 'GET',
        response.config.url || '',
        response.status,
        duration
      );
    }
    return response;
  },
  (error) => {
    const requestId = error.config?.metadata?.requestId;
    if (requestId) {
      performanceMonitor.end(`api-${requestId}`);
    }

    debug.apiError(
      error.config?.method || 'GET',
      error.config?.url || '',
      error
    );

    // Log to error logger
    errorLogger.logApiError(
      error.config?.method || 'GET',
      error.config?.url || '',
      error.response?.status,
      error.message,
      {
        responseData: error.response?.data,
        requestData: error.config?.data,
      }
    );

    console.error('API Error:', error);
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
      },
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          }
        : 'No response received',
    });

    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Tidak dapat terhubung ke server di ${API_BASE_URL}. Pastikan backend sudah berjalan di port 5000.`
      );
    }
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error(
        `Network error saat mengakses ${API_BASE_URL}. Periksa koneksi atau CORS configuration.`
      );
    }
    return Promise.reject(error);
  }
);

// Add retry mechanism for network errors
const retryRequest = async (
  fn: () => Promise<any>,
  retries = 3
): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.code === 'ECONNREFUSED' ||
        error.code === 'NETWORK_ERROR' ||
        error.message === 'Network Error')
    ) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Enhanced error handling
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler with better error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data = await response.json();

    // Handle backend API response format
    if (data && typeof data === 'object' && 'error' in data) {
      if (data.error === true) {
        throw new ApiError(
          data.message || 'API Error',
          response.status,
          'API_ERROR'
        );
      }
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      'NETWORK_ERROR'
    );
  }
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const operationName = 'productsApi.getAll';

    return retryRequest(async () => {
      try {
        debug.info(`Starting ${operationName}`);
        const response =
          await api.get<ApiResponse<Product[]>>('/getAllProduct');

        if (response.data.error) {
          throw new Error(response.data.message);
        }

        // ✅ Fix: Handle null/undefined data dengan multiple safety checks
        let products = response.data.data;

        if (!products) {
          products = [];
        } else if (!Array.isArray(products)) {
          console.warn('Products data is not an array:', products);
          products = [];
        }

        debug.info(`${operationName} completed successfully`, {
          count: products.length,
        });

        return products;
      } catch (error) {
        errorLogger.logApiError(
          'GET',
          '/getAllProduct',
          undefined,
          `${operationName} failed`
        );
        console.error('Error fetching products:', error);
        throw error;
      }
    });
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<ApiResponse<Product>>(
        `/getProductById/${id}`
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Ensure product data exists
      if (!response.data.data) {
        throw new Error('Product not found');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  getByName: async (name: string): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/getAllProductsByName`,
        {
          params: { name: query },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let products = response.data.data;
      if (!products || !Array.isArray(products)) {
        return [];
      }

      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/getAllProductByCategory`,
        {
          params: { category: categoryId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let products = response.data.data;
      if (!products || !Array.isArray(products)) {
        return [];
      }

      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // ✅ Tambahan method untuk rekomendasi produk
  getRecommendations: async (
    productId: number
  ): Promise<RecommendedProduct[]> => {
    try {
      const response = await api.get<ApiResponse<RecommendedProduct[]>>(
        `/getRecommendProducts`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let recommendations = response.data.data;
      if (!recommendations || !Array.isArray(recommendations)) {
        return [];
      }

      return recommendations;
    } catch (error) {
      console.error('Error fetching product recommendations:', error);
      throw error;
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response =
        await api.get<ApiResponse<Category[]>>('/getAllCategory');
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let categories = response.data.data;
      if (!categories || !Array.isArray(categories)) {
        return [];
      }

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

// Reviews API
export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>('/getAllReview');
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let reviews = response.data.data;
      if (!reviews || !Array.isArray(reviews)) {
        return [];
      }

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  getByProduct: async (productId: number): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>(
        `/getAllReviewByProduct`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let reviews = response.data.data;
      if (!reviews || !Array.isArray(reviews)) {
        return [];
      }

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by product ID:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId: number): Promise<Review[]> => {
    try {
      const response = await api.get<ApiResponse<Review[]>>(
        `/getAllReviewByCategory`,
        {
          params: { category: categoryId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let reviews = response.data.data;
      if (!reviews || !Array.isArray(reviews)) {
        return [];
      }

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by category:', error);
      throw error;
    }
  },

  // ✅ Tambahan method untuk rangkuman review
  getSummary: async (productId: number): Promise<ReviewSummary> => {
    try {
      const response = await api.get<ApiResponse<ReviewSummary>>(
        `/getReviewsSumOfProduct`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Ensure summary data exists
      if (!response.data.data) {
        throw new Error('Review summary not found');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching review summary:', error);
      throw error;
    }
  },
};

// Sentiment API
export const sentimentApi = {
  getByProduct: async (productId: number): Promise<SentimentData[]> => {
    try {
      const response = await api.get<ApiResponse<SentimentData[]>>(
        `/getSentimentByProduct`,
        {
          params: { product: productId.toString() },
        }
      );
      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling
      let sentiments = response.data.data;
      if (!sentiments || !Array.isArray(sentiments)) {
        return [];
      }

      return sentiments;
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      throw error;
    }
  },
};

// Health API
export const healthApi = {
  check: async (): Promise<boolean> => {
    try {
      const response = await api.get('/');
      return !response.data.error;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

// Utility function for health check
export const healthCheck = (): Promise<{ status: string }> =>
  apiRequest<{ status: string }>('/');

// Export all APIs
export const api = {
  products: productsApi,
  categories: categoriesApi,
  reviews: reviewsApi,
  sentiment: sentimentApi,
  healthCheck,
};

export default api;
