import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <a routerLink="/dashboard/stores" class="breadcrumb-link">Stores</a>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="breadcrumb-current">{{ isEditing() ? 'Edit' : 'New' }}</span>
        </nav>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="page-title">{{ isEditing() ? 'Edit Store' : 'Create Store' }}</h1>
            <p class="page-subtitle">{{ isEditing() ? 'Update your store details and settings' : 'Set up your new online storefront' }}</p>
          </div>
          @if (isEditing() && store()) {
            <div class="hero-actions">
              <span class="status-badge" [class.status-published]="store()?.status === 'PUBLISHED'" [class.status-draft]="store()?.status !== 'PUBLISHED'">{{ store()?.status }}</span>
              @if (store()?.status === 'PUBLISHED') {
                <button (click)="unpublish()" [disabled]="publishing()" class="btn btn-secondary">{{ publishing() ? 'Updating...' : 'Unpublish' }}</button>
              } @else {
                <button (click)="publish()" [disabled]="publishing()" class="btn btn-green">{{ publishing() ? 'Publishing...' : 'Publish Store' }}</button>
              }
              <a [routerLink]="['/dashboard/products/new']" [queryParams]="{ storeId: store()?.id }" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
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
        <!-- Live Store Card -->
        @if (isEditing() && store()?.status === 'PUBLISHED') {
          <div class="live-store-card">
            <div class="live-store-content">
              <div class="live-store-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div class="live-store-info">
                <p class="live-store-label">Your store is live!</p>
                <a [href]="storeService.getStoreUrl(store()!)" target="_blank" class="live-store-url">{{ store()?.slug }}.yoursite.com</a>
              </div>
            </div>
            <button (click)="copyStoreUrl()" class="btn btn-secondary btn-sm">
              @if (copied()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
              } @else {
                Copy URL
              }
            </button>
          </div>
        }

        <!-- Form Card -->
        <form (ngSubmit)="save()" class="form-card">
          <h2 class="form-card-title">Store Details</h2>

          <!-- Store Name -->
          <div class="form-group">
            <label for="name" class="form-label">
              Store Name <span class="required-mark">*</span>
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">Choose a memorable name for your store. This will be displayed to customers.</span>
              </span>
            </label>
            <input type="text" id="name" [(ngModel)]="form.name" name="name" required class="form-input" placeholder="My Awesome Store">
          </div>

          <!-- Slug -->
          <div class="form-group">
            <label for="slug" class="form-label">
              Store URL (Subdomain) <span class="required-mark">*</span>
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">This creates your unique store URL. Use lowercase letters, numbers, and hyphens only.</span>
              </span>
            </label>
            <div class="slug-input-wrapper">
              <input type="text" id="slug" [(ngModel)]="form.slug" name="slug" required class="form-input slug-input" placeholder="my-store" pattern="[a-z0-9-]+" (input)="validateSlug()">
              <span class="slug-suffix">.yoursite.com</span>
            </div>
            <p class="form-hint">Only lowercase letters, numbers, and hyphens allowed.</p>
            @if (slugError()) {
              <p class="form-error">{{ slugError() }}</p>
            }
          </div>

          <!-- URL Preview -->
          @if (form.slug) {
            <div class="url-preview-card">
              <div class="url-preview-label">Live Preview URL</div>
              <p class="url-preview-value">https://{{ form.slug }}.yoursite.com</p>
            </div>
          }

          <!-- Tagline -->
          <div class="form-group">
            <label for="tagline" class="form-label">
              Tagline
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">A short phrase that describes your store. Displayed below the store name.</span>
              </span>
            </label>
            <input type="text" id="tagline" [(ngModel)]="form.tagline" name="tagline" class="form-input" placeholder="A short catchy phrase">
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">
              Description
              <span class="tooltip-trigger" tabindex="0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span class="tooltip-content">Describe your store and what you offer. Use rich text formatting to make it engaging.</span>
              </span>
            </label>
            <app-rich-text-editor [(ngModel)]="form.description" name="description" placeholder="Tell customers about your store..."></app-rich-text-editor>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" (click)="cancel()" class="btn btn-secondary">Cancel</button>
            <button type="submit" [disabled]="saving() || !!slugError()" class="btn btn-cta">
              @if (saving()) {
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
            <div class="danger-zone-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <h3 class="danger-zone-title">Danger Zone</h3>
            </div>
            <p class="danger-zone-text">Deleting your store will permanently remove all products and data. This action cannot be undone.</p>
            <button (click)="deleteStore()" [disabled]="deleting()" class="btn btn-danger">
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

    @media (max-width: 768px) {
      .hero-content {
        flex-direction: column;
      }
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

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Status Badge */
    .status-badge {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 2px solid #111111;
    }

    .status-published {
      background: #68E079;
      color: #111111;
    }

    .status-draft {
      background: #FFC60B;
      color: #111111;
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

    .btn-primary {
      background: #111111;
      color: #ffffff;
    }

    .btn-secondary {
      background: #ffffff;
      color: #111111;
    }

    .btn-cta {
      background: #FFC60B;
      color: #111111;
    }

    .btn-green {
      background: #68E079;
      color: #111111;
    }

    .btn-danger {
      background: #FA4B28;
      color: #ffffff;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
    }

    @media (max-width: 640px) {
      .btn {
        width: 100%;
        justify-content: center;
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
      padding: 1.25rem;
      background: #68E079;
      border: 2px solid #111111;
      box-shadow: 4px 4px 0px 0px #111111;
      margin-bottom: 2rem;
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
      gap: 1rem;
    }

    .live-store-icon {
      width: 44px;
      height: 44px;
      background: #ffffff;
      border: 2px solid #111111;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .live-store-label {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 0.25rem;
    }

    .live-store-url {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111111;
      text-decoration: underline;
    }

    .live-store-url:hover {
      color: #2B57D6;
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

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: #111111;
      background: #ffffff;
      border: 2px solid #111111;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(43, 87, 214, 0.3);
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

    .form-error {
      font-size: 0.8125rem;
      color: #FA4B28;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    /* Slug Input */
    .slug-input-wrapper {
      display: flex;
      align-items: stretch;
    }

    .slug-input {
      flex: 1;
      border-right: none !important;
    }

    .slug-suffix {
      padding: 0.875rem 1rem;
      background: #F9F4EB;
      border: 2px solid #111111;
      border-left: none;
      font-size: 1rem;
      font-weight: 600;
      color: #111111;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }

    /* URL Preview Card */
    .url-preview-card {
      background: #2B57D6;
      border: 2px solid #111111;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
    }

    .url-preview-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #ffffff;
      opacity: 0.8;
      margin-bottom: 0.375rem;
    }

    .url-preview-value {
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
      word-break: break-all;
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

    /* Danger Zone */
    .danger-zone {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #ffffff;
      border: 2px solid #FA4B28;
      box-shadow: 4px 4px 0px 0px #FA4B28;
    }

    .danger-zone-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #FA4B28;
      margin-bottom: 0.75rem;
    }

    .danger-zone-title {
      font-size: 1.125rem;
      font-weight: 800;
      color: #FA4B28;
      margin: 0;
    }

    .danger-zone-text {
      font-size: 0.9375rem;
      color: #111111;
      opacity: 0.8;
      margin: 0 0 1.25rem;
      line-height: 1.5;
    }
  `]
})
export class StoreFormComponent implements OnInit {
  storeService = inject(StoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToasterService);

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
    tagline: ''
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
        tagline: store.tagline || ''
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
    this.form.slug = slug.replace(/[^a-z0-9-]/g, '');
  }

  async save() {
    this.saving.set(true);
    try {
      if (this.isEditing() && this.storeId) {
        const updated = await this.storeService.updateStore(this.storeId, this.form);
        if (updated) {
          this.store.set(updated);
          this.toaster.success({
            title: 'Store Updated',
            message: 'Your store has been updated successfully.',
          });
        }
      } else {
        await this.storeService.createStore(this.form);
        this.toaster.success({
          title: 'Store Created',
          message: 'Your new store has been created successfully.',
        });
        this.router.navigate(['/dashboard/stores']);
      }
    } catch (error) {
      console.error('Failed to save store:', error);
      this.toaster.handleError(error, 'Failed to save store. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  async publish() {
    if (!this.storeId) return;
    this.publishing.set(true);
    try {
      const updated = await this.storeService.publishStore(this.storeId);
      if (updated) {
        this.store.set(updated);
        this.toaster.success({
          title: 'Store Published',
          message: 'Your store is now live and visible to customers.',
        });
      }
    } catch (error) {
      console.error('Failed to publish store:', error);
      this.toaster.handleError(error, 'Failed to publish store. Please try again.');
    } finally {
      this.publishing.set(false);
    }
  }

  async unpublish() {
    if (!this.storeId) return;
    this.publishing.set(true);
    try {
      const updated = await this.storeService.unpublishStore(this.storeId);
      if (updated) {
        this.store.set(updated);
        this.toaster.info({
          title: 'Store Unpublished',
          message: 'Your store is now hidden from customers.',
        });
      }
    } catch (error) {
      console.error('Failed to unpublish store:', error);
      this.toaster.handleError(error, 'Failed to unpublish store. Please try again.');
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
      this.toaster.success({
        title: 'Store Deleted',
        message: 'Your store has been permanently deleted.',
      });
      this.router.navigate(['/dashboard/stores']);
    } catch (error) {
      console.error('Failed to delete store:', error);
      this.toaster.handleError(error, 'Failed to delete store. Please try again.');
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
      name: 'Choose a memorable name for your online store.',
      slug: 'This creates your store web address.',
      tagline: 'A short, catchy phrase that describes your store.',
      description: 'Write about what your store offers.'
    };
    return tooltips[field] || '';
  }

  cancel() {
    this.router.navigate(['/dashboard/stores']);
  }
}
