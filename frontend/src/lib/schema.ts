import type { Product, Organization, WebSite, BreadcrumbList, ItemList } from 'schema-dts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thoitrangnuviet.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Thời Trang Nữ Việt';

// Organization Schema
export const organizationSchema: Organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/logo.png`,
    width: '180',
    height: '60',
  },
  sameAs: [
    'https://facebook.com/thoitrangnuviet',
    'https://instagram.com/thoitrangnuviet',
    'https://tiktok.com/@thoitrangnuviet',
    'https://youtube.com/@thoitrangnuviet',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Nguyễn Văn Linh',
    addressLocality: 'Quận 7',
    addressRegion: 'TP. Hồ Chí Minh',
    postalCode: '700000',
    addressCountry: 'VN',
  },
};

// Website Schema
export const websiteSchema: WebSite = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: 'Thời trang nữ cao cấp - Váy, Đầm, Áo, Quần thời trang nhập khẩu chính hãng',
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
  inLanguage: 'vi-VN',
};

// Product Schema Generator
export function generateProductSchema(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: { url: string; alt?: string }[];
  category: { name: string };
  brand?: { name: string };
  sku: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}): Product {
  return {
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${product.slug}#product`,
    name: product.name,
    description: product.description,
    image: product.images.map(img => img.url),
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'VND',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  };
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// Product List Schema Generator
export function generateProductListSchema(
  products: Array<{
    name: string;
    slug: string;
    price: number;
    images: { url: string }[];
  }>,
  listName: string
): ItemList {
  return {
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `${SITE_URL}/products/${product.slug}`,
        image: product.images[0]?.url,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'VND',
        },
      },
    })),
  };
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Local Business Schema
export function generateLocalBusinessSchema() {
  return {
    '@type': 'ClothingStore',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}/images/store.jpg`,
    url: SITE_URL,
    telephone: '+84-123-456-789',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Nguyễn Văn Linh',
      addressLocality: 'Quận 7',
      addressRegion: 'TP. Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 10.7321,
      longitude: 106.7219,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://facebook.com/thoitrangnuviet',
      'https://instagram.com/thoitrangnuviet',
    ],
  };
}

// JSON-LD Script Component Helper
export function createJsonLd(schema: Record<string, unknown> | Record<string, unknown>[]) {
  const data = Array.isArray(schema) 
    ? { '@context': 'https://schema.org', '@graph': schema }
    : { '@context': 'https://schema.org', ...schema };
  
  return JSON.stringify(data);
}
