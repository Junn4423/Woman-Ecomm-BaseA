import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface CartItem {
  productId: string;
  strapiProductId?: string;
  name: string;
  slug?: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: string | null;
  size?: string | null;
  color?: string | null;
  // Legacy fields kept for compatibility with imported data
  productName?: string;
  productSlug?: string;
  productImage?: string;
  variantName?: string;
  sku?: string;
  stock?: number;
  total?: number;
}

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

  @Prop({
    type: [
      {
        productId: { type: String, required: true },
        strapiProductId: { type: String },
        name: { type: String, required: true },
        slug: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        variantId: { type: String },
        size: { type: String },
        color: { type: String },
        productName: { type: String },
        productSlug: { type: String },
        productImage: { type: String },
        variantName: { type: String },
        sku: { type: String },
        stock: { type: Number },
        total: { type: Number },
      },
    ],
    default: [],
  })
  items: CartItem[];

  @Prop({ default: null })
  couponCode: string | null;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  total: number;

  @Prop()
  expiresAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
