// src/components/debug/DebugPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Bug, 
  Database, 
  Clock, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { debug } from '@/lib/debug';
import { errorLogger } from '@/lib/errorLogger';
import { performanceMonitor } from '@/lib/performance';

// Only show in development
const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'errors' | 'performance' | 'console'>('errors');
  const [errors, setErrors] = useState(errorLogger.getErrors({ limit: 10 }));
  const [performanceStats, setPerformanceStats] = useState(performanceMonitor.getStats());

  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setErrors(errorLogger.getErrors({ limit: 10 }));
      setPerformanceStats(performanceMonitor.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClearErrors = () => {
    errorLogger.clearErrors();
    setErrors([]);
    debug.info('Debug panel: Errors cleared');
  };

  const handleClearPerformance = () => {
    performanceMonitor.clear();
    setPerformanceStats(performanceMonitor.getStats());
    debug.info('Debug panel: Performance data cleared');
  };

  const handleDownloadLogs = () => {
    const data = {
      errors: errorLogger.exportErrors(),
      performance: performanceMonitor.export(),
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    debug.info('Debug panel: Logs downloaded');
  };

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'mb-2 shadow-lg',
          isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        )}
        size='sm'
      >
        {isOpen ? <EyeOff className='w-4 h-4' /> : <Bug className='w-4 h-4' />}
        {isOpen ? 'Hide' : 'Debug'}
      </Button>

      {/* Debug Panel */}
      {isOpen && (
        <Card className='w-96 max-h-96 bg-gray-900 text-white border-gray-700 shadow-2xl'>
          <div className='p-4'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>Debug Panel</h3>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={handleDownloadLogs}
                  variant='outline'
                  size='sm'
                  className='text-xs'
                >
                  <Download className='w-3 h-3 mr-1' />
                  Export
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex mb-4 bg-gray-800 rounded-lg p-1'>
              {(['errors', 'performance', 'console'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 px-3 py-1 rounded text-xs font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {tab === 'errors' && <AlertTriangle className='w-3 h-3 mr-1 inline' />}
                  {tab === 'performance' && <Activity className='w-3 h-3 mr-1 inline' />}
                  {tab === 'console' && <Database className='w-3 h-3 mr-1 inline' />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className='max-h-48 overflow-y-auto'>
              {/* Errors Tab */}
              {activeTab === 'errors' && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Recent Errors ({errors.length})</span>
                    <Button
                      onClick={handleClearErrors}
                      variant='outline'
                      size='sm'
                      className='text-xs'
                    >
                      <Trash2 className='w-3 h-3' />
                    </Button>
                  </div>
                  {errors.length === 0 ? (
                    <p className='text-gray-400 text-sm'>No errors logged</p>
                  ) : (
                    errors.map((error) => (
                      <div
                        key={error.id}
                        className='bg-gray-800 rounded p-2 text-xs'
                      >
                        <div className='flex items-center justify-between mb-1'>
                          <span className={cn(
                            'font-medium',
                            error.severity === 'critical' ? 'text-red-400' :
                            error.severity === 'high' ? 'text-orange-400' :
                            error.severity === 'medium' ? 'text-yellow-400' :
                            'text-gray-400'
                          )}>
                            {error.type} - {error.severity}
                          </span>
                          <span className='text-gray-500'>
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className='text-gray-300'>{error.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Performance Stats</span>
                    <Button
                      onClick={handleClearPerformance}
                      variant='outline'
                      size='sm'
                      className='text-xs'
                    >
                      <Trash2 className='w-3 h-3' />
                    </Button>
                  </div>
                  <div className='bg-gray-800 rounded p-2 text-xs space-y-1'>
                    <div className='flex justify-between'>
                      <span>Total Operations:</span>
                      <span className='text-blue-400'>{performanceStats.total}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Avg Duration:</span>
                      <span className='text-green-400'>
                        {performanceStats.avgDuration.toFixed(2)}ms
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Max Duration:</span>
                      <span className='text-red-400'>
                        {performanceStats.maxDuration.toFixed(2)}ms
                      </span>
                    </div>
                  </div>
                  
                  {/* Recent Operations */}
                  <div className='space-y-1'>
                    <span className='text-sm font-medium'>Recent Operations</span>
                    {performanceStats.entries.slice(0, 5).map((entry, index) => (
                      <div key={index} className='bg-gray-800 rounded p-2 text-xs'>
                        <div className='flex justify-between'>
                          <span className='text-gray-300'>{entry.name}</span>
                          <span className={cn(
                            'font-medium',
                            (entry.duration || 0) > 1000 ? 'text-red-400' :
                            (entry.duration || 0) > 500 ? 'text-yellow-400' :
                            'text-green-400'
                          )}>
                            {entry.duration?.toFixed(2)}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Console Tab */}
              {activeTab === 'console' && (
                <div className='space-y-2'>
                  <span className='text-sm font-medium'>Debug Console</span>
                  <div className='bg-gray-800 rounded p-2 text-xs text-gray-400'>
                    <p>• Debug mode: {process.env.NEXT_PUBLIC_DEBUG_MODE || 'false'}</p>
                    <p>• Environment: {process.env.NODE_ENV}</p>
                    <p>• API URL: {process.env.NEXT_PUBLIC_API_URL || 'localhost:5000'}</p>
                    <p>• Build time: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DebugPanel;