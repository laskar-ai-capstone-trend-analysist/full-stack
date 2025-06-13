'use client';

import { useState, useCallback } from 'react';
import { sentimentApi } from '@/lib/api';
import { SentimentData } from '@/lib/types';

interface UseSentimentReturn {
  sentimentData: SentimentData[];
  loading: boolean;
  error: string | null;
  getSentimentByProduct: (productId: number) => Promise<SentimentData[] | null>;
  clearSentimentData: () => void;
}

export function useSentiment(): UseSentimentReturn {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Function untuk fetch sentiment data by product ID
  const getSentimentByProduct = useCallback(
    async (productId: number): Promise<SentimentData[] | null> => {
      if (!productId) {
        setError('Product ID is required');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          `🔍 [useSentiment] Fetching sentiment data for product ${productId}`
        );

        const data = await sentimentApi.getByProduct(productId);

        // ✅ Enhanced logging untuk debugging
        console.log(`🔍 [useSentiment] Raw sentiment response:`, data);
        console.log(`🔍 [useSentiment] Data type:`, typeof data);
        console.log(`🔍 [useSentiment] Is array:`, Array.isArray(data));

        // ✅ Ensure data is array
        const safeSentimentData = Array.isArray(data) ? data : [];
        setSentimentData(safeSentimentData);

        console.log(
          `✅ [useSentiment] Successfully processed ${safeSentimentData.length} sentiment records`
        );

        // ✅ Log structure of first item if available
        if (safeSentimentData.length > 0) {
          console.log(
            `🔍 [useSentiment] First item structure:`,
            safeSentimentData[0]
          );
        }

        return safeSentimentData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch sentiment data';
        console.error('❌ [useSentiment] Error fetching sentiment data:', err);

        // ✅ Enhanced error logging
        if (err instanceof Error && err.message) {
          console.error('❌ [useSentiment] Error message:', err.message);
        }

        setError(errorMessage);
        setSentimentData([]);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ Function untuk clear sentiment data
  const clearSentimentData = useCallback(() => {
    setSentimentData([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    sentimentData,
    loading,
    error,
    getSentimentByProduct,
    clearSentimentData,
  };
}
