import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus, PaymentStatus } from '../../schemas/order.schema';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create new order from cart
  @Post()
  createOrder(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, createOrderDto);
  }

  // Get current user's orders
  @Get('my-orders')
  getMyOrders(
    @Request() req: any,
    @Query('status') status?: OrderStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ordersService.findUserOrders(req.user.userId, {
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  // Get single order by ID
  @Get(':id')
  getOrder(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  // Get order by order number
  @Get('track/:orderNumber')
  trackOrder(@Request() req: any, @Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber, req.user.userId);
  }

  // Cancel order
  @Post(':id/cancel')
  cancelOrder(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.cancelOrder(id, req.user.userId);
  }

  // Admin routes
  @Get()
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.ordersService.findAll({
      status,
      paymentStatus,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
    });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto);
  }
}
