import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ApiStatus } from '@/components/ui/ApiStatus';
import DebugPanel from '@/components/debug/DebugPanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tokopedia Trends - Product Analytics Dashboard',
  description: 'Analisis tren produk marketplace dengan AI sentiment analysis',
  keywords: 'tokopedia, trends, analytics, sentiment analysis, marketplace',
  authors: [{ name: 'Tokopedia Trends Team' }],
  openGraph: {
    title: 'Tokopedia Trends - Product Analytics Dashboard',
    description: 'Analisis tren produk marketplace dengan AI sentiment analysis',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* API Status Indicator */}
        <div className="fixed top-4 left-4 z-40">
          <ApiStatus showText={false} />
        </div>

        {/* Main Content */}
        {children}

        {/* Debug Panel (Development Only) */}
        <DebugPanel />
      </body>
    </html>
  );
}
