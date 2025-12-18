import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Váy/Đầm',
    slug: 'vay-dam',
    description: 'Nữ tính & thanh lịch',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    productCount: 150,
  },
  {
    id: 2,
    name: 'Áo',
    slug: 'ao',
    description: 'Đa dạng phong cách',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
    productCount: 200,
  },
  {
    id: 3,
    name: 'Quần',
    slug: 'quan',
    description: 'Thoải mái & thời trang',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    productCount: 120,
  },
  {
    id: 4,
    name: 'Set Đồ',
    slug: 'set-do',
    description: 'Tiện lợi & đồng bộ',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop',
    productCount: 80,
  },
  {
    id: 5,
    name: 'Phụ Kiện',
    slug: 'phu-kien',
    description: 'Điểm nhấn hoàn hảo',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop',
    productCount: 100,
  },
];

export function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900 mb-4">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Khám phá thế giới thời trang với các danh mục đa dạng, 
            phù hợp với mọi phong cách và dịp của bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-product rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm mb-2">
                  {category.description}
                </p>
                <span className="inline-flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                  Xem thêm
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              {/* Product Count Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-secondary-800">
                {category.productCount}+ SP
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
