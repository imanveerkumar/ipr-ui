import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <a routerLink="/dashboard/products" class="breadcrumb-link">Products</a>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="breadcrumb-current">{{ isEditing() ? 'Edit' : 'New' }}</span>
        </nav>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="page-title">{{ isEditing() ? 'Edit Product' : 'Create Product' }}</h1>
            <p class="page-subtitle">{{ isEditing() ? 'Update your product details' : 'Add a new digital product to your store' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <form (ngSubmit)="save()" class="form-card">
          <h2 class="form-card-title">Product Details</h2>

          <!-- Store Selection -->
          <div class="form-group">
            <label for="storeId" class="form-label">
              Store <span class="required-mark">*</span>
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">Select which store this product belongs to. Cannot be changed after creation.</span>
              </span>
            </label>
            <select id="storeId" [(ngModel)]="form.storeId" name="storeId" required class="form-select" [disabled]="isEditing()">
              <option value="">Select a store</option>
              @for (store of stores(); track store.id) {
                <option [value]="store.id">{{ store.name }}</option>
              }
            </select>
          </div>

          <!-- Product Title -->
          <div class="form-group">
            <label for="title" class="form-label">
              Product Title <span class="required-mark">*</span>
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">A clear, descriptive title helps customers find and understand your product.</span>
              </span>
            </label>
            <input type="text" id="title" [(ngModel)]="form.title" name="title" required class="form-input" placeholder="My Amazing Product" (input)="onTitleChange()">
          </div>

          <!-- Product URL/Slug -->
          <div class="form-group">
            <label for="slug" class="form-label">
              Product URL <span class="required-mark">*</span>
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">The URL-friendly version of the product name. Auto-generated from title but can be customized.</span>
              </span>
            </label>
            <input type="text" id="slug" [(ngModel)]="form.slug" name="slug" required class="form-input" placeholder="my-product" pattern="[a-z0-9-]+" (input)="onSlugChange()">
            <p class="form-hint">Only lowercase letters, numbers, and hyphens allowed.</p>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">
              Description
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">Describe what customers will receive. Include features, formats, and any requirements.</span>
              </span>
            </label>
            <app-rich-text-editor [(ngModel)]="form.description" name="description" placeholder="Describe your product..."></app-rich-text-editor>
          </div>

          <!-- Price and Status Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="price" class="form-label">
                Price <span class="required-mark">*</span>
                <span class="tooltip-trigger" tabindex="0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <span class="tooltip-content">Set your product price in Indian Rupees. Enter 0 for a free product.</span>
                </span>
              </label>
              <div class="price-input-wrapper">
                <span class="price-symbol">₹</span>
                <input type="number" id="price" [(ngModel)]="form.price" name="price" required min="0" step="0.01" class="form-input price-input" placeholder="99.00">
              </div>
            </div>
            <div class="form-group">
              <label for="status" class="form-label">
                Status
                <span class="tooltip-trigger" tabindex="0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <span class="tooltip-content">Draft products are hidden from customers. Publish when ready to sell.</span>
                </span>
              </label>
              <select id="status" [(ngModel)]="form.status" name="status" class="form-select">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <!-- File Upload Section -->
          <div class="form-section">
            <h3 class="form-section-title">Product Files</h3>
            <div class="file-upload-zone" [class.dragover]="isDragOver()" (click)="fileInput.click()" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
              <input type="file" #fileInput (change)="onFilesSelected($event)" multiple class="hidden-input">
              <div class="file-upload-content">
                <div class="file-upload-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p class="file-upload-text">Drop files here or click to upload</p>
                <p class="file-upload-hint">ZIP, PDF, PSD, AI, and more</p>
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
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
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
            <button type="button" (click)="cancel()" class="btn btn-secondary">Cancel</button>
            <button type="submit" [disabled]="saving()" class="btn btn-cta">
              @if (saving()) {
                Saving...
              } @else {
                {{ isEditing() ? 'Update Product' : 'Create Product' }}
              }
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F9F4EB;
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

    /* Hero Section */
    .hero-section {
      background: #F9F4EB;
      padding: 2rem 0;
      border-bottom: 2px solid #111111;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      color: #2B57D6;
    }

    .breadcrumb-separator {
      color: #111111;
      opacity: 0.4;
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
    }

    .hero-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .hero-text {
      flex: 1;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: #111111;
      margin: 0 0 0.5rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #111111;
      opacity: 0.7;
      margin: 0;
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 1.5rem;
      }
    }

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
    }

    /* Form Card */
    .form-card {
      background: #ffffff;
      border: 2px solid #111111;
      box-shadow: 4px 4px 0px 0px #111111;
      padding: 2rem;
    }

    @media (max-width: 640px) {
      .form-card {
        padding: 1.5rem;
      }
    }

    .form-card-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111111;
      margin: 0 0 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #111111;
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
      font-weight: 700;
      color: #111111;
      margin-bottom: 0.5rem;
    }

    .required-mark {
      color: #FA4B28;
    }

    /* Tooltip Styles */
    .tooltip-trigger {
      position: relative;
      display: inline-flex;
      align-items: center;
      margin-left: 0.25rem;
      color: #111111;
      opacity: 0.5;
      cursor: help;
      -webkit-tap-highlight-color: transparent;
    }

    .tooltip-trigger:hover,
    .tooltip-trigger:focus {
      opacity: 1;
    }

    .tooltip-trigger:focus {
      outline: none;
    }

    .tooltip-content {
      position: fixed;
      left: 50%;
      bottom: auto;
      top: auto;
      transform: translateX(-50%);
      width: calc(100vw - 2rem);
      max-width: 300px;
      padding: 0.75rem 1rem;
      background: #111111;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.5;
      border: 2px solid #111111;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      text-align: left;
    }

    .tooltip-trigger:hover .tooltip-content,
    .tooltip-trigger:focus .tooltip-content {
      opacity: 1;
      visibility: visible;
    }

    /* Mobile: Fixed position at bottom of screen */
    @media (max-width: 768px) {
      .tooltip-content {
        position: fixed;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        top: auto;
        transform: none;
        width: auto;
        max-width: none;
        border-radius: 0;
      }
    }

    /* Desktop: Position above trigger */
    @media (min-width: 769px) {
      .tooltip-content {
        position: absolute;
        left: 50%;
        bottom: calc(100% + 10px);
        transform: translateX(-50%);
        width: max-content;
        max-width: 280px;
      }

      .tooltip-content::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: #111111;
      }
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: #111111;
      background: #ffffff;
      border: 2px solid #111111;
      font-family: inherit;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(43, 87, 214, 0.3);
    }

    .form-input:disabled,
    .form-select:disabled {
      background: #F9F4EB;
      color: #111111;
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-input::placeholder {
      color: #111111;
      opacity: 0.4;
    }

    .form-hint {
      font-size: 0.8125rem;
      color: #111111;
      opacity: 0.6;
      margin-top: 0.5rem;
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
      display: flex;
      align-items: stretch;
    }

    .price-symbol {
      display: flex;
      align-items: center;
      padding: 0.875rem 1rem;
      background: #FFC60B;
      border: 2px solid #111111;
      border-right: none;
      font-size: 1rem;
      font-weight: 700;
      color: #111111;
    }

    .price-input {
      flex: 1;
    }

    /* Form Section */
    .form-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #111111;
    }

    .form-section-title {
      font-size: 1rem;
      font-weight: 800;
      color: #111111;
      margin: 0 0 1rem;
    }

    /* File Upload */
    .file-upload-zone {
      border: 2px dashed #111111;
      padding: 2.5rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s;
      background: #ffffff;
    }

    .file-upload-zone:hover,
    .file-upload-zone.dragover {
      background: #F9F4EB;
      border-style: solid;
    }

    .hidden-input {
      display: none;
    }

    .file-upload-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      color: #111111;
    }

    .file-upload-text {
      font-size: 1rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 0.25rem;
    }

    .file-upload-hint {
      font-size: 0.875rem;
      color: #111111;
      opacity: 0.6;
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
      padding: 1rem;
      background: #F9F4EB;
      border: 2px solid #111111;
      margin-bottom: 0.5rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #111111;
      min-width: 0;
      flex: 1;
    }

    .file-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111111;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      font-size: 0.8125rem;
      color: #111111;
      opacity: 0.6;
      flex-shrink: 0;
    }

    .file-remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      background: #ffffff;
      border: 2px solid #111111;
      color: #111111;
      cursor: pointer;
      transition: all 0.15s;
      flex-shrink: 0;
      margin-left: 0.75rem;
    }

    .file-remove-btn:hover {
      background: #FA4B28;
      color: #ffffff;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      border: 2px solid #111111;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      font-family: inherit;
      white-space: nowrap;
    }

    .btn:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0px 0px #111111;
    }

    .btn:active:not(:disabled) {
      transform: translate(0, 0);
      box-shadow: none;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #ffffff;
      color: #111111;
    }

    .btn-cta {
      background: #FFC60B;
      color: #111111;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #111111;
    }

    @media (max-width: 640px) {
      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  isEditing = signal(false);
  saving = signal(false);
  stores = signal<Store[]>([]);
  selectedFiles = signal<File[]>([]);
  isDragOver = signal(false);
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

  private toaster = inject(ToasterService);

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId && this.productId !== 'new') {
      this.isEditing.set(true);
      this.slugManuallyEdited = true;
      const product = await this.productService.getProduct(this.productId);
      this.form = {
        storeId: product.storeId,
        title: product.title,
        slug: product.slug,
        description: product.description || '',
        price: product.price / 100,
        status: product.status,
      };
    } else {
      this.slugManuallyEdited = false;
      const storeIdFromQuery = this.route.snapshot.queryParamMap.get('storeId');
      if (storeIdFromQuery) {
        this.form.storeId = storeIdFromQuery;
      }
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
    if (event.dataTransfer?.files) {
      this.selectedFiles.set([...this.selectedFiles(), ...Array.from(event.dataTransfer.files)]);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
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
      storeId: 'Choose which of your stores this product will be listed in.',
      title: 'Give your product a clear, catchy name.',
      slug: 'This creates a web address for your product.',
      description: 'Describe your product in detail.',
      price: 'Set the price in rupees.',
      status: 'Draft means only you can see it. Published means customers can buy it.',
      files: 'Upload the files customers will download after purchase.'
    };
    return tooltips[field] || '';
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async save() {
    this.saving.set(true);
    try {
      const data: any = {
        ...this.form,
        price: Math.round(this.form.price * 100),
      };

      let product: any;
      if (this.isEditing() && this.productId) {
        product = await this.productService.updateProduct(this.productId, data);
        this.toaster.success({
          title: 'Product Updated',
          message: 'Your product has been updated successfully.',
        });
      } else {
        product = await this.productService.createProduct(data);
        this.toaster.success({
          title: 'Product Created',
          message: 'Your new product has been created successfully.',
        });
      }

      if (product) {
        for (const file of this.selectedFiles()) {
          await this.productService.uploadProductFile(product.id, file);
        }
      }

      this.router.navigate(['/dashboard/products']);
    } catch (error) {
      console.error('Failed to save product:', error);
      this.toaster.handleError(error, 'Failed to save product. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/products']);
  }
}
