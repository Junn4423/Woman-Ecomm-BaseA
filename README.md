# 👗 Women's Fashion E-Commerce Platform

A full-featured, production-ready e-commerce platform for women's fashion built with modern technologies.

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js 14    │────▶│   NestJS API    │────▶│     Strapi      │
│   (Frontend)    │     │ (Business Logic)│     │     (CMS)       │
│   Port: 3000    │     │   Port: 3001    │     │   Port: 1337    │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │    MongoDB      │     │    MongoDB      │
                        │ ecommerce_core  │     │  ecommerce_cms  │
                        └─────────────────┘     └─────────────────┘
```

## 🚀 Tech Stack

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **SEO**: Schema.org JSON-LD structured data
- **Image Optimization**: next/image
- **Animations**: Framer Motion
- **Carousel**: Swiper

### Backend API (NestJS)
- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport
- **Payment**: VNPay, MoMo
- **Storage**: AWS S3 / FPT Storage
- **Real-time**: WebSocket (Socket.io)

### CMS (Strapi)
- **Version**: Strapi 4.21
- **Database**: MongoDB
- **Storage**: S3 Provider
- **i18n**: Internationalization support

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7.0
- **Cache**: Redis
- **CDN**: Cloudflare / FPT CDN

## 📁 Project Structure

```
Woman-Ecomm3/
├── docker-compose.yml          # Docker orchestration
├── docker/
│   └── mongo-init.js           # MongoDB initialization
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities, API clients
│   │   ├── store/              # Zustand stores
│   │   └── types/              # TypeScript types
│   └── package.json
├── backend/
│   ├── strapi/                 # Strapi CMS
│   │   ├── src/
│   │   │   ├── api/            # Content types
│   │   │   └── components/     # Reusable components
│   │   └── package.json
│   └── nestjs/                 # NestJS API
│       ├── src/
│       │   ├── modules/        # Feature modules
│       │   ├── schemas/        # Mongoose schemas
│       │   └── config/         # Configuration
│       └── package.json
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Woman-Ecomm3
   ```

2. **Create environment files**
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   cp backend/strapi/.env.example backend/strapi/.env
   cp backend/nestjs/.env.example backend/nestjs/.env
   ```

3. **Update environment variables**
   Edit the `.env` files with your configuration.

4. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Access the applications**
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin
   - NestJS API: http://localhost:3001

### Manual Setup (Development)

1. **Start MongoDB**
   ```bash
   docker-compose up mongodb redis -d
   ```

2. **Setup Strapi**
   ```bash
   cd backend/strapi
   npm install
   npm run develop
   ```

3. **Setup NestJS**
   ```bash
   cd backend/nestjs
   npm install
   npm run start:dev
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔧 Configuration

### MongoDB Databases
- `ecommerce_cms`: Strapi content (products, categories, banners)
- `ecommerce_core`: NestJS data (users, orders, carts, reviews)

### Payment Integration

#### VNPay
1. Register at https://vnpay.vn
2. Get TMN Code and Hash Secret
3. Update `.env` with credentials

#### MoMo
1. Register at https://business.momo.vn
2. Get Partner Code, Access Key, Secret Key
3. Update `.env` with credentials

### S3 Storage (FPT Storage)
1. Create bucket at FPT Cloud
2. Get Access Key and Secret Key
3. Update `.env` with credentials

## 📦 Features

### Customer Features
- ✅ Product browsing with filters
- ✅ Search with autocomplete
- ✅ Shopping cart
- ✅ Wishlist
- ✅ User authentication
- ✅ Order tracking
- ✅ Product reviews
- ✅ Multiple payment methods
- ✅ Address management
- ✅ Real-time notifications

### Admin Features (Strapi)
- ✅ Product management
- ✅ Category management
- ✅ Order management
- ✅ Banner management
- ✅ Collection management
- ✅ Multi-language support

### Technical Features
- ✅ SEO optimized (Schema.org)
- ✅ Image optimization
- ✅ Responsive design
- ✅ Server-side rendering
- ✅ API rate limiting
- ✅ JWT authentication
- ✅ WebSocket notifications

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user

### Products (via NestJS → Strapi)
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product details

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PATCH /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

### Payments
- `GET /api/payments/vnpay/callback` - VNPay callback
- `POST /api/payments/vnpay/ipn` - VNPay IPN
- `GET /api/payments/momo/callback` - MoMo callback

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend/nestjs && npm test
```

## 🚀 Deployment

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Enable SSL/TLS
- Set up CDN for static assets

## 📝 License

MIT License

## 👨‍💻 Author

NgocChungIT

---

Made with ❤️ for Vietnamese fashion e-commerce
