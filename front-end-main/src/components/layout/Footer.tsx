// src/components/layout/Footer.tsx
import React from 'react';
import { Heart, Github, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'bg-gradient-to-br from-gray-900 to-blue-900 text-white',
        'border-t border-gray-800',
        className
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='py-12 grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                <Globe className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-xl font-bold'>Tokopedia Trends</h3>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Platform analisis tren produk marketplace yang membantu Anda
              menemukan produk trending dan insights pasar terkini.
            </p>
            <div className='flex items-center gap-4'>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <Github className='w-5 h-5' />
              </a>
              <a
                href='mailto:contact@example.com'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <Mail className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Kategori Populer</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Elektronik
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Fashion
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Kesehatan
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Olahraga
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold'>Newsletter</h4>
            <p className='text-gray-300 text-sm'>
              Dapatkan update tren produk terbaru langsung ke email Anda.
            </p>
            <div className='space-y-2'>
              <input
                type='email'
                placeholder='Email Anda'
                className={cn(
                  'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg',
                  'text-white placeholder-gray-400 text-sm',
                  'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                )}
              />
              <button
                className={cn(
                  'w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium',
                  'hover:bg-blue-700 transition-colors'
                )}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='text-sm text-gray-400'>
            © {currentYear} Tokopedia Trends. All rights reserved.
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-400'>
            Made with{' '}
            <Heart className='w-4 h-4 text-red-500 fill-current mx-1' />
            using Next.js & TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
};
