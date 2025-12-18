import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_SHIPPING = 'free_shipping',
}

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: DiscountType })
  discountType: DiscountType;

  @Prop({ required: true })
  discountValue: number; // Percentage or fixed amount

  @Prop({ default: 0 })
  minOrderValue: number; // Minimum order value to apply

  @Prop()
  maxDiscountAmount: number; // Max discount for percentage type

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  usageLimit: number; // Total usage limit

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ default: 1 })
  usageLimitPerUser: number; // How many times a single user can use

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  usedBy: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  applicableCategories: string[]; // Strapi category IDs

  @Prop({ type: [String], default: [] })
  applicableProducts: string[]; // Strapi product IDs

  @Prop({ type: [String], default: [] })
  excludedProducts: string[]; // Products excluded from coupon

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFirstOrderOnly: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
