// src/hooks/useSentiment.ts
import { useState, useCallback } from 'react';
import { sentimentApi } from '@/lib/api';
import { SentimentData } from '@/lib/types';

export const useSentiment = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSentimentByProduct = useCallback(
    async (productId: number) => {
      if (!productId) {
        console.warn('Product ID is required for fetching sentiment');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`🔍 Fetching sentiment for product ${productId}`);
        const data = await sentimentApi.getByProduct(productId);

        const safeSentiment = Array.isArray(data) ? data : [];
        setSentimentData(safeSentiment);

        console.log(`✅ Successfully fetched sentiment data`);
        return safeSentiment;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch sentiment';
        console.error('❌ Error fetching sentiment:', err);
        setError(errorMessage);
        setSentimentData([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [sentimentApi]
  );

  const clearSentiment = useCallback(() => {
    setSentimentData([]);
    setError(null);
  }, []);

  return {
    sentimentData,
    loading,
    error,
    getSentimentByProduct,
    clearSentiment,
  };
};
