import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Order, License } from '../models';
import { environment } from '../../../environments/environment';

declare var Razorpay: any;
import { PaginationMeta } from './pagination.types';

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

export interface CartValidationItem {
  productId: string;
  productTitle: string;
  productCoverImageUrl?: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  isValid: boolean;
  errors: string[];
}

export interface CartStoreGroup {
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeStatus: string;
  isStoreAvailable: boolean;
  items: CartValidationItem[];
  colorIndex: number;
}

export interface CartValidationResult {
  isValid: boolean;
  items: CartValidationItem[];
  storeGroups: CartStoreGroup[];
  unavailableItems: CartValidationItem[];
  summary: {
    totalItems: number;
    validItems: number;
    invalidItems: number;
    totalStores: number;
    unavailableStores: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private api: ApiService) {}

  async validateCart(productIds: string[]): Promise<CartValidationResult | null> {
    const response = await this.api.post<CartValidationResult>('/orders/validate-cart', { productIds });
    return response.data || null;
  }

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

  async initiatePayment(orderId: string, customAmount?: number): Promise<PaymentInitResponse | null> {
    // front-end guard: don't send zero/negative amounts to the API
    if (customAmount !== undefined && customAmount <= 0) {
      throw new Error('Payment amount must be greater than ₹0');
    }
    const body: any = { orderId };
    if (customAmount !== undefined) body.customAmount = customAmount;
    const response = await this.api.post<PaymentInitResponse>('/payments/initiate', body);
    return response.data || null;
  }

  async initiateGuestPayment(orderId: string, guestEmail: string, customAmount?: number): Promise<PaymentInitResponse | null> {
    if (customAmount !== undefined && customAmount <= 0) {
      throw new Error('Payment amount must be greater than ₹0');
    }
    const body: any = { orderId, guestEmail };
    if (customAmount !== undefined) body.customAmount = customAmount;
    const response = await this.api.post<PaymentInitResponse>('/payments/initiate/guest', body);
    return response.data || null;
  }

  async completeFreeOrder(orderId: string): Promise<{ success: boolean; orderId: string } | null> {
    const response = await this.api.post<{ success: boolean; orderId: string }>('/payments/free', { orderId });
    return response.data || null;
  }

  async completeGuestFreeOrder(orderId: string, guestEmail: string): Promise<{ success: boolean; orderId: string; downloadToken?: string } | null> {
    const response = await this.api.post<{ success: boolean; orderId: string; downloadToken?: string }>('/payments/free/guest', { orderId, guestEmail });
    return response.data || null;
  }

  async openRazorpayCheckout(paymentData: PaymentInitResponse, userEmail: string, userPhone?: string): Promise<{ success: boolean; cancelled?: boolean; error?: string }> {
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
          try {
            const verified = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            resolve({ success: verified, error: verified ? undefined : 'Payment verification failed' });
          } catch (error) {
            console.error('Payment verification error:', error);
            resolve({ success: false, error: 'Payment verification failed. Please contact support.' });
          }
        },
        modal: {
          ondismiss: () => resolve({ success: false, cancelled: true }),
        },
      };

      const razorpay = new Razorpay(options);
      
      // Handle payment failure events
      razorpay.on('payment.failed', (response: any) => {
        console.error('Razorpay payment failed:', response.error);
        const errorMessage = response.error?.description || 'Payment failed. Please try again.';
        resolve({ success: false, error: errorMessage });
      });
      
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

  async getMyOrdersPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Order[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    const response = await this.api.get<{
      data: Order[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }>(url);
    
    return response.data || { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
  }

  async getMyLicenses(): Promise<License[]> {
    const response = await this.api.get<License[]>('/licenses');
    return response.data || [];
  }

  async getMyLicensesPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'ACTIVE' | 'EXHAUSTED';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: License[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/licenses?${queryString}` : '/licenses';
    
    const response = await this.api.get<{
      data: License[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }>(url);
    
    return response.data || { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
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
