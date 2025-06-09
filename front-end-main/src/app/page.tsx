'use client';

import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/hooks/useProducts';
import ProductGrid from '@/components/product/ProductGrid';
import SearchInput from '@/components/ui/SearchInput';
import CategoryFilter from '@/components/ui/CategoryFilter';
import ProductModal from '@/components/product/ProductModal';
import StatsCards from '@/components/ui/StatsCards';
import FeatureCards from '@/components/ui/FeatureCards';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    searchProducts,
    filterByCategory,
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  // ✅ Safe arrays dengan null checking
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Handlers
  const handleSearch = async (query: string) => {
    try {
      await searchProducts(query);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCategoryFilter = async (categoryId: number | null) => {
    try {
      if (categoryId === null) {
        await refetchProducts();
      } else {
        await filterByCategory(categoryId);
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    refetchProducts();
  };

  // Error State dengan informasi lebih detail
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center p-8'>
          <AlertCircle className='w-16 h-16 mx-auto mb-6 text-red-500' />
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Tidak Dapat Memuat Data
          </h1>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='text-sm text-gray-500 mb-6 bg-gray-100 p-3 rounded'>
            <strong>Troubleshooting:</strong>
            <br />
            • Pastikan backend berjalan di port 5000
            <br />
            • Cek file .env.local
            <br />• Periksa console untuk error detail
          </div>
          <button
            onClick={handleRetry}
            className={cn(
              'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
            disabled={loading}
          >
            <RefreshCw
              className={cn('w-4 h-4 mr-2 inline', loading && 'animate-spin')}
            />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
      {/* Hero Section */}
      <section className='relative py-20 px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Tokopedia Trends
            <span className='text-blue-600 block mt-2'>Analytics</span>
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Temukan produk-produk pilihan yang sedang trending di marketplace
            dengan performa terbaik dan rating tertinggi
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-12 px-4'>
        <div className='max-w-6xl mx-auto'>
          <StatsCards
            totalProducts={safeProducts.length}
            totalCategories={safeCategories.length}
          />
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className='py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col lg:flex-row gap-4 mb-8'>
            <div className='flex-1'>
              <SearchInput
                onSearch={handleSearch}
                placeholder='Cari produk berdasarkan nama...'
                loading={loading}
              />
            </div>
            <div className='lg:w-64'>
              <CategoryFilter
                categories={safeCategories}
                onCategoryChange={handleCategoryFilter}
                loading={loading}
              />
            </div>
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={safeProducts}
            loading={loading}
            error={error}
            onProductClick={handleViewDetails}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Fitur Unggulan
            </h2>
            <p className='text-lg text-gray-600'>
              Platform analytics terdepan untuk marketplace insights
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
