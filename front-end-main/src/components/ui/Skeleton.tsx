// src/components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-4 space-y-4'>
      {/* Image Skeleton */}
      <Skeleton className='w-full h-48 rounded-lg' />

      {/* Title Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>

      {/* Price Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
      </div>

      {/* Stock Skeleton */}
      <Skeleton className='h-4 w-2/3' />

      {/* Button Skeleton */}
      <Skeleton className='h-10 w-full rounded-lg' />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
