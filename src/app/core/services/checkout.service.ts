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

export interface GuestOrderDetails {
  email: string;
  phone?: string;
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

  async createGuestOrder(productIds: string[], guestEmail: string, guestPhone?: string): Promise<Order | null> {
    const response = await this.api.post<Order>('/orders/guest', { 
      productIds, 
      guestEmail, 
      guestPhone 
    });
    return response.data || null;
  }

  async initiatePayment(orderId: string): Promise<PaymentInitResponse | null> {
    const response = await this.api.post<PaymentInitResponse>('/payments/initiate', { orderId });
    return response.data || null;
  }

  async initiateGuestPayment(orderId: string, guestEmail: string): Promise<PaymentInitResponse | null> {
    const response = await this.api.post<PaymentInitResponse>('/payments/initiate/guest', { 
      orderId, 
      guestEmail 
    });
    return response.data || null;
  }

  async openRazorpayCheckout(paymentData: PaymentInitResponse, userEmail: string, userPhone?: string): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.amount * 100, // Razorpay expects paise
        currency: paymentData.currency,
        order_id: paymentData.razorpayOrderId,
        name: 'StoresCraft',
        description: 'Digital Product Purchase',
        prefill: {
          email: userEmail,
          contact: userPhone || '',
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

  async getGuestOrder(downloadToken: string): Promise<Order | null> {
    const response = await this.api.get<Order>(`/orders/download/${downloadToken}`);
    return response.data || null;
  }

  async getGuestDownloadUrl(downloadToken: string, productId: string, fileId: string): Promise<any> {
    const response = await this.api.post(`/downloads/guest/${downloadToken}/product/${productId}/file/${fileId}`, {});
    return response.data || null;
  }
}
