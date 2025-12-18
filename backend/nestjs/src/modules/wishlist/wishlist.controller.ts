import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // Get user's wishlist
  @Get()
  getWishlist(@Request() req: any) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  // Add item to wishlist
  @Post(':productId')
  addToWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.userId, productId);
  }

  // Remove item from wishlist
  @Delete(':productId')
  removeFromWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }

  // Check if item is in wishlist
  @Get('check/:productId')
  isInWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.isInWishlist(req.user.userId, productId);
  }

  // Get wishlist count
  @Get('count')
  getWishlistCount(@Request() req: any) {
    return this.wishlistService.getWishlistCount(req.user.userId);
  }

  // Clear wishlist
  @Delete()
  clearWishlist(@Request() req: any) {
    return this.wishlistService.clearWishlist(req.user.userId);
  }
}
