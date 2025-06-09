// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className='block text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}
        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-gray-300 px-4 py-3',
              'placeholder-gray-400 text-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
