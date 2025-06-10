'use client';

import React, { useEffect, useState } from 'react';
import { RecommendedProduct } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import { Heart, Star, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductRecommendationsProps {
  productId: number;
  className?: string;
  title?: string;
  maxItems?: number;
  onProductClick?: (product: RecommendedProduct) => void;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  className,
  title = 'Mungkin Anda Juga Suka',
  maxItems = 6,
  onProductClick,
}) => {
  const {
    recommendations,
    recommendationsLoading,
    recommendationsError,
    getRecommendations,
  } = useProducts();

  const [displayedRecommendations, setDisplayedRecommendations] = useState<
    RecommendedProduct[]
  >([]);

  // Fetch recommendations when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      getRecommendations(productId);
    }
  }, [productId, getRecommendations]);

  // Update displayed recommendations when data changes
  useEffect(() => {
    const limitedRecommendations = recommendations.slice(0, maxItems);
    setDisplayedRecommendations(limitedRecommendations);
  }, [recommendations, maxItems]);

  // Format similarity score as percentage
  const formatSimilarityScore = (score: number): string => {
    return `${Math.round(score * 100)}% match`;
  };

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscount = (original: number, current: number): number => {
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  // Handle product click
  const handleProductClick = (product: RecommendedProduct) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Show loading state
  if (recommendationsLoading) {
    return (
      <div className={cn('w-full', className)}>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>{title}</h3>
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          <span className='ml-2 text-gray-600'>
            Mencari rekomendasi produk...
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (recommendationsError) {
    return (
      <div className={cn('w-full', className)}>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>{title}</h3>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-700 text-center'>
            Gagal memuat rekomendasi: {recommendationsError}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (displayedRecommendations.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <h3 className='text-xl font-semibold text-gray-900 mb-4'>{title}</h3>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
          <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600'>
            Belum ada rekomendasi produk tersedia untuk item ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
        <span className='text-sm text-gray-500'>
          {displayedRecommendations.length} produk direkomendasikan
        </span>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {displayedRecommendations.map((product) => {
          const discount = calculateDiscount(
            product.originalPrice,
            product.currentPrice
          );

          return (
            <div
              key={product.id}
              className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group'
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className='relative aspect-square'>
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
                  loading='lazy'
                />
                {/* Similarity Badge */}
                <div className='absolute top-2 left-2'>
                  <span className='bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium'>
                    {formatSimilarityScore(product.similarity_score)}
                  </span>
                </div>
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className='absolute top-2 right-2'>
                    <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
                      -{discount}%
                    </span>
                  </div>
                )}
                {/* Wishlist Button */}
                <button className='absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors'>
                  <Heart className='w-4 h-4 text-gray-600' />
                </button>
              </div>

              {/* Product Info */}
              <div className='p-4'>
                <h4 className='font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                  {product.name}
                </h4>

                {/* Rating */}
                <div className='flex items-center gap-1 mb-2'>
                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                  <span className='text-sm text-gray-600'>4.5</span>
                  <span className='text-xs text-gray-400'>(123 review)</span>
                </div>

                {/* Price */}
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-semibold text-gray-900'>
                      {formatPrice(product.currentPrice)}
                    </span>
                    {discount > 0 && (
                      <span className='text-sm text-gray-500 line-through'>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  <div className='flex items-center justify-between'>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        product.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      AI Match: {Math.round(product.similarity_score * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Button (jika ada lebih banyak recommendations) */}
      {recommendations.length > maxItems && (
        <div className='text-center mt-6'>
          <button
            onClick={() => setDisplayedRecommendations(recommendations)}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Lihat Semua Rekomendasi ({recommendations.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;
