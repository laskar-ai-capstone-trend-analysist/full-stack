// src/components/product/ProductSearch.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Filter, RotateCcw, TrendingUp } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { FilterBadge } from '@/components/ui/FilterBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { useCategories } from '@/hooks/useCategories';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;
  isLoading?: boolean;
  className?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  onCategoryFilter,
  isLoading = false,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    category: number | null;
    search: string;
  }>({
    category: null,
    search: '',
  });

  const { categories, loading: categoriesLoading } = useCategories();

  // Create category options for Select component
  const categoryOptions = useMemo(() => {
    const options = [{ label: 'Semua Kategori', value: 'all' }];

    categories.forEach((category) => {
      options.push({
        label: category.name,
        value: category.id.toString(),
      });
    });

    return options;
  }, [categories]);

  const handleSearch = useCallback(
    (query: string) => {
      setActiveFilters((prev) => ({ ...prev, search: query }));
      onSearch(query);
    },
    [onSearch]
  );

  const handleCategoryChange = useCallback(
    (value: string | number) => {
      const categoryId = value === 'all' ? null : Number(value);
      setActiveFilters((prev) => ({ ...prev, category: categoryId }));
      onCategoryFilter(categoryId);
    },
    [onCategoryFilter]
  );

  const clearAllFilters = () => {
    setActiveFilters({ category: null, search: '' });
    onSearch('');
    onCategoryFilter(null);
  };

  const hasActiveFilters =
    activeFilters.category !== null || activeFilters.search.trim() !== '';

  return (
    <Card className={cn('p-6 bg-white/95 backdrop-blur-sm', className)}>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='space-y-1'>
          <h2 className='text-xl font-bold text-gray-900'>
            Cari & Filter Produk
          </h2>
          <p className='text-sm text-gray-600'>
            Temukan produk yang Anda cari dengan mudah
          </p>
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowFilters(!showFilters)}
          className='lg:hidden'
          disabled={isLoading}
        >
          <Filter className='w-4 h-4' />
          Filter
        </Button>
      </div>

      {/* Search Input */}
      <div className='space-y-4'>
        <SearchInput
          placeholder='Cari produk berdasarkan nama...'
          onSearch={handleSearch}
          isLoading={isLoading}
          debounceMs={400}
        />

        {/* Filters Section */}
        <div
          className={cn(
            'space-y-4 transition-all duration-300',
            showFilters ? 'block' : 'hidden lg:block'
          )}
        >
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {/* Category Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Kategori
              </label>
              <Select
                options={categoryOptions}
                value={activeFilters.category?.toString() || 'all'}
                onChange={handleCategoryChange}
                placeholder='Pilih kategori...'
                disabled={isLoading || categoriesLoading}
              />
            </div>

            {/* Search Statistics */}
            <div className='space-y-2 lg:col-span-2'>
              <label className='text-sm font-medium text-gray-700'>
                Status Pencarian
              </label>
              <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                    )}
                  />
                  <span className='text-sm text-gray-600'>
                    {isLoading ? 'Mencari...' : 'Siap'}
                  </span>
                </div>

                {hasActiveFilters && (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>Filter aktif</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={clearAllFilters}
                      disabled={isLoading}
                      className='h-6 px-2 text-xs'
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className='flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200'>
              <span className='text-sm font-medium text-gray-700'>
                Filter aktif:
              </span>

              {activeFilters.search && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full'>
                  <Search className='w-3 h-3' />"{activeFilters.search}"
                  <button
                    onClick={() => handleSearch('')}
                    className='ml-1 hover:bg-blue-200 rounded-full p-0.5'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}

              {activeFilters.category && (
                <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full'>
                  <Tag className='w-3 h-3' />
                  {
                    categories.find((c) => c.id === activeFilters.category)
                      ?.name
                  }
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className='ml-1 hover:bg-green-200 rounded-full p-0.5'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Category Buttons */}
        {!categoriesLoading && categories.length > 0 && (
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Kategori Populer
            </label>
            <div className='flex flex-wrap gap-2'>
              {categories.slice(0, 6).map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeFilters.category === category.id
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() => handleCategoryChange(category.id)}
                  disabled={isLoading}
                  className='text-xs'
                >
                  {category.name}
                </Button>
              ))}
              {categories.length > 6 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowFilters(true)}
                  className='text-xs text-gray-500'
                >
                  +{categories.length - 6} lainnya
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
