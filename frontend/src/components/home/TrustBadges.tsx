import { Truck, RotateCcw, Shield, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Giao hàng miễn phí',
    description: 'Đơn hàng từ 500K',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả trong 30 ngày',
    description: 'Miễn phí đổi trả',
  },
  {
    icon: Shield,
    title: 'Thanh toán an toàn',
    description: 'Bảo mật 100%',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Luôn sẵn sàng giúp bạn',
  },
];

export function TrustBadges() {
  return (
    <section className="py-8 bg-white border-b">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">{badge.title}</h4>
                <p className="text-sm text-secondary-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
