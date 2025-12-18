import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ 
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Object], required: true })
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
    total: number;
  }[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ required: true })
  total: number;

  @Prop({ 
    required: true, 
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  })
  status: string;

  @Prop({ 
    required: true, 
    enum: ['cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay'],
    default: 'cod'
  })
  paymentMethod: string;

  @Prop({ 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  })
  paymentStatus: string;

  @Prop({ type: Object })
  paymentDetails: {
    transactionId?: string;
    paidAt?: Date;
    bankCode?: string;
    cardType?: string;
  };

  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
  };

  @Prop({ type: Object })
  billingAddress: {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
  };

  @Prop()
  note: string;

  @Prop({ type: Object })
  coupon: {
    code: string;
    type: string;
    value: number;
    discountAmount: number;
  };

  @Prop()
  trackingNumber: string;

  @Prop()
  shippingCarrier: string;

  @Prop()
  estimatedDelivery: Date;

  @Prop()
  deliveredAt: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  cancelReason: string;

  @Prop({ type: [Object], default: [] })
  statusHistory: {
    status: string;
    note?: string;
    createdAt: Date;
    createdBy?: string;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
