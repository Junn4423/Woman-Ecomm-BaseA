import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument, CartItem } from '../../schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { StrapiService } from '../strapi/strapi.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private strapiService: StrapiService,
  ) {}

  // Get or create cart for user
  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ userId }).exec();
    
    if (!cart) {
      cart = new this.cartModel({
        userId,
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
      });
      await cart.save();
    }

    // Refresh product data from Strapi
    await this.refreshCartPrices(cart);
    
    return cart;
  }

  // Add item to cart
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(userId);

    // Fetch product from Strapi to validate and get current price
    const product = await this.strapiService.getProductById(addToCartDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check stock availability
    let stock = product.attributes.stock;
    let price = product.attributes.salePrice || product.attributes.price;
    let image = product.attributes.images?.data?.[0]?.attributes?.url || '';

    if (addToCartDto.variantId) {
      const variant = product.attributes.variants?.find(
        (v: any) => v.id === addToCartDto.variantId,
      );
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      stock = variant.stock;
      if (variant.price) price = variant.price;
    }

    if (stock < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId === addToCartDto.productId &&
        item.variantId === (addToCartDto.variantId || null) &&
        item.size === (addToCartDto.size || null) &&
        item.color === (addToCartDto.color || null),
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + addToCartDto.quantity;
      if (newQuantity > stock) {
        throw new BadRequestException('Insufficient stock');
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: addToCartDto.productId,
        strapiProductId: addToCartDto.productId,
        name: product.attributes.name,
        slug: product.attributes.slug,
        price,
        quantity: addToCartDto.quantity,
        image,
        variantId: addToCartDto.variantId || null,
        size: addToCartDto.size || null,
        color: addToCartDto.color || null,
      };
      cart.items.push(newItem);
    }

    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Update cart item quantity
  async updateCartItem(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    const item = cart.items[itemIndex];

    // Check stock availability
    const product = await this.strapiService.getProductById(item.productId);
    if (!product) {
      throw new NotFoundException('Product no longer available');
    }

    let stock = product.attributes.stock;
    if (item.variantId) {
      const variant = product.attributes.variants?.find(
        (v: any) => v.id === item.variantId,
      );
      if (variant) stock = variant.stock;
    }

    if (updateDto.quantity > stock) {
      throw new BadRequestException('Insufficient stock');
    }

    if (updateDto.quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = updateDto.quantity;
    }

    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    cart.items.splice(itemIndex, 1);
    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Clear entire cart
  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;
    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Apply coupon
  async applyCoupon(userId: string, couponCode: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    // TODO: Validate coupon from coupons service
    // For now, just store the code
    cart.couponCode = couponCode;
    
    // Apply discount logic here
    // cart.discount = calculatedDiscount;
    
    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Remove coupon
  async removeCoupon(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.couponCode = null;
    cart.discount = 0;
    this.calculateTotals(cart);
    await cart.save();
    return cart;
  }

  // Calculate cart totals
  private calculateTotals(cart: CartDocument): void {
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.total = cart.subtotal - (cart.discount || 0);
  }

  // Refresh prices from Strapi
  private async refreshCartPrices(cart: CartDocument): Promise<void> {
    for (const item of cart.items) {
      try {
        const product = await this.strapiService.getProductById(item.productId);
        if (product) {
          item.price = product.attributes.salePrice || product.attributes.price;
          item.name = product.attributes.name;
          item.image = product.attributes.images?.data?.[0]?.attributes?.url || item.image;
        }
      } catch (error) {
        // Product may have been deleted, keep existing data
      }
    }
    this.calculateTotals(cart);
  }
}
