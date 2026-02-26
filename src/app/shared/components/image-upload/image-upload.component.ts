import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, ProcessedImageResult } from '../../../core/services/file-upload.service';
import { ToasterService } from '../../../core/services/toaster.service';

export type ImageType = 'thumbnail' | 'banner' | 'logo';

/** Result emitted when an image is uploaded and processed */
export interface ImageUploadResult {
  imageUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-upload-wrapper">
      <label *ngIf="label" class="upload-label">
        {{ label }}
        <span *ngIf="hint" class="upload-hint">{{ hint }}</span>
      </label>

      <div
        class="upload-zone"
        [class.upload-zone--banner]="imageType === 'banner'"
        [class.upload-zone--logo]="imageType === 'logo'"
        [class.upload-zone--thumbnail]="imageType === 'thumbnail'"
        [class.upload-zone--has-image]="!!currentImageUrl()"
        [class.upload-zone--dragover]="isDragOver()"
        [class.upload-zone--uploading]="isUploading()"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input
          type="file"
          #fileInput
          (change)="onFileSelected($event)"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="hidden-input"
        />

        <!-- Preview Image -->
        @if (currentImageUrl() && !isUploading()) {
          <div class="preview-container">
            <img
              [src]="currentImageUrl()"
              [alt]="label || 'Image preview'"
              class="preview-image"
              (error)="onImageError()"
            />
            <div class="preview-overlay">
              <div class="preview-actions">
                <button type="button" class="preview-btn preview-btn--change" (click)="fileInput.click(); $event.stopPropagation()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Change
                </button>
                <button type="button" class="preview-btn preview-btn--remove" (click)="removeImage($event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Upload Progress -->
        @if (isUploading()) {
          <div class="upload-progress">
            <div class="upload-progress-ring">
              <svg viewBox="0 0 36 36" class="circular-progress">
                <path
                  class="circular-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circular-fill"
                  [attr.stroke-dasharray]="uploadProgress() + ', 100'"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span class="progress-text">{{ uploadProgress() }}%</span>
            </div>
            <p class="upload-status">
              {{ uploadProgress() < 80 ? 'Uploading...' : 'Optimizing...' }}
            </p>
          </div>
        }

        <!-- Empty State -->
        @if (!currentImageUrl() && !isUploading()) {
          <div class="empty-state">
            <div class="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p class="empty-text">{{ placeholderText }}</p>
            <p class="empty-hint">
              {{ acceptHint }}
            </p>
          </div>
        }
      </div>

      <!-- Error message -->
      @if (errorMessage()) {
        <p class="upload-error">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .image-upload-wrapper {
      margin-bottom: 1.5rem;
    }

    .upload-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
      margin-bottom: 0.5rem;
    }

    .upload-hint {
      font-weight: 500;
      opacity: 0.5;
      font-size: 0.8125rem;
    }

    .hidden-input {
      display: none;
    }

    /* Upload Zone */
    .upload-zone {
      position: relative;
      border: 2px dashed #111111;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
    }

    .upload-zone:hover {
      background: #F9F4EB;
      border-style: solid;
    }

    .upload-zone--dragover {
      background: #FFC60B20;
      border-color: #FFC60B;
      border-style: solid;
    }

    .upload-zone--uploading {
      cursor: default;
      pointer-events: none;
      border-style: solid;
      border-color: #2B57D6;
    }

    .upload-zone--has-image {
      border-style: solid;
      border-color: #111111;
    }

    .upload-zone--has-image:hover {
      border-color: #2B57D6;
    }

    /* Type-specific sizes */
    .upload-zone--thumbnail {
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1;
    }

    .upload-zone--banner {
      width: 100%;
      aspect-ratio: 16 / 5;
      min-height: 160px;
    }

    .upload-zone--logo {
      width: 160px;
      height: 160px;
    }

    @media (max-width: 640px) {
      .upload-zone--thumbnail {
        max-width: 100%;
        aspect-ratio: 4 / 3;
      }

      .upload-zone--banner {
        aspect-ratio: 16 / 7;
        min-height: 120px;
      }

      .upload-zone--logo {
        width: 120px;
        height: 120px;
      }
    }

    /* Preview */
    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .preview-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .preview-actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transform: translateY(4px);
      transition: all 0.2s ease;
    }

    .upload-zone:hover .preview-overlay {
      background: rgba(0, 0, 0, 0.45);
    }

    .upload-zone:hover .preview-actions {
      opacity: 1;
      transform: translateY(0);
    }

