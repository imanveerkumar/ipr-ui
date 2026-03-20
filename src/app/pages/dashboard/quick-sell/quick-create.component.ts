import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-quick-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Header -->
      <div class="bg-theme-secondary border-b-2 border-theme-border">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </a>
          <h1 class="font-display tracking-tighter text-2xl md:text-3xl font-bold text-theme-fg">
            Quick Sell
          </h1>
          <p class="text-sm text-theme-muted mt-1">Upload a file, set a price, and get a shareable link instantly.</p>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        @if (success()) {
          <!-- Success State -->
          <div class="bg-theme-success/10 border-2 border-theme-success p-6 md:p-8 mb-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-theme-success border-2 border-theme-border flex items-center justify-center">
                <svg class="w-5 h-5 text-[var(--on-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <h2 class="font-bold text-theme-fg text-lg">Product is live!</h2>
                <p class="text-sm text-theme-muted">Share the link below with your customers.</p>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-theme-surface border-2 border-theme-border p-3">
              <input type="text" [value]="productUrl()" readonly class="flex-1 bg-transparent text-sm text-theme-fg font-mono outline-none truncate" />
              <button type="button" (click)="copyUrl()" class="shrink-0 px-4 py-2 bg-theme-primary text-[var(--on-primary)] border-2 border-theme-border text-sm font-bold hover:opacity-90 transition-opacity">
                {{ copied() ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="reset()" class="px-5 py-2.5 bg-theme-accent text-[var(--on-accent)] border-2 border-theme-border font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all">
                Create Another
              </button>
              <a routerLink="/dashboard/quick-sell" class="px-5 py-2.5 bg-theme-surface text-theme-fg border-2 border-theme-border font-bold text-sm hover:bg-theme-secondary transition-colors">
                View All Quick Products
              </a>
            </div>
          </div>
        } @else {
          <!-- Upload Area -->
          <div class="space-y-6">
            <!-- File Upload -->
            <div>
              <label class="block text-sm font-bold text-theme-fg mb-2">Product File <span class="text-theme-error">*</span></label>
              @if (!uploadedFile()) {
                <div
                  class="relative border-2 border-dashed border-theme-border bg-theme-secondary hover:bg-theme-secondary/80 transition-colors cursor-pointer p-8 md:p-12 text-center"
                  [class.border-theme-primary]="isDragging()"
                  [class.bg-theme-primary/5]="isDragging()"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                >
                  @if (uploading()) {
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-12 h-12 border-2 border-theme-border bg-theme-surface flex items-center justify-center">
                        <svg class="w-6 h-6 text-theme-primary animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      </div>
                      <div class="text-sm font-bold text-theme-fg">Uploading... {{ uploadProgress() }}%</div>
                      <div class="w-48 h-2 bg-theme-secondary border border-theme-border overflow-hidden">
                        <div class="h-full bg-theme-primary transition-all duration-300" [style.width.%]="uploadProgress()"></div>
                      </div>
                    </div>
                  } @else {
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-14 h-14 bg-theme-surface border-2 border-theme-border flex items-center justify-center">
                        <svg class="w-7 h-7 text-theme-fg/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-theme-fg">Drop your file here or click to browse</p>
                        <p class="text-xs text-theme-muted mt-1">Any digital file up to 500MB</p>
                      </div>
                    </div>
                  }
                  <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" [disabled]="uploading()" />
                </div>
              } @else {
                <div class="flex items-center gap-3 p-4 bg-theme-secondary border-2 border-theme-border">
                  <div class="w-10 h-10 bg-theme-success border-2 border-theme-border flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-[var(--on-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-theme-fg truncate">{{ uploadedFile()!.filename }}</p>
                    <p class="text-xs text-theme-muted">{{ formatSize(uploadedFile()!.size) }}</p>
                  </div>
                  <button type="button" (click)="removeFile()" class="w-8 h-8 flex items-center justify-center border-2 border-theme-border bg-theme-surface hover:bg-theme-error/10 transition-colors">
                    <svg class="w-4 h-4 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              }
              @if (uploadError()) {
                <p class="text-xs text-theme-error font-medium mt-2">{{ uploadError() }}</p>
              }
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-bold text-theme-fg mb-2">Price (INR) <span class="text-theme-error">*</span></label>
              <div class="flex items-center border-2 border-theme-border bg-theme-surface focus-within:border-theme-primary transition-colors">
                <span class="px-3 py-2.5 bg-theme-secondary border-r-2 border-theme-border text-sm font-bold text-theme-muted">₹</span>
                <input
                  id="price"
                  type="number"
                  [(ngModel)]="price"
                  min="0"
                  step="1"
                  placeholder="0 for free"
                  class="flex-1 px-3 py-2.5 bg-transparent text-sm text-theme-fg outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <p class="text-xs text-theme-muted mt-1">Enter price in rupees. Use 0 for a free product.</p>
            </div>

            <!-- Submit -->
            <button
              type="button"
              (click)="submit()"
              [disabled]="!canSubmit()"
              class="w-full py-3 bg-theme-accent text-[var(--on-accent)] border-2 border-theme-border font-bold text-base shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              @if (submitting()) {
                Creating product...
              } @else {
                Publish & Get Link
              }
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class QuickCreateComponent {
  private productService = inject(ProductService);
  private fileUpload = inject(FileUploadService);
  private toaster = inject(ToasterService);
  private router = inject(Router);

  uploadedFile = signal<{ fileId: string; filename: string; size: number } | null>(null);
  uploading = signal(false);
  uploadProgress = signal(0);
  uploadError = signal('');
  isDragging = signal(false);
  price: number = 0;

  submitting = signal(false);
  success = signal(false);
  productUrl = signal('');
  copied = signal(false);

  canSubmit() {
    return this.uploadedFile() && !this.uploading() && !this.submitting() && this.price >= 0;
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.uploadFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadFile(file);
    input.value = '';
  }

  async uploadFile(file: File) {
    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.uploadError.set('');
    try {
      const result = await this.fileUpload.uploadProductFile(file, {
        onProgress: (p) => this.uploadProgress.set(p ?? 0),
      });
      this.uploadedFile.set({
        fileId: result.fileId,
        filename: result.filename,
        size: result.size,
      });
    } catch (err: any) {
      this.uploadError.set(err?.message || 'Upload failed');
    } finally {
      this.uploading.set(false);
    }
  }

  removeFile() {
    this.uploadedFile.set(null);
    this.uploadError.set('');
  }

  async submit() {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    try {
      // Price is in rupees from the input; convert to paise for the API
      const priceInPaise = Math.round(this.price * 100);
      const result = await this.productService.quickCreateProduct({
        fileId: this.uploadedFile()!.fileId,
        price: priceInPaise,
      });
      this.productUrl.set(result.productUrl);
      this.success.set(true);
      this.toaster.success('Product published!');
    } catch (err: any) {
      this.toaster.error(err?.message || 'Failed to create product');
    } finally {
      this.submitting.set(false);
    }
  }

  reset() {
    this.uploadedFile.set(null);
    this.uploading.set(false);
    this.uploadProgress.set(0);
    this.uploadError.set('');
    this.price = 0;
    this.submitting.set(false);
    this.success.set(false);
    this.productUrl.set('');
    this.copied.set(false);
  }

  async copyUrl() {
    try {
      await navigator.clipboard.writeText(this.productUrl());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.toaster.error('Failed to copy');
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}
