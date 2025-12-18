import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';
import { createJsonLd, organizationSchema, websiteSchema } from '@/lib/schema';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-dancing',
  display: 'swap',
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Thời Trang Nữ Việt';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thoitrangnuviet.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Thời Trang Nữ Cao Cấp`,
    template: `%s | ${siteName}`,
  },
  description: 'Thời trang nữ cao cấp - Váy, Đầm, Áo, Quần thời trang nhập khẩu chính hãng. Miễn phí giao hàng cho đơn từ 500k. Đổi trả trong 30 ngày.',
  keywords: [
    'thời trang nữ',
    'váy đầm',
    'áo nữ',
    'quần nữ',
    'thời trang công sở',
    'đầm dự tiệc',
    'thời trang Việt Nam',
    'mua quần áo online',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'vi-VN': siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Thời Trang Nữ Cao Cấp`,
    description: 'Thời trang nữ cao cấp - Váy, Đầm, Áo, Quần thời trang nhập khẩu chính hãng',
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Thời Trang Nữ Cao Cấp`,
    description: 'Thời trang nữ cao cấp - Váy, Đầm, Áo, Quần thời trang nhập khẩu chính hãng',
    images: [`${siteUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'ecommerce',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ec4899' },
    { media: '(prefers-color-scheme: dark)', color: '#be185d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="vi" 
      className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: createJsonLd([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '0.75rem',
                padding: '1rem',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
