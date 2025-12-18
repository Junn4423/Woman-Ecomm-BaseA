import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ 
  timestamps: true,
  collection: 'carts',
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', sparse: true })
  userId: Types.ObjectId;

  @Prop({ sparse: true })
  sessionId: string;

  @Prop({ type: [Object], default: [] })
  items: {
    productId: string;
    productName: string;
    productSlug: string;
    productImage: string;
    variantId?: string;
    variantName?: string;
    sku: string;
    price: number;
    quantity: number;
    stock: number;
  }[];

  @Prop({ type: Object })
  coupon: {
    code: string;
    type: string;
    value: number;
  };

  @Prop()
  expiresAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
