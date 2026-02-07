import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { SubdomainService } from './subdomain.service';
import { Store, ApiResponse } from '../models';
import { PaginationMeta, PaginatedResponse } from './pagination.types';

export interface StoresQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'PUBLISHED' | 'DRAFT';
  sortOrder?: 'asc' | 'desc';
  sortField?: string;
}

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

  async getMyStoresPaginated(params: StoresQueryParams): Promise<PaginatedResponse<Store>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.sortField) queryParams.append('sortField', params.sortField);

    const queryString = queryParams.toString();
    const url = queryString ? `/stores/my-stores?${queryString}` : '/stores/my-stores';
    
    const response = await this.api.get<PaginatedResponse<Store>>(url);
    return response.data || { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
  }

  async getMyArchivedStores(): Promise<Store[]> {
    const response = await this.api.get<Store[]>('/stores/my-stores/archived');
    return response.data || [];
  }

  async getMyArchivedStoresPaginated(params: StoresQueryParams): Promise<PaginatedResponse<Store>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/stores/my-stores/archived?${queryString}` : '/stores/my-stores/archived';
    
    const response = await this.api.get<PaginatedResponse<Store>>(url);
    return response.data || { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
  }

  async getMyDeletedStores(): Promise<Store[]> {
    const response = await this.api.get<Store[]>('/stores/my-stores/deleted');
    return response.data || [];
  }

  async getMyDeletedStoresPaginated(params: StoresQueryParams): Promise<PaginatedResponse<Store>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/stores/my-stores/deleted?${queryString}` : '/stores/my-stores/deleted';
    
    const response = await this.api.get<PaginatedResponse<Store>>(url);
    return response.data || { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false } };
  }

  // Get stats for current user's stores (supports filters)
  async getMyStats(params?: StoresQueryParams): Promise<{ total: number; published: number; drafts: number; tabs: { active: number; archived: number; bin: number } }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortField) queryParams.append('sortField', params.sortField);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString ? `/stores/my-stats?${queryString}` : '/stores/my-stats';

    const response = await this.api.get<{ total: number; published: number; drafts: number; tabs: { active: number; archived: number; bin: number } }>(url);
    return response.data || { total: 0, published: 0, drafts: 0, tabs: { active: 0, archived: 0, bin: 0 } };
  }

  async getStoreById(id: string): Promise<Store | null> {
    const response = await this.api.get<Store>(`/stores/${id}`);
    return response.data || null;
  }

  async getStoreByIdForOwner(id: string): Promise<Store | null> {
    const response = await this.api.get<Store>(`/stores/${id}/owner`);
    return response.data || null;
  }

  async getStoreByIdWithState(id: string): Promise<Store | null> {
    const response = await this.api.get<Store>(`/stores/${id}/with-state`);
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

  async createStore(data: Partial<Store> & { publish?: boolean }): Promise<Store | null> {
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

  async archiveStore(id: string): Promise<Store | null> {
    const response = await this.api.post<Store>(`/stores/${id}/archive`, {});
    return response.data || null;
  }

  async unarchiveStore(id: string): Promise<Store | null> {
    const response = await this.api.post<Store>(`/stores/${id}/unarchive`, {});
    return response.data || null;
  }

  async deleteStore(id: string): Promise<boolean> {
    const response = await this.api.delete(`/stores/${id}`);
    return response.success;
  }

  async restoreStore(id: string): Promise<Store | null> {
    const response = await this.api.post<Store>(`/stores/${id}/restore`, {});
    return response.data || null;
  }

  async bulkDeleteStores(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/stores/bulk/delete', { ids });
    return response.data || { count: 0 };
  }

  async bulkArchiveStores(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/stores/bulk/archive', { ids });
    return response.data || { count: 0 };
  }

  async bulkRestoreStores(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/stores/bulk/restore', { ids });
    return response.data || { count: 0 };
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
