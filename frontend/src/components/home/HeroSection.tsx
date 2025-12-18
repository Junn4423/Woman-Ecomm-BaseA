'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    title: 'Bộ Sưu Tập Xuân Hè',
    subtitle: '2024',
    description: 'Khám phá vẻ đẹp rực rỡ với BST mới nhất. Phong cách thanh lịch, nữ tính cho mọi dịp.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
    buttonText: 'Khám phá ngay',
    buttonLink: '/collections/xuan-he-2024',
    align: 'left',
  },
  {
    id: 2,
    title: 'Váy Đầm Công Sở',
    subtitle: 'Thanh Lịch',
    description: 'Tự tin tỏa sáng nơi công sở với những thiết kế tinh tế, sang trọng.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1920&h=1080&fit=crop',
    buttonText: 'Xem bộ sưu tập',
    buttonLink: '/collections/cong-so',
    align: 'right',
  },
  {
    id: 3,
    title: 'Sale Cuối Mùa',
    subtitle: 'Giảm đến 50%',
    description: 'Cơ hội cuối cùng sở hữu những items yêu thích với giá cực ưu đãi.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
    buttonText: 'Mua ngay',
    buttonLink: '/sale',
    align: 'center',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex items-center">
            <div
              className={cn(
                'max-w-xl text-white',
                slide.align === 'left' && 'mr-auto',
                slide.align === 'right' && 'ml-auto',
                slide.align === 'center' && 'mx-auto text-center'
              )}
            >
              <p className="text-primary-400 font-medium mb-2 animate-fade-in">
                {slide.subtitle}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 animate-slide-up">
                {slide.title}
              </h2>
              <p className="text-lg text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {slide.description}
              </p>
              <Link
                href={slide.buttonLink}
                className="inline-flex items-center gap-2 btn-primary animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                {slide.buttonText}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'w-8 bg-primary-500'
                : 'w-2 bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
