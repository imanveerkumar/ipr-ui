import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, signal, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rich-text-editor-wrapper">
      <quill-editor
        #editor
        [(ngModel)]="value"
        [modules]="quillModules"
        [placeholder]="placeholder"
        class="block"
        (onEditorCreated)="onEditorCreated($event)"
        (ngModelChange)="onValueChange($event)"
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
  `,
  styles: [`
    :host {
      display: block;
    }

    ::ng-deep .ql-container {
      min-height: 200px;
      font-family: inherit;
    }

    ::ng-deep .ql-editor {
      min-height: 200px;
    }
  `],
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Enter text...';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editor') editorComponent!: QuillEditorComponent;

  uploading = signal(false);
  currentUploadType = signal<'image' | 'video' | 'file'>('image');
  
  private quillEditor: any;
  private storageBaseUrl: string = '';
  
  value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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

  constructor(private apiService: ApiService) {
    this.loadStorageBaseUrl();
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

  onValueChange(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
