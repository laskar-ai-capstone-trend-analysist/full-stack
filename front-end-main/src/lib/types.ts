// src/lib/types.ts

// Base interfaces sesuai dengan back-end response format
export interface Product {
  id: number;
  name: string;
  currentPrice: number; // ✅ Sesuai backend
  originalPrice: number; // ✅ Sesuai backend
  imgUrl: string; // ✅ Sesuai backend (bukan imageUrl)
  stock: number;
  categoryId: number;
  discount: number;
  // Optional fields
  description?: string;
  rating?: number;
  reviewCount?: number;
}

// ✅ Interface untuk rekomendasi produk
export interface RecommendedProduct extends Product {
  similarity_score: number; // Score kesamaan dari AI model
}

// ✅ Interface untuk rangkuman review
export interface ReviewSummary {
  productId: string;
  summary: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// ✅ Fix: Review interface sesuai dengan backend response
export interface Review {
  id: number;
  review: string; // ✅ Backend menggunakan 'review' bukan 'content'
  rating: number;
  tanggal: string; // ✅ Backend menggunakan 'tanggal' bukan 'createdAt'
  productId: number;
}

export interface SentimentData {
  productId: number;
  sentiment_positive: number;
  sentiment_negative: number;
  sentiment_neutral: number;
}

// API Response interface sesuai dengan back-end format
export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

// Extended interfaces untuk UI enhancement
export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductFilters {
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}

// Trend data interface
export interface TrendData {
  productId: number;
  views: number;
  sales: number;
  rating: number;
  trending_score: number;
}

// Error handling interface
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Search and pagination interfaces
export interface SearchParams {
  query?: string;
  category?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'name' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

// Form interfaces
export interface SearchFormData {
  query: string;
  category?: number;
  filters?: ProductFilters;
}

// Component prop interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
