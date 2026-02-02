import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface ExploreProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  coverImageUrl?: string;
  createdAt: string;
  store: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  creator: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface ExploreStore {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  productCount: number;
  creator: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface ExploreCreator {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  twitterHandle?: string;
  createdAt: string;
  storeCount: number;
  productCount: number;
}

export interface ExploreStats {
  totalProducts: number;
  totalStores: number;
  totalCreators: number;
}

export interface ExplorePaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ExploreQueryParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  storeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  private api = inject(ApiService);

  private buildQueryString(params: ExploreQueryParams): string {
    const queryParts: string[] = [];
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  async getProducts(params: ExploreQueryParams = {}): Promise<ExplorePaginatedResponse<ExploreProduct>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<ExplorePaginatedResponse<ExploreProduct>>(`/explore/products${query}`);
    return response.data || { items: [], total: 0, page: 1, limit: 12, totalPages: 0, hasMore: false };
  }

  async getStores(params: ExploreQueryParams = {}): Promise<ExplorePaginatedResponse<ExploreStore>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<ExplorePaginatedResponse<ExploreStore>>(`/explore/stores${query}`);
    return response.data || { items: [], total: 0, page: 1, limit: 12, totalPages: 0, hasMore: false };
  }

  async getCreators(params: ExploreQueryParams = {}): Promise<ExplorePaginatedResponse<ExploreCreator>> {
    const query = this.buildQueryString(params);
    const response = await this.api.get<ExplorePaginatedResponse<ExploreCreator>>(`/explore/creators${query}`);
    return response.data || { items: [], total: 0, page: 1, limit: 12, totalPages: 0, hasMore: false };
  }

  async getStats(): Promise<ExploreStats> {
    const response = await this.api.get<ExploreStats>('/explore/stats');
    return response.data || { totalProducts: 0, totalStores: 0, totalCreators: 0 };
  }

  async getFeaturedProducts(limit: number = 6): Promise<ExploreProduct[]> {
    const response = await this.api.get<ExploreProduct[]>(`/explore/featured/products?limit=${limit}`);
    return response.data || [];
  }

  async getFeaturedStores(limit: number = 6): Promise<ExploreStore[]> {
    const response = await this.api.get<ExploreStore[]>(`/explore/featured/stores?limit=${limit}`);
    return response.data || [];
  }

  async getFeaturedCreators(limit: number = 6): Promise<ExploreCreator[]> {
    const response = await this.api.get<ExploreCreator[]>(`/explore/featured/creators?limit=${limit}`);
    return response.data || [];
  }

  formatPrice(price: number, currency: string = 'INR'): string {
    const amount = price / 100; // Convert from paise to rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  getDiscountPercentage(price: number, compareAtPrice: number): number {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }
}
