import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/1',
    likes: 1234,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/2',
    likes: 2156,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/3',
    likes: 1876,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/4',
    likes: 3245,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/5',
    likes: 1567,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop',
    link: 'https://instagram.com/p/6',
    likes: 2089,
  },
];

export function InstagramFeed() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-primary-600 font-medium mb-2">
            <Instagram className="w-5 h-5" />
            <span>@thoitrangnuviet</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900 mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-secondary-600 max-w-xl mx-auto">
            Theo dõi chúng tôi để cập nhật xu hướng thời trang mới nhất và nhận ưu đãi độc quyền
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={post.image}
                alt={`Instagram post ${post.id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="https://instagram.com/thoitrangnuviet"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Instagram className="w-5 h-5" />
            Theo dõi trên Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
