// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center'>
      <div className='max-w-md mx-auto text-center p-8'>
        <div className='w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center'>
          <AlertTriangle className='w-10 h-10 text-red-500' />
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          Terjadi Kesalahan
        </h1>
        <p className='text-gray-600 mb-6'>
          Maaf, aplikasi mengalami error yang tidak terduga. Silakan coba lagi
          atau kembali ke halaman utama.
        </p>
        <div className='space-y-3'>
          <Button
            onClick={reset}
            leftIcon={<RefreshCw className='w-4 h-4' />}
            className='w-full'
          >
            Coba Lagi
          </Button>
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/')}
            leftIcon={<Home className='w-4 h-4' />}
            className='w-full'
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
