// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: ProductImage[];
  category: Category;
  brand?: Brand;
  variants: ProductVariant[];
  tags?: string[];
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  seo?: SEOMeta;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  isMain?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  stock: number;
  size?: string;
  color?: string;
  colorCode?: string;
  image?: ProductImage;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
  seo?: SEOMeta;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: ProductImage;
  description?: string;
  isActive: boolean;
}

// Cart Types
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  coupon?: Coupon;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  note?: string;
  coupon?: Coupon;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'cod'
  | 'bank_transfer'
  | 'vnpay'
  | 'momo'
  | 'zalopay';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  addresses: ShippingAddress[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar?: string;
  };
  productId: string;
  rating: number;
  title?: string;
  content: string;
  images?: ProductImage[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: ProductImage;
  mobileImage?: ProductImage;
  link?: string;
  buttonText?: string;
  position: number;
  isActive: boolean;
}

// SEO Types
export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

// Pagination Types
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Filter Types
export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  sort?: ProductSort;
  search?: string;
}

export type ProductSort = 
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'popular'
  | 'rating';

// Wishlist Types
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Auth Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
