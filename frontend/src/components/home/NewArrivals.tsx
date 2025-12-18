import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

// Mock data - will be replaced with API call
const newArrivals: Product[] = [
  {
    id: '5',
    name: 'Đầm Midi Cổ Vuông Tay Phồng',
    slug: 'dam-midi-co-vuong-tay-phong',
    description: 'Đầm midi cổ vuông thanh lịch, tay phồng nữ tính.',
    price: 680000,
    images: [
      { id: '6', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Đầm midi' },
    ],
    category: { id: '1', name: 'Váy/Đầm', slug: 'vay-dam', isActive: true },
    variants: [
      { id: 'v16', name: 'S', sku: 'DM-S', stock: 15, size: 'S' },
      { id: 'v17', name: 'M', sku: 'DM-M', stock: 20, size: 'M' },
      { id: 'v18', name: 'L', sku: 'DM-L', stock: 12, size: 'L' },
    ],
    sku: 'DM002',
    stock: 47,
    isActive: true,
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 23,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: '6',
    name: 'Áo Croptop Len Mỏng',
    slug: 'ao-croptop-len-mong',
    description: 'Áo croptop len mỏng, phong cách Hàn Quốc.',
    price: 280000,
    originalPrice: 350000,
    images: [
      { id: '7', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', alt: 'Áo croptop' },
    ],
    category: { id: '2', name: 'Áo', slug: 'ao', isActive: true },
    variants: [
      { id: 'v19', name: 'S - Trắng', sku: 'ACL-S-T', stock: 25, size: 'S', color: 'Trắng', colorCode: '#FFFFFF' },
      { id: 'v20', name: 'M - Trắng', sku: 'ACL-M-T', stock: 30, size: 'M', color: 'Trắng', colorCode: '#FFFFFF' },
      { id: 'v21', name: 'S - Đen', sku: 'ACL-S-D', stock: 20, size: 'S', color: 'Đen', colorCode: '#000000' },
      { id: 'v22', name: 'M - Đen', sku: 'ACL-M-D', stock: 28, size: 'M', color: 'Đen', colorCode: '#000000' },
    ],
    sku: 'ACL001',
    stock: 103,
    isActive: true,
    isNewArrival: true,
    rating: 4.3,
    reviewCount: 45,
    createdAt: '2024-03-14',
    updatedAt: '2024-03-14',
  },
  {
    id: '7',
    name: 'Chân Váy Xếp Ly Dài',
    slug: 'chan-vay-xep-ly-dai',
    description: 'Chân váy xếp ly dài thanh lịch, phong cách Hàn Quốc.',
    price: 420000,
    images: [
      { id: '8', url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop', alt: 'Chân váy' },
    ],
    category: { id: '1', name: 'Váy/Đầm', slug: 'vay-dam', isActive: true },
    variants: [
      { id: 'v23', name: 'S', sku: 'CVX-S', stock: 18, size: 'S' },
      { id: 'v24', name: 'M', sku: 'CVX-M', stock: 22, size: 'M' },
      { id: 'v25', name: 'L', sku: 'CVX-L', stock: 15, size: 'L' },
    ],
    sku: 'CVX001',
    stock: 55,
    isActive: true,
    isNewArrival: true,
    createdAt: '2024-03-13',
    updatedAt: '2024-03-13',
  },
  {
    id: '8',
    name: 'Áo Blazer Oversized',
    slug: 'ao-blazer-oversized',
    description: 'Áo blazer oversized phong cách, dễ phối đồ.',
    price: 750000,
    originalPrice: 950000,
    images: [
      { id: '9', url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop', alt: 'Áo blazer' },
    ],
    category: { id: '2', name: 'Áo', slug: 'ao', isActive: true },
    variants: [
      { id: 'v26', name: 'M - Kem', sku: 'AB-M-K', stock: 10, size: 'M', color: 'Kem', colorCode: '#F5F5DC' },
      { id: 'v27', name: 'L - Kem', sku: 'AB-L-K', stock: 8, size: 'L', color: 'Kem', colorCode: '#F5F5DC' },
      { id: 'v28', name: 'M - Đen', sku: 'AB-M-D', stock: 12, size: 'M', color: 'Đen', colorCode: '#000000' },
      { id: 'v29', name: 'L - Đen', sku: 'AB-L-D', stock: 10, size: 'L', color: 'Đen', colorCode: '#000000' },
    ],
    sku: 'AB001',
    stock: 40,
    isActive: true,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 18,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12',
  },
];

export function NewArrivals() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary-600 font-medium mb-2 block">Vừa ra mắt</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900">
              Sản Phẩm Mới
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products?sort=newest" className="btn-outline">
            Xem tất cả sản phẩm mới
          </Link>
        </div>
      </div>
    </section>
  );
}
