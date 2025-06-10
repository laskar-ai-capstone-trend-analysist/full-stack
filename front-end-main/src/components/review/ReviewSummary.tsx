'use client';

import React, { useEffect, useState } from 'react';
import { useReviewSummary } from '@/hooks/useReviewSummary';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
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
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  productId,
  title = 'Ringkasan Review',
  maxLength = 200,
  showMetadata = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { summary, loading, error, getReviewSummary } = useReviewSummary();

  useEffect(() => {
    if (productId) {
      getReviewSummary(productId);
    }
  }, [productId, getReviewSummary]);

  if (loading) {
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

  if (error) {
    return (
      <div className={cn('bg-red-50 rounded-lg p-6', className)}>
        <div className='flex items-center gap-3 mb-2'>
          <FileText className='w-5 h-5 text-red-600' />
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
        <p className='text-red-600 text-sm'>{error}</p>
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
      <div className='flex items-center gap-3 mb-4'>
        <FileText className='w-5 h-5 text-blue-600' />
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
      </div>

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

      {showMetadata && (
        <div className='mt-4 pt-4 border-t border-blue-200'>
          <p className='text-xs text-gray-500'>
            Ringkasan ini dibuat secara otomatis menggunakan AI dari review
            pelanggan.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
