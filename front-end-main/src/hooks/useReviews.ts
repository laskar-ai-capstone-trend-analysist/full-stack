import { useState, useCallback } from 'react';
import { reviewsApi } from '@/lib/api';
import { Review } from '@/lib/types';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Function untuk fetch reviews by product
  const fetchReviewsByProduct = useCallback(async (productId: number) => {
    if (!productId) {
      console.warn('Product ID is required for fetching reviews');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching reviews for product ${productId}`);
      const data = await reviewsApi.getByProduct(productId);

      // Ensure data is array
      const safeReviews = Array.isArray(data) ? data : [];
      setReviews(safeReviews);

      console.log(`✅ Successfully fetched ${safeReviews.length} reviews`);
      return safeReviews;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch reviews';
      console.error('❌ Error fetching reviews:', err);
      setError(errorMessage);
      setReviews([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Function untuk clear reviews
  const clearReviews = useCallback(() => {
    setReviews([]);
    setError(null);
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchReviewsByProduct, // ✅ Export function yang dibutuhkan
    clearReviews,
  };
};
