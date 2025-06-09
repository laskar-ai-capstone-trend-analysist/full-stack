'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Loader2, AlertTriangle, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[] | null | undefined;
  loading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  onProductClick,
}) => {
  // ✅ Safe array handling with multiple checks
  const safeProducts = React.useMemo(() => {
    if (!products) return [];
    if (!Array.isArray(products)) return [];
    return products.filter((product) => product && typeof product === 'object');
  }, [products]);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 mx-auto mb-4 animate-spin text-blue-600' />
          <p className='text-gray-600 text-lg font-medium'>Memuat produk...</p>
          <p className='text-gray-500 text-sm mt-2'>Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='text-center max-w-md'>
          <AlertTriangle className='w-16 h-16 text-red-500 mb-4 mx-auto' />
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Terjadi Kesalahan
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (safeProducts.length === 0) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='text-center max-w-md'>
          <Package className='w-16 h-16 text-gray-400 mb-4 mx-auto' />
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Tidak Ada Produk
          </h3>
          <p className='text-gray-600'>
            Tidak ditemukan produk yang sesuai dengan pencarian Anda. Coba ubah
            kata kunci atau filter yang digunakan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {safeProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
