// src/components/layout/Header.tsx
import React from 'react';
import { TrendingUp, Package, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';

interface HeaderProps {
  productCount: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  label,
  value,
  delay = 0,
}) => (
  <div
    className={cn(
      'flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm',
      'rounded-xl border border-white/20 shadow-lg',
      'hover:bg-white/20 transition-all duration-300',
      'animate-fade-in-up'
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className='p-2 bg-white/20 rounded-lg'>{icon}</div>
    <div>
      <div className='text-white/90 text-sm font-medium'>{label}</div>
      <div className='text-white text-lg font-bold'>{value}</div>
    </div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ productCount }) => {
  const { categories } = useCategories();

  return (
    <header className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center mb-12'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'
          >
            Tokopedia Trends
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed'
          >
            Analisis mendalam tentang tren produk marketplace dengan AI
            sentiment analysis
          </motion.p>
        </div>

        {/* Stats */}
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
            <StatItem
              icon={<Package className='w-5 h-5 text-white' />}
              label='Total Produk'
              value={productCount.toLocaleString('id-ID')}
              delay={600}
            />
            <StatItem
              icon={<Activity className='w-5 h-5 text-white' />}
              label='Kategori Aktif'
              value={`${categories.length}+`}
              delay={800}
            />
            <StatItem
              icon={<Users className='w-5 h-5 text-white' />}
              label='Data Real-time'
              value='Live'
              delay={1000}
            />
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className='absolute bottom-0 left-0 right-0'>
        <svg
          className='w-full h-6 text-gray-50'
          preserveAspectRatio='none'
          viewBox='0 0 1440 54'
          fill='currentColor'
        >
          <path d='M0,22L48,28C96,34,192,46,288,46C384,46,480,34,576,32C672,30,768,38,864,44C960,50,1056,54,1152,50C1248,46,1344,34,1392,28L1440,22V54H1392C1344,54,1248,54,1152,54C1056,54,960,54,864,54C768,54,672,54,576,54C480,54,384,54,288,54C192,54,96,54,48,54H0V22Z' />
        </svg>
      </div>
    </header>
  );
};
