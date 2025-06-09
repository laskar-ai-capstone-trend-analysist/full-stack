'use client';

import React from 'react';
import { Product } from '@/types';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatRating = (rating: number) => {
    return Number(rating).toFixed(1);
  };

  return (
    <div
      className={cn(
        'group bg-white rounded-xl shadow-sm border border-gray-200',
        'hover:shadow-lg hover:border-gray-300 transition-all duration-300',
        'cursor-pointer overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      {/* Product Image */}
      <div className='relative aspect-square overflow-hidden bg-gray-100'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.jpg';
            }}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gray-200'>
            <ShoppingCart className='w-12 h-12 text-gray-400' />
          </div>
        )}

        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center'>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <Eye className='w-8 h-8 text-white' />
          </div>
        </div>

        {/* Stock Badge */}
        {product.stock !== undefined && (
          <div className='absolute top-3 left-3'>
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='p-4'>
        {/* Product Name */}
        <h3 className='text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className='flex items-center mb-2'>
            <div className='flex items-center'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
              <span className='ml-1 text-sm font-medium text-gray-700'>
                {formatRating(product.rating)}
              </span>
            </div>
            {product.reviewCount && (
              <span className='ml-1 text-sm text-gray-500'>
                ({product.reviewCount} review)
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className='flex items-center justify-between'>
          <div>
            <span className='text-lg font-bold text-gray-900'>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500 line-through'>
                  {formatPrice(product.originalPrice)}
                </span>
                <span className='text-sm font-medium text-green-600'>
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % off
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={cn(
            'w-full mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors duration-200',
            product.stock === 0 && 'bg-gray-400 cursor-not-allowed'
          )}
          disabled={product.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          {product.stock === 0 ? 'Stok Habis' : 'Lihat Detail'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
