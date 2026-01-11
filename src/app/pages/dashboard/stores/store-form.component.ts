import { Component, OnInit, signal } from '@angular/core';
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
        <div class="max-w-3xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-gray-900">
            {{ isEditing() ? 'Edit Store' : 'Create Store' }}
          </h1>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 py-8">
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
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
            <div class="flex items-center">
              <span class="text-gray-500 mr-2">yoursite.com/</span>
              <input
                type="text"
                id="slug"
                [(ngModel)]="form.slug"
                name="slug"
                required
                class="input flex-1"
                placeholder="my-store"
                pattern="[a-z0-9-]+"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <app-rich-text-editor
              [(ngModel)]="form.description"
              name="description"
              placeholder="Tell customers about your store..."
            ></app-rich-text-editor>
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

          <div class="flex justify-end gap-4 pt-4">
            <button type="button" (click)="cancel()" class="btn-outline">Cancel</button>
            <button type="submit" [disabled]="saving()" class="btn-primary">
              {{ saving() ? 'Saving...' : (isEditing() ? 'Update Store' : 'Create Store') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class StoreFormComponent implements OnInit {
  isEditing = signal(false);
  saving = signal(false);
  storeId: string | null = null;

  form = {
    name: '',
    slug: '',
    description: '',
    tagline: '',
  };

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('id');
    if (this.storeId && this.storeId !== 'new') {
      this.isEditing.set(true);
      const store = await this.storeService.getStore(this.storeId);
      this.form = {
        name: store.name,
        slug: store.slug,
        description: store.description || '',
        tagline: store.tagline || '',
      };
    }
  }

  async save() {
    this.saving.set(true);
    try {
      if (this.isEditing() && this.storeId) {
        await this.storeService.updateStore(this.storeId, this.form);
      } else {
        await this.storeService.createStore(this.form);
      }
      this.router.navigate(['/dashboard/stores']);
    } catch (error) {
      console.error('Failed to save store:', error);
      alert('Failed to save store. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/stores']);
  }
}
