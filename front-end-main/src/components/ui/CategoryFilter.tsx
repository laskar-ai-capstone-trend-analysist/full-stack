'use client';

import React, { useState } from 'react';
import { Category } from '@/types';
import { ChevronDown, Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  onCategoryChange: (categoryId: number | null) => void;
  loading?: boolean;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  onCategoryChange,
  loading = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Safe categories dengan null checking
  const safeCategories = Array.isArray(categories) ? categories : [];

  const selectedCategoryName = selectedCategory
    ? safeCategories.find((cat) => cat.id === selectedCategory)?.name
    : 'Semua Kategori';

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type='button'
        className={cn(
          'w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'transition-all duration-200',
          loading
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:border-gray-400',
          isOpen && 'ring-2 ring-blue-500 border-blue-500'
        )}
        onClick={handleToggle}
        disabled={loading}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Filter className='w-4 h-4 text-gray-400 mr-3' />
            <span className='text-gray-900 font-medium'>
              {selectedCategoryName}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto'>
          {/* Semua Kategori Option */}
          <button
            type='button'
            className={cn(
              'w-full px-4 py-3 text-left hover:bg-gray-50',
              'focus:outline-none focus:bg-gray-50',
              'transition-colors duration-150',
              'flex items-center justify-between border-b border-gray-100',
              selectedCategory === null && 'bg-blue-50 text-blue-600'
            )}
            onClick={() => handleCategorySelect(null)}
          >
            <span className='font-medium'>Semua Kategori</span>
            {selectedCategory === null && (
              <Check className='w-4 h-4 text-blue-600' />
            )}
          </button>

          {/* Category Options */}
          {safeCategories.map((category) => (
            <button
              key={category.id}
              type='button'
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-gray-50',
                'focus:outline-none focus:bg-gray-50',
                'transition-colors duration-150',
                'flex items-center justify-between',
                selectedCategory === category.id && 'bg-blue-50 text-blue-600'
              )}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span>{category.name}</span>
              {selectedCategory === category.id && (
                <Check className='w-4 h-4 text-blue-600' />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop untuk menutup dropdown */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default CategoryFilter;
