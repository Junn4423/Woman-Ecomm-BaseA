// MongoDB Initialization Script
// Creates separate databases for Strapi CMS and NestJS Core

// Create database for Strapi CMS
db = db.getSiblingDB('ecommerce_cms');
db.createUser({
  user: 'strapi_user',
  pwd: 'strapi_password_123',
  roles: [
    { role: 'readWrite', db: 'ecommerce_cms' }
  ]
});

// Create initial collections for CMS
db.createCollection('products');
db.createCollection('categories');
db.createCollection('brands');
db.createCollection('banners');
db.createCollection('pages');
db.createCollection('settings');

// Create database for NestJS Core (Business Logic)
db = db.getSiblingDB('ecommerce_core');
db.createUser({
  user: 'nestjs_user',
  pwd: 'nestjs_password_123',
  roles: [
    { role: 'readWrite', db: 'ecommerce_core' }
  ]
});

// Create initial collections for Core
db.createCollection('users');
db.createCollection('orders');
db.createCollection('order_items');
db.createCollection('carts');
db.createCollection('cart_items');
db.createCollection('payments');
db.createCollection('shipping_addresses');
db.createCollection('reviews');
db.createCollection('wishlists');
db.createCollection('inventory_logs');
db.createCollection('notifications');
db.createCollection('coupons');
db.createCollection('coupon_usages');

// Create indexes for better performance
db = db.getSiblingDB('ecommerce_core');

// Users indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { sparse: true });
db.users.createIndex({ createdAt: -1 });

// Orders indexes
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ 'payment.status': 1 });

// Carts indexes
db.carts.createIndex({ userId: 1 }, { unique: true });
db.carts.createIndex({ sessionId: 1 }, { sparse: true });

// Reviews indexes
db.reviews.createIndex({ productId: 1 });
db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ rating: 1 });

// Wishlists indexes
db.wishlists.createIndex({ userId: 1 });
db.wishlists.createIndex({ productId: 1 });
db.wishlists.createIndex({ userId: 1, productId: 1 }, { unique: true });

// Inventory logs indexes
db.inventory_logs.createIndex({ productId: 1 });
db.inventory_logs.createIndex({ variantId: 1 });
db.inventory_logs.createIndex({ createdAt: -1 });

// Coupons indexes
db.coupons.createIndex({ code: 1 }, { unique: true });
db.coupons.createIndex({ isActive: 1 });
db.coupons.createIndex({ expiresAt: 1 });

// Notifications indexes
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ createdAt: -1 });

print('MongoDB initialization completed successfully!');
print('Created databases: ecommerce_cms, ecommerce_core');
