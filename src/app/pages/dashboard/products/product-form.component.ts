import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-3xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-gray-900">
            {{ isEditing() ? 'Edit Product' : 'Create Product' }}
          </h1>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 py-8">
        <form (ngSubmit)="save()" class="card p-6 space-y-6">
          <div>
            <label for="storeId" class="block text-sm font-medium text-gray-700 mb-1">
              Store <span class="text-red-500">*</span>
              <button 
                type="button"
                (click)="toggleTooltip('storeId')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Store field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'storeId') {
                <div class="tooltip-container mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('storeId') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <select
              id="storeId"
              [(ngModel)]="form.storeId"
              name="storeId"
              required
              class="input"
              [disabled]="isEditing()"
            >
              <option value="">Select a store</option>
              @for (store of stores(); track store.id) {
                <option [value]="store.id">{{ store.name }}</option>
              }
            </select>
          </div>

          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Product Title <span class="text-red-500">*</span>
              <button 
                type="button"
                (click)="toggleTooltip('title')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Product Title field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'title') {
                <div class="tooltip-container mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('title') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <input
              type="text"
              id="title"
              [(ngModel)]="form.title"
              name="title"
              required
              class="input"
              placeholder="My Amazing Product"
              (input)="onTitleChange()"
            >
          </div>

          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
              Product URL <span class="text-red-500">*</span>
              <button 
                type="button"
                (click)="toggleTooltip('slug')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Product URL field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'slug') {
                <div class="tooltip-container mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('slug') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <input
              type="text"
              id="slug"
              [(ngModel)]="form.slug"
              name="slug"
              required
              class="input"
              placeholder="my-product"
              pattern="[a-z0-9-]+"
              (input)="onSlugChange()"
            >
            <p class="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
              <button 
                type="button"
                (click)="toggleTooltip('description')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Description field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'description') {
                <div class="tooltip-container mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('description') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <app-rich-text-editor
              [(ngModel)]="form.description"
              name="description"
              placeholder="Describe your product..."
            ></app-rich-text-editor>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) <span class="text-red-500">*</span>
              <button 
                type="button"
                (click)="toggleTooltip('price')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Price field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'price') {
                <div class="tooltip-container mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('price') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <input
              type="number"
              id="price"
              [(ngModel)]="form.price"
              name="price"
              required
              min="0"
              step="0.01"
              class="input"
              placeholder="99.00"
            >
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              Status
              <button 
                type="button"
                (click)="toggleTooltip('status')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Status field"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'status') {
                <div class="mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('status') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </label>
            <select
              id="status"
              [(ngModel)]="form.status"
              name="status"
              class="input"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <!-- File Upload Section -->
          <div class="border-t pt-6">
            <h3 class="font-medium text-gray-900 mb-4">
              Product Files
              <button 
                type="button"
                (click)="toggleTooltip('files')"
                class="info-button inline-block w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                aria-label="Help for Product Files"
              >
                <svg viewBox="0 0 16 16" class="w-full h-full">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
                  <text x="8" y="12" text-anchor="middle" font-size="10" fill="currentColor">i</text>
                </svg>
              </button>
              @if (activeTooltip() === 'files') {
                <div class="mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs relative z-10">
                  <div class="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  {{ getTooltipText('files') }}
                  <button 
                    (click)="hideTooltip()"
                    class="ml-2 text-gray-300 hover:text-white text-sm"
                    aria-label="Close tooltip"
                  >
                    ×
                  </button>
                </div>
              }
            </h3>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="files"
                (change)="onFilesSelected($event)"
                multiple
                class="hidden"
              >
              <label for="files" class="cursor-pointer">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-gray-600">Click to upload files</p>
                <p class="text-sm text-gray-400 mt-1">ZIP, PDF, PSD, AI, etc.</p>
              </label>
            </div>

            @if (selectedFiles().length > 0) {
              <ul class="mt-4 space-y-2">
                @for (file of selectedFiles(); track file.name) {
                  <li class="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span class="text-sm text-gray-700">{{ file.name }}</span>
                    <button type="button" (click)="removeFile(file)" class="text-red-500 hover:text-red-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </li>
                }
              </ul>
            }
          </div>

          <div class="flex justify-end gap-4 pt-4">
            <button type="button" (click)="cancel()" class="btn-outline">Cancel</button>
            <button type="submit" [disabled]="saving()" class="btn-primary">
              {{ saving() ? 'Saving...' : (isEditing() ? 'Update Product' : 'Create Product') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
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
    if (!target.closest('.tooltip-container') && !target.closest('.info-button')) {
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
