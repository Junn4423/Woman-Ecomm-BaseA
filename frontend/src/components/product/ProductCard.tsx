'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { formatCurrency, calculateDiscount, cn } from '@/lib/utils';
import { Product } from '@/types';
import { useCartStore, useWishlistStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product.id);
  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Đã xóa khỏi yêu thích');
    } else {
      addToWishlist(product);
      toast.success('Đã thêm vào yêu thích');
    }
  };

  return (
    <div className="product-card group">
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden bg-secondary-100">
          <Image
            src={product.images[0]?.url || '/images/placeholder.jpg'}
            alt={product.images[0]?.alt || product.name}
            fill
            className="product-image object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Second Image on Hover */}
          {product.images[1] && (
            <Image
              src={product.images[1].url}
              alt={product.images[1].alt || product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="badge-danger">-{discount}%</span>
            )}
            {product.isNewArrival && (
              <span className="badge-primary">Mới</span>
            )}
            {product.isBestSeller && (
              <span className="badge bg-accent-gold text-white">Hot</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
              isWishlisted
                ? 'bg-primary-600 text-white'
                : 'bg-white/80 backdrop-blur-sm text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
            )}
            aria-label={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
          </button>

          {/* Quick Actions */}
          <div className="product-actions absolute bottom-0 left-0 right-0 p-4">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary btn-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Thêm vào giỏ
              </button>
              {showQuickView && (
                <button
                  className="btn-secondary btn-sm"
                  aria-label="Xem nhanh"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="px-4 py-2 bg-secondary-900 text-white text-sm font-medium rounded-lg">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-secondary-500 mb-1">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-secondary-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-secondary-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-secondary-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Size Options Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3 flex items-center gap-1">
              {product.variants
                .filter(v => v.size)
                .slice(0, 5)
                .map((variant) => (
                  <span
                    key={variant.id}
                    className={cn(
                      'w-7 h-7 text-2xs border rounded flex items-center justify-center',
                      variant.stock > 0
                        ? 'border-secondary-300 text-secondary-700'
                        : 'border-secondary-200 text-secondary-300 line-through'
                    )}
                  >
                    {variant.size}
                  </span>
                ))}
              {product.variants.filter(v => v.size).length > 5 && (
                <span className="text-2xs text-secondary-400">
                  +{product.variants.filter(v => v.size).length - 5}
                </span>
              )}
            </div>
          )}

          {/* Color Options Preview */}
          {product.variants && product.variants.some(v => v.colorCode) && (
            <div className="mt-2 flex items-center gap-1">
              {product.variants
                .filter(v => v.colorCode)
                .slice(0, 5)
                .map((variant) => (
                  <span
                    key={variant.id}
                    className="w-5 h-5 rounded-full border border-secondary-200"
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.color}
                  />
                ))}
              {product.variants.filter(v => v.colorCode).length > 5 && (
                <span className="text-2xs text-secondary-400">
                  +{product.variants.filter(v => v.colorCode).length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
