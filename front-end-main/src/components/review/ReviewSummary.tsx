'use client';

import React, { useEffect, useState } from 'react';
import { useReviewSummary } from '@/hooks/useReviewSummary';
import { useSentiment } from '@/hooks/useSentiment'; // ✅ Import hook sentiment
import { FileText, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react'; // ✅ Add BarChart3 icon
import { cn } from '@/lib/utils';

// ✅ Interface untuk rangkuman review
export interface ReviewSummary {
  productId: string;
  summary: string;
}

interface ReviewSummaryProps {
  productId: number;
  title?: string;
  maxLength?: number;
  showMetadata?: boolean;
  className?: string;
  showSentiment?: boolean; // ✅ New prop untuk enable/disable sentiment
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  productId,
  title = 'Ringkasan Review',
  maxLength = 200,
  showMetadata = false,
  className = '',
  showSentiment = false, // ✅ Default false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'sentiment'>(
    'summary'
  ); // ✅ Tab state

  // Existing hooks
  const { summary, loading, error, getReviewSummary } = useReviewSummary();

  // ✅ New sentiment hook
  const {
    sentimentData,
    loading: sentimentLoading,
    error: sentimentError,
    getSentimentByProduct,
  } = useSentiment();

  // ✅ Fetch data saat component mount atau productId berubah
  useEffect(() => {
    if (productId) {
      console.log(`🔄 Fetching data for product ID: ${productId}`);
      getReviewSummary(productId);
      if (showSentiment) {
        getSentimentByProduct(productId); // ✅ Fetch sentiment if enabled
      }
    }
  }, [productId, getReviewSummary, getSentimentByProduct, showSentiment]);

  // ✅ Loading state untuk kedua data
  const isLoading = loading || (showSentiment && sentimentLoading);

  // ✅ Error state - prioritas error summary
  const displayError = error || (showSentiment && sentimentError);

  if (isLoading) {
    return (
      <div className={cn('bg-blue-50 rounded-lg p-6', className)}>
        <div className='flex items-center gap-3 mb-4'>
          <FileText className='w-5 h-5 text-blue-600' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <div className='space-y-2'>
          <div className='h-4 bg-blue-200 rounded animate-pulse'></div>
          <div className='h-4 bg-blue-200 rounded animate-pulse w-4/5'></div>
          <div className='h-4 bg-blue-200 rounded animate-pulse w-3/5'></div>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className={cn('bg-red-50 rounded-lg p-6', className)}>
        <div className='flex items-center gap-3 mb-2'>
          <FileText className='w-5 h-5 text-red-600' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <p className='text-red-600 text-sm'>{displayError}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-6', className)}>
        <div className='flex items-center gap-3 mb-2'>
          <FileText className='w-5 h-5 text-gray-600' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <p className='text-gray-600'>
          Belum ada ringkasan review tersedia untuk produk ini.
        </p>
      </div>
    );
  }

  const shouldTruncate = summary.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded
      ? summary.substring(0, maxLength) + '...'
      : summary;

  return (
    <div className={cn('bg-blue-50 rounded-lg p-6', className)}>
      {/* ✅ Header dengan Tab Navigation */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-blue-600' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>

        {/* ✅ Tab Navigation - hanya tampil jika showSentiment true */}
        {showSentiment && (
          <div className='flex bg-white rounded-lg p-1 shadow-sm'>
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              )}
            >
              <FileText className='w-4 h-4 inline mr-1' />
              Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('sentiment')}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                activeTab === 'sentiment'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              )}
            >
              <BarChart3 className='w-4 h-4 inline mr-1' />
              Sentiment
            </button>
          </div>
        )}
      </div>

      {/* ✅ Content berdasarkan active tab */}
      {activeTab === 'summary' ? (
        <>
          <div className='prose prose-sm max-w-none'>
            <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
              {displayText}
            </p>
          </div>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors'
            >
              {isExpanded ? (
                <>
                  <ChevronUp className='w-4 h-4' />
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <ChevronDown className='w-4 h-4' />
                  Baca Selengkapnya
                </>
              )}
            </button>
          )}
        </>
      ) : (
        // ✅ Sentiment Analysis Content
        <div className='space-y-4'>
          {sentimentData && sentimentData.length > 0 ? (
            <>
              {/* ✅ Sentiment Overview */}
              <div className='grid grid-cols-3 gap-4 mb-6'>
                {sentimentData.map((item, index) => {
                  const total =
                    item.sentiment_positive +
                    item.sentiment_negative +
                    item.sentiment_neutral;
                  const positivePercent =
                    total > 0 ? (item.sentiment_positive / total) * 100 : 0;
                  const negativePercent =
                    total > 0 ? (item.sentiment_negative / total) * 100 : 0;
                  const neutralPercent =
                    total > 0 ? (item.sentiment_neutral / total) * 100 : 0;

                  return (
                    <div key={index} className='text-center'>
                      {/* Positive Sentiment */}
                      <div className='bg-green-100 rounded-lg p-4 mb-2'>
                        <div className='text-2xl font-bold text-green-600'>
                          {positivePercent.toFixed(1)}%
                        </div>
                        <div className='text-sm text-green-700 font-medium'>
                          Positif
                        </div>
                        <div className='text-xs text-green-600 mt-1'>
                          {item.sentiment_positive} review
                        </div>
                      </div>

                      {/* Neutral Sentiment */}
                      <div className='bg-yellow-100 rounded-lg p-4 mb-2'>
                        <div className='text-2xl font-bold text-yellow-600'>
                          {neutralPercent.toFixed(1)}%
                        </div>
                        <div className='text-sm text-yellow-700 font-medium'>
                          Netral
                        </div>
                        <div className='text-xs text-yellow-600 mt-1'>
                          {item.sentiment_neutral} review
                        </div>
                      </div>

                      {/* Negative Sentiment */}
                      <div className='bg-red-100 rounded-lg p-4'>
                        <div className='text-2xl font-bold text-red-600'>
                          {negativePercent.toFixed(1)}%
                        </div>
                        <div className='text-sm text-red-700 font-medium'>
                          Negatif
                        </div>
                        <div className='text-xs text-red-600 mt-1'>
                          {item.sentiment_negative} review
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ✅ Sentiment Bar Chart Visual */}
              <div className='bg-white rounded-lg p-4'>
                <h4 className='text-sm font-semibold text-gray-900 mb-3'>
                  Distribusi Sentiment Review
                </h4>
                {sentimentData.map((item, index) => {
                  const total =
                    item.sentiment_positive +
                    item.sentiment_negative +
                    item.sentiment_neutral;
                  const positivePercent =
                    total > 0 ? (item.sentiment_positive / total) * 100 : 0;
                  const negativePercent =
                    total > 0 ? (item.sentiment_negative / total) * 100 : 0;
                  const neutralPercent =
                    total > 0 ? (item.sentiment_neutral / total) * 100 : 0;

                  return (
                    <div key={index} className='space-y-2'>
                      {/* Progress Bar */}
                      <div className='w-full bg-gray-200 rounded-full h-6 overflow-hidden'>
                        <div className='h-full flex'>
                          {/* Positive bar */}
                          <div
                            className='bg-green-500 h-full transition-all duration-500'
                            style={{ width: `${positivePercent}%` }}
                          />
                          {/* Neutral bar */}
                          <div
                            className='bg-yellow-500 h-full transition-all duration-500'
                            style={{ width: `${neutralPercent}%` }}
                          />
                          {/* Negative bar */}
                          <div
                            className='bg-red-500 h-full transition-all duration-500'
                            style={{ width: `${negativePercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Legend */}
                      <div className='flex justify-between text-xs text-gray-600'>
                        <span className='flex items-center'>
                          <div className='w-3 h-3 bg-green-500 rounded mr-1'></div>
                          Positif ({positivePercent.toFixed(1)}%)
                        </span>
                        <span className='flex items-center'>
                          <div className='w-3 h-3 bg-yellow-500 rounded mr-1'></div>
                          Netral ({neutralPercent.toFixed(1)}%)
                        </span>
                        <span className='flex items-center'>
                          <div className='w-3 h-3 bg-red-500 rounded mr-1'></div>
                          Negatif ({negativePercent.toFixed(1)}%)
                        </span>
                      </div>

                      {/* Total Reviews */}
                      <div className='text-center text-sm text-gray-500 mt-2'>
                        Total: {total} review dianalisis
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // ✅ No Sentiment Data State
            <div className='text-center py-8'>
              <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-2' />
              <p className='text-gray-500 mb-2'>
                Belum ada data sentiment tersedia untuk produk ini.
              </p>
              <p className='text-sm text-gray-400'>
                Analisis sentiment akan muncul setelah ada review yang cukup.
              </p>
            </div>
          )}
        </div>
      )}

      {showMetadata && (
        <div className='mt-4 pt-4 border-t border-blue-200'>
          <p className='text-xs text-gray-500'>
            {activeTab === 'summary'
              ? 'Ringkasan ini dibuat secara otomatis menggunakan AI dari review pelanggan.'
              : 'Analisis sentiment menggunakan AI untuk mengkategorikan review pelanggan.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
