'use client';

import React, { useEffect, useState } from 'react';
import { Product, RecommendedProduct } from '@/lib/types';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Tag,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReviews } from '@/hooks/useReviews';
import { useSentiment } from '@/hooks/useSentiment';
import ProductRecommendations from './ProductRecommendations';
import ReviewSummary from '../review/ReviewSummary';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: RecommendedProduct) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onProductSelect,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'reviews' | 'recommendations'
  >('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    reviews,
    fetchReviewsByProduct,
    loading: reviewsLoading,
    getAverageRating,
  } = useReviews();

  const {
    sentimentData,
    getSentimentByProduct,
    loading: sentimentLoading,
  } = useSentiment();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && product) {
      setActiveTab('overview');
      fetchReviewsByProduct(product.id);
      getSentimentByProduct(product.id);
    }
  }, [isOpen, product, fetchReviewsByProduct, getSentimentByProduct]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle recommendation product click
  const handleRecommendationClick = (
    recommendedProduct: RecommendedProduct
  ) => {
    if (onProductSelect) {
      onProductSelect(recommendedProduct);
    }
    // Modal akan tetap terbuka dan menampilkan produk baru
  };

  // Calculate discount percentage
  const calculateDiscount = (original: number, current: number): number => {
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get sentiment summary
  const getSentimentSummary = () => {
    if (!sentimentData || sentimentData.length === 0) return null;

    const positive = sentimentData.filter(
      (s) => s.sentiment === 'positive'
    ).length;
    const negative = sentimentData.filter(
      (s) => s.sentiment === 'negative'
    ).length;
    const neutral = sentimentData.filter(
      (s) => s.sentiment === 'neutral'
    ).length;
    const total = sentimentData.length;

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      total,
    };
  };

  if (!isOpen || !product) return null;

  const discount = calculateDiscount(
    product.originalPrice,
    product.currentPrice
  );
  const averageRating = getAverageRating();
  const sentimentSummary = getSentimentSummary();

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative min-h-screen flex items-center justify-center p-4'>
        <div className='relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
          {/* Header */}
          <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10'>
            <h2 className='text-xl font-semibold text-gray-900 truncate pr-4'>
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          {/* Content */}
          <div className='overflow-y-auto max-h-[calc(90vh-80px)]'>
            {/* Product Info Section */}
            <div className='p-6 border-b border-gray-200'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Product Image */}
                <div className='space-y-4'>
                  <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className='w-full h-full object-cover'
                    />
                    {discount > 0 && (
                      <div className='absolute top-4 left-4'>
                        <span className='bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium'>
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className='space-y-6'>
                  {/* Price */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                      <span className='text-3xl font-bold text-gray-900'>
                        {formatPrice(product.currentPrice)}
                      </span>
                      {discount > 0 && (
                        <span className='text-lg text-gray-500 line-through'>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <p className='text-green-600 font-medium'>
                        Hemat{' '}
                        {formatPrice(
                          product.originalPrice - product.currentPrice
                        )}
                      </p>
                    )}
                  </div>

                  {/* Rating & Reviews */}
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-1'>
                      <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                      <span className='font-medium'>
                        {averageRating.toFixed(1)}
                      </span>
                      <span className='text-gray-500'>
                        ({reviews.length} review)
                      </span>
                    </div>

                    {sentimentSummary && (
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='flex items-center gap-1'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          <span>{sentimentSummary.positive}% positif</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div className='flex items-center gap-2'>
                    <Package className='w-5 h-5 text-gray-600' />
                    <span
                      className={cn(
                        'font-medium',
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {product.stock > 0
                        ? `Stok tersedia: ${product.stock}`
                        : 'Stok habis'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className='space-y-3'>
                    <div className='flex gap-3'>
                      <button
                        disabled={product.stock === 0}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                          product.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        )}
                      >
                        <ShoppingCart className='w-5 h-5' />
                        {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
                      </button>
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={cn(
                          'p-3 rounded-lg border transition-colors',
                          isWishlisted
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <Heart
                          className={cn(
                            'w-5 h-5',
                            isWishlisted && 'fill-current'
                          )}
                        />
                      </button>
                      <button className='p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors'>
                        <Share2 className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className='border-b border-gray-200'>
              <nav className='flex space-x-8 px-6'>
                {[
                  { key: 'overview', label: 'Ringkasan', count: null },
                  { key: 'reviews', label: 'Review', count: reviews.length },
                  { key: 'recommendations', label: 'Rekomendasi', count: null },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={cn(
                      'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab.label}
                    {tab.count !== null && (
                      <span className='ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs'>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className='p-6'>
              {activeTab === 'overview' && (
                <div className='space-y-8'>
                  {/* ✅ Review Summary Component */}
                  <ReviewSummary
                    productId={product.id}
                    title='Rangkuman Review Pelanggan'
                    maxLength={300}
                    showMetadata={true}
                  />

                  {/* Sentiment Analysis */}
                  {sentimentSummary && (
                    <div className='bg-white border border-gray-200 rounded-lg p-6'>
                      <h4 className='text-lg font-semibold mb-4'>
                        Analisis Sentiment
                      </h4>
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-green-600'>
                            {sentimentSummary.positive}%
                          </div>
                          <div className='text-sm text-gray-600'>Positif</div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-gray-600'>
                            {sentimentSummary.neutral}%
                          </div>
                          <div className='text-sm text-gray-600'>Netral</div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl font-bold text-red-600'>
                            {sentimentSummary.negative}%
                          </div>
                          <div className='text-sm text-gray-600'>Negatif</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className='space-y-4'>
                  {reviewsLoading ? (
                    <div className='text-center py-8'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                      <p className='text-gray-600 mt-2'>Memuat review...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.slice(0, 10).map((review) => (
                      <div
                        key={review.id}
                        className='bg-gray-50 rounded-lg p-4'
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='flex items-center'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                          <span className='text-sm text-gray-600'>
                            {new Date(review.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>
                        <p className='text-gray-700'>{review.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8'>
                      <p className='text-gray-600'>
                        Belum ada review untuk produk ini.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div>
                  {/* ✅ Product Recommendations Component */}
                  <ProductRecommendations
                    productId={product.id}
                    title='Produk Serupa yang Direkomendasikan'
                    maxItems={6}
                    onProductClick={handleRecommendationClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
