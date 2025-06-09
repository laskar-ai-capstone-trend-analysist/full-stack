'use client';

import React from 'react';
import {
  Search,
  Filter,
  BarChart3,
  Zap,
  Shield,
  Users,
  Clock,
  Database,
} from 'lucide-react';

const FeatureCards: React.FC = () => {
  const features = [
    {
      title: 'Pencarian Cerdas',
      description:
        'Temukan produk yang tepat dengan sistem pencarian AI yang memahami konteks dan preferensi Anda.',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Filter Canggih',
      description:
        'Filter produk berdasarkan kategori, harga, rating, dan berbagai kriteria lainnya dengan mudah.',
      icon: Filter,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Analytics Real-time',
      description:
        'Dapatkan insight mendalam tentang tren pasar dan performa produk secara real-time.',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Performa Tinggi',
      description:
        'Platform yang dioptimalkan untuk memberikan pengalaman pengguna yang cepat dan responsif.',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Keamanan Data',
      description:
        'Data Anda terlindungi dengan enkripsi tingkat enterprise dan standar keamanan terbaru.',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      gradient: 'from-red-500 to-red-600',
    },
    {
      title: 'Komunitas Aktif',
      description:
        'Bergabung dengan ribuan pengguna yang aktif berbagi review dan rekomendasi produk.',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Update Real-time',
      description:
        'Dapatkan informasi terbaru tentang harga, stok, dan promo langsung ke dashboard Anda.',
      icon: Clock,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Big Data Analytics',
      description:
        'Analisis jutaan data produk dan review untuk memberikan rekomendasi terbaik.',
      icon: Database,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      gradient: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className='group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden'
          style={{
            animationDelay: `${index * 150}ms`,
          }}
        >
          {/* Background Gradient (Hidden by default, shown on hover) */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
          />

          {/* Content */}
          <div className='relative z-10'>
            {/* Icon */}
            <div
              className={`w-14 h-14 mx-auto mb-6 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className={`w-7 h-7 ${feature.color}`} />
            </div>

            {/* Title */}
            <h3 className='text-lg font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors duration-300'>
              {feature.title}
            </h3>

            {/* Description */}
            <p className='text-gray-600 text-sm leading-relaxed text-center group-hover:text-gray-700 transition-colors duration-300'>
              {feature.description}
            </p>

            {/* Hover Effect: Bottom Border */}
            <div
              className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
            />
          </div>

          {/* Decorative Elements */}
          <div className='absolute top-4 right-4 w-2 h-2 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors duration-300' />
          <div className='absolute bottom-4 left-4 w-1 h-1 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors duration-300' />
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
