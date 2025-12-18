import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { StrapiService } from '../strapi/strapi.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private strapiService: StrapiService,
  ) {}

  // Get or create wishlist for user
  async getWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!wishlist) {
      wishlist = new this.wishlistModel({
        userId: new Types.ObjectId(userId),
        items: [],
      });
      await wishlist.save();
    }

    // Optionally refresh product data from Strapi
    await this.refreshWishlistData(wishlist);

    return wishlist;
  }

  // Add item to wishlist
  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.getWishlist(userId);

    // Check if item already exists
    const existingItem = wishlist.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      return wishlist; // Already in wishlist
    }

    // Fetch product from Strapi
    const product = await this.strapiService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    wishlist.items.push({
      productId,
      name: product.attributes.name,
      slug: product.attributes.slug,
      price: product.attributes.price,
      salePrice: product.attributes.salePrice,
      image: product.attributes.images?.data?.[0]?.attributes?.url || '',
      addedAt: new Date(),
    });

    await wishlist.save();
    return wishlist;
  }

  // Remove item from wishlist
  async removeFromWishlist(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.getWishlist(userId);

    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId,
    );

    await wishlist.save();
    return wishlist;
  }

  // Check if item is in wishlist
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.wishlistModel
      .findOne({
        userId: new Types.ObjectId(userId),
        'items.productId': productId,
      })
      .exec();

    return !!wishlist;
  }

  // Clear wishlist
  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.getWishlist(userId);
    wishlist.items = [];
    await wishlist.save();
    return wishlist;
  }

  // Get wishlist count
  async getWishlistCount(userId: string): Promise<number> {
    const wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    return wishlist?.items?.length || 0;
  }

  // Refresh wishlist data from Strapi
  private async refreshWishlistData(wishlist: WishlistDocument): Promise<void> {
    let hasChanges = false;

    for (const item of wishlist.items) {
      try {
        const product = await this.strapiService.getProductById(item.productId);
        if (product) {
          if (item.price !== product.attributes.price) {
            item.price = product.attributes.price;
            hasChanges = true;
          }
          if (item.salePrice !== product.attributes.salePrice) {
            item.salePrice = product.attributes.salePrice;
            hasChanges = true;
          }
          if (item.name !== product.attributes.name) {
            item.name = product.attributes.name;
            hasChanges = true;
          }
        }
      } catch (error) {
        // Product may have been deleted
      }
    }

    if (hasChanges) {
      await wishlist.save();
    }
  }
}
