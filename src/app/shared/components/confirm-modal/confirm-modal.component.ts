import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" (click)="onCancel()">
        <!-- Modal -->
        <div class="bg-white w-full sm:max-w-md border-2 border-black shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto safe-area-bottom" (click)="$event.stopPropagation()" [ngStyle]="{'background-color': accent() === 'yellow' ? '#FFC60B' : (accent() === 'danger' ? '#ffffff' : '#ffffff')}">
          <!-- Mobile drag handle -->
          <div class="sm:hidden flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-5 border-b border-black/10">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-dm-sans font-extrabold text-[#111111]">{{ title() }}</h2>
              <button (click)="onCancel()" class="w-8 h-8 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all" [ngStyle]="{'background-color': accent() === 'yellow' ? '#FFC60B' : '#ffffff'}">
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-[#111111]/70 mt-1 font-semibold">{{ message() }}</p>
          </div>

          <!-- Actions -->
          <div class="p-6 space-y-3">
            <div class="flex gap-3">
              <button (click)="onCancel()" [class]="accent() === 'yellow' ? 'flex-1 py-3 bg-white text-[#111111] border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all' : 'flex-1 py-3 bg-white text-[#111111] border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all'">{{ cancelText() }}</button>
              <button (click)="onConfirm()" [class]="confirmClass() ? confirmClass() : (confirmColor() === 'yellow' ? 'flex-1 py-3 bg-[#FFC60B] text-[#111111] border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all' : (confirmColor() === 'danger' ? 'flex-1 py-3 bg-[#dc2626] text-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all' : 'flex-1 py-3 bg-[#111111] text-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all'))">{{ confirmText() }}</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  private confirm = inject(ConfirmService);

  isOpen = signal(false);
  title = signal('Are you sure?');
  message = signal('Are you sure you want to continue?');
  confirmText = signal('Yes');
  cancelText = signal('Cancel');
  // accent: 'default' | 'danger' | 'yellow' | custom string
  accent = signal<'default' | 'danger' | 'yellow' | string>('default');
  // confirmColor lets confirm button color differ from modal accent
  confirmColor = signal<'default' | 'danger' | 'yellow' | string>('default');
  confirmClass = signal<string | null>(null);

  private currentResolve?: (value: boolean) => void;

  constructor() {
    // Register handler with service
    this.confirm._setHandler(({ options, resolve }) => {
      this.title.set(options.title || 'Are you sure?');
      this.message.set(options.message || 'Are you sure you want to continue?');
      this.confirmText.set(options.confirmText || 'Yes');
      this.cancelText.set(options.cancelText || 'Cancel');
      this.accent.set(options.accent || 'default');
      this.confirmClass.set(options.confirmClass || null);
      this.confirmColor.set(options.confirmColor || options.accent || 'default');
      this.currentResolve = resolve;
      this.open();
    });
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.currentResolve = undefined;
  }

  onConfirm() {
    if (this.currentResolve) this.currentResolve(true);
    this.close();
  }

  onCancel() {
    if (this.currentResolve) this.currentResolve(false);
    this.close();
  }

  // Close on Escape key
  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.onCancel();
  }
}
