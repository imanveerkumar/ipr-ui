import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService) {}

  async getProductsByStore(storeId: string): Promise<Product[]> {
    const response = await this.api.get<Product[]>(`/products/store/${storeId}`);
    return response.data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const response = await this.api.get<Product>(`/products/${id}`);
    return response.data || null;
  }

  async getProductByIdForOwner(id: string): Promise<Product | null> {
    const response = await this.api.get<Product>(`/products/${id}/owner`);
    return response.data || null;
  }

  async getProductByIdWithState(id: string): Promise<Product | null> {
    const response = await this.api.get<Product>(`/products/${id}/with-state`);
    return response.data || null;
  }

  async createProduct(data: Partial<Product> & { storeId: string }): Promise<Product | null> {
    const response = await this.api.post<Product>('/products', data);
    return response.data || null;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    const response = await this.api.patch<Product>(`/products/${id}`, data);
    return response.data || null;
  }

  async publishProduct(id: string): Promise<Product | null> {
    const response = await this.api.post<Product>(`/products/${id}/publish`, {});
    return response.data || null;
  }

  async archiveProduct(id: string): Promise<Product | null> {
    const response = await this.api.post<Product>(`/products/${id}/archive`, {});
    return response.data || null;
  }

  async unarchiveProduct(id: string): Promise<Product | null> {
    const response = await this.api.post<Product>(`/products/${id}/unarchive`, {});
    return response.data || null;
  }

  async deleteProduct(id: string): Promise<Product | null> {
    const response = await this.api.delete<Product>(`/products/${id}`);
    return response.data || null;
  }

  async restoreProduct(id: string): Promise<Product | null> {
    const response = await this.api.post<Product>(`/products/${id}/restore`, {});
    return response.data || null;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get<Product>(`/products/${id}`);
    return response.data!;
  }

  async getMyProducts(): Promise<Product[]> {
    const response = await this.api.get<Product[]>('/products/my');
    return response.data || [];
  }

  async getMyArchivedProducts(): Promise<Product[]> {
    const response = await this.api.get<Product[]>('/products/my/archived');
    return response.data || [];
  }

  async getMyDeletedProducts(): Promise<Product[]> {
    const response = await this.api.get<Product[]>('/products/my/deleted');
    return response.data || [];
  }

  async bulkDeleteProducts(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/products/bulk/delete', { ids });
    return response.data || { count: 0 };
  }

  async bulkArchiveProducts(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/products/bulk/archive', { ids });
    return response.data || { count: 0 };
  }

  async bulkRestoreProducts(ids: string[]): Promise<{ count: number }> {
    const response = await this.api.post<{ count: number }>('/products/bulk/restore', { ids });
    return response.data || { count: 0 };
  }

  async uploadProductFile(productId: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await this.api.uploadFile(`/files/product/${productId}`, formData);
  }
}
