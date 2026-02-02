import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { SubdomainService } from './subdomain.service';
import { Store, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private api = inject(ApiService);
  private subdomainService = inject(SubdomainService);

  async getMyStores(): Promise<Store[]> {
    const response = await this.api.get<Store[]>('/stores/my-stores');
    return response.data || [];
  }

  async getStoreById(id: string): Promise<Store | null> {
    const response = await this.api.get<Store>(`/stores/${id}`);
    return response.data || null;
  }

  async getStore(id: string): Promise<Store> {
    const response = await this.api.get<Store>(`/stores/${id}`);
    return response.data!;
  }

  async getStoreBySlug(slug: string): Promise<Store | null> {
    const response = await this.api.get<Store>(`/stores/slug/${slug}`);
    return response.data || null;
  }

  async createStore(data: Partial<Store>): Promise<Store | null> {
    const response = await this.api.post<Store>('/stores', data);
    return response.data || null;
  }

  async updateStore(id: string, data: Partial<Store>): Promise<Store | null> {
    const response = await this.api.patch<Store>(`/stores/${id}`, data);
    return response.data || null;
  }

  async publishStore(id: string): Promise<Store | null> {
    const response = await this.api.post<Store>(`/stores/${id}/publish`, {});
    return response.data || null;
  }

  async unpublishStore(id: string): Promise<Store | null> {
    const response = await this.api.post<Store>(`/stores/${id}/unpublish`, {});
    return response.data || null;
  }

  async deleteStore(id: string): Promise<boolean> {
    const response = await this.api.delete(`/stores/${id}`);
    return response.success;
  }

  /**
   * Get the public URL for a store (subdomain-based)
   */
  getStoreUrl(store: Store | string, path: string = ''): string {
    const slug = typeof store === 'string' ? store : store.slug;
    return this.subdomainService.getStoreUrl(slug, path);
  }

  /**
   * Check if a slug is valid for use as a store subdomain
   */
  isValidSlug(slug: string): boolean {
    return this.subdomainService.isValidSubdomain(slug);
  }
}
