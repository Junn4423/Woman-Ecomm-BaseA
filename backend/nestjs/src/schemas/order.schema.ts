import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

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
    strapiProductId?: string;
    name: string;
    slug?: string;
    image?: string;
    variantId?: string | null;
    variantName?: string;
    sku?: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    total?: number;
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
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({
    required: true,
    enum: ['cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay'],
    default: 'cod',
  })
  paymentMethod: string;

  @Prop({
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

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
  couponCode?: string;

  @Prop()
  paymentUrl?: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  trackingUrl?: string;

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

  @Prop()
  transactionId?: string;

  @Prop()
  paidAt?: Date;

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
