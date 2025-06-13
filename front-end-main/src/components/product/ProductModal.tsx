'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Star, ShoppingCart, Heart, Package, Truck } from 'lucide-react';
import { Product, RecommendedProduct, Review } from '@/lib/types';
import { useReviews } from '@/hooks/useReviews';
import { useSentiment } from '@/hooks/useSentiment';
import { cn } from '@/lib/utils';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import ReviewSummary from '@/components/review/ReviewSummary';

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

  // ✅ Use hooks dengan proper destructuring
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    fetchReviewsByProduct,
  } = useReviews();

  const {
    sentimentData,
    getSentimentByProduct,
    loading: sentimentLoading,
  } = useSentiment();

  // ✅ Function untuk calculate average rating
  const getAverageRating = useCallback((): number => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => {
      const rating = typeof review.rating === 'number' ? review.rating : 0;
      return sum + rating;
    }, 0);

    return totalRating / reviews.length;
  }, [reviews]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && product) {
      setActiveTab('overview');
      console.log('Modal opened for product:', product.id);

      // Fetch reviews and sentiment
      fetchReviewsByProduct(product.id).catch(console.error);
      getSentimentByProduct(product.id).catch(console.error);
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
  const handleRecommendationClick = useCallback(
    (recommendedProduct: RecommendedProduct) => {
      if (onProductSelect) {
        onProductSelect(recommendedProduct);
      }
      // Modal akan tetap terbuka dan menampilkan produk baru
    },
    [onProductSelect]
  );

  // Calculate discount percentage
  const calculateDiscount = useCallback(
    (original: number, current: number): number => {
      if (original <= current) return 0;
      return Math.round(((original - current) / original) * 100);
    },
    []
  );

  // Format price to Indonesian Rupiah
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  // Get sentiment summary
  const getSentimentSummary = useCallback(() => {
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
  }, [sentimentData]);

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
                        {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <span className='text-gray-600'>
                      ({reviews.length} review)
                    </span>
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
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <Heart
                          className={cn(
                            'w-5 h-5',
                            isWishlisted && 'fill-current'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className='border-b border-gray-200'>
              <div className='flex space-x-8 px-6'>
                {['overview', 'reviews', 'recommendations'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {tab === 'overview' && 'Deskripsi'}
                    {tab === 'reviews' && `Review (${reviews.length})`}
                    {tab === 'recommendations' && 'Rekomendasi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className='p-6'>
              {activeTab === 'overview' && (
                <div className='space-y-6'>
                  {/* Review Summary */}
                  <ReviewSummary
                    productId={product.id}
                    title='Rangkuman Review Pelanggan'
                    maxLength={300}
                    showMetadata={true}
                    showSentiment={true} // ✅ Enable sentiment analysis
                    className='mb-6'
                  />

                  {/* ✅ Tambahkan informasi produk lainnya jika diperlukan */}
                  <div className='bg-gray-50 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Detail Produk
                    </h3>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-gray-600'>Kategori:</span>
                        <span className='ml-2 font-medium'>
                          {product.categoryId
                            ? `Kategori ${product.categoryId}`
                            : 'Tidak tersedia'}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Stok:</span>
                        <span className='ml-2 font-medium'>
                          {product.stock} unit
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Diskon:</span>
                        <span className='ml-2 font-medium'>
                          {discount > 0 ? `${discount}%` : 'Tidak ada diskon'}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Rating:</span>
                        <span className='ml-2 font-medium'>
                          {averageRating > 0
                            ? `${averageRating.toFixed(1)}/5`
                            : 'Belum ada rating'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className='space-y-4'>
                  {reviewsLoading ? (
                    <div className='text-center py-8'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                      <p className='text-gray-600 mt-2'>Memuat review...</p>
                    </div>
                  ) : reviewsError ? (
                    <div className='text-center py-8'>
                      <p className='text-red-600 mb-4'>Error: {reviewsError}</p>
                      <button
                        onClick={() =>
                          product && fetchReviewsByProduct(product.id)
                        }
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                      >
                        Coba Lagi
                      </button>
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
                            {new Date(review.tanggal).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>
                        <p className='text-gray-700'>{review.review}</p>
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