    /* Mobile: always show buttons */
    @media (max-width: 768px) {
      .preview-overlay {
        background: rgba(0, 0, 0, 0.35) !important;
      }

      .preview-actions {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    }

    .preview-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 700;
      border: 2px solid #ffffff;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .preview-btn--change {
      background: #ffffff;
      color: #111111;
    }

    .preview-btn--change:hover {
      background: #FFC60B;
    }

    .preview-btn--remove {
      background: transparent;
      color: #ffffff;
    }

    .preview-btn--remove:hover {
      background: #FA4B28;
      border-color: #FA4B28;
    }

    /* Upload Progress */
    .upload-progress {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.95);
    }

    .upload-progress-ring {
      position: relative;
      width: 64px;
      height: 64px;
    }

    .circular-progress {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .circular-bg {
      fill: none;
      stroke: #e5e5e5;
      stroke-width: 3;
    }

    .circular-fill {
      fill: none;
      stroke: #2B57D6;
      stroke-width: 3;
      stroke-linecap: round;
      transition: stroke-dasharray 0.3s ease;
    }

    .progress-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
      color: #111111;
    }

    .upload-status {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111111;
      opacity: 0.7;
      margin: 0;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 120px;
      padding: 1.5rem;
      text-align: center;
    }

    .empty-icon {
      color: #111111;
      opacity: 0.4;
      margin-bottom: 0.75rem;
    }

    .empty-text {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 0.25rem;
    }

    .empty-hint {
      font-size: 0.8125rem;
      color: #111111;
      opacity: 0.5;
      margin: 0;
    }

    /* Error */
    .upload-error {
      font-size: 0.8125rem;
      color: #FA4B28;
      font-weight: 600;
      margin-top: 0.5rem;
    }
  `]
})
export class ImageUploadComponent {
  /** Image type: determines processing preset and aspect ratio */
  @Input() imageType: ImageType = 'thumbnail';
  /** Label text above the upload zone */
  @Input() label = '';
  /** Hint text next to label */
  @Input() hint = '';
  /** Current image URL (for pre-populated edit forms) */
  @Input() set imageUrl(value: string | undefined | null) {
    if (value) {
      this.currentImageUrl.set(value);
    }
  }
  /** Placeholder text */
  @Input() placeholderText = 'Click or drop image here';
  /** Accept hint text */
  @Input() acceptHint = 'JPG, PNG, WebP, GIF — max 15MB';

  /** Emitted when image is uploaded and processed, with the URL and dimensions */
  @Output() imageUploaded = new EventEmitter<ImageUploadResult>();
  /** Emitted when image is removed */
  @Output() imageRemoved = new EventEmitter<void>();

  currentImageUrl = signal<string | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  isDragOver = signal(false);
  errorMessage = signal<string | null>(null);

  private uploadController: AbortController | null = null;
  private fileUpload = inject(FileUploadService);
  private toaster = inject(ToasterService);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      void this.processFile(input.files[0]);
      input.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      void this.processFile(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.currentImageUrl.set(null);
    this.errorMessage.set(null);
    this.imageRemoved.emit();
  }

  onImageError() {
    // If image fails to load, clear it
    this.currentImageUrl.set(null);
  }

  private async processFile(file: File) {
    // Validate client-side
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select an image file (JPG, PNG, WebP, or GIF)');
      return;
    }

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage.set('Image is too large. Maximum size is 15MB.');
      return;
    }

    this.errorMessage.set(null);
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    // Cancel any existing upload
    if (this.uploadController) {
      this.uploadController.abort();
    }
    this.uploadController = new AbortController();

    try {
      const result: ProcessedImageResult = await this.fileUpload.uploadImage(
        file,
        this.imageType,
        {
          signal: this.uploadController.signal,
          onProgress: (p) => {
            if (p !== null) {
              this.uploadProgress.set(p);
            }
          },
        },
      );

      this.currentImageUrl.set(result.imageUrl);
      this.imageUploaded.emit({
        imageUrl: result.imageUrl,
        width: result.width,
        height: result.height,
      });
    } catch (error: any) {
      if (error?.name === 'AbortError' || this.uploadController?.signal.aborted) {
        return; // User cancelled, don't show error
      }
      this.errorMessage.set('Failed to upload image. Please try again.');
      this.toaster.handleError(error, 'Image upload failed');
    } finally {
      this.isUploading.set(false);
      this.uploadController = null;
    }
  }
}
