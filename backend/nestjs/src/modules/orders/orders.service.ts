import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from '../../schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { StrapiService } from '../strapi/strapi.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private strapiService: StrapiService,
    private paymentsService: PaymentsService,
  ) {}

  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // Create order from cart
  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Get user's cart
    const cart = await this.cartService.getCart(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate shipping fee
    const shippingFee = this.calculateShippingFee(createOrderDto.shippingAddress);

    // Create order
    const order = new this.orderModel({
      orderNumber: this.generateOrderNumber(),
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        strapiProductId: item.strapiProductId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variantId: item.variantId,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      subtotal: cart.subtotal,
      discount: cart.discount || 0,
      shippingFee,
      total: cart.total + shippingFee,
      couponCode: cart.couponCode,
      notes: createOrderDto.notes,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    await order.save();

    // Deduct stock from Strapi
    await this.deductStock(order);

    // Clear cart after successful order
    await this.cartService.clearCart(userId);

    // Generate payment URL if online payment
    if (createOrderDto.paymentMethod !== 'cod') {
      try {
        const paymentUrl = await this.paymentsService.createPaymentUrl(
          order,
          createOrderDto.paymentMethod,
        );
        order.paymentUrl = paymentUrl;
        await order.save();
      } catch (error) {
        this.logger.error('Error creating payment URL', error);
      }
    }

    return order;
  }

  // Deduct stock after order is placed
  private async deductStock(order: OrderDocument): Promise<void> {
    for (const item of order.items) {
      try {
        const strapiId = item.strapiProductId || item.productId;
        await this.strapiService.updateProductStock(
          strapiId,
          item.variantId ?? null,
          item.quantity,
        );
      } catch (error) {
        this.logger.error(
          `Failed to deduct stock for product ${item.productId}`,
          error,
        );
        // Continue with other items even if one fails
      }
    }
  }

  // Restore stock when order is cancelled
  private async restoreStock(order: OrderDocument): Promise<void> {
    for (const item of order.items) {
      try {
        const strapiId = item.strapiProductId || item.productId;
        await this.strapiService.restoreProductStock(
          strapiId,
          item.variantId ?? null,
          item.quantity,
        );
      } catch (error) {
        this.logger.error(
          `Failed to restore stock for product ${item.productId}`,
          error,
        );
      }
    }
  }

  // Calculate shipping fee based on address
  private calculateShippingFee(address: any): number {
    // Free shipping for orders in Ho Chi Minh City
    const freeShippingCities = ['Hồ Chí Minh', 'Ho Chi Minh', 'HCM'];
    if (freeShippingCities.some((city) => address.city?.includes(city))) {
      return 0;
    }
    // Standard shipping fee
    return 30000; // 30,000 VND
  }

  // Get all orders for a user
  async findUserOrders(
    userId: string,
    params?: { status?: OrderStatus; page?: number; limit?: number },
  ) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (params?.status) {
      query.status = params.status;
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single order by ID
  async findOne(orderId: string, userId?: string): Promise<Order> {
    const query: any = { _id: orderId };
    if (userId) {
      query.userId = userId;
    }

    const order = await this.orderModel.findOne(query).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Get order by order number
  async findByOrderNumber(orderNumber: string, userId?: string): Promise<Order> {
    const query: any = { orderNumber };
    if (userId) {
      query.userId = userId;
    }

    const order = await this.orderModel.findOne(query).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  // Update order status (admin)
  async updateStatus(
    orderId: string,
    updateDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    // Validate status transition
    this.validateStatusTransition(order.status, updateDto.status);

    // If cancelling, restore stock
    if (
      updateDto.status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      await this.restoreStock(order as OrderDocument);
    }

    order.status = updateDto.status;
    if (updateDto.trackingNumber) {
      order.trackingNumber = updateDto.trackingNumber;
    }
    if (updateDto.trackingUrl) {
      order.trackingUrl = updateDto.trackingUrl;
    }

    await (order as OrderDocument).save();
    return order;
  }

  // Update payment status
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    transactionId?: string,
  ): Promise<Order> {
    const order = await this.findOne(orderId);
    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }
    if (paymentStatus === PaymentStatus.PAID) {
      order.paidAt = new Date();
      // Auto-confirm order when paid
      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.CONFIRMED;
      }
    }
    await (order as OrderDocument).save();
    return order;
  }

  // Cancel order by user
  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await this.findOne(orderId, userId);

    // Can only cancel pending or confirmed orders
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    // Restore stock
    await this.restoreStock(order as OrderDocument);

    order.status = OrderStatus.CANCELLED;
    await (order as OrderDocument).save();
    return order;
  }

  // Validate status transitions
  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
      [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  // Admin: Get all orders
  async findAll(params?: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params?.status) query.status = params.status;
    if (params?.paymentStatus) query.paymentStatus = params.paymentStatus;
    if (params?.search) {
      query.$or = [
        { orderNumber: { $regex: params.search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: params.search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: params.search, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
