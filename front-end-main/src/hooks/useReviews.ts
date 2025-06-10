import { useState, useCallback } from 'react';
import { Review, ReviewSummary } from '@/lib/types';
import { reviewsApi } from '@/lib/api';
import { debug } from '@/lib/debug';
import { errorLogger } from '@/lib/errorLogger';
import { performanceMonitor } from '@/lib/performance';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Tambahan state untuk review summary
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const fetchReviews = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getByProductId(productId);
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil review'
      );
      console.error('Error in fetchReviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsByCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getByCategory(categoryId);
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil review kategori'
      );
      console.error('Error in fetchReviewsByCategory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsApi.getAll();
      setReviews(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil semua review'
      );
      console.error('Error in fetchAllReviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearReviews = () => {
    setReviews([]);
    setError(null);
  };

  // Calculate average rating from reviews
  const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  // ✅ Tambahan fungsi untuk mendapatkan rangkuman review
  const getReviewSummary = useCallback(async (productId: number) => {
    const operationName = 'getReviewSummary';
    try {
      performanceMonitor.start(operationName, { productId });
      setSummaryLoading(true);
      setSummaryError(null);

      const data = await reviewsApi.getSummary(productId);
      setSummary(data);

      const duration = performanceMonitor.end(operationName);
      debug.info(`${operationName} completed in ${duration?.toFixed(2)}ms`, {
        productId,
        summaryLength: data?.summary?.length || 0,
      });

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil rangkuman review';
      errorLogger.logComponentError(
        'useReviews',
        `${operationName} failed`,
        err instanceof Error ? err : new Error(String(err))
      );
      setSummaryError(errorMessage);
      setSummary(null);
      debug.error(`Error in ${operationName}:`, err);
      return null;
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ✅ Clear summary function
  const clearSummary = useCallback(() => {
    setSummary(null);
    setSummaryError(null);
  }, []);

  return {
    // Existing returns
    reviews,
    loading,
    error,
    fetchReviewsByProduct,
    fetchReviewsByCategory,
    fetchAllReviews,
    clearReviews,
    getAverageRating,

    // ✅ Tambahan returns untuk summary
    summary,
    summaryLoading,
    summaryError,
    getReviewSummary,
    clearSummary,
  };
}
