import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

// Mock data - will be replaced with API call
const bestSellers: Product[] = [
  {
    id: '9',
    name: 'Đầm Body Ôm Sát Gợi Cảm',
    slug: 'dam-body-om-sat-goi-cam',
    description: 'Đầm body ôm sát tôn dáng, quyến rũ.',
    price: 520000,
    originalPrice: 680000,
    images: [
      { id: '10', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop', alt: 'Đầm body' },
    ],
    category: { id: '1', name: 'Váy/Đầm', slug: 'vay-dam', isActive: true },
    variants: [
      { id: 'v30', name: 'S', sku: 'DB-S', stock: 8, size: 'S' },
      { id: 'v31', name: 'M', sku: 'DB-M', stock: 12, size: 'M' },
      { id: 'v32', name: 'L', sku: 'DB-L', stock: 6, size: 'L' },
    ],
    sku: 'DB001',
    stock: 26,
    isActive: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 312,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '10',
    name: 'Áo Kiểu Cổ Vuông Nơ',
    slug: 'ao-kieu-co-vuong-no',
    description: 'Áo kiểu cổ vuông đính nơ, nữ tính.',
    price: 320000,
    images: [
      { id: '11', url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop', alt: 'Áo kiểu' },
    ],
    category: { id: '2', name: 'Áo', slug: 'ao', isActive: true },
    variants: [
      { id: 'v33', name: 'S - Trắng', sku: 'AK-S-T', stock: 30, size: 'S', color: 'Trắng', colorCode: '#FFFFFF' },
      { id: 'v34', name: 'M - Trắng', sku: 'AK-M-T', stock: 35, size: 'M', color: 'Trắng', colorCode: '#FFFFFF' },
      { id: 'v35', name: 'L - Trắng', sku: 'AK-L-T', stock: 25, size: 'L', color: 'Trắng', colorCode: '#FFFFFF' },
    ],
    sku: 'AK001',
    stock: 90,
    isActive: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 189,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '11',
    name: 'Quần Tây Ống Suông',
    slug: 'quan-tay-ong-suong',
    description: 'Quần tây ống suông thanh lịch cho công sở.',
    price: 380000,
    originalPrice: 450000,
    images: [
      { id: '12', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', alt: 'Quần tây' },
    ],
    category: { id: '3', name: 'Quần', slug: 'quan', isActive: true },
    variants: [
      { id: 'v36', name: 'S', sku: 'QT-S', stock: 22, size: 'S' },
      { id: 'v37', name: 'M', sku: 'QT-M', stock: 28, size: 'M' },
      { id: 'v38', name: 'L', sku: 'QT-L', stock: 20, size: 'L' },
      { id: 'v39', name: 'XL', sku: 'QT-XL', stock: 15, size: 'XL' },
    ],
    sku: 'QT001',
    stock: 85,
    isActive: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 267,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '12',
    name: 'Đầm Hoa Tay Bồng Vintage',
    slug: 'dam-hoa-tay-bong-vintage',
    description: 'Đầm hoa tay bồng phong cách vintage.',
    price: 580000,
    images: [
      { id: '13', url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop', alt: 'Đầm vintage' },
    ],
    category: { id: '1', name: 'Váy/Đầm', slug: 'vay-dam', isActive: true },
    variants: [
      { id: 'v40', name: 'S', sku: 'DHV-S', stock: 18, size: 'S' },
      { id: 'v41', name: 'M', sku: 'DHV-M', stock: 22, size: 'M' },
      { id: 'v42', name: 'L', sku: 'DHV-L', stock: 15, size: 'L' },
    ],
    sku: 'DHV001',
    stock: 55,
    isActive: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 145,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export function BestSellers() {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary-600 font-medium mb-2 block">Bán chạy nhất</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products?sort=popular"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products?sort=popular" className="btn-outline">
            Xem tất cả best sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
