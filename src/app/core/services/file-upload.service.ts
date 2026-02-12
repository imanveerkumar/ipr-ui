import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface UploadedFileRef {
  fileId: string;
  storageKey: string;
  filename: string;
  mimeType: string;
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

    const { fileId, uploadUrl, storageKey } = uploadInfo;

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
      storageKey,
      filename: file.name,
      mimeType: contentType,
      size: file.size,
    };
  }

  async delete(fileId: string): Promise<void> {
    await this.api.delete(`/files/${fileId}`);
  }

  async attachToProduct(fileId: string, productId: string): Promise<void> {
    await this.api.post(`/files/${fileId}/attach/${productId}`, {});
  }
}
