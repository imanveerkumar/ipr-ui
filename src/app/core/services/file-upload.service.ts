import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface UploadedFileRef {
  fileId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface ProcessedImageResult {
  imageUrl: string;
  width: number;
  height: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private api: ApiService) {}

  /**
   * Upload a file immediately using the presigned flow:
   * 1) request presigned URL (creates PENDING file record)
   * 2) PUT file to storage
   * 3) confirm upload (marks file UPLOADED)
   */
  async upload(
    file: File,
    options?: {
      onProgress?: (percent: number | null) => void;
      signal?: AbortSignal;
    },
  ): Promise<UploadedFileRef> {
    const contentType = file.type || 'application/octet-stream';

    const { data: uploadInfo, success } = await this.api.getUploadUrl(
      file.name,
      contentType,
      file.size,
    );

    if (!success || !uploadInfo) {
      throw new Error('Failed to get upload URL');
    }

    const { fileId, uploadUrl } = uploadInfo;

    const uploaded = await this.api.uploadToS3(uploadUrl, file, {
      onProgress: options?.onProgress,
      signal: options?.signal,
    });
    if (!uploaded) {
      throw new Error('File upload to storage failed');
    }

    await this.api.post(`/files/${fileId}/confirm`, {});

    return {
      fileId,
      filename: file.name,
      mimeType: contentType,
      size: file.size,
    };
  }

  /**
   * Upload an image with server-side processing (resize, compress, WebP conversion).
   * 
   * Flow:
   * 1) Upload raw image via presigned URL
   * 2) Confirm upload
   * 3) Call server to process image (resize/compress/convert)
   * 4) Server returns optimized image URL
   * 
   * @param type - 'thumbnail' for product images, 'banner' for store banners, 'logo' for store logos
   */
  async uploadImage(
    file: File,
    type: 'thumbnail' | 'banner' | 'logo',
    options?: {
      onProgress?: (percent: number | null) => void;
      signal?: AbortSignal;
    },
  ): Promise<ProcessedImageResult> {
    // Validate image type client-side
    if (!file.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }

    // Max 15MB for images
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image is too large (max 15MB)');
    }

    // Step 1 & 2: Upload raw image using standard flow
    // Report progress as 0-80% for the upload phase
    const uploadedFile = await this.upload(file, {
      signal: options?.signal,
      onProgress: (p) => {
        if (options?.onProgress && p !== null) {
          // Scale: 0-80% for upload
          options.onProgress(Math.round(p * 0.8));
        }
      },
    });

    // Step 3: Process image on server (remaining 20%)
    options?.onProgress?.(85);

    const response = await this.api.post<ProcessedImageResult>(
      `/files/${uploadedFile.fileId}/process-image`,
      { type },
    );

    options?.onProgress?.(100);

    if (!response.success || !response.data) {
      throw new Error('Image processing failed');
    }

    return response.data;
  }

  async delete(fileId: string): Promise<void> {
    await this.api.delete(`/files/${fileId}`);
  }

  async attachToProduct(fileId: string, productId: string): Promise<void> {
    await this.api.post(`/files/${fileId}/attach/${productId}`, {});
  }

  async detachFromProduct(fileId: string, productId: string): Promise<void> {
    await this.api.delete(`/files/${fileId}/detach/${productId}`);
  }
}
