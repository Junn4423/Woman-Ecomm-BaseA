import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private configService: ConfigService) {}

  // Create payment URL
  async createPaymentUrl(order: any, paymentMethod: string): Promise<string> {
    switch (paymentMethod) {
      case 'vnpay':
        return this.createVNPayUrl(order);
      case 'momo':
        return this.createMoMoUrl(order);
      default:
        throw new BadRequestException('Invalid payment method');
    }
  }

  // VNPay integration
  private createVNPayUrl(order: any): string {
    const vnpConfig = this.configService.get('payment.vnpay');
    
    const date = new Date();
    const createDate = this.formatDate(date);
    const orderId = this.formatDate(date, true);

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnpConfig.tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = order.orderNumber;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang ${order.orderNumber}`;
    vnp_Params['vnp_OrderType'] = 'fashion';
    vnp_Params['vnp_Amount'] = order.total * 100; // VNPay uses amount * 100
    vnp_Params['vnp_ReturnUrl'] = vnpConfig.returnUrl;
    vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sort parameters
    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const vnpUrl = `${vnpConfig.url}?${querystring.stringify(vnp_Params, { encode: false })}`;
    
    this.logger.log(`Created VNPay URL for order ${order.orderNumber}`);
    return vnpUrl;
  }

  // Verify VNPay callback
  verifyVNPayCallback(vnp_Params: any): {
    isValid: boolean;
    orderNumber: string;
    amount: number;
    responseCode: string;
    transactionNo: string;
  } {
    const vnpConfig = this.configService.get('payment.vnpay');
    
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValid = secureHash === signed;

    return {
      isValid,
      orderNumber: vnp_Params['vnp_TxnRef'],
      amount: parseInt(vnp_Params['vnp_Amount']) / 100,
      responseCode: vnp_Params['vnp_ResponseCode'],
      transactionNo: vnp_Params['vnp_TransactionNo'],
    };
  }

  // MoMo integration
  private async createMoMoUrl(order: any): Promise<string> {
    const momoConfig = this.configService.get('payment.momo');
    
    const requestId = `${Date.now()}-${order.orderNumber}`;
    const orderId = order.orderNumber;
    const orderInfo = `Thanh toan don hang ${order.orderNumber}`;
    const amount = order.total.toString();
    const extraData = '';

    // Create signature
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
    
    const signature = crypto
      .createHmac('sha256', momoConfig.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData,
      requestType: 'captureWallet',
      signature,
      lang: 'vi',
    };

    try {
      const response = await fetch(momoConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.resultCode === 0) {
        this.logger.log(`Created MoMo URL for order ${order.orderNumber}`);
        return data.payUrl;
      } else {
        throw new Error(`MoMo error: ${data.message}`);
      }
    } catch (error) {
      this.logger.error('Error creating MoMo URL', error);
      throw error;
    }
  }

  // Verify MoMo callback
  verifyMoMoCallback(params: any): {
    isValid: boolean;
    orderNumber: string;
    amount: number;
    resultCode: number;
    transactionId: string;
  } {
    const momoConfig = this.configService.get('payment.momo');
    
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${params.amount}&extraData=${params.extraData}&message=${params.message}&orderId=${params.orderId}&orderInfo=${params.orderInfo}&orderType=${params.orderType}&partnerCode=${params.partnerCode}&payType=${params.payType}&requestId=${params.requestId}&responseTime=${params.responseTime}&resultCode=${params.resultCode}&transId=${params.transId}`;
    
    const signature = crypto
      .createHmac('sha256', momoConfig.secretKey)
      .update(rawSignature)
      .digest('hex');

    const isValid = params.signature === signature;

    return {
      isValid,
      orderNumber: params.orderId,
      amount: parseInt(params.amount),
      resultCode: params.resultCode,
      transactionId: params.transId,
    };
  }

  // Helper: Format date for VNPay
  private formatDate(date: Date, includeTime = false): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    if (includeTime) {
      return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    }
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  // Helper: Sort object keys
  private sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  }
}
