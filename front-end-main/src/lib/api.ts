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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('🔧 API_BASE_URL:', API_BASE_URL); // Debug log

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // ✅ Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add retry functionality
const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      console.log(`🔄 Retrying request, ${retries} attempts left...`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    if (config.params) {
      console.log('📋 Request params:', config.params);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced error interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    // ✅ Better error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - Backend server might be down');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Server taking too long to respond');
    }

    return Promise.reject(error);
  }
);

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    return retryRequest(async () => {
      try {
        console.log('📦 Fetching all products...');

        const response =
          await api.get<ApiResponse<Product[]>>('/getAllProduct');

        console.log('📦 Raw API response:', response.data);

        if (response.data.error) {
          throw new Error(response.data.message || 'Failed to fetch products');
        }

        let products = response.data.data;
        if (!products || !Array.isArray(products)) {
          console.warn('⚠️ Products data is not an array:', products);
          return [];
        }

        console.log(`✅ Successfully fetched ${products.length} products`);
        return products;
      } catch (error) {
        console.error('❌ Error in getAll products:', error);

        // ✅ Enhanced error logging
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error(
              'Response error:',
              error.response.status,
              error.response.data
            );
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Request setup error:', error.message);
          }
        }

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

  // Fix: Parameter name yang salah
  search: async (query: string): Promise<Product[]> => {
    return retryRequest(async () => {
      try {
        console.log(`🔍 Searching products with query: "${query}"`);

        if (!query || query.trim().length < 2) {
          console.log('⚠️ Query too short, returning empty array');
          return [];
        }

        const cleanQuery = query.trim();
        const response = await api.get(`/getAllProductsByName`, {
          params: { name: cleanQuery },
        });

        if (response.data.error) {
          console.error(`❌ Backend error: ${response.data.message}`);
          throw new Error(response.data.message || 'Search failed');
        }

        const products = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log(`✅ Found ${products.length} products for "${cleanQuery}"`);

        return products;
      } catch (error) {
        console.error('❌ Search products failed:', error);
        // ✅ Return empty array instead of throwing to prevent UI crash
        return [];
      }
    });
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    return retryRequest(async () => {
      try {
        console.log(`📦 Fetching products for category: ${categoryId}`);

        const response = await api.get<ApiResponse<Product[]>>(
          `/getAllProductByCategory`,
          {
            params: { category: categoryId.toString() },
          }
        );

        if (response.data.error) {
          throw new Error(
            response.data.message || 'Failed to fetch products by category'
          );
        }

        const products = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        console.log(
          `✅ Found ${products.length} products for category ${categoryId}`
        );

        return products;
      } catch (error) {
        console.error('❌ Error fetching products by category:', error);
        throw error;
      }
    });
  },

  // Fix: Method untuk rekomendasi produk
  getRecommendations: async (
    productId: number
  ): Promise<RecommendedProduct[]> => {
    try {
      console.log(`🔍 Fetching recommendations for product ${productId}`);

      const response = await api.get<ApiResponse<RecommendedProduct[]>>(
        `/getRecommendProducts`,
        {
          params: { product: productId.toString() },
          timeout: 30000, // Extended timeout for AI processing
        }
      );

      console.log('🔍 Recommendations API response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Safe array handling dengan logging
      let recommendations = response.data.data;
      if (!recommendations) {
        console.warn('No recommendations data received');
        return [];
      }

      if (!Array.isArray(recommendations)) {
        console.warn('Recommendations data is not an array:', recommendations);
        return [];
      }

      console.log(
        `✅ Successfully fetched ${recommendations.length} recommendations`
      );
      return recommendations;
    } catch (error) {
      console.error('❌ Error fetching product recommendations:', error);

      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

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

  // Method untuk rangkuman review
  getSummary: async (productId: number): Promise<ReviewSummary> => {
    try {
      console.log(`🔍 Fetching review summary for product ${productId}`);
      const response = await api.get(`/getReviewsSumOfProduct`, {
        params: {
          product: productId.toString(),
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('🔍 Review summary API response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // ✅ Ensure summary data exists
      if (!response.data.data) {
        throw new Error('Review summary not found');
      }

      console.log('✅ Successfully fetched review summary');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching review summary:', error);

      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      throw error;
    }
  },
};

// Sentiment API
export const sentimentApi = {
  getByProduct: async (productId: number): Promise<SentimentData[]> => {
    return retryRequest(async () => {
      try {
        console.log(`🔍 Fetching sentiment data for product ${productId}`);

        const response = await api.get<ApiResponse<SentimentData[]>>(
          `/getSentimentByProduct`,
          {
            params: { product: productId.toString() },
            timeout: 30000, // Extended timeout for AI processing
          }
        );

        console.log('🔍 Sentiment API response:', response.data);

        if (response.data.error) {
          throw new Error(response.data.message);
        }

        // ✅ Safe array handling dengan logging
        let sentimentData = response.data.data;
        if (!sentimentData) {
          console.warn('No sentiment data received');
          return [];
        }

        if (!Array.isArray(sentimentData)) {
          console.warn('Sentiment data is not an array:', sentimentData);
          return [];
        }

        console.log(
          `✅ Successfully fetched ${sentimentData.length} sentiment records`
        );
        return sentimentData;
      } catch (error) {
        console.error('❌ Error fetching sentiment data:', error);
        throw error;
      }
    });
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

// Export all APIs
export const apiClient = {
  products: productsApi,
  categories: categoriesApi,
  reviews: reviewsApi,
  sentiment: sentimentApi, // ✅ Add sentiment API
  health: healthApi,
};

export default apiClient;
