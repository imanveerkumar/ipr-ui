import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

/**
 * Mirrors the PublicUploadConfig shape from the API.
 * All values are bytes (for sizes) or string arrays (for MIME types).
 */
export interface UploadConfig {
  allowedImageTypes: string[];
  allowedEditorFileTypes: string[];
  allowedProductFileTypes: string[];
  maxImageSizeCover: number;
  maxImageSizeBanner: number;
  maxImageSizeLogo: number;
  maxEditorFileSize: number;
  maxProductFileSize: number;
  maxProductFiles: number;
  maxProductTotalSize: number;
}

/** Sensible defaults while the real config is being fetched. */
const DEFAULT_CONFIG: UploadConfig = {
  allowedImageTypes: ['*'],
  allowedEditorFileTypes: ['*'],
  allowedProductFileTypes: ['*'],
  maxImageSizeCover: 5 * 1024 * 1024,
  maxImageSizeBanner: 5 * 1024 * 1024,
  maxImageSizeLogo: 2 * 1024 * 1024,
  maxEditorFileSize: 10 * 1024 * 1024,
  maxProductFileSize: 500 * 1024 * 1024,
  maxProductFiles: 10,
  maxProductTotalSize: 1024 * 1024 * 1024,
};

export type ImageContext = 'cover' | 'banner' | 'logo';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Fetches upload restrictions from the backend once, caches them,
 * and provides helpers for the UI to validate files before upload.
 */
@Injectable({ providedIn: 'root' })
export class UploadConfigService {
  private api = inject(ApiService);

  private config: UploadConfig = DEFAULT_CONFIG;
  private loaded = false;
  private loading: Promise<void> | null = null;

  /**
   * Ensure the config is fetched. Safe to call multiple times (deduplicates).
   */
  async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    if (this.loading) return this.loading;

