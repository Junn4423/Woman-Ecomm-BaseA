import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class WishlistItem {
  @Prop({ required: true })
  productId: string; // Strapi product ID

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  price: number;

  @Prop()
  salePrice: number;

  @Prop()
  image: string;

  @Prop({ default: Date.now })
  addedAt: Date;
}

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [WishlistItem], default: [] })
  items: WishlistItem[];

  createdAt: Date;
  updatedAt: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
