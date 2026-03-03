import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { UploadConfigService, ImageContext } from './upload-config.service';

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

/** Upload context sent to the API for context-aware validation */
export type UploadContext =
  | 'image:cover'
  | 'image:banner'
  | 'image:logo'
  | 'editor'
  | 'product-file'
  | 'general';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private api = inject(ApiService);
  private uploadConfig = inject(UploadConfigService);

  /**
   * Upload a file immediately using the presigned flow:
   * 1) request presigned URL (creates PENDING file record)
   * 2) PUT file to storage
   * 3) confirm upload (marks file UPLOADED)
   *
   * @param context — optional upload context for server-side validation
   */
  async upload(
    file: File,
    options?: {
      onProgress?: (percent: number | null) => void;
      signal?: AbortSignal;
      context?: UploadContext;
    },
  ): Promise<UploadedFileRef> {
    const contentType = file.type || 'application/octet-stream';
    const context = options?.context || 'general';

    const { data: uploadInfo, success } = await this.api.getUploadUrl(
      file.name,
      contentType,
      file.size,
      context,
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
   * Validates client-side using UploadConfigService before uploading.
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
    // Map type to ImageContext for config lookup
    const imageContext: ImageContext = type === 'thumbnail' ? 'cover' : type;
    const uploadContext: UploadContext =
      type === 'thumbnail' ? 'image:cover' : type === 'banner' ? 'image:banner' : 'image:logo';

    // Client-side validation using backend-driven config
    await this.uploadConfig.ensureLoaded();
    const validation = this.uploadConfig.validateImageFile(file, imageContext);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Step 1 & 2: Upload raw image using standard flow
    const uploadedFile = await this.upload(file, {
      signal: options?.signal,
      context: uploadContext,
      onProgress: (p) => {
        if (options?.onProgress && p !== null) {
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

  /**
   * Upload a file intended for the rich-text description editor.
   * Validates client-side before uploading.
   */
  async uploadEditorFile(
    file: File,
    options?: {
      onProgress?: (percent: number | null) => void;
      signal?: AbortSignal;
    },
  ): Promise<UploadedFileRef> {
    await this.uploadConfig.ensureLoaded();
    const validation = this.uploadConfig.validateEditorFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return this.upload(file, {
      ...options,
      context: 'editor',
    });
  }

  /**
   * Upload a downloadable product file.
   * Validates client-side before uploading.
   */
  async uploadProductFile(
    file: File,
    options?: {
      onProgress?: (percent: number | null) => void;
      signal?: AbortSignal;
      /** Current count of files already attached to the product */
      currentFileCount?: number;
      /** Current total bytes of files already attached to the product */
      currentTotalBytes?: number;
    },
  ): Promise<UploadedFileRef> {
    await this.uploadConfig.ensureLoaded();

    // Validate individual file
    const fileValidation = this.uploadConfig.validateProductFile(file);
    if (!fileValidation.valid) {
      throw new Error(fileValidation.error);
    }

    // Validate product-level aggregates if provided
    if (options?.currentFileCount != null && options?.currentTotalBytes != null) {
      const aggValidation = this.uploadConfig.validateProductFileLimits(
        options.currentFileCount,
        options.currentTotalBytes,
        file.size,
      );
      if (!aggValidation.valid) {
        throw new Error(aggValidation.error);
      }
    }

    return this.upload(file, {
      onProgress: options?.onProgress,
      signal: options?.signal,
      context: 'product-file',
    });
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
