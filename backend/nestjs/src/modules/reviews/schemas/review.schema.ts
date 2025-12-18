import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true })
  productId: string; // Strapi product ID

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop([String])
  images: string[];

  @Prop({ default: false })
  isVerifiedPurchase: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  helpfulVotes: Types.ObjectId[];

  @Prop()
  adminReply: string;

  @Prop()
  adminReplyAt: Date;

  @Prop()
  size: string;

  @Prop()
  color: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
