'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { healthApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ApiStatusProps {
  className?: string;
  showText?: boolean;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({
  className,
  showText = true,
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    try {
      const status = await healthApi.check();
      setIsOnline(status);
      setLastChecked(new Date());
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Initial check
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isOnline === null) {
      return <AlertCircle className='w-4 h-4 text-yellow-500 animate-pulse' />;
    }
    return isOnline ? (
      <Wifi className='w-4 h-4 text-green-500' />
    ) : (
      <WifiOff className='w-4 h-4 text-red-500' />
    );
  };

  const getStatusText = () => {
    if (isOnline === null) return 'Memeriksa...';
    return isOnline ? 'API Online' : 'API Offline';
  };

  const getStatusColor = () => {
    if (isOnline === null) return 'text-yellow-600';
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {getStatusIcon()}
      {showText && (
        <div className='flex flex-col'>
          <span className={cn('text-sm font-medium', getStatusColor())}>
            {getStatusText()}
          </span>
          {lastChecked && (
            <span className='text-xs text-gray-500'>
              {lastChecked.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
