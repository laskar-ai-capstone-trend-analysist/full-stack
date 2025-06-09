'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product } from '@/types';
import { productsApi } from '@/lib/api';
import { debug } from '@/lib/debug';
import { performanceMonitor } from '@/lib/performance';
import { errorLogger } from '@/lib/errorLogger';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    (limit: number = 8) => {
      if (!Array.isArray(products)) return [];

      // Sort berdasarkan kriteria trending:
      // 1. Discount tertinggi
      // 2. Stock tersedia
      // 3. Harga competitive
      return products
        .filter((product) => product && product.stock > 0) // Hanya produk yang tersedia
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    searchProducts,
    filterByCategory,
    getProductById,
    getTrendingProducts, // ✅ Export fungsi baru
  };
}
