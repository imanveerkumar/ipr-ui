import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor() {}

  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get token from Clerk (we'll inject this later to avoid circular dependency)
    const token = await this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private tokenGetter: (() => Promise<string | null>) | null = null;

  setTokenGetter(getter: () => Promise<string | null>) {
    this.tokenGetter = getter;
  }

  private async getToken(): Promise<string | null> {
    if (this.tokenGetter) {
      return this.tokenGetter();
    }
    return null;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return response.json();
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  }

  // Helper for file upload URLs
  async getUploadUrl(filename: string, contentType: string, size: number) {
    return this.post<{ fileId: string; uploadUrl: string; storageKey: string }>(
      '/files/upload-url',
      { filename, contentType, size }
    );
  }

  // Helper for direct upload to S3
  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Upload to S3 failed:', error);
      return false;
    }
  }

  // Helper for multipart form upload
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }
}
