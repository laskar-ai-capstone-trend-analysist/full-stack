import { useState, useCallback } from 'react';
import { reviewsApi } from '@/lib/api';
import { ReviewSummary } from '@/lib/types';

export const useReviewSummary = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReviewSummary = useCallback(async (productId: number) => {
    if (!productId) {
      console.warn('Product ID is required for review summary');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching review summary for product ${productId}`);
      const data = await reviewsApi.getSummary(productId);

      // Extract summary text from response
      const summaryText =
        typeof data === 'string'
          ? data
          : data?.summary || 'Tidak ada ringkasan tersedia';
      setSummary(summaryText);

      console.log(`✅ Successfully fetched review summary`);
      return summaryText;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch review summary';
      console.error('❌ Error fetching review summary:', err);
      setError(errorMessage);
      setSummary(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSummary = useCallback(() => {
    setSummary(null);
    setError(null);
  }, []);

  return {
    summary,
    loading,
    error,
    getReviewSummary,
    clearSummary,
  };
};
