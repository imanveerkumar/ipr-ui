import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

export interface GuestPurchase {
  id: string;
  licenseKey: string;
  downloadCount: number;
  maxDownloads: number;
  createdAt: string;
  product: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    store: {
      id: string;
      name: string;
      slug: string;
      logoUrl: string | null;
    };
    files: Array<{
      id: string;
      filename: string;
      size: number;
      mimeType: string;
    }>;
  };
  order: {
    id: string;
    downloadToken: string;
    paidAt: string;
    totalAmount: number;
    currency: string;
  };
}

interface OtpResponse {
  message: string;
  expiresIn: number;
}

interface VerifyResponse {
  accessToken: string;
  expiresIn: number;
}

interface TokenValidation {
  valid: boolean;
  identifier?: string;
  type?: 'email' | 'phone';
}

const GUEST_TOKEN_KEY = 'guest_access_token';

@Injectable({
  providedIn: 'root'
})
export class GuestAccessService {
  // State signals
  private _isAuthenticated = signal(false);
  private _identifier = signal<string | null>(null);
  private _identifierType = signal<'email' | 'phone' | null>(null);
  private _purchases = signal<GuestPurchase[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public computed signals
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly identifier = computed(() => this._identifier());
  readonly identifierType = computed(() => this._identifierType());
  readonly purchases = computed(() => this._purchases());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly hasPurchases = computed(() => this._purchases().length > 0);

  constructor(private api: ApiService) {
    // Check for existing token on init
    this.validateStoredToken();
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(GUEST_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Store token in localStorage
   */
  private storeToken(token: string): void {
    try {
      localStorage.setItem(GUEST_TOKEN_KEY, token);
    } catch {
      console.error('Failed to store token');
    }
  }

  /**
   * Remove stored token
   */
  private clearToken(): void {
    try {
      localStorage.removeItem(GUEST_TOKEN_KEY);
    } catch {
      console.error('Failed to clear token');
    }
  }

  /**
   * Validate stored token on service init
   */
  private async validateStoredToken(): Promise<void> {
    const token = this.getStoredToken();
    if (!token) return;

    try {
      const response = await this.api.post<TokenValidation>(
        '/guest-auth/validate-token',
        {},
        { headers: { 'x-guest-token': token } }
      );

      if (response.success && response.data?.valid) {
        this._isAuthenticated.set(true);
        this._identifier.set(response.data.identifier || null);
        this._identifierType.set(response.data.type || null);
      } else {
        this.clearToken();
      }
    } catch {
      this.clearToken();
    }
  }

  /**
   * Request OTP for email or phone
   */
  async requestOtp(identifier: string, type: 'email' | 'phone'): Promise<OtpResponse> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await this.api.post<OtpResponse>('/guest-auth/request-otp', {
        identifier,
        type,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to send verification code');
      }

      return response.data!;
    } catch (error: any) {
      const message = error.message || 'Failed to send verification code';
      this._error.set(message);
      throw new Error(message);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Verify OTP and get access token
   */
  async verifyOtp(identifier: string, type: 'email' | 'phone', code: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await this.api.post<VerifyResponse>('/guest-auth/verify-otp', {
        identifier,
        type,
        code,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Verification failed');
      }

      // Store token and update state
      this.storeToken(response.data.accessToken);
      this._isAuthenticated.set(true);
      this._identifier.set(identifier);
      this._identifierType.set(type);

      return true;
    } catch (error: any) {
      const message = error.message || 'Verification failed';
      this._error.set(message);
      throw new Error(message);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Fetch purchased products for authenticated guest
   */
  async fetchPurchases(): Promise<GuestPurchase[]> {
    const token = this.getStoredToken();
    if (!token) {
      this._error.set('Not authenticated');
      return [];
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await this.api.get<GuestPurchase[]>(
        '/guest-auth/purchases',
        { headers: { 'x-guest-token': token } }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch purchases');
      }

      const purchases = response.data || [];
      this._purchases.set(purchases);
      return purchases;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch purchases';
      this._error.set(message);
      
      // If token is invalid, clear auth state
      if (error.status === 401) {
        this.logout();
      }
      
      return [];
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Get download URL for a purchased file
   */
  async downloadFile(downloadToken: string, productId: string, fileId: string): Promise<void> {
    try {
      const response = await this.api.post<{ downloadUrl: string; filename: string }>(
        `/downloads/guest/${downloadToken}/product/${productId}/file/${fileId}`,
        {}
      );

      if (response.success && response.data) {
        // Trigger download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Refresh purchases to update download count
        await this.fetchPurchases();
      }
    } catch (error: any) {
      this._error.set(error.message || 'Download failed');
      throw error;
    }
  }

  /**
   * Logout guest user
   */
  logout(): void {
    this.clearToken();
    this._isAuthenticated.set(false);
    this._identifier.set(null);
    this._identifierType.set(null);
    this._purchases.set([]);
    this._error.set(null);
  }

  /**
   * Clear any error messages
   */
  clearError(): void {
    this._error.set(null);
  }
}
