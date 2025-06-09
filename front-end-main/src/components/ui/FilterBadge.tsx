// src/components/ui/FilterBadge.tsx
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'search' | 'category';
  className?: string;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  onRemove,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    search: 'bg-blue-100 text-blue-700 border-blue-200',
    category: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'border text-sm font-medium',
        'transition-all duration-200',
        'hover:shadow-sm',
        variants[variant],
        className
      )}
    >
      <span className='truncate max-w-32'>{label}</span>
      <button
        onClick={onRemove}
        className={cn(
          'p-0.5 rounded-full hover:bg-black/10',
          'transition-colors duration-150'
        )}
      >
        <X className='w-3 h-3' />
      </button>
    </div>
  );
};
