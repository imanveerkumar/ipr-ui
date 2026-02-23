import { Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase-details-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        (click)="closeModal()"
      >
        <!-- Modal -->
        <div 
          class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden max-h-[90vh] overflow-y-auto safe-area-bottom"
          (click)="$event.stopPropagation()"
        >
          <!-- Mobile drag handle -->
          <div class="sm:hidden flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-5 border-b-2 border-black bg-[#F9F4EB]">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-[#111111]">
                Purchase Details
              </h2>
              <button 
                (click)="closeModal()"
                class="w-8 h-8 flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all rounded-lg"
              >
                <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            @if (purchase()) {
              <div class="space-y-6">
                <!-- Product Info -->
                <div class="flex gap-4 items-start">
                  <div class="w-24 h-24 shrink-0 bg-[#F9F4EB] border-2 border-black rounded-xl overflow-hidden">
                    @if (purchase()?.product?.thumbnailUrl || purchase()?.product?.coverImageUrl) {
                      <img 
                        [src]="purchase()?.product?.thumbnailUrl || purchase()?.product?.coverImageUrl" 
                        [alt]="purchase()?.product?.title" 
                        class="w-full h-full object-cover"
                      />
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <a [routerLink]="['/product', purchase()?.product?.slug || purchase()?.product?.id]" class="font-bold text-lg text-[#111111] hover:underline line-clamp-2 mb-1">
                      {{ purchase()?.product?.title }}
                    </a>
                    <div class="flex items-center gap-1.5 mb-2">
                      <span class="text-sm text-[#111111]/60 font-medium">by</span>
                      <a [routerLink]="['/store', purchase()?.product?.store?.slug || purchase()?.product?.store?.id]" class="text-sm font-bold text-[#111111] hover:underline truncate">
                        {{ purchase()?.product?.store?.name }}
                      </a>
                    </div>
                    <div class="inline-flex items-center px-2 py-1 bg-[#F9F4EB] rounded border border-black/10 max-w-full">
                      <svg class="w-3 h-3 text-[#111111]/40 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                      </svg>
                      <code class="text-xs font-mono text-[#111111]/80 truncate select-all">
                        {{ purchase()?.licenseKey }}
                      </code>
                    </div>
                  </div>
                </div>

                <!-- Key Information -->
                <div class="bg-[#F9F4EB] border-2 border-black rounded-xl p-4">
                  <h3 class="font-bold text-[#111111] mb-3 text-sm uppercase tracking-wider">Order Details</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-[#111111]/60 font-medium mb-1">Date</p>
                      <p class="text-sm font-bold text-[#111111]">{{ purchase()?.createdAt | date:'mediumDate' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-[#111111]/60 font-medium mb-1">Amount</p>
                      <p class="text-sm font-bold text-[#111111]">
                        {{ (purchase()?.order?.totalAmount || 0) / 100 | currency:(purchase()?.order?.currency || 'INR') }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-[#111111]/60 font-medium mb-1">Order ID</p>
                      <p class="text-sm font-mono text-[#111111]">{{ purchase()?.order?.id || purchase()?.orderId }}</p>
                    </div>
                  </div>
                </div>

                <!-- Downloads -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-[#111111] text-sm uppercase tracking-wider">Files</h3>
                    <span class="text-xs font-medium" [class.text-[#FA4B28]]="purchase()?.downloadCount >= purchase()?.maxDownloads" [class.text-[#68E079]]="purchase()?.downloadCount < purchase()?.maxDownloads">
                      {{ purchase()?.downloadCount }} / {{ purchase()?.maxDownloads }} downloads used
                    </span>
                  </div>

                  @if (purchase()?.product?.files && purchase()?.product?.files?.length > 0) {
                    <div class="space-y-2">
                      @for (file of purchase()?.product?.files; track file.id || file.fileId) {
                        <button 
                          (click)="onDownload(file.id || file.fileId)"
                          [disabled]="downloading() === (file.id || file.fileId) || purchase()?.downloadCount >= purchase()?.maxDownloads"
                          class="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-black rounded-xl hover:bg-[#F9F4EB] active:bg-[#F0EBE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                          <div class="flex items-center min-w-0 mr-3">
                            <svg class="w-5 h-5 text-[#111111]/40 mr-3 shrink-0 group-hover/btn:text-[#111111] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span class="text-sm font-bold text-[#111111] truncate text-left">
                              {{ file.filename || file.file?.filename }}
                            </span>
                          </div>

                          @if (downloading() === (file.id || file.fileId)) {
                            <svg class="w-5 h-5 animate-spin text-[#111111]" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5 text-[#111111] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                          }
                        </button>
                      }
                    </div>
                  } @else {
                     <div class="text-sm text-[#111111]/50 italic text-center py-4 border-2 border-dashed border-black/20 rounded-xl">
                       No files available
                     </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class PurchaseDetailsModalComponent {
  isOpen = signal(false);
  purchase = signal<any>(null);
  downloading = signal<string | null>(null);

  @Output() download = new EventEmitter<{purchase: any, fileId: string}>();

  open(purchaseData: any) {
    this.purchase.set(purchaseData);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isOpen.set(false);
    this.purchase.set(null);
    document.body.style.overflow = '';
  }

  setDownloading(fileId: string | null) {
    this.downloading.set(fileId);
  }

  onDownload(fileId: string) {
    if (this.purchase() && this.purchase().downloadCount < this.purchase().maxDownloads) {
      this.download.emit({ purchase: this.purchase(), fileId });
    }
  }
}
