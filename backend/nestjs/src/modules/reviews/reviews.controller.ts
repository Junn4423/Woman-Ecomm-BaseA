import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AdminReplyDto } from './dto/admin-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Get reviews for a product (public)
  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('rating') rating?: string,
    @Query('sort') sort?: 'newest' | 'oldest' | 'helpful',
  ) {
    return this.reviewsService.findByProduct(productId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      rating: rating ? parseInt(rating, 10) : undefined,
      sort,
    });
  }

  // Get review stats for a product (public)
  @Get('product/:productId/stats')
  getProductReviewStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviewStats(productId);
  }

  // Create a review (authenticated)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  // Get my reviews (authenticated)
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  getMyReviews(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByUser(
      req.user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // Update my review (authenticated)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, req.user.userId, updateReviewDto);
  }

  // Delete my review (authenticated)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.reviewsService.remove(id, req.user.userId);
  }

  // Vote helpful (authenticated)
  @UseGuards(JwtAuthGuard)
  @Post(':id/helpful')
  voteHelpful(@Request() req: any, @Param('id') id: string) {
    return this.reviewsService.voteHelpful(id, req.user.userId);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findAll({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reviewsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  addAdminReply(@Param('id') id: string, @Body() replyDto: AdminReplyDto) {
    return this.reviewsService.addAdminReply(id, replyDto.reply);
  }
}
