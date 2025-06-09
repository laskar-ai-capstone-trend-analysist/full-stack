'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/lib/types';
import ProductGrid from '@/components/product/ProductGrid';
import SearchInput from '@/components/ui/SearchInput';
import CategoryFilter from '@/components/ui/CategoryFilter';
import StatsCards from '@/components/ui/StatsCards';
import FeatureCards from '@/components/ui/FeatureCards';
import {
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Star,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Heart,
  ExternalLink,
  ChevronUp,
  Zap,
  Users,
  Award,
  Clock,
  WifiOff,
  AlertTriangle,
  Brain,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy load heavy components for better performance
const ProductModal = lazy(() => import('@/components/product/ProductModal'));

// Custom error boundary component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    const state = this.state as any;
    if (state.hasError) {
      return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4'>
          <div className='text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto'>
            <AlertTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Oops! Terjadi Kesalahan
            </h2>
            <p className='text-gray-600 mb-6'>
              Maaf, aplikasi mengalami masalah teknis. Tim kami sudah diberitahu
              dan sedang memperbaikinya.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Muat Ulang Halaman
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
    if (searchQuery || selectedCategory !== null) {
      return safeProducts;
    }
    return getTrendingProducts(8);
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
        setRetryCount(0);
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
        if (categoryId === null) {
          setSearchQuery('');
          await refetchProducts();
        } else {
          await filterByCategory(categoryId);
        }
        setRetryCount(0);
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
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

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
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowScrollTop(window.scrollY > 500);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimized resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        if (width < 768) setScreenSize('mobile');
        else if (width < 1024) setScreenSize('tablet');
        else setScreenSize('desktop');
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Enhanced error state with offline detection
  if (error && !loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4'>
        <div className='text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto'>
          {!isOnline ? (
            <>
              <WifiOff className='w-16 h-16 text-gray-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Tidak Ada Koneksi Internet
              </h2>
              <p className='text-gray-600 mb-6'>
                Periksa koneksi internet Anda dan coba lagi.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Gagal Memuat Data
              </h2>
              <p className='text-gray-600 mb-6'>
                {retryCount > 0
                  ? `Percobaan ke-${retryCount + 1} dari 3...`
                  : 'Terjadi kesalahan saat memuat data produk.'}
              </p>
            </>
          )}

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={handleRetry}
              disabled={retryCount >= 3 || loading}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                retryCount >= 3 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              )}
            >
              {loading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <RefreshCw className='w-4 h-4' />
              )}
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
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        {/* Loading Hero Section */}
        <section className='py-12 sm:py-16 lg:py-24 px-4'>
          <div className='max-w-6xl mx-auto text-center'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse mb-6'>
              <Brain className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
            </div>

            <div className='mb-4 sm:mb-6'>
              <div className='flex justify-center space-x-2'>
                <div className='w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full animate-bounce'></div>
                <div className='w-2 h-2 sm:w-3 sm:h-3 bg-purple-600 rounded-full animate-bounce delay-100'></div>
                <div className='w-2 h-2 sm:w-3 sm:h-3 bg-pink-600 rounded-full animate-bounce delay-200'></div>
              </div>
            </div>

            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
              Memuat Data Terbaru
            </h2>
            <p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6'>
              AI sedang menganalisis ribuan produk dari marketplace...
            </p>
          </div>
        </section>

        {/* Loading Skeleton */}
        <section className='py-8 sm:py-12 px-4'>
          <div className='max-w-6xl mx-auto'>
            {/* Stats Skeleton */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-soft'
                >
                  <div className='flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left'>
                    <div className='w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl mb-2 sm:mb-0 animate-pulse'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 sm:h-6 bg-gray-200 rounded animate-pulse'></div>
                      <div className='h-3 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Skeleton */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8'>
              <div className='flex flex-col lg:flex-row gap-6'>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
                  <div className='h-12 bg-gray-200 rounded-lg animate-pulse'></div>
                </div>
                <div className='lg:w-80 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                  <div className='h-12 bg-gray-200 rounded-lg animate-pulse'></div>
                </div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl shadow-soft p-4 space-y-3'
                >
                  <div className='h-48 bg-gray-200 rounded-lg animate-pulse'></div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4'></div>
                    <div className='h-6 bg-gray-200 rounded animate-pulse w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative'>
        {/* Offline Indicator */}
        {!isOnline && (
          <div className='fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm z-50'>
            <WifiOff className='w-4 h-4 inline mr-2' />
            Tidak ada koneksi internet. Beberapa fitur mungkin tidak tersedia.
          </div>
        )}

        <main>
          {/* Hero Section */}
          <section className='relative py-12 sm:py-16 lg:py-24 px-4 overflow-hidden'>
            <div className='max-w-6xl mx-auto text-center relative z-10'>
              <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6'>
                <Brain className='w-4 h-4' />
                AI-Powered Product Discovery
                <Lightbulb className='w-4 h-4' />
              </div>

              <h1 className='text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-6'>
                <span className='block'>YAPin</span>
                <span className='text-2xl md:text-3xl font-medium text-gray-600 block mt-2'>
                  Yuk AI Pickin
                </span>
              </h1>

              <p className='text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed'>
                Biarkan <span className='text-blue-600 font-bold'>AI</span>{' '}
                membantu Anda menemukan produk-produk{' '}
                <span className='text-purple-600 font-bold'>terbaik</span>{' '}
                dengan analisis sentiment dan rating{' '}
                <span className='inline-flex items-center gap-1 text-yellow-500'>
                  <Star className='w-5 h-5 fill-current' />
                  tertinggi
                </span>
              </p>

              <button className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto'>
                <Brain className='w-5 h-5' />
                Mulai AI Picking
              </button>
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
          <section className='py-12 px-4 bg-white/50 backdrop-blur-sm'>
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4'>
                  <Brain className='w-4 h-4' />
                  AI Smart Search
                  <Lightbulb className='w-4 h-4' />
                </div>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Temukan Produk Impian Anda
                </h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Gunakan AI-powered search dan filter cerdas untuk menemukan
                  produk yang perfect untuk Anda
                </p>
              </div>

              <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8'>
                <div className='flex flex-col lg:flex-row gap-6'>
                  <div className='flex-1'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      🤖 AI Smart Search
                    </label>
                    <SearchInput
                      onSearch={handleSearch}
                      placeholder='Ceritakan produk yang Anda cari...'
                      loading={loading}
                    />
                  </div>
                  <div className='lg:w-80'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      📂 Filter Kategori
                    </label>
                    <CategoryFilter
                      categories={safeCategories}
                      onCategoryChange={handleCategoryFilter}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>

              <ProductGrid
                products={displayProducts}
                loading={loading}
                error={error}
                onProductClick={handleViewDetails}
                showTrendingBadge={!searchQuery && selectedCategory === null}
              />
            </div>
          </section>

          {/* Features Section */}
          <section className='py-16 px-4 bg-white'>
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-12'>
                <div className='inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4'>
                  <Zap className='w-4 h-4' />
                  Fitur AI Canggih
                </div>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  Kenapa Pilih YAPin?
                </h2>
                <p className='text-lg text-gray-600'>
                  Platform AI-powered pertama untuk product discovery yang
                  cerdas
                </p>
              </div>
              <FeatureCards />
            </div>
          </section>

          {/* Footer */}
          <footer className='bg-gray-900 text-white py-12'>
            <div className='max-w-6xl mx-auto px-4 text-center'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
                  <Brain className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold'>YAPin</h3>
                  <p className='text-sm text-gray-400'>Yuk AI Pickin</p>
                </div>
              </div>

              <p className='text-gray-300 mb-6'>
                Platform AI-powered untuk product discovery yang cerdas dan
                personal
              </p>

              {/* Team Section */}
              <div className='mb-8'>
                <h4 className='text-lg font-semibold text-gray-300 mb-4'>
                  Tim Laskar AI
                </h4>
                <div className='flex flex-wrap justify-center gap-4'>
                  <a
                    href='https://github.com/ajusdwimantara'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors'
                  >
                    <Github className='w-4 h-4' />
                    <span className='text-sm'>ajusdwimantara</span>
                  </a>

                  <a
                    href='https://github.com/fluffybhe'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors'
                  >
                    <Github className='w-4 h-4' />
                    <span className='text-sm'>fluffybhe</span>
                  </a>

                  <a
                    href='https://github.com/jeremiasibarani'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors'
                  >
                    <Github className='w-4 h-4' />
                    <span className='text-sm'>jeremiasibarani</span>
                  </a>

                  <a
                    href='https://github.com/ramaanindyaa'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors'
                  >
                    <Github className='w-4 h-4' />
                    <span className='text-sm'>ramaanindyaa</span>
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className='flex justify-center space-x-6 mb-8'>
                <a
                  href='https://github.com/laskar-ai-capstone-trend-analysist'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <Github className='w-6 h-6' />
                </a>
                <Twitter className='w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Linkedin className='w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Instagram className='w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors' />
              </div>

              <div className='pt-8 border-t border-gray-700'>
                <p className='text-gray-400 text-sm'>
                  © 2025 YAPin - Yuk AI Pickin. Made with{' '}
                  <Heart className='w-4 h-4 inline text-red-500' /> and Laskar
                  AI in Indonesia
                </p>
              </div>
            </div>
          </footer>
        </main>

        {/* Enhanced Floating Action Buttons */}
        <div className='fixed bottom-6 right-6 z-50 space-y-3'>
          {showScrollTop && (
            <button
              onClick={handleScrollToTop}
              className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group'
              title='Kembali ke atas'
            >
              <ChevronUp className='w-5 h-5' />
            </button>
          )}

          <button
            className='w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group'
            title='AI Assistant'
          >
            <Brain className='w-5 h-5' />
            <div className='absolute right-14 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
              AI Assistant
            </div>
          </button>
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <Suspense
            fallback={
              <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
                <div className='bg-white rounded-xl p-6 shadow-2xl flex items-center gap-3'>
                  <Brain className='w-6 h-6 text-blue-600 animate-pulse' />
                  <span className='text-gray-700 font-medium'>
                    AI sedang memproses detail produk...
                  </span>
                </div>
              </div>
            }
          >
            <ProductModal
              product={selectedProduct}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </Suspense>
        )}

        {/* AI Status Indicator */}
        <div className='fixed top-4 left-4 z-40'>
          <div className='bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-200'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-xs font-medium text-gray-700'>
                AI Online
              </span>
            </div>
          </div>
        </div>

        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className='fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono'>
            Screen: {screenSize} | Products: {safeProducts.length} | Loading:{' '}
            {loading ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
