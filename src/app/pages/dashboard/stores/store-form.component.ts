import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';
import { RichTextEditorComponent } from '../../../shared/components';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-3xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 class="text-2xl font-display font-bold text-gray-900">
            {{ isEditing() ? 'Edit Store' : 'Create Store' }}
          </h1>
          
          @if (isEditing() && store()) {
            <div class="flex items-center gap-4">
              <!-- Status Badge -->
              <span 
                class="px-3 py-1 text-sm font-medium rounded-full"
                [class]="store()?.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'"
              >
                {{ store()?.status }}
              </span>
              
              <!-- Publish/Unpublish Button -->
              @if (store()?.status === 'PUBLISHED') {
                <button 
                  (click)="unpublish()" 
                  [disabled]="publishing()"
                  class="btn-outline text-sm"
                >
                  {{ publishing() ? 'Updating...' : 'Unpublish' }}
                </button>
              } @else {
                <button 
                  (click)="publish()" 
                  [disabled]="publishing()"
                  class="btn-primary text-sm"
                >
                  {{ publishing() ? 'Publishing...' : 'Publish Store' }}
                </button>
              }
            </div>
          }
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 py-8">
        <!-- Store URL Card (when editing and published) -->
        @if (isEditing() && store()?.status === 'PUBLISHED') {
          <div class="card p-4 mb-6 bg-green-50 border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-700 font-medium">Your store is live!</p>
                <a 
                  [href]="storeService.getStoreUrl(store()!)" 
                  target="_blank"
                  class="text-green-600 hover:text-green-800 font-semibold flex items-center gap-1"
                >
                  {{ store()?.slug }}.yoursite.com
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
              <button 
                (click)="copyStoreUrl()" 
                class="btn-outline text-sm"
              >
                {{ copied() ? 'Copied!' : 'Copy URL' }}
              </button>
            </div>
          </div>
        }

        <form (ngSubmit)="save()" class="card p-6 space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="form.name"
              name="name"
              required
              class="input"
              placeholder="My Awesome Store"
            >
          </div>

          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Store URL (Subdomain)</label>
            <div class="flex items-center">
              <input
                type="text"
                id="slug"
                [(ngModel)]="form.slug"
                name="slug"
                required
                class="input flex-1 rounded-r-none"
                placeholder="my-store"
                pattern="[a-z0-9-]+"
                (input)="validateSlug()"
              >
              <span class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-500">
                .yoursite.com
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens. This will be your store's subdomain.
            </p>
            @if (slugError()) {
              <p class="text-xs text-red-500 mt-1">{{ slugError() }}</p>
            }
          </div>

          <div>
            <label for="tagline" class="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              id="tagline"
              [(ngModel)]="form.tagline"
              name="tagline"
              class="input"
              placeholder="A short catchy phrase"
            >
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <app-rich-text-editor
              [(ngModel)]="form.description"
              name="description"
              placeholder="Tell customers about your store..."
            ></app-rich-text-editor>
          </div>

          <div class="flex justify-end gap-4 pt-4">
            <button type="button" (click)="cancel()" class="btn-outline">Cancel</button>
            <button type="submit" [disabled]="saving() || !!slugError()" class="btn-primary">
              {{ saving() ? 'Saving...' : (isEditing() ? 'Update Store' : 'Create Store') }}
            </button>
          </div>
        </form>

        <!-- Danger Zone (when editing) -->
        @if (isEditing()) {
          <div class="card p-6 mt-6 border-red-200">
            <h3 class="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p class="text-sm text-gray-600 mb-4">
              Deleting your store will remove all products and cannot be undone.
            </p>
            <button 
              (click)="deleteStore()" 
              [disabled]="deleting()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {{ deleting() ? 'Deleting...' : 'Delete Store' }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
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

  cancel() {
    this.router.navigate(['/dashboard/stores']);
  }
}
