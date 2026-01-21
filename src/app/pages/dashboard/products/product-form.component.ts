import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, RouterLink],
  template: `
    <div class="page-wrapper">
      <!-- Header Section -->
      <section class="header-section">
        <div class="container">
          <div class="header-content">
            <div class="header-text">
              <div class="breadcrumb">
                <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
                <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <a routerLink="/dashboard/products" class="breadcrumb-link">Products</a>
                <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <span class="breadcrumb-current">{{ isEditing() ? 'Edit' : 'New' }}</span>
              </div>
              <h1 class="page-title">{{ isEditing() ? 'Edit Product' : 'Create Product' }}</h1>
              <p class="page-subtitle">{{ isEditing() ? 'Update your product details' : 'Add a new digital product to your store' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Section -->
      <section class="content-section">
        <div class="container">
          <form (ngSubmit)="save()" class="form-card">
            <!-- Store Selection -->
            <div class="form-group">
              <label for="storeId" class="form-label">
                Store
                <span class="required-mark">*</span>
                <button 
                  type="button"
                  (click)="toggleTooltip('storeId')"
                  class="info-btn"
                  aria-label="Help for Store field"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'storeId') {
                <div class="tooltip-box">
                  {{ getTooltipText('storeId') }}
                </div>
              }
              <select
                id="storeId"
                [(ngModel)]="form.storeId"
                name="storeId"
                required
                class="form-select"
                [disabled]="isEditing()"
              >
                <option value="">Select a store</option>
                @for (store of stores(); track store.id) {
                  <option [value]="store.id">{{ store.name }}</option>
                }
              </select>
            </div>

            <!-- Product Title -->
            <div class="form-group">
              <label for="title" class="form-label">
                Product Title
                <span class="required-mark">*</span>
                <button 
                  type="button"
                  (click)="toggleTooltip('title')"
                  class="info-btn"
                  aria-label="Help for Title field"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'title') {
                <div class="tooltip-box">
                  {{ getTooltipText('title') }}
                </div>
              }
              <input
                type="text"
                id="title"
                [(ngModel)]="form.title"
                name="title"
                required
                class="form-input"
                placeholder="My Amazing Product"
                (input)="onTitleChange()"
              >
            </div>

            <!-- Product URL/Slug -->
            <div class="form-group">
              <label for="slug" class="form-label">
                Product URL
                <span class="required-mark">*</span>
                <button 
                  type="button"
                  (click)="toggleTooltip('slug')"
                  class="info-btn"
                  aria-label="Help for URL field"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'slug') {
                <div class="tooltip-box">
                  {{ getTooltipText('slug') }}
                </div>
              }
              <input
                type="text"
                id="slug"
                [(ngModel)]="form.slug"
                name="slug"
                required
                class="form-input"
                placeholder="my-product"
                pattern="[a-z0-9-]+"
                (input)="onSlugChange()"
              >
              <p class="form-hint">Only lowercase letters, numbers, and hyphens</p>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description" class="form-label">
                Description
                <button 
                  type="button"
                  (click)="toggleTooltip('description')"
                  class="info-btn"
                  aria-label="Help for Description field"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'description') {
                <div class="tooltip-box">
                  {{ getTooltipText('description') }}
                </div>
              }
              <app-rich-text-editor
                [(ngModel)]="form.description"
                name="description"
                placeholder="Describe your product..."
              ></app-rich-text-editor>
            </div>

            <!-- Price and Status Row -->
            <div class="form-row">
              <div class="form-group">
                <label for="price" class="form-label">
                  Price (₹)
                  <span class="required-mark">*</span>
                  <button 
                    type="button"
                    (click)="toggleTooltip('price')"
                    class="info-btn"
                    aria-label="Help for Price field"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </button>
                </label>
                @if (activeTooltip() === 'price') {
                  <div class="tooltip-box">
                    {{ getTooltipText('price') }}
                  </div>
                }
                <div class="price-input-wrapper">
                  <span class="price-symbol">₹</span>
                  <input
                    type="number"
                    id="price"
                    [(ngModel)]="form.price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    class="form-input price-input"
                    placeholder="99.00"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="status" class="form-label">
                  Status
                  <button 
                    type="button"
                    (click)="toggleTooltip('status')"
                    class="info-btn"
                    aria-label="Help for Status field"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </button>
                </label>
                @if (activeTooltip() === 'status') {
                  <div class="tooltip-box">
                    {{ getTooltipText('status') }}
                  </div>
                }
                <select
                  id="status"
                  [(ngModel)]="form.status"
                  name="status"
                  class="form-select"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>

            <!-- File Upload Section -->
            <div class="form-section">
              <div class="form-section-header">
                <h3 class="form-section-title">
                  Product Files
                  <button 
                    type="button"
                    (click)="toggleTooltip('files')"
                    class="info-btn"
                    aria-label="Help for Files"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </button>
                </h3>
                @if (activeTooltip() === 'files') {
                  <div class="tooltip-box">
                    {{ getTooltipText('files') }}
                  </div>
                }
              </div>
              
              <div class="file-upload-zone" (click)="fileInput.click()">
                <input
                  type="file"
                  #fileInput
                  (change)="onFilesSelected($event)"
                  multiple
                  class="hidden-input"
                >
                <div class="file-upload-content">
                  <div class="file-upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p class="file-upload-text">Click to upload files</p>
                  <p class="file-upload-hint">ZIP, PDF, PSD, AI, etc.</p>
                </div>
              </div>

              @if (selectedFiles().length > 0) {
                <ul class="file-list">
                  @for (file of selectedFiles(); track file.name) {
                    <li class="file-item">
                      <div class="file-info">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span class="file-name">{{ file.name }}</span>
                      </div>
                      <button type="button" (click)="removeFile(file)" class="file-remove-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  }
                </ul>
              }
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" (click)="cancel()" class="secondary-button">Cancel</button>
              <button type="submit" [disabled]="saving()" class="primary-button">
                @if (saving()) {
                  <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                  Saving...
                } @else {
                  {{ isEditing() ? 'Update Product' : 'Create Product' }}
                }
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .page-wrapper {
      font-family: 'DM Sans', system-ui, sans-serif;
      min-height: 100vh;
      background: #f8fafc;
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    @media (max-width: 640px) {
      .container {
        padding: 0 1rem;
      }
    }

    /* Header Section */
    .header-section {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem 0;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .header-text {
      flex: 1;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb-link:hover {
      color: #111827;
    }

    .breadcrumb-separator {
      color: #d1d5db;
      flex-shrink: 0;
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 500;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 1.25rem;
      }
    }

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
    }

    /* Form Card */
    .form-card {
      background: #ffffff;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid #e5e7eb;
    }

    @media (max-width: 640px) {
      .form-card {
        padding: 1.5rem;
        border-radius: 0.75rem;
      }
    }

    /* Form Group */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .required-mark {
      color: #ef4444;
    }

    .info-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      transition: color 0.2s;
    }

    .info-btn:hover {
      color: #6b7280;
    }

    .tooltip-box {
      margin-top: 0.5rem;
      padding: 0.75rem 1rem;
      background: #1f2937;
      color: #ffffff;
      font-size: 0.8125rem;
      font-weight: 400;
      border-radius: 0.5rem;
      line-height: 1.5;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      color: #111827;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #111827;
      box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
    }

    .form-input:disabled,
    .form-select:disabled {
      background: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-hint {
      font-size: 0.8125rem;
      color: #6b7280;
      margin-top: 0.375rem;
    }

    /* Form Row */
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }

    /* Price Input */
    .price-input-wrapper {
      position: relative;
    }

    .price-symbol {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-weight: 500;
    }

    .price-input {
      padding-left: 2rem;
    }

    /* Form Section */
    .form-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .form-section-header {
      margin-bottom: 1rem;
    }

    .form-section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    /* File Upload */
    .file-upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .file-upload-zone:hover {
      border-color: #9ca3af;
      background: #f9fafb;
    }

    .hidden-input {
      display: none;
    }

    .file-upload-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 0.75rem;
      color: #9ca3af;
    }

    .file-upload-text {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
      margin: 0 0 0.25rem;
    }

    .file-upload-hint {
      font-size: 0.8125rem;
      color: #9ca3af;
      margin: 0;
    }

    /* File List */
    .file-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0 0;
    }

    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #6b7280;
    }

    .file-name {
      font-size: 0.875rem;
      color: #374151;
    }

    .file-remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      transition: color 0.2s;
    }

    .file-remove-btn:hover {
      color: #ef4444;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 640px) {
      .form-actions {
        flex-direction: column-reverse;
      }
    }

    .primary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #111827;
      color: #ffffff;
      font-size: 0.9375rem;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .primary-button:hover:not(:disabled) {
      background: #1f2937;
    }

    .primary-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .secondary-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background: #ffffff;
      color: #374151;
      font-size: 0.9375rem;
      font-weight: 500;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .secondary-button:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    @media (max-width: 640px) {
      .primary-button,
      .secondary-button {
        width: 100%;
        justify-content: center;
      }
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  isEditing = signal(false);
  saving = signal(false);
  stores = signal<Store[]>([]);
  selectedFiles = signal<File[]>([]);
  productId: string | null = null;
  slugManuallyEdited = false;
  activeTooltip = signal<string | null>(null);

  form = {
    storeId: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    status: 'DRAFT',
  };

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    // Load stores
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);

    // Check if editing
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId && this.productId !== 'new') {
      this.isEditing.set(true);
      this.slugManuallyEdited = true; // Don't auto-update slug when editing
      const product = await this.productService.getProduct(this.productId);
      this.form = {
        storeId: product.storeId,
        title: product.title,
        slug: product.slug,
        description: product.description || '',
        price: product.price / 100, // Convert from cents
        status: product.status,
      };
    } else {
      this.slugManuallyEdited = false; // Allow auto-generation for new products
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.set([...this.selectedFiles(), ...Array.from(input.files)]);
    }
  }

  removeFile(file: File) {
    this.selectedFiles.set(this.selectedFiles().filter(f => f !== file));
  }

  onTitleChange() {
    if (!this.isEditing() && this.form.title && !this.slugManuallyEdited) {
      this.form.slug = this.generateSlug(this.form.title);
    }
  }

  onSlugChange() {
    this.slugManuallyEdited = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    // Close tooltip if clicked outside of tooltip or info button
    if (!target.closest('.tooltip-box') && !target.closest('.info-btn')) {
      this.hideTooltip();
    }
  }

  toggleTooltip(field: string) {
    this.activeTooltip.set(this.activeTooltip() === field ? null : field);
  }

  hideTooltip() {
    this.activeTooltip.set(null);
  }

  getTooltipText(field: string): string {
    const tooltips: { [key: string]: string } = {
      storeId: 'Choose which of your stores this product will be listed in. Each store can have multiple products.',
      title: 'Give your product a clear, catchy name that customers will see. Keep it descriptive and appealing.',
      slug: 'This creates a web address for your product. It auto-generates from your title but you can customize it. Use only letters, numbers, and hyphens.',
      description: 'Describe your product in detail. Explain what it includes, how it helps customers, and any special features. You can use formatting like bold text and lists.',
      price: 'Set the price customers will pay for your product. Enter the amount in rupees (e.g., 99.00 for ₹99). This is what they\'ll be charged.',
      status: 'Choose whether your product is ready for customers to see. Draft means only you can see it. Published means customers can find and buy it.',
      files: 'Upload the actual files customers will download after purchase. These can be digital products like design files, PDFs, software, templates, etc. Supported formats: ZIP, PDF, PSD, AI, and more.'
    };
    return tooltips[field] || '';
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async save() {
    this.saving.set(true);
    try {
      const data: any = {
        ...this.form,
        price: Math.round(this.form.price * 100), // Convert to cents
      };

      let product: any;
      if (this.isEditing() && this.productId) {
        product = await this.productService.updateProduct(this.productId, data);
      } else {
        product = await this.productService.createProduct(data);
      }

      // Upload files if any
      if (product) {
        for (const file of this.selectedFiles()) {
          await this.productService.uploadProductFile(product.id, file);
        }
      }

      this.router.navigate(['/dashboard/products']);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/products']);
  }
}
