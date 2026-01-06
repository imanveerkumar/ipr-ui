import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Order, License } from '../models';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;

export interface PaymentInitResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  orderId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private api: ApiService) {}

  async createOrder(productIds: string[]): Promise<Order | null> {
    const response = await this.api.post<Order>('/orders', { productIds });
    return response.data || null;
  }

  async initiatePayment(orderId: string): Promise<PaymentInitResponse | null> {
    const response = await this.api.post<PaymentInitResponse>('/payments/initiate', { orderId });
    return response.data || null;
  }

  async openRazorpayCheckout(paymentData: PaymentInitResponse, userEmail: string): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.amount * 100, // Razorpay expects paise
        currency: paymentData.currency,
        order_id: paymentData.razorpayOrderId,
        name: 'Creator Marketplace',
        description: 'Digital Product Purchase',
        prefill: {
          email: userEmail,
        },
        handler: async (response: any) => {
          const verified = await this.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          resolve(verified);
        },
        modal: {
          ondismiss: () => resolve(false),
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    });
  }

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    const response = await this.api.post('/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.success;
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await this.api.get<Order[]>('/orders');
    return response.data || [];
  }

  async getMyLicenses(): Promise<License[]> {
    const response = await this.api.get<License[]>('/licenses');
    return response.data || [];
  }
}
