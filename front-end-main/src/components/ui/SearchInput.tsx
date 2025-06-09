// src/components/ui/SearchInput.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  debounceMs?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Cari produk...',
  loading = false,
  className,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(searchQuery.trim());
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center bg-white border rounded-lg transition-all duration-200',
          isFocused
            ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20 shadow-md'
            : 'border-gray-300 hover:border-gray-400',
          loading && 'opacity-75'
        )}
      >
        {/* Search Icon */}
        <div className='flex items-center justify-center pl-4 pr-2'>
          {loading ? (
            <Loader2 className='w-5 h-5 text-gray-400 animate-spin' />
          ) : (
            <Search className='w-5 h-5 text-gray-400' />
          )}
        </div>

        {/* Input Field */}
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={loading}
          className={cn(
            'flex-1 py-3 px-2 bg-transparent border-none outline-none',
            'text-gray-900 placeholder-gray-500',
            'disabled:cursor-not-allowed'
          )}
          autoComplete='off'
        />

        {/* Clear Button */}
        {query && (
          <button
            type='button'
            onClick={handleClear}
            className={cn(
              'p-2 mr-2 hover:bg-gray-100 rounded-md transition-colors',
              'focus:outline-none focus:bg-gray-100'
            )}
            disabled={loading}
          >
            <X className='w-4 h-4 text-gray-400' />
          </button>
        )}

        {/* Search Button */}
        <button
          type='submit'
          disabled={loading || !query.trim()}
          className={cn(
            'px-4 py-2 mr-2 bg-blue-600 text-white rounded-md',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 text-sm font-medium'
          )}
        >
          Cari
        </button>
      </div>

      {/* Search Suggestions or Results Count (Optional) */}
      {query && !loading && (
        <div className='absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 px-4'>
          Tekan Enter untuk mencari "{query}"
        </div>
      )}
    </form>
  );
};

export default SearchInput;
