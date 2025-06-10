'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Product, RecommendedProduct } from '@/lib/types';
import { productsApi } from '@/lib/api';
import { debug } from '@/lib/debug';
import { errorLogger } from '@/lib/errorLogger';
import { performanceMonitor } from '@/lib/performance';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Tambahan state untuk rekomendasi
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(
    []
  );
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<
    string | null
  >(null);

  const fetchProducts = useCallback(async () => {
    const operationName = 'fetchProducts';
    try {
      performanceMonitor.start(operationName);
      setLoading(true);
      setError(null);

      const data = await productsApi.getAll();

      // ✅ Double check for safety
      const safeData = Array.isArray(data) ? data : [];
      setProducts(safeData);

      const duration = performanceMonitor.end(operationName);
      debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data produk';
      errorLogger.logComponentError(
        'useProducts',
        `${operationName} failed`,
        err instanceof Error ? err : new Error(String(err))
      );
      setError(errorMessage);
      setProducts([]); // ✅ Set to empty array on error
      debug.error(`Error in ${operationName}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(
    async (query: string) => {
      const operationName = 'searchProducts';
      try {
        if (!query.trim()) {
          await fetchProducts();
          return;
        }

        performanceMonitor.start(operationName, { query });
        setLoading(true);
        setError(null);

        const data = await productsApi.search(query);

        // ✅ Safe data handling
        const safeData = Array.isArray(data) ? data : [];
        setProducts(safeData);

        const duration = performanceMonitor.end(operationName);
        debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`, {
          query,
          resultsCount: safeData.length,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mencari produk';
        errorLogger.logComponentError(
          'useProducts',
          `${operationName} failed`,
          err instanceof Error ? err : new Error(String(err))
        );
        setError(errorMessage);
        setProducts([]); // ✅ Set to empty array on error
        debug.error(`Error in ${operationName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const filterByCategory = useCallback(async (categoryId: number) => {
    const operationName = 'filterByCategory';
    try {
      performanceMonitor.start(operationName, { categoryId });
      setLoading(true);
      setError(null);

      const data = await productsApi.getByCategory(categoryId);

      // ✅ Safe data handling
      const safeData = Array.isArray(data) ? data : [];
      setProducts(safeData);

      const duration = performanceMonitor.end(operationName);
      debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`, {
        categoryId,
        resultsCount: safeData.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memfilter produk';
      errorLogger.logComponentError(
        'useProducts',
        `${operationName} failed`,
        err instanceof Error ? err : new Error(String(err))
      );
      setError(errorMessage);
      setProducts([]); // ✅ Set to empty array on error
      debug.error(`Error in ${operationName}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(
    async (id: number): Promise<Product | null> => {
      try {
        const product = await productsApi.getById(id);
        return product || null;
      } catch (err) {
        console.error('Error fetching product by ID:', err);
        return null;
      }
    },
    []
  );

  // ✅ Tambahkan fungsi untuk mendapatkan trending products
  const getTrendingProducts = useCallback(
    (limit = 8) => {
      if (!Array.isArray(products) || products.length === 0) {
        console.log('No products available for trending');
        return [];
      }

      // Filter produk yang tersedia dan sort berdasarkan kriteria trending
      const availableProducts = products.filter(
        (product) => product && product.stock > 0
      );

      if (availableProducts.length === 0) {
        console.log('No products with stock available');
        return products.slice(0, limit); // Return all products if none have stock
      }

      return availableProducts
        .sort((a, b) => {
          // Primary: Discount tertinggi
          const discountA = a.discount || 0;
          const discountB = b.discount || 0;
          if (discountB !== discountA) {
            return discountB - discountA;
          }

          // Secondary: Stock terbanyak
          const stockDiff = b.stock - a.stock;
          if (stockDiff !== 0) {
            return stockDiff;
          }

          // Tertiary: Harga terendah
          return a.currentPrice - b.currentPrice;
        })
        .slice(0, limit);
    },
    [products]
  );

  // ✅ Tambahan fungsi untuk mendapatkan rekomendasi produk
  const getRecommendations = useCallback(async (productId: number) => {
    const operationName = 'getRecommendations';
    try {
      performanceMonitor.start(operationName, { productId });
      setRecommendationsLoading(true);
      setRecommendationsError(null);

      const data = await productsApi.getRecommendations(productId);

      // ✅ Safe data handling
      const safeData = Array.isArray(data) ? data : [];
      setRecommendations(safeData);

      const duration = performanceMonitor.end(operationName);
      debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`, {
        productId,
        recommendationsCount: safeData.length,
      });

      return safeData;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil rekomendasi produk';
      errorLogger.logComponentError(
        'useProducts',
        `${operationName} failed`,
        err instanceof Error ? err : new Error(String(err))
      );
      setRecommendationsError(errorMessage);
      setRecommendations([]); // ✅ Set to empty array on error
      debug.error(`Error in ${operationName}:`, err);
      return [];
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  // ✅ Clear recommendations function
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setRecommendationsError(null);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memastikan produk selalu dalam format yang aman
  const safeProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      currentPrice: product.currentPrice ? Number(product.currentPrice) : 0,
      discount: product.discount ? Number(product.discount) : 0,
      stock: product.stock ? Number(product.stock) : 0,
    }));
  }, [products]);

  return {
    products: safeProducts,
    loading,
    error,
    refetch: fetchProducts,
    searchProducts,
    filterByCategory,
    getTrendingProducts,
    getProductById,

    // ✅ Tambahan returns untuk rekomendasi
    recommendations,
    recommendationsLoading,
    recommendationsError,
    getRecommendations,
    clearRecommendations,
  };
}