    this.loading = this.fetchConfig();
    await this.loading;
  }

  /** Return the cached config (may be defaults if not yet loaded). */
  getConfig(): UploadConfig {
    return this.config;
  }

  /** Synchronously access config after load. */
  get maxProductFiles(): number {
    return this.config.maxProductFiles;
  }

  get maxProductTotalSize(): number {
    return this.config.maxProductTotalSize;
  }

  /* ── Validation helpers ──────────────────────────────────────── */

  /**
   * Validate a file intended for an image upload (cover, banner, logo).
   */
  validateImageFile(file: File, context: ImageContext): FileValidationResult {
    // Type check
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file.' };
    }

    const allowed = this.config.allowedImageTypes;
    if (!this.isMimeAllowed(file.type, allowed)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed. Accepted: ${this.formatAllowedTypes(allowed)}`,
      };
    }

    // Size check
    const maxSize = this.getMaxImageSize(context);
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image exceeds maximum size of ${this.formatBytes(maxSize)}.`,
      };
    }

    if (file.size === 0) {
      return { valid: false, error: 'File is empty.' };
    }

    return { valid: true };
  }

  /**
   * Validate a file intended for the rich-text description editor.
   */
  validateEditorFile(file: File): FileValidationResult {
    const allowed = this.config.allowedEditorFileTypes;
    if (!this.isMimeAllowed(file.type, allowed)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed in the editor. Accepted: ${this.formatAllowedTypes(allowed)}`,
      };
    }

    if (file.size > this.config.maxEditorFileSize) {
      return {
        valid: false,
        error: `File exceeds maximum size of ${this.formatBytes(this.config.maxEditorFileSize)}.`,
      };
    }

    if (file.size === 0) {
      return { valid: false, error: 'File is empty.' };
    }

    return { valid: true };
  }

  /**
   * Validate a product downloadable file.
   */
  validateProductFile(file: File): FileValidationResult {
    const allowed = this.config.allowedProductFileTypes;
    if (!this.isMimeAllowed(file.type || 'application/octet-stream', allowed)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed for product files. Accepted: ${this.formatAllowedTypes(allowed)}`,
      };
    }

    if (file.size > this.config.maxProductFileSize) {
      return {
        valid: false,
        error: `File exceeds maximum size of ${this.formatBytes(this.config.maxProductFileSize)}.`,
      };
    }

    if (file.size === 0) {
      return { valid: false, error: 'File is empty.' };
    }

    return { valid: true };
  }

  /**
   * Check product-level aggregate: can one more file be added?
   */
  validateProductFileLimits(
    currentFileCount: number,
    currentTotalBytes: number,
    newFileSize: number,
  ): FileValidationResult {
    if (currentFileCount + 1 > this.config.maxProductFiles) {
      return {
        valid: false,
        error: `Cannot attach more than ${this.config.maxProductFiles} files to a single product.`,
      };
    }

    if (currentTotalBytes + newFileSize > this.config.maxProductTotalSize) {
      return {
        valid: false,
        error: `Total file size would exceed the limit of ${this.formatBytes(this.config.maxProductTotalSize)}.`,
      };
    }

    return { valid: true };
  }

  /* ── Display helpers ─────────────────────────────────────────── */

  getMaxImageSize(context: ImageContext): number {
    switch (context) {
      case 'cover':
        return this.config.maxImageSizeCover;
      case 'banner':
        return this.config.maxImageSizeBanner;
      case 'logo':
        return this.config.maxImageSizeLogo;
    }
  }

  getAcceptHint(context: ImageContext): string {
    const allowed = this.config.allowedImageTypes;
    const maxSize = this.getMaxImageSize(context);
    const typesLabel = allowed.includes('*')
      ? 'JPG, PNG, WebP, GIF'
      : this.formatAllowedTypes(allowed);
    return `${typesLabel} — max ${this.formatBytes(maxSize)}`;
  }

  getEditorAcceptHint(): string {
    const allowed = this.config.allowedEditorFileTypes;
    const typesLabel = allowed.includes('*') ? 'All file types' : this.formatAllowedTypes(allowed);
    return `${typesLabel} — max ${this.formatBytes(this.config.maxEditorFileSize)}`;
  }

  getProductFileAcceptHint(): string {
    const allowed = this.config.allowedProductFileTypes;
    const typesLabel = allowed.includes('*') ? 'All file types' : this.formatAllowedTypes(allowed);
    return `${typesLabel} — max ${this.formatBytes(this.config.maxProductFileSize)} per file`;
  }

  /**
   * Build the HTML `accept` attribute value from the allowed MIME list.
   */
  getAcceptAttribute(context: 'image' | 'editor' | 'product'): string {
    let allowed: string[];
    switch (context) {
      case 'image':
        allowed = this.config.allowedImageTypes;
        break;
      case 'editor':
        allowed = this.config.allowedEditorFileTypes;
        break;
      case 'product':
        allowed = this.config.allowedProductFileTypes;
        break;
    }
    if (allowed.includes('*')) {
      return context === 'image' ? 'image/*' : '*/*';
    }
    return allowed.join(',');
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  /* ── Internal ────────────────────────────────────────────────── */

  private async fetchConfig(): Promise<void> {
    try {
      const response = await this.api.get<UploadConfig>('/files/upload-config', {
        skipRateLimit: true,
        skipDeduplication: false,
      });
      if (response.data) {
        this.config = response.data;
      }
    } catch (err) {
      console.warn('Failed to fetch upload config, using defaults:', err);
    } finally {
      this.loaded = true;
      this.loading = null;
    }
  }

  private isMimeAllowed(mimeType: string, allowed: string[]): boolean {
    if (allowed.includes('*')) return true;
    const lower = mimeType.toLowerCase();
    if (allowed.includes(lower)) return true;
    const [mainType] = lower.split('/');
    if (allowed.includes(`${mainType}/*`)) return true;
    return false;
  }

  private formatAllowedTypes(types: string[]): string {
    if (types.includes('*')) return 'All types';
    return types
      .map((t) => {
        // Convert mime to friendly label
        const ext = t.split('/').pop() || t;
        return ext.toUpperCase();
      })
      .join(', ');
  }
}
