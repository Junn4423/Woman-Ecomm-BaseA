import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get current user's cart
  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  // Add item to cart
  @Post('items')
  addToCart(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, addToCartDto);
  }

  // Update cart item quantity
  @Patch('items/:itemId')
  updateCartItem(
    @Request() req: any,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.userId, itemId, updateDto);
  }

  // Remove item from cart
  @Delete('items/:itemId')
  removeFromCart(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user.userId, itemId);
  }

  // Clear cart
  @Delete()
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }

  // Apply coupon
  @Post('coupon')
  applyCoupon(@Request() req: any, @Body() applyCouponDto: ApplyCouponDto) {
    return this.cartService.applyCoupon(req.user.userId, applyCouponDto.code);
  }

  // Remove coupon
  @Delete('coupon')
  removeCoupon(@Request() req: any) {
    return this.cartService.removeCoupon(req.user.userId);
  }
}
