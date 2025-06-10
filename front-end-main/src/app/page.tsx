'use client';

import React, { useEffect, useState, useCallback, useMemo, lazy } from 'react';
import { Product, RecommendedProduct } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import {
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  ShoppingBag,
  Star,
  Users,
  BarChart3,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductRecommendations from '@/components/product/ProductRecommendations';

// Lazy load heavy components for better performance
const ProductModal = lazy(() => import('@/components/product/ProductModal'));

// Custom error boundary component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Oops! Terjadi kesalahan
            </h2>
            <p className='text-gray-600 mb-4'>
              Silakan refresh halaman untuk mencoba lagi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

export default function Home() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    searchProducts,
    filterByCategory,
    getTrendingProducts,
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // State management with better organization
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // ✅ State untuk rekomendasi di homepage
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendationProductId, setRecommendationProductId] = useState<
    number | null
  >(null);

  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  // Memoized safe arrays
  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  // Memoized display products with performance optimization
  const displayProducts = useMemo(() => {
    console.log('Computing displayProducts:', {
      safeProductsLength: safeProducts.length,
      searchQuery,
      selectedCategory,
    });

    if (!Array.isArray(safeProducts) || safeProducts.length === 0) {
      console.log('No safe products available');
      return [];
    }

    let filtered = [...safeProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply category filter
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory
      );
      console.log('After category filter:', filtered.length);
    }

    // Show trending products when no filters applied
    if (!searchQuery.trim() && selectedCategory === null) {
      const trending = getTrendingProducts(12);
      console.log('Trending products:', trending.length);
      return trending;
    }

    return filtered.slice(0, 12);
  }, [safeProducts, searchQuery, selectedCategory, getTrendingProducts]);

  // Optimized handlers with useCallback
  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setSearchQuery(query);
        if (query.trim()) {
          await searchProducts(query);
        } else {
          await refetchProducts();
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    },
    [searchProducts, refetchProducts]
  );

  const handleCategoryFilter = useCallback(
    async (categoryId: number | null) => {
      try {
        setSelectedCategory(categoryId);
        if (categoryId !== null) {
          await filterByCategory(categoryId);
        } else {
          await refetchProducts();
        }
      } catch (error) {
        console.error('Filter error:', error);
      }
    },
    [filterByCategory, refetchProducts]
  );

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  // ✅ Handle modal product selection from recommendations
  const handleModalProductSelect = useCallback(
    (recommendedProduct: RecommendedProduct) => {
      // Convert RecommendedProduct to Product
      const product: Product = {
        id: recommendedProduct.id,
        name: recommendedProduct.name,
        currentPrice: recommendedProduct.currentPrice,
        originalPrice: recommendedProduct.originalPrice,
        imgUrl: recommendedProduct.imgUrl,
        stock: recommendedProduct.stock,
        categoryId: recommendedProduct.categoryId,
        discount: recommendedProduct.discount,
      };
      setSelectedProduct(product);
      // Modal tetap terbuka untuk produk yang baru dipilih
    },
    []
  );

  // ✅ Handle product click to show recommendations
  const handleProductClick = useCallback(
    (product: Product) => {
      handleViewDetails(product);
      // Set untuk menampilkan rekomendasi di homepage juga
      setRecommendationProductId(product.id);
      setShowRecommendations(true);
    },
    [handleViewDetails]
  );

  const handleRetry = useCallback(async () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      try {
        await refetchProducts();
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  }, [refetchProducts, retryCount]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 300;
          setShowScrollTop(scrolled);

          const statsElement = document.getElementById('stats-section');
          if (statsElement) {
            const rect = statsElement.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            setIsStatsVisible(isVisible);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clear recommendations when search or category changes
  useEffect(() => {
    if (searchQuery || selectedCategory !== null) {
      setShowRecommendations(false);
      setRecommendationProductId(null);
    }
  }, [searchQuery, selectedCategory]);

  // Show error state
  if (error && safeProducts.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md mx-auto text-center'>
          <div className='mb-6'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <WifiOff className='w-10 h-10 text-red-500' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Gagal Memuat Data
            </h2>
            <p className='text-gray-600 mb-6'>{error}</p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className={cn(
                'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                retryCount >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {retryCount < 3 && <RefreshCw className='w-4 h-4' />}
              {retryCount >= 3 ? 'Batas Percobaan Tercapai' : 'Coba Lagi'}
            </button>

            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Muat Ulang Halaman
            </button>
          </div>

          {retryCount >= 3 && (
            <p className='text-sm text-gray-500 mt-4'>
              Jika masalah berlanjut, silakan hubungi tim support kami.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Enhanced loading state with skeleton
  if (loading && safeProducts.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        {/* Loading Hero Section */}
        <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'>
          <div className='container mx-auto px-4 py-16'>
            <div className='text-center'>
              <div className='w-32 h-8 bg-white/20 rounded mx-auto mb-4 animate-pulse'></div>
              <div className='w-96 h-6 bg-white/10 rounded mx-auto mb-8 animate-pulse'></div>
              <div className='w-80 h-12 bg-white/20 rounded mx-auto animate-pulse'></div>
            </div>
          </div>
        </div>

        {/* Loading Product Grid */}
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse'
              >
                <div className='aspect-square bg-gray-200'></div>
                <div className='p-4 space-y-3'>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  <div className='h-6 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-50'>
        {/* Online/Offline Indicator */}
        {!isOnline && (
          <div className='bg-red-500 text-white text-center py-2 text-sm'>
            <WifiOff className='w-4 h-4 inline mr-2' />
            Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
          </div>
        )}

        {/* Hero Section with Enhanced Design */}
        <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-white/5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>

          <div className='container mx-auto px-4 py-16 relative z-10'>
            <div className='text-center max-w-4xl mx-auto'>
              <h1 className='text-4xl md:text-6xl font-bold text-white mb-6 leading-tight'>
                YAPin - Yuk AI Pickin 🤖
              </h1>
              <p className='text-xl md:text-2xl text-white/90 mb-8 leading-relaxed'>
                Platform AI-powered untuk product discovery yang cerdas dan
                personal
              </p>

              {/* Enhanced Search Bar */}
              <div className='max-w-2xl mx-auto mb-8'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Ceritakan produk yang Anda cari...'
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='w-full px-6 py-4 pr-14 text-lg rounded-full border-0 shadow-lg focus:ring-4 focus:ring-white/20 focus:outline-none transition-all'
                  />
                  <Search className='absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400' />
                </div>

                {/* Category Filter */}
                <div className='mt-4 flex justify-center'>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) =>
                      handleCategoryFilter(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className='px-4 py-2 rounded-full bg-white backdrop-blur-sm border border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm'
                  >
                    <option value='' className='text-gray-700'>
                      Semua Kategori
                    </option>
                    {safeCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className='text-gray-700'
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats Section */}
              <div
                id='stats-section'
                className={cn(
                  'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000',
                  isStatsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-70 translate-y-4'
                )}
              >
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center'>
                  <ShoppingBag className='w-8 h-8 text-white mx-auto mb-2' />
                  <div className='text-2xl font-bold text-white'>
                    {safeProducts.length.toLocaleString()}
                  </div>
                  <div className='text-white/80'>Produk Tersedia</div>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center'>
                  <Users className='w-8 h-8 text-white mx-auto mb-2' />
                  <div className='text-2xl font-bold text-white'>10K+</div>
                  <div className='text-white/80'>Review Pelanggan</div>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center'>
                  <BarChart3 className='w-8 h-8 text-white mx-auto mb-2' />
                  <div className='text-2xl font-bold text-white'>
                    {safeCategories.length}
                  </div>
                  <div className='text-white/80'>Kategori Produk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className='container mx-auto px-4 py-12'>
          {/* Section Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                {searchQuery
                  ? `Hasil Pencarian: "${searchQuery}"`
                  : selectedCategory
                    ? 'Produk Berdasarkan Kategori'
                    : 'Produk Trending'}
              </h2>
              <p className='text-gray-600'>
                Menampilkan {displayProducts.length} dari {safeProducts.length}{' '}
                produk
              </p>
            </div>

            <button
              onClick={refetchProducts}
              className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
          </div>

          {/* Products Grid */}
          {displayProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
              {displayProducts.map((product) => (
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
                    {product.discount > 0 && (
                      <div className='absolute top-2 left-2'>
                        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
                          -{product.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className='p-4'>
                    <h3 className='font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                      {product.name}
                    </h3>

                    <div className='flex items-center gap-1 mb-2'>
                      <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm text-gray-600'>4.5</span>
                      <span className='text-xs text-gray-400'>(123)</span>
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg font-semibold text-gray-900'>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(product.currentPrice)}
                        </span>
                        {product.discount > 0 && (
                          <span className='text-sm text-gray-500 line-through'>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className='flex items-center justify-between'>
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            product.stock > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          )}
                        >
                          {product.stock > 0
                            ? `Stok: ${product.stock}`
                            : 'Habis'}
                        </span>
                        <TrendingUp className='w-4 h-4 text-gray-400' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Search className='w-10 h-10 text-gray-400' />
              </div>
              <h3 className='text-xl font-medium text-gray-900 mb-2'>
                Tidak ada produk ditemukan
              </h3>
              <p className='text-gray-600 mb-6'>
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  refetchProducts();
                }}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Tampilkan Semua Produk
              </button>
            </div>
          )}

          {/* ✅ Recommendations Section - Muncul di Homepage */}
          {showRecommendations && recommendationProductId && (
            <div className='mt-16 pt-8 border-t border-gray-200'>
              <ProductRecommendations
                productId={recommendationProductId}
                title='Mungkin Anda Juga Suka'
                maxItems={8}
                onProductClick={(recommendedProduct) => {
                  // Convert dan buka modal untuk produk yang direkomendasikan
                  const product: Product = {
                    id: recommendedProduct.id,
                    name: recommendedProduct.name,
                    currentPrice: recommendedProduct.currentPrice,
                    originalPrice: recommendedProduct.originalPrice,
                    imgUrl: recommendedProduct.imgUrl,
                    stock: recommendedProduct.stock,
                    categoryId: recommendedProduct.categoryId,
                    discount: recommendedProduct.discount,
                  };
                  handleViewDetails(product);
                  // Update rekomendasi untuk produk baru
                  setRecommendationProductId(product.id);
                }}
                className='bg-gray-50 rounded-xl p-6'
              />
            </div>
          )}
        </div>

        {/* Product Modal */}
        {isModalOpen && (
          <React.Suspense
            fallback={
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
              </div>
            }
          >
            <ProductModal
              product={selectedProduct}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onProductSelect={handleModalProductSelect}
            />
          </React.Suspense>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={handleScrollToTop}
            className='fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110'
          >
            <ChevronDown className='w-5 h-5 rotate-180' />
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}
