import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class StrapiService {
  private readonly logger = new Logger(StrapiService.name);
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const strapiUrl = this.configService.get<string>('strapi.url');
    const apiToken = this.configService.get<string>('strapi.apiToken');

    this.client = axios.create({
      baseURL: `${strapiUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
    });
  }

  // Get products from Strapi
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
    sort?: string;
    populate?: string | string[];
  }) {
    try {
      const response = await this.client.get('/products', {
        params: {
          'pagination[page]': params?.page || 1,
          'pagination[pageSize]': params?.pageSize || 20,
          populate: params?.populate || '*',
          sort: params?.sort || 'createdAt:desc',
          ...this.buildFilters(params?.filters),
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching products from Strapi', error);
      throw error;
    }
  }

  // Get single product by slug
  async getProductBySlug(slug: string) {
    try {
      const response = await this.client.get('/products', {
        params: {
          'filters[slug][$eq]': slug,
          populate: '*',
        },
      });
      return response.data?.data?.[0] || null;
    } catch (error) {
      this.logger.error(`Error fetching product ${slug} from Strapi`, error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id: string) {
    try {
      const response = await this.client.get(`/products/${id}`, {
        params: { populate: '*' },
      });
      return response.data?.data || null;
    } catch (error) {
      this.logger.error(`Error fetching product ${id} from Strapi`, error);
      throw error;
    }
  }

  // Update product stock (called after order is placed)
  async updateProductStock(productId: string, variantId: string | null, quantity: number) {
    try {
      // Get current product data
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      if (variantId) {
        // Update variant stock
        const variants = product.attributes.variants || [];
        const variantIndex = variants.findIndex((v: any) => v.id === variantId);
        if (variantIndex !== -1) {
          variants[variantIndex].stock = Math.max(0, variants[variantIndex].stock - quantity);
        }
        
        await this.client.put(`/products/${productId}`, {
          data: { variants },
        });
      } else {
        // Update main product stock
        const newStock = Math.max(0, product.attributes.stock - quantity);
        await this.client.put(`/products/${productId}`, {
          data: { stock: newStock },
        });
      }

      this.logger.log(`Updated stock for product ${productId}, variant ${variantId}, quantity: -${quantity}`);
    } catch (error) {
      this.logger.error(`Error updating stock for product ${productId}`, error);
      throw error;
    }
  }

  // Restore stock (when order is cancelled)
  async restoreProductStock(productId: string, variantId: string | null, quantity: number) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      if (variantId) {
        const variants = product.attributes.variants || [];
        const variantIndex = variants.findIndex((v: any) => v.id === variantId);
        if (variantIndex !== -1) {
          variants[variantIndex].stock += quantity;
        }
        
        await this.client.put(`/products/${productId}`, {
          data: { variants },
        });
      } else {
        const newStock = product.attributes.stock + quantity;
        await this.client.put(`/products/${productId}`, {
          data: { stock: newStock },
        });
      }

      this.logger.log(`Restored stock for product ${productId}, variant ${variantId}, quantity: +${quantity}`);
    } catch (error) {
      this.logger.error(`Error restoring stock for product ${productId}`, error);
      throw error;
    }
  }

  // Get categories
  async getCategories(params?: { populate?: string }) {
    try {
      const response = await this.client.get('/categories', {
        params: {
          populate: params?.populate || '*',
          'filters[isActive][$eq]': true,
          sort: 'position:asc',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching categories from Strapi', error);
      throw error;
    }
  }

  // Get banners
  async getBanners(position?: string) {
    try {
      const response = await this.client.get('/banners', {
        params: {
          populate: '*',
          'filters[isActive][$eq]': true,
          ...(position && { 'filters[position][$eq]': position }),
          sort: 'order:asc',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching banners from Strapi', error);
      throw error;
    }
  }

  // Get collections
  async getCollections(params?: { featured?: boolean }) {
    try {
      const response = await this.client.get('/collections', {
        params: {
          populate: '*',
          'filters[isActive][$eq]': true,
          ...(params?.featured && { 'filters[isFeatured][$eq]': true }),
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching collections from Strapi', error);
      throw error;
    }
  }

  // Helper to build Strapi filters
  private buildFilters(filters?: Record<string, any>): Record<string, any> {
    if (!filters) return {};

    const strapiFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          strapiFilters[`filters[${key}][$in]`] = value;
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([op, val]) => {
            strapiFilters[`filters[${key}][${op}]`] = val;
          });
        } else {
          strapiFilters[`filters[${key}][$eq]`] = value;
        }
      }
    });

    return strapiFilters;
  }
}
