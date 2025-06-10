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
  Sparkles,
  Heart,
  Share2,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import Footer from '@/components/layout/Footer';

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
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50'>
          <div className='text-center max-w-md mx-auto p-8'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <WifiOff className='w-10 h-10 text-red-500' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Oops! Terjadi kesalahan
            </h2>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              Silakan refresh halaman untuk mencoba lagi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg'
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
  const [isHeroAnimated, setIsHeroAnimated] = useState(false);

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

  // Hero animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsHeroAnimated(true), 100);
    return () => clearTimeout(timer);
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
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50'>
        <div className='max-w-md mx-auto text-center p-8'>
          <div className='mb-8'>
            <div className='w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl'>
              <WifiOff className='w-12 h-12 text-white' />
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Gagal Memuat Data
            </h2>
            <p className='text-gray-600 mb-8 text-lg leading-relaxed'>
              {error}
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className={cn(
                'flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform',
                retryCount >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
              )}
            >
              {retryCount < 3 && <RefreshCw className='w-5 h-5' />}
              {retryCount >= 3 ? 'Batas Percobaan Tercapai' : 'Coba Lagi'}
            </button>

            <button
              onClick={() => window.location.reload()}
              className='px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 font-semibold'
            >
              Muat Ulang Halaman
            </button>
          </div>

          {retryCount >= 3 && (
            <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl'>
              <p className='text-sm text-yellow-800'>
                Jika masalah berlanjut, silakan hubungi tim support kami.
              </p>
            </div>
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
        <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden'>
          <div className='absolute inset-0 bg-white/5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            ></div>
          </div>

          <div className='container mx-auto px-4 py-20 relative z-10'>
            <div className='text-center max-w-4xl mx-auto'>
              <div className='w-40 h-12 bg-white/20 rounded-xl mx-auto mb-6 animate-pulse'></div>
              <div className='w-96 h-8 bg-white/10 rounded-xl mx-auto mb-10 animate-pulse'></div>
              <div className='w-full max-w-2xl h-16 bg-white/20 rounded-full mx-auto animate-pulse'></div>
            </div>
          </div>
        </div>

        {/* Loading Product Grid */}
        <div className='container mx-auto px-4 py-12'>
          <div className='mb-8'>
            <div className='w-48 h-8 bg-gray-200 rounded mb-2 animate-pulse'></div>
            <div className='w-32 h-6 bg-gray-200 rounded animate-pulse'></div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse'
              >
                <div className='aspect-square bg-gray-200'></div>
                <div className='p-6 space-y-4'>
                  <div className='h-5 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  <div className='h-7 bg-gray-200 rounded w-2/3'></div>
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
          <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-3 text-sm font-medium shadow-lg'>
            <WifiOff className='w-4 h-4 inline mr-2' />
            Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
          </div>
        )}

        {/* Enhanced Hero Section */}
        <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden'>
          {/* Animated Background Pattern */}
          <div className='absolute inset-0 bg-white/5'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            ></div>
          </div>

          {/* Floating Elements */}
          <div className='absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float'></div>
          <div
            className='absolute top-40 right-20 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-float'
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className='absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-float'
            style={{ animationDelay: '4s' }}
          ></div>

          <div className='container mx-auto px-4 py-20 relative z-10'>
            <div
              className={cn(
                'text-center max-w-5xl mx-auto transition-all duration-1000',
                isHeroAnimated
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
            >
              {/* Brand Title with Icon */}
              <div className='flex items-center justify-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                  <Sparkles className='w-8 h-8 text-white' />
                </div>
                <h1 className='text-4xl md:text-7xl font-bold text-white leading-tight'>
                  YAPin
                </h1>
              </div>

              <p className='text-xl md:text-3xl text-white/90 mb-4 font-light'>
                Yuk AI Pickin 🤖
              </p>

              <p className='text-lg md:text-xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto'>
                Platform AI-powered untuk product discovery yang cerdas dan
                personal. Temukan produk terbaik dengan bantuan artificial
                intelligence.
              </p>

              {/* Enhanced Search Bar */}
              <div className='max-w-3xl mx-auto mb-12'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-30'></div>
                  <div className='relative bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-2xl'>
                    <div className='flex items-center'>
                      <input
                        type='text'
                        placeholder='Ceritakan produk yang Anda cari...'
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='flex-1 px-6 py-4 text-lg bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-500 text-gray-900'
                      />
                      <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg'>
                        <Search className='w-6 h-6' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className='mt-6 flex justify-center'>
                  <div className='relative'>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) =>
                        handleCategoryFilter(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className='appearance-none px-6 py-3 pr-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg font-medium'
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
                    <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Section */}
              <div
                id='stats-section'
                className={cn(
                  'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000',
                  isStatsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-70 translate-y-4'
                )}
              >
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                  <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <ShoppingBag className='w-8 h-8 text-white' />
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {safeProducts.length.toLocaleString()}
                  </div>
                  <div className='text-white/80 font-medium'>
                    Produk Tersedia
                  </div>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                  <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <Users className='w-8 h-8 text-white' />
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>10K+</div>
                  <div className='text-white/80 font-medium'>
                    Review Pelanggan
                  </div>
                </div>

                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group'>
                  <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <BarChart3 className='w-8 h-8 text-white' />
                  </div>
                  <div className='text-3xl font-bold text-white mb-2'>
                    {safeCategories.length}
                  </div>
                  <div className='text-white/80 font-medium'>
                    Kategori Produk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products Section */}
        <div className='container mx-auto px-4 py-16'>
          {/* Section Header */}
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-3'>
                {searchQuery
                  ? `Hasil Pencarian: "${searchQuery}"`
                  : selectedCategory
                    ? 'Produk Berdasarkan Kategori'
                    : 'Produk Trending'}
              </h2>
              <p className='text-gray-600 text-lg'>
                Menampilkan{' '}
                <span className='font-semibold text-blue-600'>
                  {displayProducts.length}
                </span>{' '}
                dari{' '}
                <span className='font-semibold'>{safeProducts.length}</span>{' '}
                produk
              </p>
            </div>

            <button
              onClick={refetchProducts}
              className='flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 border border-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-lg'
            >
              <RefreshCw className='w-5 h-5' />
              Refresh
            </button>
          </div>

          {/* Enhanced Products Grid */}
          {displayProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16'>
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    'bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2',
                    'animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className='relative aspect-square overflow-hidden'>
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      loading='lazy'
                    />

                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    {/* Badges */}
                    <div className='absolute top-4 left-4 flex flex-col gap-2'>
                      {product.discount > 0 && (
                        <span className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1.5 rounded-full font-semibold shadow-lg'>
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className='absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                      <button className='w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg'>
                        <Heart className='w-5 h-5 text-gray-600 hover:text-red-500' />
                      </button>
                      <button className='w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg'>
                        <Share2 className='w-5 h-5 text-gray-600' />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Product Info */}
                  <div className='p-6'>
                    <h3 className='font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-relaxed'>
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className='flex items-center gap-2 mb-4'>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-4 h-4',
                              i < 4
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      <span className='text-sm font-medium text-gray-600'>
                        4.5
                      </span>
                      <span className='text-xs text-gray-400'>
                        (123 ulasan)
                      </span>
                    </div>

                    {/* Price */}
                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center gap-3'>
                        <span className='text-xl font-bold text-gray-900'>
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

                      {/* Stock & Trending */}
                      <div className='flex items-center justify-between'>
                        <span
                          className={cn(
                            'text-xs px-3 py-1.5 rounded-full font-medium',
                            product.stock > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          )}
                        >
                          {product.stock > 0
                            ? `Stok: ${product.stock}`
                            : 'Habis'}
                        </span>
                        <div className='flex items-center gap-1 text-orange-500'>
                          <TrendingUp className='w-4 h-4' />
                          <span className='text-xs font-medium'>Trending</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg opacity-0 group-hover:opacity-100'>
                      Lihat Detail
                      <ArrowRight className='w-4 h-4 inline ml-2' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-20'>
              <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8'>
                <Search className='w-16 h-16 text-gray-400' />
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
                Tidak ada produk ditemukan
              </h3>
              <p className='text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto'>
                Coba ubah kata kunci pencarian atau filter kategori untuk
                menemukan produk yang Anda cari
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  refetchProducts();
                }}
                className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold'
              >
                Tampilkan Semua Produk
                <ArrowRight className='w-5 h-5 inline ml-2' />
              </button>
            </div>
          )}

          {/* ✅ Enhanced Recommendations Section */}
          {showRecommendations && recommendationProductId && (
            <div className='mt-20 pt-12 border-t border-gray-200'>
              <div className='text-center mb-12'>
                <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                  Mungkin Anda Juga Suka
                </h3>
                <p className='text-gray-600 text-lg'>
                  Rekomendasi produk serupa berdasarkan AI analysis
                </p>
              </div>

              <ProductRecommendations
                productId={recommendationProductId}
                title=''
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
                className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100'
              />
            </div>
          )}
        </div>

        {/* Product Modal */}
        {isModalOpen && (
          <React.Suspense
            fallback={
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                <div className='bg-white rounded-2xl p-8 flex items-center gap-4'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='text-gray-700 font-medium'>Memuat...</span>
                </div>
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

        {/* Enhanced Footer */}
        <Footer />

        {/* Enhanced Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={handleScrollToTop}
            className='fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1'
          >
            <ChevronUp className='w-6 h-6' />
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}
