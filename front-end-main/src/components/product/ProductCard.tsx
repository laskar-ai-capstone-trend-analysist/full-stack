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

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer',
        className
      )}
      onClick={() => onClick?.(product)}
    >
      {/* Image Container */}
      <div className='relative h-48 bg-gray-100 overflow-hidden'>
        {product.imgUrl ? (
          <img
            src={product.imgUrl}
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

        {/* Stock Badge */}
        <div className='absolute top-2 right-2'>
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
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[40px]'>
          {product.name}
        </h3>

        {/* Price */}
        <div className='mb-3'>
          <span className='text-lg font-bold text-gray-900'>
            {formatPrice(product.currentPrice)}
          </span>
          {product.originalPrice &&
            product.originalPrice > product.currentPrice && (
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500 line-through'>
                  {formatPrice(product.originalPrice)}
                </span>
                <span className='text-sm font-medium text-green-600'>
                  {Math.round(
                    ((product.originalPrice - product.currentPrice) /
                      product.originalPrice) *
                      100
                  )}
                  % off
                </span>
              </div>
            )}
        </div>

        {/* Button */}
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
