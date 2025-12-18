import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // Create and send notification
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    link?: string;
    image?: string;
  }): Promise<Notification> {
    const notification = new this.notificationModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
    });

    await notification.save();

    // Send real-time notification via WebSocket
    this.notificationsGateway.sendToUser(data.userId, notification);

    this.logger.log(`Notification created for user ${data.userId}: ${data.title}`);

    return notification;
  }

  // Get user's notifications
  async findByUser(
    userId: string,
    params?: {
      isRead?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = { userId: new Types.ObjectId(userId) };
    if (params?.isRead !== undefined) {
      query.isRead = params.isRead;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({
        userId: new Types.ObjectId(userId),
        isRead: false,
      }),
    ]);

    return {
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  // Mark single notification as read
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        userId: new Types.ObjectId(userId),
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true },
    );

    return notification;
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    return { modifiedCount: result.modifiedCount };
  }

  // Delete notification
  async remove(notificationId: string, userId: string): Promise<void> {
    await this.notificationModel.deleteOne({
      _id: notificationId,
      userId: new Types.ObjectId(userId),
    });
  }

  // Delete all notifications for user
  async removeAll(userId: string): Promise<{ deletedCount: number }> {
    const result = await this.notificationModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });

    return { deletedCount: result.deletedCount };
  }

  // Send order notification
  async sendOrderNotification(
    userId: string,
    orderId: string,
    orderNumber: string,
    type: 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  ): Promise<void> {
    const typeMap = {
      confirmed: {
        type: NotificationType.ORDER_CONFIRMED,
        title: 'Đơn hàng đã được xác nhận',
        message: `Đơn hàng ${orderNumber} của bạn đã được xác nhận và đang được xử lý.`,
      },
      shipped: {
        type: NotificationType.ORDER_SHIPPED,
        title: 'Đơn hàng đang được giao',
        message: `Đơn hàng ${orderNumber} của bạn đang trên đường giao đến bạn.`,
      },
      delivered: {
        type: NotificationType.ORDER_DELIVERED,
        title: 'Đơn hàng đã giao thành công',
        message: `Đơn hàng ${orderNumber} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
      },
      cancelled: {
        type: NotificationType.ORDER_CANCELLED,
        title: 'Đơn hàng đã bị hủy',
        message: `Đơn hàng ${orderNumber} của bạn đã bị hủy.`,
      },
    };

    const notificationData = typeMap[type];

    await this.create({
      userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: { orderId, orderNumber },
      link: `/account/orders/${orderId}`,
    });
  }

  // Send payment notification
  async sendPaymentNotification(
    userId: string,
    orderId: string,
    orderNumber: string,
    success: boolean,
  ): Promise<void> {
    await this.create({
      userId,
      type: success ? NotificationType.PAYMENT_SUCCESS : NotificationType.PAYMENT_FAILED,
      title: success ? 'Thanh toán thành công' : 'Thanh toán thất bại',
      message: success
        ? `Thanh toán cho đơn hàng ${orderNumber} đã được xác nhận.`
        : `Thanh toán cho đơn hàng ${orderNumber} không thành công. Vui lòng thử lại.`,
      data: { orderId, orderNumber },
      link: `/account/orders/${orderId}`,
    });
  }

  // Send promotion notification to multiple users
  async sendPromotionNotification(
    userIds: string[],
    title: string,
    message: string,
    link?: string,
    image?: string,
  ): Promise<void> {
    const notifications = userIds.map((userId) => ({
      userId: new Types.ObjectId(userId),
      type: NotificationType.PROMOTION,
      title,
      message,
      link,
      image,
    }));

    await this.notificationModel.insertMany(notifications);

    // Send real-time notifications
    userIds.forEach((userId) => {
      this.notificationsGateway.sendToUser(userId, {
        type: NotificationType.PROMOTION,
        title,
        message,
        link,
        image,
      });
    });
  }
}
