import { Controller, Get, Post, Query, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus } from '../../schemas/order.schema';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // VNPay return URL
  @Get('vnpay/callback')
  async vnpayCallback(@Query() query: any, @Res() res: Response) {
    this.logger.log('VNPay callback received');
    
    const result = this.paymentsService.verifyVNPayCallback(query);
    
    if (result.isValid) {
      if (result.responseCode === '00') {
        // Payment successful
        this.logger.log(`VNPay payment successful for order ${result.orderNumber}`);
        // Redirect to success page
        return res.redirect(
          `${process.env.FRONTEND_URL}/checkout/success?orderNumber=${result.orderNumber}`,
        );
      } else {
        // Payment failed
        this.logger.log(`VNPay payment failed for order ${result.orderNumber}: ${result.responseCode}`);
        return res.redirect(
          `${process.env.FRONTEND_URL}/checkout/failed?orderNumber=${result.orderNumber}&code=${result.responseCode}`,
        );
      }
    } else {
      this.logger.error('Invalid VNPay signature');
      return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed?error=invalid_signature`);
    }
  }

  // VNPay IPN (Instant Payment Notification)
  @Post('vnpay/ipn')
  async vnpayIPN(@Query() query: any) {
    this.logger.log('VNPay IPN received');
    
    const result = this.paymentsService.verifyVNPayCallback(query);
    
    if (!result.isValid) {
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    // TODO: Update order payment status
    // await this.ordersService.updatePaymentStatus(
    //   result.orderNumber,
    //   result.responseCode === '00' ? PaymentStatus.PAID : PaymentStatus.FAILED,
    //   result.transactionNo,
    // );

    if (result.responseCode === '00') {
      return { RspCode: '00', Message: 'Success' };
    } else {
      return { RspCode: '01', Message: 'Payment failed' };
    }
  }

  // MoMo callback
  @Get('momo/callback')
  async momoCallback(@Query() query: any, @Res() res: Response) {
    this.logger.log('MoMo callback received');
    
    const result = this.paymentsService.verifyMoMoCallback(query);
    
    if (result.isValid && result.resultCode === 0) {
      this.logger.log(`MoMo payment successful for order ${result.orderNumber}`);
      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout/success?orderNumber=${result.orderNumber}`,
      );
    } else {
      this.logger.log(`MoMo payment failed for order ${result.orderNumber}`);
      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout/failed?orderNumber=${result.orderNumber}`,
      );
    }
  }

  // MoMo IPN
  @Post('momo/ipn')
  async momoIPN(@Body() body: any) {
    this.logger.log('MoMo IPN received');
    
    const result = this.paymentsService.verifyMoMoCallback(body);
    
    if (!result.isValid) {
      return { resultCode: 1, message: 'Invalid signature' };
    }

    // TODO: Update order payment status
    
    return { resultCode: 0, message: 'Success' };
  }
}
