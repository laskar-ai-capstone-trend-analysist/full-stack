'use client';

import React, { useEffect, useState } from 'react';
import { ReviewSummary as ReviewSummaryType } from '@/lib/types';
import { useReviews } from '@/hooks/useReviews';
import { MessageSquare, Loader2, AlertCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSummaryProps {
  productId: number;
  className?: string;
  title?: string;
  maxLength?: number;
  showMetadata?: boolean;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  productId,
  className,
  title = 'Rangkuman Review',
  maxLength = 500,
  showMetadata = true,
}) => {
  const { summary, summaryLoading, summaryError, getReviewSummary } =
    useReviews();

  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedSummary, setTruncatedSummary] = useState<string>('');

  // Fetch summary when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      getReviewSummary(productId);
    }
  }, [productId, getReviewSummary]);

  // Handle text truncation
  useEffect(() => {
    if (summary?.summary) {
      if (summary.summary.length > maxLength) {
        setTruncatedSummary(summary.summary.substring(0, maxLength) + '...');
      } else {
        setTruncatedSummary(summary.summary);
      }
    }
  }, [summary, maxLength]);

  // Toggle expand/collapse
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if summary needs truncation
  const needsTruncation =
    summary?.summary && summary.summary.length > maxLength;

  // Show loading state
  if (summaryLoading) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-6',
          className
        )}
      >
        <div className='flex items-center mb-4'>
          <FileText className='w-5 h-5 text-gray-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-6 h-6 animate-spin text-blue-600' />
          <span className='ml-2 text-gray-600'>
            Membuat rangkuman review...
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (summaryError) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-6',
          className
        )}
      >
        <div className='flex items-center mb-4'>
          <FileText className='w-5 h-5 text-gray-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <AlertCircle className='w-5 h-5 text-red-500 mr-2' />
            <p className='text-red-700'>
              Gagal memuat rangkuman: {summaryError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!summary || !summary.summary) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-6',
          className
        )}
      >
        <div className='flex items-center mb-4'>
          <FileText className='w-5 h-5 text-gray-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
          <MessageSquare className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600'>
            Belum ada rangkuman review tersedia untuk produk ini.
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Rangkuman akan dibuat otomatis setelah tersedia cukup review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6',
        className
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <FileText className='w-5 h-5 text-gray-600 mr-2' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        {showMetadata && (
          <div className='flex items-center text-sm text-gray-500'>
            <MessageSquare className='w-4 h-4 mr-1' />
            <span>AI Generated</span>
          </div>
        )}
      </div>

      {/* Summary Content */}
      <div className='space-y-4'>
        <div className='prose prose-gray max-w-none'>
          <p className='text-gray-700 leading-relaxed'>
            {isExpanded ? summary.summary : truncatedSummary}
          </p>
        </div>

        {/* Expand/Collapse Button */}
        {needsTruncation && (
          <div className='pt-2'>
            <button
              onClick={handleToggleExpand}
              className='text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors'
            >
              {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
            </button>
          </div>
        )}

        {/* Metadata */}
        {showMetadata && (
          <div className='pt-4 border-t border-gray-100'>
            <div className='flex items-center justify-between text-xs text-gray-500'>
              <span>Ringkasan dibuat dengan AI dari review pelanggan</span>
              <div className='flex items-center'>
                <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                <span>Terbaru</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Disclaimer */}
      <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
        <p className='text-xs text-blue-700'>
          <span className='font-medium'>💡 Info:</span> Rangkuman ini dibuat
          secara otomatis oleh AI berdasarkan analisis review pelanggan. Hasil
          mungkin tidak mencerminkan seluruh aspek produk.
        </p>
      </div>
    </div>
  );
};

export default ReviewSummary;
