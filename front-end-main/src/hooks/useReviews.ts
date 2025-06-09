import { useState } from 'react';
import { Review } from '@/lib/types';
import { reviewsApi } from '@/lib/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    fetchReviewsByCategory,
    fetchAllReviews,
    clearReviews,
    getAverageRating,
    getRatingDistribution,
  };
};
