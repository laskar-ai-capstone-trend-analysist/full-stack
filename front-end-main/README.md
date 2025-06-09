# Tokopedia Trends - Product Analytics Dashboard 📈

Sebuah aplikasi web modern untuk menganalisis tren produk marketplace Tokopedia menggunakan Next.js, TypeScript, dan Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)

## 🚀 Features

- ✅ **Search & Filter Produk** - Pencarian berdasarkan nama dan filter kategori
- ✅ **Grid Produk Responsif** - Tampilan grid yang adaptif untuk semua device
- ✅ **Detail Produk Modal** - Modal dengan informasi lengkap produk dan reviews
- ✅ **Mock Data Integration** - Data produk real dari database Tokopedia
- ✅ **Loading States** - Animasi loading yang smooth
- ✅ **TypeScript Support** - Type safety untuk development yang lebih aman
- ✅ **Clean Architecture** - Struktur kode yang terorganisir dan maintainable
- ✅ **Responsive Design** - Mobile-first design dengan Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Charts**: Recharts (siap untuk fitur analytics)
- **Development**: ESLint, Turbopack

## 📁 Project Structure

```
tokopedia-trends/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/                # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── product/           # Product-specific components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   └── ProductSearch.tsx
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   └── useReviews.ts
│   └── lib/                   # Utilities & configurations
│       ├── api.ts             # API functions
│       ├── types.ts           # TypeScript types
│       ├── utils.ts           # Helper functions
│       └── mockData.ts        # Mock data for development
├── public/                    # Static assets
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── next.config.ts            # Next.js configuration
```

## 🚦 Getting Started

### Prerequisites

Pastikan Anda sudah menginstall:

- Node.js 18.0 atau lebih baru
- npm, yarn, pnpm, atau bun

### Installation

1. **Clone repository** (jika menggunakan Git):

   ```bash
   git clone <repository-url>
   cd tokopedia-trends
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   # atau
   bun install
   ```

3. **Jalankan development server**:

   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   # atau
   bun dev
   ```

4. **Buka aplikasi**:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📜 Available Scripts

| Command         | Description                                     |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Menjalankan development server dengan Turbopack |
| `npm run build` | Build aplikasi untuk production                 |
| `npm run start` | Menjalankan production build                    |
| `npm run lint`  | Menjalankan ESLint untuk code quality check     |

## 🔧 Configuration

### Environment Variables

Untuk menggunakan real API (opsional), buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Mock Data

Saat ini aplikasi menggunakan mock data untuk development. Untuk mengubah ke real API:

1. Buka file `src/lib/api.ts`
2. Ubah `useMockData` menjadi `false`
3. Pastikan backend API sudah berjalan

## 🎨 UI Components

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

<Button variant='primary' size='md'>
  Click Me
</Button>;
```

### Card Component

```tsx
import { Card } from '@/components/ui/Card';

<Card padding='md'>
  <p>Content here</p>
</Card>;
```

### Input Component

```tsx
import { Input } from '@/components/ui/Input';

<Input label='Search' placeholder='Cari produk...' icon={<SearchIcon />} />;
```

## 📊 Data Structure

### Product Interface

```typescript
interface Product {
  id: number;
  name: string;
  currentPrice: number;
  originalPrice: number;
  imgUrl: string;
  stock: number;
  categoryId: number;
  discount: number;
}
```

### Review Interface

```typescript
interface Review {
  id: number;
  review: string;
  rating: number;
  tanggal: string;
  productId: number;
}
```

### Category Interface

```typescript
interface Category {
  id: number;
  name: string;
}
```

## 🔄 API Integration

Aplikasi menggunakan custom hooks untuk manajemen state:

```typescript
// Menggunakan products hook
const { products, loading, error, searchProducts } = useProducts();

// Menggunakan categories hook
const { categories } = useCategories();

// Menggunakan reviews hook
const { reviews, fetchReviews } = useReviews();
```

## 🎯 Features Roadmap

- [ ] **Charts & Analytics** - Implementasi chart untuk trend analysis
- [ ] **Real-time Updates** - WebSocket untuk update real-time
- [ ] **Export Data** - Export data ke CSV/Excel
- [ ] **Advanced Filters** - Filter berdasarkan harga, rating, dll
- [ ] **Wishlist Feature** - Fitur favorit produk
- [ ] **Dark Mode** - Theme switcher
- [ ] **PWA Support** - Progressive Web App

## 🐛 Troubleshooting

### Error: Module not found

```bash
# Clear cache dan reinstall
rm -rf node_modules .next
npm install
```

### ESLint errors

```bash
# Fix ESLint issues
npm run lint
```

### Build errors

```bash
# Check TypeScript errors
npm run build
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Code Style

Project ini menggunakan:

- ESLint untuk code linting
- TypeScript untuk type safety
- Prettier untuk code formatting (recommended)

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features dan API
- [React Documentation](https://react.dev) - React concepts
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Lucide Icons](https://lucide.dev/) - Icon library

<!-- ## 📄 License

Project ini menggunakan [MIT License](LICENSE).

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Data produk dari [Tokopedia](https://tokopedia.com)
- UI inspiration dari Google Trends
- Icons dari [Lucide](https://lucide.dev)
- Built with [Next.js](https://nextjs.org)

---

⭐ **Jika project ini membantu, berikan star di repository!** ⭐ -->
