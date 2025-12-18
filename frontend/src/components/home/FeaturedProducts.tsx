import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

// Mock data - will be replaced with API call
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Đầm Hoa Maxi Cổ V Thanh Lịch',
    slug: 'dam-hoa-maxi-co-v-thanh-lich',
    description: 'Đầm maxi họa tiết hoa nhỏ, cổ V quyến rũ, chất liệu vải lụa mềm mại.',
    price: 599000,
    originalPrice: 899000,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Đầm hoa maxi' },
      { id: '2', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Đầm hoa maxi view 2' },
    ],
    category: { id: '1', name: 'Váy/Đầm', slug: 'vay-dam', isActive: true },
    variants: [
      { id: 'v1', name: 'S - Hồng', sku: 'DH-S-H', stock: 10, size: 'S', color: 'Hồng', colorCode: '#FFB6C1' },
      { id: 'v2', name: 'M - Hồng', sku: 'DH-M-H', stock: 15, size: 'M', color: 'Hồng', colorCode: '#FFB6C1' },
      { id: 'v3', name: 'L - Hồng', sku: 'DH-L-H', stock: 8, size: 'L', color: 'Hồng', colorCode: '#FFB6C1' },
      { id: 'v4', name: 'S - Xanh', sku: 'DH-S-X', stock: 5, size: 'S', color: 'Xanh', colorCode: '#87CEEB' },
    ],
    sku: 'DH001',
    stock: 38,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Áo Sơ Mi Trắng Công Sở',
    slug: 'ao-so-mi-trang-cong-so',
    description: 'Áo sơ mi trắng thanh lịch, phù hợp công sở và dự tiệc.',
    price: 350000,
    images: [
      { id: '3', url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&h=800&fit=crop', alt: 'Áo sơ mi trắng' },
    ],
    category: { id: '2', name: 'Áo', slug: 'ao', isActive: true },
    variants: [
      { id: 'v5', name: 'S', sku: 'ASM-S', stock: 20, size: 'S' },
      { id: 'v6', name: 'M', sku: 'ASM-M', stock: 25, size: 'M' },
      { id: 'v7', name: 'L', sku: 'ASM-L', stock: 15, size: 'L' },
    ],
    sku: 'ASM001',
    stock: 60,
    isActive: true,
    isNewArrival: true,
    rating: 4.6,
    reviewCount: 89,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Quần Jean Ống Rộng Vintage',
    slug: 'quan-jean-ong-rong-vintage',
    description: 'Quần jean ống rộng phong cách vintage, thoải mái và thời trang.',
    price: 450000,
    originalPrice: 550000,
    images: [
      { id: '4', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop', alt: 'Quần jean' },
    ],
    category: { id: '3', name: 'Quần', slug: 'quan', isActive: true },
    variants: [
      { id: 'v8', name: '26', sku: 'QJ-26', stock: 12, size: '26' },
      { id: 'v9', name: '27', sku: 'QJ-27', stock: 18, size: '27' },
      { id: 'v10', name: '28', sku: 'QJ-28', stock: 20, size: '28' },
      { id: 'v11', name: '29', sku: 'QJ-29', stock: 15, size: '29' },
      { id: 'v12', name: '30', sku: 'QJ-30', stock: 10, size: '30' },
    ],
    sku: 'QJ001',
    stock: 75,
    isActive: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 256,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Set Đồ Công Sở Thanh Lịch',
    slug: 'set-do-cong-so-thanh-lich',
    description: 'Set áo vest và quần tây thanh lịch cho nàng công sở.',
    price: 899000,
    originalPrice: 1200000,
    images: [
      { id: '5', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', alt: 'Set đồ công sở' },
    ],
    category: { id: '4', name: 'Set Đồ', slug: 'set-do', isActive: true },
    variants: [
      { id: 'v13', name: 'S - Đen', sku: 'SD-S-D', stock: 8, size: 'S', color: 'Đen', colorCode: '#000000' },
      { id: 'v14', name: 'M - Đen', sku: 'SD-M-D', stock: 12, size: 'M', color: 'Đen', colorCode: '#000000' },
      { id: 'v15', name: 'L - Đen', sku: 'SD-L-D', stock: 6, size: 'L', color: 'Đen', colorCode: '#000000' },
    ],
    sku: 'SD001',
    stock: 26,
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 67,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary-600 font-medium mb-2 block">Được yêu thích</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900">
              Sản Phẩm Nổi Bật
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products?featured=true" className="btn-outline">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}
