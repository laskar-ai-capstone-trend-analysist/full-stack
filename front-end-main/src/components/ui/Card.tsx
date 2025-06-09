// src/components/ui/Card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  border?: boolean;
  hover?: boolean;
}

const paddingVariants = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const shadowVariants = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl',
        paddingVariants[padding],
        shadowVariants[shadow],
        border && 'border border-gray-200',
        hover &&
          'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('pb-4 border-b border-gray-100', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('pt-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('pt-4 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);
