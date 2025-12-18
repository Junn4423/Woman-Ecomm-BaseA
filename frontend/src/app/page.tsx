import Image from 'next/image';
import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BestSellers } from '@/components/home/BestSellers';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { Newsletter } from '@/components/home/Newsletter';
import { TrustBadges } from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <>
      {/* Hero Slider/Banner */}
      <HeroSection />
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Shop by Category */}
      <CategorySection />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* New Arrivals */}
      <NewArrivals />
      
      {/* Best Sellers */}
      <BestSellers />
      
      {/* Instagram Feed */}
      <InstagramFeed />
      
      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
