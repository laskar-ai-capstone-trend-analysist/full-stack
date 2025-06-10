'use client';

import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ExternalLink,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Fitur AI', href: '#features' },
      { name: 'Sentiment Analysis', href: '#sentiment' },
      { name: 'Product Discovery', href: '#discovery' },
      { name: 'Smart Recommendations', href: '#recommendations' },
    ],
    company: [
      { name: 'Tentang Kami', href: '#about' },
      { name: 'Tim Pengembang', href: '#team' },
      { name: 'Karir', href: '#careers' },
      { name: 'Blog', href: '#blog' },
    ],
    support: [
      { name: 'Pusat Bantuan', href: '#help' },
      { name: 'Dokumentasi API', href: '#docs' },
      { name: 'Status System', href: '#status' },
      { name: 'Hubungi Kami', href: '#contact' },
    ],
    legal: [
      { name: 'Kebijakan Privasi', href: '#privacy' },
      { name: 'Syarat & Ketentuan', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Lisensi', href: '#license' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
      color: 'hover:text-blue-600',
    },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-blue-700',
    },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Teknologi AI terdepan untuk product discovery',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Data dan insight produk secara real-time',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Keamanan data tingkat enterprise',
    },
  ];

  return (
    <footer className='bg-gray-900 text-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900'>
        <div
          className='absolute inset-0 opacity-5'
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Main Footer Content */}
      <div className='relative z-10'>
        {/* Top Section with Features */}
        <div className='border-b border-gray-700'>
          <div className='container mx-auto px-4 py-16'>
            <div className='text-center mb-12'>
              <h3 className='text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Mengapa Memilih YAPin?
              </h3>
              <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
                Platform terdepan dengan teknologi AI untuk membantu Anda
                menemukan produk terbaik
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {features.map((feature, index) => (
                <div key={index} className='text-center group'>
                  <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    <feature.icon className='w-8 h-8 text-white' />
                  </div>
                  <h4 className='text-xl font-semibold mb-2 text-white'>
                    {feature.title}
                  </h4>
                  <p className='text-gray-400 leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className='container mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-white'>YAPin</h3>
                  <p className='text-blue-400 text-sm'>Yuk AI Pickin</p>
                </div>
              </div>

              <p className='text-gray-400 mb-6 leading-relaxed'>
                Platform AI-powered untuk product discovery yang cerdas dan
                personal. Temukan produk terbaik dengan bantuan teknologi
                artificial intelligence terdepan.
              </p>

              {/* Contact Info */}
              <div className='space-y-3 mb-8'>
                <div className='flex items-center gap-3 text-gray-400'>
                  <Mail className='w-5 h-5 text-blue-400' />
                  <span>hello@yapin.ai</span>
                </div>
                <div className='flex items-center gap-3 text-gray-400'>
                  <Phone className='w-5 h-5 text-blue-400' />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className='flex items-center gap-3 text-gray-400'>
                  <MapPin className='w-5 h-5 text-blue-400' />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>

              {/* Social Links */}
              <div className='flex items-center gap-4'>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={cn(
                      'w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110',
                      social.color
                    )}
                    aria-label={social.name}
                  >
                    <social.icon className='w-5 h-5' />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6'>Produk</h4>
              <ul className='space-y-3'>
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group'
                    >
                      <span>{link.name}</span>
                      <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6'>
                Perusahaan
              </h4>
              <ul className='space-y-3'>
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group'
                    >
                      <span>{link.name}</span>
                      <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6'>
                Dukungan
              </h4>
              <ul className='space-y-3'>
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group'
                    >
                      <span>{link.name}</span>
                      <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='border-t border-gray-700'>
          <div className='container mx-auto px-4 py-12'>
            <div className='max-w-4xl mx-auto text-center'>
              <h3 className='text-2xl font-bold text-white mb-4'>
                Tetap Update dengan YAPin
              </h3>
              <p className='text-gray-400 mb-8 text-lg'>
                Dapatkan update terbaru tentang fitur baru, tips product
                discovery, dan insight menarik langsung ke email Anda
              </p>

              <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
                <input
                  type='email'
                  placeholder='Masukkan email Anda'
                  className='flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400'
                />
                <button className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center gap-2'>
                  Subscribe
                  <ArrowRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-700'>
          <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div className='flex items-center gap-2 text-gray-400'>
                <span>© {currentYear} YAPin. Dibuat dengan</span>
                <Heart className='w-4 h-4 text-red-500 fill-current' />
                <span>di Indonesia</span>
              </div>

              <div className='flex items-center gap-6'>
                {footerLinks.legal.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm'
                    >
                      {link.name}
                    </a>
                    {index < footerLinks.legal.length - 1 && (
                      <span className='text-gray-600'>•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
