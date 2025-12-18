'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail('');
    toast.success('Đăng ký thành công!');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Đăng Ký Nhận Tin
          </h2>
          <p className="text-white/90 mb-8">
            Đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi độc quyền và 
            <span className="font-semibold"> giảm 10% cho đơn hàng đầu tiên</span>
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-white">
              <CheckCircle className="w-8 h-8" />
              <span className="text-lg font-medium">
                Cảm ơn bạn đã đăng ký! Kiểm tra email để nhận mã giảm giá nhé.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:border-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Đăng ký</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-white/60 text-sm mt-4">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </section>
  );
}
