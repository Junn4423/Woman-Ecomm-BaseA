import Image from 'next/image';
import Link from 'next/link';

export function PromoBanner() {
  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <Link href="/collections/cong-so" className="group relative overflow-hidden rounded-2xl">
            <div className="aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop"
                alt="Bộ sưu tập công sở"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
                <span className="text-primary-400 font-medium mb-2">Bộ sưu tập</span>
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3">
                  Công Sở Thanh Lịch
                </h3>
                <p className="text-white/80 mb-6 max-w-sm">
                  Tự tin tỏa sáng với phong cách chuyên nghiệp, sang trọng
                </p>
                <span className="inline-flex items-center text-white font-medium border-b-2 border-white pb-1 w-fit group-hover:border-primary-400 group-hover:text-primary-400 transition-colors">
                  Khám phá ngay
                </span>
              </div>
            </div>
          </Link>

          {/* Banner 2 */}
          <Link href="/sale" className="group relative overflow-hidden rounded-2xl">
            <div className="aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop"
                alt="Sale cuối mùa"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-600/50" />
              
              <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
                <span className="text-yellow-400 font-medium mb-2">Ưu đãi đặc biệt</span>
                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-3">
                  Sale Cuối Mùa
                </h3>
                <p className="text-white/90 mb-2">
                  <span className="text-4xl lg:text-5xl font-bold text-yellow-400">50%</span>
                  <span className="ml-2">Giảm đến</span>
                </p>
                <p className="text-white/80 mb-6 max-w-sm">
                  Cơ hội cuối cùng sở hữu items yêu thích
                </p>
                <span className="inline-flex items-center text-white font-medium border-b-2 border-yellow-400 pb-1 w-fit group-hover:text-yellow-400 transition-colors">
                  Mua ngay
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
