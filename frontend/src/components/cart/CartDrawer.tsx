'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/store';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Giỏ hàng
            {cart && cart.items.length > 0 && (
              <span className="text-sm font-normal text-secondary-500">
                ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
              </span>
            )}
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-secondary-500 hover:text-secondary-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {!cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-secondary-500 mb-6">
              Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!
            </p>
            <button onClick={closeCart} className="btn-primary">
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-secondary-50 rounded-xl">
                  {/* Image */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.variant?.image?.url || item.product.images[0]?.url || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-secondary-900 line-clamp-2 hover:text-primary-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.variant && (
                      <p className="text-sm text-secondary-500 mt-1">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && ' - '}
                        {item.variant.color && `Màu: ${item.variant.color}`}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(item.price)}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-secondary-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-secondary-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-secondary-600">
                  <span>Phí vận chuyển</span>
                  <span>
                    {cart.shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatCurrency(cart.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-secondary-900 pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatCurrency(cart.total)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {cart.subtotal < 500000 && (
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700 mb-2">
                    Mua thêm <strong>{formatCurrency(500000 - cart.subtotal)}</strong> để được miễn phí vận chuyển
                  </p>
                  <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${(cart.subtotal / 500000) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full"
                >
                  Thanh toán
                </Link>
                <button
                  onClick={closeCart}
                  className="btn-secondary w-full"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
