import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Store, Product } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components/rich-text-editor/rich-text-editor.component';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { FileUploadService, UploadedFileRef } from '../../../core/services/file-upload.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, ImageUploadComponent, RouterLink, SkeletonComponent],
  template: `
    <!-- State Banner for Archived/Deleted Products -->
    @if (isEditing() && !isLoading()) {
      @if (productState().isDeleted) {
        <section class="bg-[#FA4B28] border-b-2 border-black">
          <div class="max-w-[720px] mx-auto px-4 sm:px-6 py-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <div>
                  <p class="font-bold text-white">This product is in the Bin</p>
                  <p class="text-sm text-white/80">It cannot be edited or purchased. Restore it to make changes.</p>
                </div>
              </div>
              <button type="button" (click)="restoreProduct()" 
                class="px-4 py-2 bg-white text-[#FA4B28] font-bold border-2 border-white hover:bg-[#F9F4EB] transition-colors whitespace-nowrap">
                Restore Product
              </button>
            </div>
          </div>
        </section>
      } @else if (productState().isArchived) {
        <section class="bg-[#FFC60B] border-b-2 border-black">
          <div class="max-w-[720px] mx-auto px-4 sm:px-6 py-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
                </svg>
                <div>
                  <p class="font-bold text-[#111111]">This product is archived</p>
                  <p class="text-sm text-[#111111]/80">It cannot be edited, purchased, or seen by customers. Unarchive to make changes.</p>
                </div>
              </div>
              <button type="button" (click)="unarchiveProduct()" 
                class="px-4 py-2 bg-white text-[#111111] font-bold border-2 border-black hover:bg-[#F9F4EB] transition-colors whitespace-nowrap">
                Unarchive Product
              </button>
            </div>
          </div>
        </section>
      }
    }

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

            @if (!isEditing() && stores().length === 0 && !isLoading()) {
              <div class="mt-6 bg-[#FFC60B] border-2 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_#000]">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0">
                      <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-[#111111] mb-0.5">Note</h3>
                      <p class="text-sm text-[#111111]/80">There are no store created. Create a store first.</p>
                    </div>
                  </div>
                  <a routerLink="/dashboard/stores/new" class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap">
                    Create Store
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <!-- Loading Skeleton -->
        <div *ngIf="isLoading()" class="form-card">
          <div class="mb-8">
            <app-skeleton variant="text-lg" width="200px" class="mb-6"></app-skeleton>
            
            <div class="space-y-6">
              <div>
                <app-skeleton variant="text-sm" width="100px" class="mb-2"></app-skeleton>
                <app-skeleton variant="full" height="48px" class="w-full rounded-lg"></app-skeleton>
              </div>
              
              <div>
                <app-skeleton variant="text-sm" width="120px" class="mb-2"></app-skeleton>
                <app-skeleton variant="full" height="48px" class="w-full rounded-lg"></app-skeleton>
                <app-skeleton variant="text-sm" width="150px" class="mt-1"></app-skeleton>
              </div>

              <div>
                <app-skeleton variant="text-sm" width="140px" class="mb-2"></app-skeleton>
                <app-skeleton variant="full" height="48px" class="w-full rounded-lg"></app-skeleton>
              </div>

              <div>
                <app-skeleton variant="text-sm" width="80px" class="mb-2"></app-skeleton>
                <app-skeleton variant="full" height="200px" class="w-full rounded-lg"></app-skeleton>
              </div>
              
              <div>
                <app-skeleton variant="text-sm" width="60px" class="mb-2"></app-skeleton>
                <app-skeleton variant="full" height="48px" class="w-full rounded-lg"></app-skeleton>
              </div>
            </div>
          </div>
        </div>

        <form *ngIf="!isLoading()" (ngSubmit)="save()" class="form-card" [class.opacity-60]="!canEdit()" [class.pointer-events-none]="!canEdit()">
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
            <select id="storeId" [(ngModel)]="form.storeId" name="storeId" required class="form-select" 
              [class.input-error]="storeError() && formTouched().storeId"
              [disabled]="isEditing()"
              (blur)="validateStore()"
              (change)="validateStore()">
              <option value="">Select a store</option>
              @for (store of stores(); track store.id) {
                <option [value]="store.id">{{ store.name }}</option>
              }
            </select>
            @if (storeError() && formTouched().storeId) {
              <p class="form-error">{{ storeError() }}</p>
            }
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
            <input type="text" id="title" [(ngModel)]="form.title" name="title" required class="form-input" 
              [class.input-error]="titleError() && formTouched().title"
              placeholder="My Amazing Product" 
              (input)="onTitleChange(); validateTitle()"
              (blur)="validateTitle()"
              [attr.maxlength]="MAX_TITLE_LENGTH">
            @if (titleError() && formTouched().title) {
              <p class="form-error">{{ titleError() }}</p>
            }
            <p class="form-hint">{{ form.title.length }}/{{ MAX_TITLE_LENGTH }} characters</p>
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
            <input type="text" id="slug" [(ngModel)]="form.slug" name="slug" required class="form-input" 
              [class.input-error]="slugError() && formTouched().slug"
              placeholder="my-product" 
              pattern="[a-z0-9-]+" 
              (input)="onSlugChange(); validateSlug()"
              (blur)="validateSlug()"
              [attr.maxlength]="MAX_SLUG_LENGTH">
            @if (slugError() && formTouched().slug) {
              <p class="form-error">{{ slugError() }}</p>
            }
            <p class="form-hint">Only lowercase letters, numbers, and hyphens allowed. {{ form.slug.length }}/{{ MAX_SLUG_LENGTH }}</p>
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

          <!-- Cover Image / Thumbnail -->
          <div class="form-group">
            <app-image-upload
              imageType="thumbnail"
              label="Cover Image"
              hint="Displayed on explore, storefront, and cards"
              [imageUrl]="form.coverImageUrl"
              placeholderText="Upload product thumbnail"
              acceptHint="JPG, PNG, WebP — max 15MB, optimized to 800px"
              (imageUploaded)="onThumbnailUploaded($event)"
              (imageRemoved)="onThumbnailRemoved()"
            ></app-image-upload>
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
                <input type="number" id="price" [(ngModel)]="form.price" name="price" required min="0" step="0.01" 
                  class="form-input price-input" 
                  [class.input-error]="priceError() && formTouched().price"
                  placeholder="99.00"
                  (input)="validatePrice()"
                  (blur)="validatePrice()">
              </div>
              @if (priceError() && formTouched().price) {
                <p class="form-error">{{ priceError() }}</p>
              }
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

            @if (uploadingFiles()) {
              <p class="uploading-hint">Uploading files…</p>
            }

            @if (uploads().length > 0) {
              <ul class="file-list">
                @for (u of uploads(); track u.localId) {
                  <li class="file-item">
                    <div class="file-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span class="file-name">{{ u.file.name }}</span>
                      <span class="file-size">{{ formatFileSize(u.file.size) }}</span>
                      <span class="file-status">
                        @if (u.status === 'uploading') {
                          @if (u.progress !== null) { Uploading… {{ u.progress }}% }
                          @else { Uploading… }
                        }
                        @else if (u.status === 'failed') { Upload failed }
                        @else { Uploaded }
                      </span>
                    </div>

                    @if (u.status === 'uploading') {
                      <div class="progress-row">
                        <div class="progress-track">
                          <div
                            class="progress-fill"
                            [style.width.%]="u.progress === null ? 10 : u.progress"
                          ></div>
                        </div>
                      </div>
                    }
                    <button type="button" (click)="removeUpload(u.localId)" class="file-remove-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                }
              </ul>
            }

            @if (isEditing() && existingProductFiles().length > 0) {
              <div class="mt-4">
                <p class="form-hint">Already linked files</p>
                <ul class="file-list">
                  @for (f of existingProductFiles(); track f.id) {
                    <li class="file-item">
                      <div class="file-info">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span class="file-name">{{ f.filename }}</span>
                        <span class="file-size">{{ formatFileSize(f.size) }}</span>
                        <span class="file-status">Linked</span>
                      </div>
                      <button type="button" (click)="removeExistingLinkedFile(f.fileId)" class="file-remove-btn" aria-label="Remove linked file">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Form Actions -->
          <div class="form-actions" [class.hidden]="!canEdit()">
            <button type="button" (click)="cancel()" class="btn btn-secondary">Cancel</button>
            <button type="submit" [disabled]="saving() || !isFormValid()" class="btn btn-cta">
              @if (saving()) {
                Saving...
              } @else {
                {{ isEditing() ? 'Update Product' : 'Create Product' }}
              }
            </button>
          </div>
        </form>

        <!-- Danger Zone Skeleton -->
        @if (isEditing() && canEdit() && isLoading()) {
          <div class="danger-zone-card">
            <h2 class="danger-zone-title"><app-skeleton variant="text-lg" width="160px"></app-skeleton></h2>
            <div class="danger-zone-content">
              <div class="danger-zone-item">
                <div class="danger-zone-item-info">
                  <app-skeleton variant="text-sm" width="200px" class="mb-2"></app-skeleton>
                  <app-skeleton variant="full" height="48px" class="w-1/3 rounded-lg"></app-skeleton>
                </div>
                <app-skeleton variant="full" height="40px" width="140px" class="rounded-lg"></app-skeleton>
              </div>

              <div class="danger-zone-item">
                <div class="danger-zone-item-info">
                  <app-skeleton variant="text-sm" width="200px" class="mb-2"></app-skeleton>
                  <app-skeleton variant="full" height="48px" class="w-1/3 rounded-lg"></app-skeleton>
                </div>
                <app-skeleton variant="full" height="40px" width="140px" class="rounded-lg"></app-skeleton>
              </div>
            </div>
          </div>
        }
        <!-- Danger Zone -->
        @if (isEditing() && canEdit() && !isLoading()) {
          <div class="danger-zone-card">
            <h2 class="danger-zone-title">Danger Zone</h2>
            <div class="danger-zone-content">
              <!-- Archive Section -->
              <div class="danger-zone-item">
                <div class="danger-zone-item-info">
                  <h3 class="danger-zone-item-title">Archive this product</h3>
                  <p class="danger-zone-item-desc">Hide this product from customers. You can unarchive it later.</p>
                </div>
                <button type="button" (click)="archiveProduct()" class="btn btn-secondary danger-btn">
                  Archive
                </button>
              </div>
              
              <!-- Delete Section -->
              <div class="danger-zone-item">
                <div class="danger-zone-item-info">
                  <h3 class="danger-zone-item-title">Delete this product</h3>
                  <p class="danger-zone-item-desc">Move to Bin. The product can be restored within 30 days.</p>
                </div>
                <button type="button" (click)="deleteProduct()" class="btn btn-danger danger-btn">
                  Delete
                </button>
              </div>
            </div>
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

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: #111111;
      background: #ffffff;
      border: 2px solid #111111;
      font-family: inherit;
      cursor: text;
    }

    .form-select {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: #111111;
      background: #ffffff;
      border: 2px solid #111111;
      font-family: inherit;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23111111' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 1rem center;
      background-repeat: no-repeat;
      background-size: 1.25em 1.25em;
      padding-right: 2.5rem;
      cursor: pointer;
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

    .form-input.input-error,
    .form-select.input-error {
      border-color: #FA4B28;
      background-color: #FFF5F5;
    }

    .form-input.input-error:focus,
    .form-select.input-error:focus {
      box-shadow: 0 0 0 3px rgba(250, 75, 40, 0.2);
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

    .uploading-hint {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      color: #111111;
      opacity: 0.6;
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
      gap: 0.75rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #111111;
      min-width: 0;
      flex: 1;
      flex-wrap: wrap;
    }

    .progress-row {
      width: 100%;
      margin-top: 0.5rem;
    }

    .progress-track {
      width: 100%;
      height: 8px;
      background: #ffffff;
      border: 2px solid #111111;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #111111;
      width: 0;
      transition: width 0.15s linear;
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

    .file-status {
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

    /* Danger Zone */
    .danger-zone-card {
      background: #ffffff;
      border: 2px solid #111111;
      box-shadow: 4px 4px 0px 0px #111111;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .danger-zone-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111111;
      margin: 0;
      padding: 1.25rem 1.5rem;
      border-bottom: 2px solid #111111;
    }

    .danger-zone-content {
      padding: 0;
    }

    .danger-zone-item {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .danger-zone-item:last-child {
      border-bottom: none;
    }

    @media (min-width: 640px) {
      .danger-zone-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .danger-zone-item-info {
      flex: 1;
    }

    .danger-zone-item-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111111;
      margin: 0 0 0.25rem 0;
    }

    .danger-zone-item-desc {
      font-size: 0.875rem;
      color: #666666;
      margin: 0;
    }

    .btn-danger {
      background: #FA4B28;
      color: white;
      border: 2px solid #111111;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 2px 2px 0px 0px #111111;
    }

    .btn-danger:hover {
      background: #e53e1e;
      border-color: #e53e1e;
    }

    .btn-danger-outline {
      background: white;
      color: #111111;
      border: 2px solid #111111;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 2px 2px 0px 0px #111111;
    }

    .btn-danger-outline:hover {
      background: #FEF2F2;
    }

    /* Danger button shared size */
    .danger-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 140px;
      padding: 0.5rem 1rem;
    }

    @media (max-width: 640px) {
      .btn-danger, .btn-danger-outline, .danger-btn {
        width: 100%;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  isEditing = signal(false);
  isLoading = signal(false);
  saving = signal(false);
  stores = signal<Store[]>([]);
  uploads = signal<
    Array<{
      localId: string;
      file: File;
      status: 'uploading' | 'uploaded' | 'failed';
      progress: number | null;
      uploaded?: UploadedFileRef;
    }>
  >([]);
  existingProductFiles = signal<Array<{ id: string; fileId: string; filename: string; size: number }>>([]);
  pendingDetachedFileIds = signal<string[]>([]);
  uploadingFiles = signal(false);
  isDragOver = signal(false);
  productId: string | null = null;
  slugManuallyEdited = false;
  activeTooltip = signal<string | null>(null);
  productState = signal<{ isOwner: boolean; isDeleted: boolean; isArchived: boolean; isPublished: boolean; canEdit: boolean; canPurchase: boolean; storeIsAccessible: boolean }>({
    isOwner: true,
    isDeleted: false,
    isArchived: false,
    isPublished: false,
    canEdit: true,
    canPurchase: false,
    storeIsAccessible: true
  });
  
  // Computed property for edit access
  canEdit = () => this.productState().canEdit;
  
  // Validation error signals
  storeError = signal<string | null>(null);
  titleError = signal<string | null>(null);
  slugError = signal<string | null>(null);
  priceError = signal<string | null>(null);
  formTouched = signal({ storeId: false, title: false, slug: false, price: false });

  form = {
    storeId: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    status: 'DRAFT',
    coverImageUrl: '' as string | undefined,
  };

  // Validation constants
  readonly MIN_TITLE_LENGTH = 2;
  readonly MAX_TITLE_LENGTH = 100;
  readonly MIN_SLUG_LENGTH = 2;
  readonly MAX_SLUG_LENGTH = 50;
  readonly MAX_PRICE = 10000000; // 1 crore INR

  private toaster = inject(ToasterService);
  private confirmService = inject(ConfirmService);
  private fileUpload = inject(FileUploadService);

  private canceledUploads = new Set<string>();
  private uploadControllers = new Map<string, AbortController>();

  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.isLoading.set(true);

    // Set edit mode immediately so the header shows 'Edit Product' without waiting for stores
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId && this.productId !== 'new') {
      this.isEditing.set(true);
      this.slugManuallyEdited = true;
    }

    try {
      const stores = await this.storeService.getMyStores();
      this.stores.set(stores);

      if (this.productId && this.productId !== 'new') {
        // Fetch product as owner (includes all states) and derive state client-side
        const product = await this.productService.getProductByIdForOwner(this.productId);
        if (product) {
          this.existingProductFiles.set(
            (product.files || [])
              .filter((pf) => !!pf.file)
              .map((pf) => ({
                id: pf.id,
                fileId: pf.fileId,
                filename: pf.file.filename,
                size: pf.file.size,
              })),
          );
          this.pendingDetachedFileIds.set([]);

          this.form = {
            storeId: product.storeId,
            title: product.title,
            slug: product.slug,
            description: product.description || '',
            price: product.price / 100,
            status: product.status,
            coverImageUrl: product.coverImageUrl || undefined,
          };

          // Derive state from returned product (owner context)
          const isDeleted = !!product.deletedAt;
          const isArchived = !!product.isArchived;
          const isPublished = product.status === 'PUBLISHED';
          const storeIsAccessible = !!product.store && !product.store.deletedAt && !product.store.isArchived && product.store.status === 'PUBLISHED';

          this.productState.set({
            isOwner: true,
            isDeleted,
            isArchived,
            isPublished,
            canEdit: !isDeleted && !isArchived,
            canPurchase: isPublished && !isDeleted && !isArchived && storeIsAccessible,
            storeIsAccessible,
          });
        }
      } else {
        this.slugManuallyEdited = false;
        const storeIdFromQuery = this.route.snapshot.queryParamMap.get('storeId');
        if (storeIdFromQuery) {
          this.form.storeId = storeIdFromQuery;
        }
      }
    } catch (error) {
      this.toaster.error('Error loading product details');
      // If we can't load stores for new product or get product for edit, maybe redirect
      if (this.productId !== 'new') {
         this.router.navigate(['/dashboard/products']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      void this.addAndUploadFiles(Array.from(input.files));
      input.value = '';
    }
  }

  removeUpload(localId: string) {
    const existing = this.uploads().find((u) => u.localId === localId);
    this.canceledUploads.add(localId);

    // Abort the in-flight upload immediately (if any)
    const controller = this.uploadControllers.get(localId);
    if (controller) {
      controller.abort();
      this.uploadControllers.delete(localId);
    }

    this.uploads.set(this.uploads().filter(u => u.localId !== localId));

    const fileId = existing?.uploaded?.fileId;
    if (fileId) {
      void this.fileUpload.delete(fileId).catch(() => undefined);
    }
  }

  async removeExistingLinkedFile(fileId: string) {
    if (this.pendingDetachedFileIds().includes(fileId)) {
      return;
    }

    this.pendingDetachedFileIds.set([...this.pendingDetachedFileIds(), fileId]);
    this.existingProductFiles.set(
      this.existingProductFiles().filter((f) => f.fileId !== fileId),
    );

    this.toaster.info({
      title: 'Removal Staged',
      message: 'This file will be removed when you update the product.',
    });
  }

  onTitleChange() {
    if (!this.isEditing() && this.form.title && !this.slugManuallyEdited) {
      this.form.slug = this.generateSlug(this.form.title);
    }
  }

  onThumbnailUploaded(imageUrl: string) {
    this.form.coverImageUrl = imageUrl;
  }

  onThumbnailRemoved() {
    this.form.coverImageUrl = undefined;
    this.toaster.info({
      title: 'Removal Staged',
      message: 'Cover image removal will apply when you update the product.',
    });
  }

  onSlugChange() {
    this.slugManuallyEdited = true;
  }

  // Validation methods
  validateStore() {
    this.formTouched.update(t => ({ ...t, storeId: true }));
    if (!this.form.storeId) {
      this.storeError.set('Please select a store');
    } else {
      this.storeError.set(null);
    }
  }

  validateTitle() {
    this.formTouched.update(t => ({ ...t, title: true }));
    const title = this.form.title.trim();
    
    if (!title) {
      this.titleError.set('Product title is required');
    } else if (title.length < this.MIN_TITLE_LENGTH) {
      this.titleError.set(`Title must be at least ${this.MIN_TITLE_LENGTH} characters`);
    } else if (title.length > this.MAX_TITLE_LENGTH) {
      this.titleError.set(`Title must be less than ${this.MAX_TITLE_LENGTH} characters`);
    } else {
      this.titleError.set(null);
    }
  }

  validateSlug() {
    this.formTouched.update(t => ({ ...t, slug: true }));
    const slug = this.form.slug.toLowerCase();
    
    if (!slug) {
      this.slugError.set('Product URL is required');
    } else if (slug.length < this.MIN_SLUG_LENGTH) {
      this.slugError.set(`URL must be at least ${this.MIN_SLUG_LENGTH} characters`);
    } else if (slug.length > this.MAX_SLUG_LENGTH) {
      this.slugError.set(`URL must be less than ${this.MAX_SLUG_LENGTH} characters`);
    } else if (!/^[a-z0-9-]*$/.test(slug)) {
      this.slugError.set('Only lowercase letters, numbers, and hyphens allowed');
    } else if (slug.startsWith('-') || slug.endsWith('-')) {
      this.slugError.set('URL cannot start or end with a hyphen');
    } else if (slug.includes('--')) {
      this.slugError.set('URL cannot contain consecutive hyphens');
    } else {
      this.slugError.set(null);
    }
    // Auto-format slug
    this.form.slug = slug.replace(/[^a-z0-9-]/g, '');
  }

  validatePrice() {
    this.formTouched.update(t => ({ ...t, price: true }));
    const price = this.form.price;
    
    if (price === null || price === undefined || isNaN(price)) {
      this.priceError.set('Price is required');
    } else if (price < 0) {
      this.priceError.set('Price cannot be negative');
    } else if (price > this.MAX_PRICE) {
      this.priceError.set(`Price cannot exceed ₹${this.MAX_PRICE.toLocaleString()}`);
    } else {
      this.priceError.set(null);
    }
  }

  isFormValid(): boolean {
    return !this.storeError() && !this.titleError() && !this.slugError() && !this.priceError()
      && this.form.storeId !== ''
      && this.form.title.trim().length >= this.MIN_TITLE_LENGTH
      && this.form.slug.trim().length >= this.MIN_SLUG_LENGTH
      && this.form.price >= 0;
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
      void this.addAndUploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  private async addAndUploadFiles(files: File[]) {
    if (!files.length) return;

    const newItems = files.map((file) => ({
      localId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file,
      status: 'uploading' as const,
      progress: 0 as number,
    }));

    this.uploads.set([...this.uploads(), ...newItems]);
    this.uploadingFiles.set(true);

    try {
      for (const item of newItems) {
        if (this.canceledUploads.has(item.localId)) continue;

        try {
          const controller = new AbortController();
          this.uploadControllers.set(item.localId, controller);

          const uploaded = await this.fileUpload.upload(item.file, {
            signal: controller.signal,
            onProgress: (p) => {
              this.uploads.set(
                this.uploads().map((u) =>
                  u.localId === item.localId ? { ...u, progress: p } : u,
                ),
              );
            },
          });

          this.uploadControllers.delete(item.localId);

          if (this.canceledUploads.has(item.localId)) {
            await this.fileUpload.delete(uploaded.fileId).catch(() => undefined);
            continue;
          }

          this.uploads.set(
            this.uploads().map((u) =>
              u.localId === item.localId ? { ...u, status: 'uploaded', progress: 100, uploaded } : u,
            ),
          );
        } catch (error) {
          this.uploadControllers.delete(item.localId);
          if (this.canceledUploads.has(item.localId)) continue;

          this.uploads.set(
            this.uploads().map((u) =>
              u.localId === item.localId ? { ...u, status: 'failed', progress: null } : u,
            ),
          );

          this.toaster.handleError(error, `Failed to upload ${item.file.name}`);
        }
      }
    } finally {
      this.uploadingFiles.set(this.uploads().some((u) => u.status === 'uploading'));
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
      if (this.uploads().some((u) => u.status === 'uploading')) {
        this.toaster.error('Please wait for file uploads to finish');
        return;
      }

      if (this.uploads().some((u) => u.status === 'failed')) {
        this.toaster.error('Remove failed uploads and try again');
        return;
      }

      const data: any = {
        ...this.form,
        slug: this.form.slug.toLowerCase(), // Ensure slug is lowercase
        price: Math.round(this.form.price * 100),
        coverImageUrl: this.form.coverImageUrl || undefined,
      };

      let product: any;
      if (this.isEditing() && this.productId) {
        // Remove storeId when updating - it's not allowed in UpdateProductDto
        const { storeId, ...updateData } = data;
        product = await this.productService.updateProduct(this.productId, updateData);
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
        const uploadedFileIds = this.uploads()
          .filter((u) => u.status === 'uploaded' && !!u.uploaded?.fileId)
          .map((u) => u.uploaded!.fileId);

        for (const fileId of uploadedFileIds) {
          await this.productService.attachUploadedFile(product.id, fileId);
        }

        const detachedFileIds = this.pendingDetachedFileIds();
        for (const fileId of detachedFileIds) {
          await this.fileUpload.detachFromProduct(fileId, product.id);
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

  async archiveProduct() {
    if (!this.productId) return;
    
    const confirmed = await this.confirmService.confirm({
      title: 'Archive Product',
      message: `Are you sure you want to archive "${this.form.title}"? It will be hidden from customers but can be unarchived later.`,
      confirmText: 'Archive',
      cancelText: 'Cancel',
      accent: 'yellow',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.archiveProduct(this.productId);
      this.toaster.success({
        title: 'Product Archived',
        message: 'The product has been archived successfully.'
      });
      this.router.navigate(['/dashboard/products'], { queryParams: { tab: 'archived' } });
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.handleError(error, 'Failed to archive product');
      this.confirmService.setPending(false);
    }
  }

  async unarchiveProduct() {
    if (!this.productId) return;

    try {
      await this.productService.unarchiveProduct(this.productId);
      this.toaster.success({
        title: 'Product Unarchived',
        message: 'The product has been restored to active status.'
      });
      // Reload to get fresh state
      window.location.reload();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to unarchive product');
    }
  }

  async deleteProduct() {
    if (!this.productId) return;
    
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${this.form.title}"? It will be moved to the Bin and can be restored within 30 days.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      accent: 'danger',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.deleteProduct(this.productId);
      this.toaster.success({
        title: 'Product Deleted',
        message: 'The product has been moved to the Bin.'
      });
      this.router.navigate(['/dashboard/products'], { queryParams: { tab: 'deleted' } });
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.handleError(error, 'Failed to delete product');
      this.confirmService.setPending(false);
    }
  }

  async restoreProduct() {
    if (!this.productId) return;

    try {
      await this.productService.restoreProduct(this.productId);
      this.toaster.success({
        title: 'Product Restored',
        message: 'The product has been restored from the Bin.'
      });
      // Reload to get fresh state
      window.location.reload();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to restore product');
    }
  }
}
