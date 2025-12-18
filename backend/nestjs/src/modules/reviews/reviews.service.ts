import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  // Create a review
  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if user already reviewed this product
    const existingReview = await this.reviewModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: createReviewDto.productId,
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    const review = new this.reviewModel({
      ...createReviewDto,
      userId: new Types.ObjectId(userId),
      status: 'pending',
    });

    return review.save();
  }

  // Get reviews for a product
  async findByProduct(
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      sort?: 'newest' | 'oldest' | 'helpful';
    },
  ) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {
      productId,
      status: 'approved',
    };

    if (params?.rating) {
      query.rating = params.rating;
    }

    let sortOption: any = { createdAt: -1 };
    if (params?.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (params?.sort === 'helpful') {
      sortOption = { helpfulCount: -1, createdAt: -1 };
    }

    const [reviews, total, stats] = await Promise.all([
      this.reviewModel
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName avatar')
        .exec(),
      this.reviewModel.countDocuments(query),
      this.getProductReviewStats(productId),
    ]);

    return {
      data: reviews,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get review statistics for a product
  async getProductReviewStats(productId: string) {
    const stats = await this.reviewModel.aggregate([
      { $match: { productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    return {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingDistribution: {
        5: stats[0].rating5,
        4: stats[0].rating4,
        3: stats[0].rating3,
        2: stats[0].rating2,
        1: stats[0].rating1,
      },
    };
  }

  // Get user's reviews
  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update review
  async update(
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    Object.assign(review, updateReviewDto);
    review.status = 'pending'; // Re-review after edit
    return review.save();
  }

  // Delete review
  async remove(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await review.deleteOne();
  }

  // Vote helpful
  async voteHelpful(reviewId: string, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasVoted = review.helpfulVotes.some(
      (vote) => vote.toString() === userId,
    );

    if (hasVoted) {
      // Remove vote
      review.helpfulVotes = review.helpfulVotes.filter(
        (vote) => vote.toString() !== userId,
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add vote
      review.helpfulVotes.push(userObjectId);
      review.helpfulCount += 1;
    }

    return review.save();
  }

  // Admin: Get all reviews
  async findAll(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params?.status) {
      query.status = params.status;
    }

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName email')
        .exec(),
      this.reviewModel.countDocuments(query),
    ]);

    return {
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin: Update review status
  async updateStatus(reviewId: string, status: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true },
    );

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  // Admin: Reply to review
  async addAdminReply(reviewId: string, reply: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      {
        adminReply: reply,
        adminReplyAt: new Date(),
      },
      { new: true },
    );

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
