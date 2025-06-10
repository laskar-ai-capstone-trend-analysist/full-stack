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

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Reduce timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // ✅ Add retry configuration
  retry: 3,
  retryDelay: 1000,
});

// Enhanced retry mechanism
const retryRequest = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (error) {
    if (
      retries > 0 &&
      (error.code === 'ECONNREFUSED' ||
        error.code === 'NETWORK_ERROR' ||
        error.message === 'Network Error' ||
        error.response?.status >= 500)
    ) {
      console.log(`🔄 Retrying request... ${retries} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Products API with better error handling
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    return retryRequest(async () => {
      try {
        console.log('📦 Fetching products...');
        const response =
          await api.get<ApiResponse<Product[]>>('/getAllProduct');

        if (response.data.error) {
          throw new Error(response.data.message);
        }

        let products = response.data.data;
        if (!products || !Array.isArray(products)) {
          products = [];
        }

        console.log(`✅ Fetched ${products.length} products`);
        return products;
      } catch (error) {
        console.error('❌ Error fetching products:', error);
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

  // ✅ Fix: Parameter name yang salah
  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/getAllProductsByName`,
        {
          params: { name: query }, // ✅ Fix: gunakan 'name' bukan 'query'
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

  // ✅ Fix: Method untuk rekomendasi produk
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

  // ✅ Method untuk rangkuman review
  getSummary: async (productId: number): Promise<ReviewSummary> => {
    try {
      console.log(`🔍 Fetching review summary for product ${productId}`);

      const response = await api.get<ApiResponse<ReviewSummary>>(
        `/getReviewsSumOfProduct`,
        {
          params: { product: productId.toString() },
          timeout: 30000, // Extended timeout for AI processing
        }
      );

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

// Export all APIs
export const apiClient = {
  products: productsApi,
  categories: categoriesApi,
  reviews: reviewsApi,
  sentiment: sentimentApi,
  health: healthApi,
};

export default apiClient;
