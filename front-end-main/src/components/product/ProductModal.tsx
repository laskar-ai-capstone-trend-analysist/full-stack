'use client';

import React, { useEffect } from 'react';
import { Product } from '@/types';
import { X, Star, Package, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  // Remove hooks that don't exist yet to avoid errors
  // const { reviews, fetchReviews, getAverageRating } = useReviews();
  // const { categories, getCategoryName } = useCategories();
  // const { sentimentData, fetchSentimentByProduct, getSentimentSummary, getSentimentColor, getSentimentLabel, loading: sentimentLoading } = useSentiment();

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (!isOpen || !product) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div
          className={cn(
            'relative bg-white rounded-2xl shadow-xl max-w-4xl w-full',
            'transform transition-all duration-300 max-h-[90vh] overflow-y-auto'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className='absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors'
          >
            <X className='w-5 h-5 text-gray-600' />
          </button>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-6'>
            {/* Product Image */}
            <div className='aspect-square rounded-xl overflow-hidden bg-gray-100'>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <Package className='w-16 h-16 text-gray-400' />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className='flex flex-col'>
              {/* Product Name */}
              <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating !== undefined && (
                <div className='flex items-center mb-4'>
                  <div className='flex items-center'>
                    <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                    <span className='ml-2 text-lg font-medium text-gray-700'>
                      {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                  <span className='ml-2 text-gray-500'>(Rating produk)</span>
                </div>
              )}

              {/* Price */}
              <div className='mb-6'>
                <span className='text-3xl font-bold text-gray-900'>
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <div className='flex items-center space-x-3 mt-2'>
                      <span className='text-lg text-gray-500 line-through'>
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className='px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full'>
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
              </div>

              {/* Stock Info */}
              {product.stock !== undefined && (
                <div className='mb-6'>
                  <div className='flex items-center'>
                    <Package className='w-5 h-5 text-gray-400 mr-2' />
                    <span className='text-gray-700'>
                      Stok:{' '}
                      <span
                        className={cn(
                          'font-medium',
                          product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {product.stock > 0
                          ? `${product.stock} tersedia`
                          : 'Habis'}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Deskripsi Produk
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex space-x-4 mt-auto'>
                <button
                  className={cn(
                    'flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg',
                    'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'transition-colors duration-200 flex items-center justify-center',
                    product.stock === 0 && 'bg-gray-400 cursor-not-allowed'
                  )}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Stok Habis' : 'Lihat di Tokopedia'}
                </button>

                <button
                  onClick={onClose}
                  className='px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Gunakan default export
export default ProductModal;
