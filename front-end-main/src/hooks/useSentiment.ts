// src/hooks/useSentiment.ts
import { useState } from 'react';
import { SentimentData } from '@/lib/types';
import { sentimentApi } from '@/lib/api';

export const useSentiment = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSentimentByProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await sentimentApi.getByProductId(productId);
      setSentimentData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data sentiment'
      );
      console.error('Error in fetchSentimentByProduct:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSentiment = () => {
    setSentimentData([]);
    setError(null);
  };

  // Get sentiment summary for a product
  const getSentimentSummary = (productId: number) => {
    const productSentiment = sentimentData.find(
      (s) => s.productId === productId
    );

    if (!productSentiment) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
        total: 0,
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0,
        dominantSentiment: 'neutral' as const,
      };
    }

    const { sentiment_positive, sentiment_neutral, sentiment_negative } =
      productSentiment;
    const total = sentiment_positive + sentiment_neutral + sentiment_negative;

    if (total === 0) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
        total: 0,
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0,
        dominantSentiment: 'neutral' as const,
      };
    }

    const positivePercentage = (sentiment_positive / total) * 100;
    const neutralPercentage = (sentiment_neutral / total) * 100;
    const negativePercentage = (sentiment_negative / total) * 100;

    // Determine dominant sentiment
    let dominantSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (
      sentiment_positive > sentiment_neutral &&
      sentiment_positive > sentiment_negative
    ) {
      dominantSentiment = 'positive';
    } else if (
      sentiment_negative > sentiment_neutral &&
      sentiment_negative > sentiment_positive
    ) {
      dominantSentiment = 'negative';
    }

    return {
      positive: sentiment_positive,
      neutral: sentiment_neutral,
      negative: sentiment_negative,
      total,
      positivePercentage: Math.round(positivePercentage * 10) / 10,
      neutralPercentage: Math.round(neutralPercentage * 10) / 10,
      negativePercentage: Math.round(negativePercentage * 10) / 10,
      dominantSentiment,
    };
  };

  // Get sentiment color based on dominant sentiment
  const getSentimentColor = (productId: number) => {
    const summary = getSentimentSummary(productId);
    switch (summary.dominantSentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get sentiment label based on dominant sentiment
  const getSentimentLabel = (productId: number) => {
    const summary = getSentimentSummary(productId);
    switch (summary.dominantSentiment) {
      case 'positive':
        return 'Positif';
      case 'negative':
        return 'Negatif';
      default:
        return 'Netral';
    }
  };

  return {
    sentimentData,
    loading,
    error,
    fetchSentimentByProduct,
    clearSentiment,
    getSentimentSummary,
    getSentimentColor,
    getSentimentLabel,
  };
};
