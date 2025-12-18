import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

const footerLinks = {
  shop: {
    title: 'Mua sắm',
    links: [
      { name: 'Tất cả sản phẩm', href: '/products' },
      { name: 'Váy/Đầm', href: '/products?category=vay-dam' },
      { name: 'Áo', href: '/products?category=ao' },
      { name: 'Quần', href: '/products?category=quan' },
      { name: 'Set đồ', href: '/products?category=set-do' },
      { name: 'Phụ kiện', href: '/products?category=phu-kien' },
      { name: 'Sale', href: '/sale' },
    ],
  },
  support: {
    title: 'Hỗ trợ',
    links: [
      { name: 'Hướng dẫn mua hàng', href: '/huong-dan-mua-hang' },
      { name: 'Chính sách đổi trả', href: '/chinh-sach-doi-tra' },
      { name: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
      { name: 'Điều khoản sử dụng', href: '/dieu-khoan-su-dung' },
      { name: 'Câu hỏi thường gặp', href: '/faq' },
      { name: 'Bảng size', href: '/bang-size' },
    ],
  },
  about: {
    title: 'Về chúng tôi',
    links: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Hệ thống cửa hàng', href: '/stores' },
      { name: 'Tuyển dụng', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Liên hệ', href: '/contact' },
    ],
  },
};

const paymentMethods = [
  { name: 'VISA', icon: '/images/payment/visa.svg' },
  { name: 'MasterCard', icon: '/images/payment/mastercard.svg' },
  { name: 'VNPay', icon: '/images/payment/vnpay.svg' },
  { name: 'MoMo', icon: '/images/payment/momo.svg' },
  { name: 'ZaloPay', icon: '/images/payment/zalopay.svg' },
  { name: 'COD', icon: '/images/payment/cod.svg' },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'Youtube', href: 'https://youtube.com', icon: Youtube },
  { name: 'TikTok', href: 'https://tiktok.com', icon: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  )},
];

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      {/* Features */}
      <div className="border-b border-secondary-800">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/20 rounded-xl">
                <Truck className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium">Giao hàng miễn phí</h4>
                <p className="text-sm text-secondary-400">Đơn từ 500K</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/20 rounded-xl">
                <RotateCcw className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium">Đổi trả 30 ngày</h4>
                <p className="text-sm text-secondary-400">Miễn phí đổi trả</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/20 rounded-xl">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium">Thanh toán an toàn</h4>
                <p className="text-sm text-secondary-400">Bảo mật 100%</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-600/20 rounded-xl">
                <CreditCard className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium">Nhiều hình thức</h4>
                <p className="text-sm text-secondary-400">Thanh toán linh hoạt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif text-2xl">W</span>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold">Thời Trang Nữ Việt</h2>
                  <p className="text-xs text-secondary-400">Phong cách của bạn</p>
                </div>
              </div>
            </Link>
            <p className="text-secondary-400 mb-6 max-w-sm">
              Thời trang nữ cao cấp với những thiết kế độc đáo, chất liệu premium. 
              Mang đến vẻ đẹp tự tin cho phái đẹp Việt.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="tel:+84123456789" className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>0123 456 789</span>
              </a>
              <a href="mailto:contact@thoitrangnuviet.com" className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>contact@thoitrangnuviet.com</span>
              </a>
              <p className="flex items-start gap-3 text-secondary-300">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary-400 hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} Thời Trang Nữ Việt. Tất cả quyền được bảo lưu.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-secondary-400 text-sm">Thanh toán:</span>
              <div className="flex items-center gap-2">
                {/* Payment icons placeholder - replace with actual images */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-2xs font-bold text-secondary-800">VISA</div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-2xs font-bold text-secondary-800">MC</div>
                <div className="w-10 h-6 bg-[#003087] rounded flex items-center justify-center text-2xs font-bold text-white">VNPAY</div>
                <div className="w-10 h-6 bg-[#a50064] rounded flex items-center justify-center text-2xs font-bold text-white">MoMo</div>
                <div className="w-10 h-6 bg-secondary-700 rounded flex items-center justify-center text-2xs font-bold text-white">COD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
