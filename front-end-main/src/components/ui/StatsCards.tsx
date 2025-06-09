'use client';

import React from 'react';
import { Package, Tag, TrendingUp, Star } from 'lucide-react';

interface StatsCardsProps {
  totalProducts: number;
  totalCategories: number;
  totalReviews?: number;
  averageRating?: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalProducts,
  totalCategories,
  totalReviews = 0,
  averageRating = 0,
}) => {
  const stats = [
    {
      title: 'Total Produk',
      value: totalProducts.toLocaleString('id-ID'),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Produk tersedia',
    },
    {
      title: 'Kategori',
      value: totalCategories.toLocaleString('id-ID'),
      icon: Tag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Kategori aktif',
    },
    {
      title: 'Total Review',
      value: totalReviews > 0 ? totalReviews.toLocaleString('id-ID') : '10K+',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Review pelanggan',
    },
    {
      title: 'Rating Rata-rata',
      value: averageRating > 0 ? averageRating.toFixed(1) : '4.5',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Kepuasan pelanggan',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300'
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className='flex items-center justify-between mb-4'>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-gray-900'>
                {stat.value}
              </div>
              <div className='text-xs text-gray-500'>{stat.description}</div>
            </div>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-600 mb-1'>
              {stat.title}
            </h3>
            <div className='w-full bg-gray-200 rounded-full h-1.5'>
              <div
                className={`h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                style={{
                  width: `${Math.min((parseInt(stat.value.replace(/\D/g, '')) / 1000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
