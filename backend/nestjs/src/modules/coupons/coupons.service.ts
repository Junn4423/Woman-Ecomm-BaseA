import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coupon, CouponDocument, DiscountType } from './schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
  ) {}

  // Create a coupon (admin)
  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const existingCoupon = await this.couponModel.findOne({
      code: createCouponDto.code.toUpperCase(),
    });

    if (existingCoupon) {
      throw new ConflictException('Coupon code already exists');
    }

    const coupon = new this.couponModel({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });

    return coupon.save();
  }

  // Find all coupons (admin)
  async findAll(params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params?.isActive !== undefined) {
      query.isActive = params.isActive;
    }

    const [coupons, total] = await Promise.all([
      this.couponModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.couponModel.countDocuments(query),
    ]);

    return {
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Find one coupon by ID (admin)
  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  // Find coupon by code
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponModel
      .findOne({ code: code.toUpperCase() })
      .exec();
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  // Validate and calculate discount
  async validateCoupon(
    userId: string,
    validateDto: ValidateCouponDto,
  ): Promise<{
    valid: boolean;
    discount: number;
    message?: string;
    coupon?: Coupon;
  }> {
    try {
      const coupon = await this.findByCode(validateDto.code);

      // Check if coupon is active
      if (!coupon.isActive) {
        return { valid: false, discount: 0, message: 'Coupon is not active' };
      }

      // Check date validity
      const now = new Date();
      if (now < coupon.startDate) {
        return { valid: false, discount: 0, message: 'Coupon is not yet valid' };
      }
      if (now > coupon.endDate) {
        return { valid: false, discount: 0, message: 'Coupon has expired' };
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
      }

      // Check user usage limit
      const userObjectId = new Types.ObjectId(userId);
      const userUsageCount = coupon.usedBy.filter(
        (id) => id.toString() === userId,
      ).length;
      if (userUsageCount >= coupon.usageLimitPerUser) {
        return {
          valid: false,
          discount: 0,
          message: 'You have already used this coupon',
        };
      }

      // Check minimum order value
      if (validateDto.orderTotal < coupon.minOrderValue) {
        return {
          valid: false,
          discount: 0,
          message: `Minimum order value is ${coupon.minOrderValue.toLocaleString('vi-VN')}đ`,
        };
      }

      // Check applicable products/categories
      if (
        coupon.applicableProducts.length > 0 ||
        coupon.applicableCategories.length > 0
      ) {
        const applicableItems = validateDto.items?.filter((item) => {
          if (coupon.excludedProducts.includes(item.productId)) {
            return false;
          }
          if (coupon.applicableProducts.length > 0) {
            return coupon.applicableProducts.includes(item.productId);
          }
          if (coupon.applicableCategories.length > 0 && item.categoryId) {
            return coupon.applicableCategories.includes(item.categoryId);
          }
          return true;
        });

        if (!applicableItems || applicableItems.length === 0) {
          return {
            valid: false,
            discount: 0,
            message: 'Coupon is not applicable to items in your cart',
          };
        }
      }

      // Calculate discount
      let discount = 0;
      switch (coupon.discountType) {
        case DiscountType.PERCENTAGE:
          discount = (validateDto.orderTotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            discount = Math.min(discount, coupon.maxDiscountAmount);
          }
          break;
        case DiscountType.FIXED:
          discount = coupon.discountValue;
          break;
        case DiscountType.FREE_SHIPPING:
          discount = validateDto.shippingFee || 0;
          break;
      }

      // Don't let discount exceed order total
      discount = Math.min(discount, validateDto.orderTotal);

      return {
        valid: true,
        discount,
        coupon,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { valid: false, discount: 0, message: 'Invalid coupon code' };
      }
      throw error;
    }
  }

  // Apply coupon (mark as used)
  async applyCoupon(couponId: string, userId: string): Promise<void> {
    const coupon = await this.couponModel.findById(couponId);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    coupon.usedCount += 1;
    coupon.usedBy.push(new Types.ObjectId(userId));
    await coupon.save();
  }

  // Update coupon (admin)
  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true },
    );

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  // Delete coupon (admin)
  async remove(id: string): Promise<void> {
    const result = await this.couponModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Coupon not found');
    }
  }
}
