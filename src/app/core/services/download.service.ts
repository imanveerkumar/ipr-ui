import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface DownloadUrlResponse {
  downloadUrl: string;
  filename: string;
  size: number;
  mimeType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private api: ApiService) {}

  async getDownloadUrl(productId: string, fileId: string): Promise<DownloadUrlResponse | null> {
    const response = await this.api.post<DownloadUrlResponse>(
      `/downloads/product/${productId}/file/${fileId}`,
      {}
    );
    return response.data || null;
  }

  async downloadFile(productId: string, fileId: string): Promise<void> {
    const urlData = await this.getDownloadUrl(productId, fileId);
    
    if (urlData) {
      // Open download URL in new tab/trigger download
      const link = document.createElement('a');
      link.href = urlData.downloadUrl;
      link.download = urlData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  async getGuestDownloadUrl(
    downloadToken: string,
    productId: string,
    fileId: string
  ): Promise<DownloadUrlResponse | null> {
    const response = await this.api.post<DownloadUrlResponse>(
      `/downloads/guest/${downloadToken}/product/${productId}/file/${fileId}`,
      {}
    );
    return response.data || null;
  }

  async downloadGuestFile(
    downloadToken: string,
    productId: string,
    fileId: string
  ): Promise<void> {
    const urlData = await this.getGuestDownloadUrl(downloadToken, productId, fileId);
    
    if (urlData) {
      // Open download URL in new tab/trigger download
      const link = document.createElement('a');
      link.href = urlData.downloadUrl;
      link.download = urlData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  async getDownloadHistory() {
    const response = await this.api.get('/downloads/history');
    return response.data || [];
  }
}
