import { Product, Category, Review } from './types';

export const mockCategories: Category[] = [
  { id: 1, name: 'Aksesoris' },
  { id: 2, name: 'Alas_kaki' },
  { id: 3, name: 'Elektronik' },
  { id: 4, name: 'Kecantikan' },
  { id: 5, name: 'Kesehatan' },
  { id: 6, name: 'Pakaian_Pria' },
  { id: 7, name: 'Pakaian_Wanita' },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'APPLE IPHONE 15 IBOX 512GB 256GB 128GB - IPHONE 14',
    currentPrice: 8299000,
    originalPrice: 10499000,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/9/11/8f8f5c8e-7a5f-4f4f-9f4f-8f8f5c8e7a5f.jpg',
    stock: 44,
    categoryId: 3,
    discount: 21,
  },
  {
    id: 2,
    name: 'ASUS ROG Phone 9 FE 12GB/256GB Snapdragon 8 AMOLED',
    currentPrice: 9899000,
    originalPrice: 12999000,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2024/8/15/a1b2c3d4-5e6f-7890-abcd-ef1234567890.jpg',
    stock: 218,
    categoryId: 3,
    discount: 24,
  },
  {
    id: 3,
    name: 'APRIL TOP Atasan Wanita Korean Top Baju Knit Basic',
    currentPrice: 53000,
    originalPrice: 0,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/6/20/b2c3d4e5-6f78-9012-3456-789012345678.jpg',
    stock: 988,
    categoryId: 7,
    discount: 0,
  },
  {
    id: 4,
    name: 'About Pout Lip Liner - MakeUp Eyeliner Eye Waterpr',
    currentPrice: 15700,
    originalPrice: 29000,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2024/7/12/c3d4e5f6-7890-1234-5678-901234567890.jpg',
    stock: 463,
    categoryId: 4,
    discount: 46,
  },
  {
    id: 5,
    name: 'Adidas Samba OG White Gum (100% Authentic) - 40',
    currentPrice: 1999000,
    originalPrice: 0,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/5/8/d4e5f678-9012-3456-7890-123456789012.jpg',
    stock: 9,
    categoryId: 2,
    discount: 0,
  },
  {
    id: 6,
    name: 'Aeris Beauté The Onyx 2.0 - 15 pcs Complete Set',
    currentPrice: 303200,
    originalPrice: 379000,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2024/4/3/e5f67890-1234-5678-9012-345678901234.jpg',
    stock: 39,
    categoryId: 4,
    discount: 20,
  },
  {
    id: 7,
    name: 'Aerostreet 36-41 Celino Natural Cherry - Sandal S',
    currentPrice: 59900,
    originalPrice: 119800,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2024/3/20/f6789012-3456-7890-1234-567890123456.jpg',
    stock: 124,
    categoryId: 2,
    discount: 50,
  },
  {
    id: 8,
    name: 'Mantap bahan nyaa bagus anak mengerti nanges bagus',
    currentPrice: 45000,
    originalPrice: 0,
    imgUrl:
      'https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2024/2/15/g7890123-4567-8901-2345-678901234567.jpg',
    stock: 67,
    categoryId: 6,
    discount: 0,
  },
];

export const mockReviews: Review[] = [
  {
    id: 1,
    review: 'gelang kirim seller ramah tanggung dana terimakasi',
    rating: 5,
    tanggal: '2025-04-01',
    productId: 1,
  },
  {
    id: 2,
    review: 'recommended muas bagus kokoh',
    rating: 5,
    tanggal: '2025-05-25',
    productId: 1,
  },
  {
    id: 3,
    review: 'barang sesuai gambar desain modern bahan anti air',
    rating: 4,
    tanggal: '2024-10-01',
    productId: 2,
  },
  {
    id: 4,
    review: 'kerenkualitasnya seprtnya kuatokelahterlihat',
    rating: 5,
    tanggal: '2025-04-01',
    productId: 2,
  },
  {
    id: 5,
    review: 'sesuai pesan kirim cepat kemas rapi ukur pas tang',
    rating: 5,
    tanggal: '2025-04-01',
    productId: 3,
  },
];
