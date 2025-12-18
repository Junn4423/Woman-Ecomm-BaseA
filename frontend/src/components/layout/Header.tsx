'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X,
  ChevronDown,
  Phone,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '@/store';
import { SearchModal } from './SearchModal';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { 
    name: 'Sản phẩm', 
    href: '/products',
    children: [
      { name: 'Váy/Đầm', href: '/products?category=vay-dam' },
      { name: 'Áo', href: '/products?category=ao' },
      { name: 'Quần', href: '/products?category=quan' },
      { name: 'Set đồ', href: '/products?category=set-do' },
      { name: 'Phụ kiện', href: '/products?category=phu-kien' },
    ]
  },
  { 
    name: 'Bộ sưu tập', 
    href: '/collections',
    children: [
      { name: 'Xuân Hè 2024', href: '/collections/xuan-he-2024' },
      { name: 'Thu Đông 2024', href: '/collections/thu-dong-2024' },
      { name: 'Công sở', href: '/collections/cong-so' },
      { name: 'Dự tiệc', href: '/collections/du-tiec' },
    ]
  },
  { name: 'Sale', href: '/sale', highlight: true },
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  
  const { cart, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isMobileMenuOpen, toggleMobileMenu, isSearchOpen, toggleSearch } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary-900 text-white text-sm py-2 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+84123456789" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
              <Phone className="w-4 h-4" />
              <span>0123 456 789</span>
            </a>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>123 Nguyễn Văn Linh, Q7, TP.HCM</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>🎉 Miễn phí vận chuyển cho đơn hàng từ 500K</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={cn(
          'sticky top-0 z-50 bg-white transition-all duration-300',
          isScrolled ? 'shadow-md py-2' : 'py-4'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif text-xl">W</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-serif text-xl font-bold text-secondary-900">
                    Thời Trang Nữ
                  </h1>
                  <p className="text-2xs text-secondary-500 -mt-1">Phong cách của bạn</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-1',
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50',
                      item.highlight && 'text-red-600 hover:text-red-700'
                    )}
                  >
                    {item.name}
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 animate-slide-down">
                      <div className="bg-white rounded-xl shadow-elegant py-2 min-w-[200px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Account */}
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors hidden sm:block"
                aria-label="Tài khoản"
              >
                <User className="w-6 h-6" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors relative hidden sm:block"
                aria-label="Yêu thích"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="p-2 text-secondary-600 hover:text-primary-600 transition-colors relative"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t animate-slide-down">
            <nav className="container-custom py-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-3 font-medium border-b border-secondary-100',
                      pathname === item.href
                        ? 'text-primary-600'
                        : 'text-secondary-700',
                      item.highlight && 'text-red-600'
                    )}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block py-2 text-secondary-600"
                          onClick={toggleMobileMenu}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <Link
                  href={isAuthenticated ? '/account' : '/login'}
                  className="flex items-center gap-2 text-secondary-700"
                  onClick={toggleMobileMenu}
                >
                  <User className="w-5 h-5" />
                  <span>{isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 text-secondary-700"
                  onClick={toggleMobileMenu}
                >
                  <Heart className="w-5 h-5" />
                  <span>Yêu thích ({wishlistCount})</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={toggleSearch} />
    </>
  );
}
