// src/components/ui/Loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2
        className={cn('animate-spin text-blue-600', sizeClasses[size])}
      />
      {text && <span className='text-gray-600 font-medium'>{text}</span>}
    </div>
  );
};

export const FullPageLoading: React.FC<{ text?: string }> = ({
  text = 'Memuat aplikasi...',
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center'>
          <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold text-gray-900'>{text}</h2>
          <p className='text-gray-600'>Harap tunggu sebentar...</p>
        </div>
      </div>
    </div>
  );
};
