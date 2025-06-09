// src/components/ui/ErrorBoundary.tsx
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center'>
          <div className='max-w-md mx-auto text-center p-8'>
            <div className='w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-10 h-10 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              Oops! Terjadi Kesalahan
            </h1>
            <p className='text-gray-600 mb-6'>
              Aplikasi mengalami error yang tidak terduga. Silakan refresh
              halaman atau coba lagi nanti.
            </p>
            <div className='space-y-3'>
              <Button
                onClick={this.resetError}
                leftIcon={<RefreshCw className='w-4 h-4' />}
                className='w-full'
              >
                Coba Lagi
              </Button>
              <Button
                variant='outline'
                onClick={() => window.location.reload()}
                className='w-full'
              >
                Refresh Halaman
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                  Detail Error (Development)
                </summary>
                <pre className='mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto'>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};
