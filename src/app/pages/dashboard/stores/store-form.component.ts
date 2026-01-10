import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { StoreService } from '../../../core/services/store.service';
import { ApiService } from '../../../core/services/api.service';
import { Store } from '../../../core/models/index';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
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
            <quill-editor
              #editor
              [(ngModel)]="form.description"
              name="description"
              [modules]="quillModules"
              placeholder="Tell customers about your store..."
              class="block"
              (onEditorCreated)="onEditorCreated($event)"
            ></quill-editor>
            @if (uploading()) {
              <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            }
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              class="hidden"
              [accept]="currentUploadType() === 'image' ? 'image/*' : currentUploadType() === 'video' ? 'video/*' : '*/*'"
            >
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editor') editorComponent!: QuillEditorComponent;
  
  isEditing = signal(false);
  saving = signal(false);
  uploading = signal(false);
  currentUploadType = signal<'image' | 'video' | 'file'>('image');
  storeId: string | null = null;
  
  private quillEditor: any;
  private storageBaseUrl: string = '';

  quillModules = {
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'file'],
        ['clean']
      ],
      handlers: {
        image: () => this.triggerFileUpload('image'),
        video: () => this.triggerFileUpload('video'),
        file: () => this.triggerFileUpload('file'),
      }
    }
  };

  form = {
    name: '',
    slug: '',
    description: '',
    tagline: '',
  };

  constructor(
    private storeService: StoreService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    // Fetch storage base URL
    await this.loadStorageBaseUrl();
    
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

  private async loadStorageBaseUrl() {
    try {
      const response = await this.apiService.get<{ baseUrl: string }>('/files/storage-url');
      if (response.success && response.data) {
        this.storageBaseUrl = response.data.baseUrl;
      }
    } catch (error) {
      console.error('Failed to load storage URL:', error);
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

  onEditorCreated(editor: any) {
    this.quillEditor = editor;
    
    // Add custom file button to toolbar
    const toolbar = editor.getModule('toolbar');
    const fileButton = document.querySelector('.ql-file');
    if (fileButton) {
      fileButton.innerHTML = `<svg viewBox="0 0 18 18"><path d="M9 0L7.5 1.5L9 3L7.5 4.5L6 3L4.5 4.5L6 6L4.5 7.5L3 6L1.5 7.5L3 9L0 12V18H6L9 15L10.5 16.5L12 15L13.5 16.5L15 15L16.5 16.5L18 15V9L15 12L13.5 10.5L15 9L13.5 7.5L12 9L10.5 7.5L12 6L10.5 4.5L9 6L7.5 4.5L9 3L7.5 1.5L9 0Z" fill="currentColor"/></svg>`;
    }
  }

  triggerFileUpload(type: 'image' | 'video' | 'file') {
    this.currentUploadType.set(type);
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    }, 0);
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    try {
      // Get presigned upload URL
      const response = await this.apiService.getUploadUrl(file.name, file.type, file.size);
      if (!response.success || !response.data) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, storageKey, fileId } = response.data;

      // Upload file to S3
      const uploaded = await this.apiService.uploadToS3(uploadUrl, file);
      if (!uploaded) {
        throw new Error('Failed to upload file');
      }

      // Confirm upload
      await this.apiService.post(`/files/${fileId}/confirm`, {});

      // Get the public URL for the file
      const fileUrl = this.getPublicUrl(storageKey);

      // Insert into editor based on type
      this.insertMedia(fileUrl, file.name, file.type);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      this.uploading.set(false);
      input.value = ''; // Reset input
    }
  }

  private getPublicUrl(storageKey: string): string {
    // Constructs the S3/MinIO public URL from the storage base URL
    return `${this.storageBaseUrl}/${storageKey}`;
  }

  private insertMedia(url: string, filename: string, mimeType: string) {
    if (!this.quillEditor) return;

    const range = this.quillEditor.getSelection(true);
    const index = range ? range.index : this.quillEditor.getLength();

    if (mimeType.startsWith('image/')) {
      this.quillEditor.insertEmbed(index, 'image', url, 'user');
    } else if (mimeType.startsWith('video/')) {
      this.quillEditor.insertEmbed(index, 'video', url, 'user');
    } else {
      // For other files, insert as a link
      const linkText = `📎 ${filename}`;
      this.quillEditor.insertText(index, linkText, 'link', url, 'user');
    }

    // Move cursor after inserted content
    this.quillEditor.setSelection(index + 1, 0, 'user');
  }
}
