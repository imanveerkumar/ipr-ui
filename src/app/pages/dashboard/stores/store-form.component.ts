import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-store-form',
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
                <a routerLink="/dashboard/stores" class="breadcrumb-link">Stores</a>
                <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <span class="breadcrumb-current">{{ isEditing() ? 'Edit' : 'New' }}</span>
              </div>
              <h1 class="page-title">{{ isEditing() ? 'Edit Store' : 'Create Store' }}</h1>
              <p class="page-subtitle">{{ isEditing() ? 'Update your store details and settings' : 'Set up your new online storefront' }}</p>
            </div>
            
            @if (isEditing() && store()) {
              <div class="header-actions">
                <span class="status-badge" [class.status-published]="store()?.status === 'PUBLISHED'" [class.status-draft]="store()?.status !== 'PUBLISHED'">
                  {{ store()?.status }}
                </span>
                @if (store()?.status === 'PUBLISHED') {
                  <button (click)="unpublish()" [disabled]="publishing()" class="secondary-button">
                    {{ publishing() ? 'Updating...' : 'Unpublish' }}
                  </button>
                } @else {
                  <button (click)="publish()" [disabled]="publishing()" class="primary-button">
                    {{ publishing() ? 'Publishing...' : 'Publish Store' }}
                  </button>
                }

                <!-- Add Product button: navigates to product creation and passes current store id -->
                <a [routerLink]="['/dashboard/products/new']" [queryParams]="{ storeId: store()?.id }" class="primary-button add-product-button" role="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add Product
                </a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="content-section">
        <div class="container">
          <!-- Live Store URL Card -->
          @if (isEditing() && store()?.status === 'PUBLISHED') {
            <div class="live-store-card">
              <div class="live-store-content">
                <div class="live-store-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div class="live-store-info">
                  <p class="live-store-label">Your store is live!</p>
                  <a [href]="storeService.getStoreUrl(store()!)" target="_blank" class="live-store-url">
                    {{ store()?.slug }}.yoursite.com
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
              <button (click)="copyStoreUrl()" class="copy-url-btn">
                @if (copied()) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied!
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy URL
                }
              </button>
            </div>
          }

          <!-- Form Card -->
          <form (ngSubmit)="save()" class="form-card">
            <!-- Store Name -->
            <div class="form-group">
              <label for="name" class="form-label">
                Store Name
                <span class="required-mark">*</span>
                <button 
                  type="button"
                  (click)="toggleTooltip('name')"
                  class="info-btn"
                  aria-label="Help for Store Name"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'name') {
                <div class="tooltip-box">
                  {{ getTooltipText('name') }}
                </div>
              }
              <input
                type="text"
                id="name"
                [(ngModel)]="form.name"
                name="name"
                required
                class="form-input"
                placeholder="My Awesome Store"
              >
            </div>

            <!-- Store Slug/URL -->
            <div class="form-group">
              <label for="slug" class="form-label">
                Store URL (Subdomain)
                <span class="required-mark">*</span>
                <button 
                  type="button"
                  (click)="toggleTooltip('slug')"
                  class="info-btn"
                  aria-label="Help for Store URL"
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
              <div class="slug-input-wrapper">
                <input
                  type="text"
                  id="slug"
                  [(ngModel)]="form.slug"
                  name="slug"
                  required
                  class="form-input slug-input"
                  placeholder="my-store"
                  pattern="[a-z0-9-]+"
                  (input)="validateSlug()"
                >
                <span class="slug-suffix">.yoursite.com</span>
              </div>
              <p class="form-hint">Only lowercase letters, numbers, and hyphens. This will be your store's subdomain.</p>
              @if (slugError()) {
                <p class="form-error">{{ slugError() }}</p>
              }
            </div>

            <!-- Tagline -->
            <div class="form-group">
              <label for="tagline" class="form-label">
                Tagline
                <button 
                  type="button"
                  (click)="toggleTooltip('tagline')"
                  class="info-btn"
                  aria-label="Help for Tagline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
              </label>
              @if (activeTooltip() === 'tagline') {
                <div class="tooltip-box">
                  {{ getTooltipText('tagline') }}
                </div>
              }
              <input
                type="text"
                id="tagline"
                [(ngModel)]="form.tagline"
                name="tagline"
                class="form-input"
                placeholder="A short catchy phrase"
              >
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description" class="form-label">
                Description
                <button 
                  type="button"
                  (click)="toggleTooltip('description')"
                  class="info-btn"
                  aria-label="Help for Description"
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
                placeholder="Tell customers about your store..."
              ></app-rich-text-editor>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" (click)="cancel()" class="secondary-button">Cancel</button>
              <button type="submit" [disabled]="saving() || !!slugError()" class="primary-button">
                @if (saving()) {
                  <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                  Saving...
                } @else {
                  {{ isEditing() ? 'Update Store' : 'Create Store' }}
                }
              </button>
            </div>
          </form>

          <!-- Danger Zone -->
          @if (isEditing()) {
            <div class="danger-zone">
              <div class="danger-zone-content">
                <h3 class="danger-zone-title">Danger Zone</h3>
                <p class="danger-zone-text">Deleting your store will remove all products and cannot be undone.</p>
              </div>
              <button (click)="deleteStore()" [disabled]="deleting()" class="danger-button">
                @if (deleting()) {
                  Deleting...
                } @else {
                  Delete Store
                }
              </button>
            </div>
          }
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
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
      }
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

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .status-badge {
      padding: 0.375rem 0.875rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
    }

    .status-published {
      background: #dcfce7;
      color: #166534;
    }

    .status-draft {
      background: #fef3c7;
      color: #92400e;
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

    /* Live Store Card */
    .live-store-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) {
      .live-store-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .live-store-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .live-store-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #dcfce7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #16a34a;
      flex-shrink: 0;
    }

    .live-store-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #166534;
      margin: 0 0 0.125rem;
    }

    .live-store-url {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #15803d;
      text-decoration: none;
      transition: color 0.2s;
    }

    .live-store-url:hover {
      color: #166534;
    }

    .copy-url-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #ffffff;
      color: #374151;
      font-size: 0.8125rem;
      font-weight: 500;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      white-space: nowrap;
    }

    .copy-url-btn:hover {
      background: #f9fafb;
      border-color: #9ca3af;
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

    .form-input {
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

    .form-input:focus {
      outline: none;
      border-color: #111827;
      box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .form-hint {
      font-size: 0.8125rem;
      color: #6b7280;
      margin-top: 0.375rem;
    }

    .form-error {
      font-size: 0.8125rem;
      color: #dc2626;
      margin-top: 0.375rem;
    }

    /* Slug Input */
    .slug-input-wrapper {
      display: flex;
      align-items: center;
    }

    .slug-input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }

    .slug-input:focus {
      border-right: none;
    }

    .slug-suffix {
      padding: 0.75rem 1rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-left: none;
      border-radius: 0 0.5rem 0.5rem 0;
      font-size: 0.9375rem;
      color: #6b7280;
      white-space: nowrap;
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

    /* Danger Zone */
    .danger-zone {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem;
      background: #ffffff;
      border: 1px solid #fecaca;
      border-radius: 0.75rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 640px) {
      .danger-zone {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .danger-zone-title {
      font-size: 1rem;
      font-weight: 600;
      color: #dc2626;
      margin: 0 0 0.25rem;
    }

    .danger-zone-text {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .danger-button {
      padding: 0.625rem 1.25rem;
      background: #dc2626;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      white-space: nowrap;
    }

    .danger-button:hover:not(:disabled) {
      background: #b91c1c;
    }

    .danger-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
export class StoreFormComponent implements OnInit {
  storeService = inject(StoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditing = signal(false);
  saving = signal(false);
  publishing = signal(false);
  deleting = signal(false);
  copied = signal(false);
  slugError = signal<string | null>(null);
  store = signal<Store | null>(null);
  storeId: string | null = null;
  activeTooltip = signal<string | null>(null);

  form = {
    name: '',
    slug: '',
    description: '',
    tagline: '',
  };

  async ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('id');
    if (this.storeId && this.storeId !== 'new') {
      this.isEditing.set(true);
      const store = await this.storeService.getStore(this.storeId);
      this.store.set(store);
      this.form = {
        name: store.name,
        slug: store.slug,
        description: store.description || '',
        tagline: store.tagline || '',
      };
    }
  }

  validateSlug() {
    const slug = this.form.slug.toLowerCase();
    
    if (!this.storeService.isValidSlug(slug)) {
      if (!/^[a-z0-9-]*$/.test(slug)) {
        this.slugError.set('Only lowercase letters, numbers, and hyphens allowed');
      } else {
        this.slugError.set('This subdomain is reserved');
      }
    } else {
      this.slugError.set(null);
    }
    
    // Auto-format slug
    this.form.slug = slug.replace(/[^a-z0-9-]/g, '');
  }

  async save() {
    this.saving.set(true);
    try {
      if (this.isEditing() && this.storeId) {
        const updated = await this.storeService.updateStore(this.storeId, this.form);
        if (updated) this.store.set(updated);
      } else {
        await this.storeService.createStore(this.form);
        this.router.navigate(['/dashboard/stores']);
      }
    } catch (error) {
      console.error('Failed to save store:', error);
      alert('Failed to save store. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  async publish() {
    if (!this.storeId) return;
    this.publishing.set(true);
    try {
      const updated = await this.storeService.publishStore(this.storeId);
      if (updated) this.store.set(updated);
    } catch (error) {
      console.error('Failed to publish store:', error);
      alert('Failed to publish store. Please try again.');
    } finally {
      this.publishing.set(false);
    }
  }

  async unpublish() {
    if (!this.storeId) return;
    this.publishing.set(true);
    try {
      const updated = await this.storeService.unpublishStore(this.storeId);
      if (updated) this.store.set(updated);
    } catch (error) {
      console.error('Failed to unpublish store:', error);
      alert('Failed to unpublish store. Please try again.');
    } finally {
      this.publishing.set(false);
    }
  }

  async deleteStore() {
    if (!this.storeId) return;
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) return;
    
    this.deleting.set(true);
    try {
      await this.storeService.deleteStore(this.storeId);
      this.router.navigate(['/dashboard/stores']);
    } catch (error) {
      console.error('Failed to delete store:', error);
      alert('Failed to delete store. Please try again.');
    } finally {
      this.deleting.set(false);
    }
  }

  copyStoreUrl() {
    const store = this.store();
    if (!store) return;
    
    const url = this.storeService.getStoreUrl(store);
    navigator.clipboard.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
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
      name: 'Choose a memorable name for your online store. This is what customers will see as your brand name.',
      slug: 'This creates your store\'s web address (like mystore.yoursite.com). Choose something simple and brand-related. Only use letters, numbers, and hyphens.',
      tagline: 'A short, catchy phrase that describes what makes your store special. This appears under your store name.',
      description: 'Write about what your store offers, your story, and what makes you unique. This helps customers understand your brand.'
    };
    return tooltips[field] || '';
  }

  cancel() {
    this.router.navigate(['/dashboard/stores']);
  }
}
