import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Adaptive Image Component
 * 
 * Renders images with their natural aspect ratio using pre-computed dimensions
 * from the backend, eliminating CLS (Cumulative Layout Shift).
 * 
 * Features:
 * - Pre-allocated space using width/height from backend
 * - Lazy loading via IntersectionObserver
 * - Smooth fade-in transition on load
 * - Fallback placeholder when no image or dimensions available
 * - Neo-brutalist styling consistent with app design system
 */
@Component({
  selector: 'app-adaptive-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="adaptive-image-wrapper relative overflow-hidden bg-[#F9F4EB]"
      [ngClass]="wrapperClass"
      [style.aspect-ratio]="computedAspectRatio"
      [style.max-height]="maxHeight ? maxHeight + 'px' : null"
    >
      <!-- Skeleton placeholder -->
      <div
        *ngIf="!loaded() && !hasError()"
        class="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
        [class.rounded-lg]="rounded"
      ></div>

      <!-- Fallback placeholder when no image -->
      <div
        *ngIf="!src || hasError()"
        class="absolute inset-0 flex items-center justify-center bg-[#F9F4EB]"
        [class.rounded-lg]="rounded"
      >
        <svg class="w-8 h-8 md:w-12 md:h-12 text-[#111111]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>

      <!-- Actual image -->
      <img
        *ngIf="src && !hasError()"
        #imageEl
        [src]="shouldLoad() ? src : ''"
        [alt]="alt"
        [class]="'absolute inset-0 w-full h-full transition-opacity duration-300 ' + (objectFit === 'cover' ? 'object-cover' : 'object-contain')"
        [class.opacity-0]="!loaded()"
        [class.opacity-100]="loaded()"
        [class.rounded-lg]="rounded"
        (load)="onImageLoad()"
        (error)="onImageError()"
        decoding="async"
      />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .adaptive-image-wrapper {
      width: 100%;
    }

    .animate-pulse {
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class AdaptiveImageComponent implements OnChanges, AfterViewInit, OnDestroy {
  /** Image source URL */
  @Input() src?: string | null;

  /** Alt text for accessibility */
  @Input() alt = '';

  /** Pre-computed width from backend */
  @Input() width?: number | null;

  /** Pre-computed height from backend */
  @Input() height?: number | null;

  /** Fallback aspect ratio when no dimensions available (e.g., '4/3', '1/1', '16/9') */
  @Input() fallbackRatio = '4/3';

  /** CSS object-fit mode */
  @Input() objectFit: 'cover' | 'contain' = 'cover';

  /** Maximum height in pixels to cap tall images */
  @Input() maxHeight?: number;

  /** Apply rounded corners */
  @Input() rounded = false;

  /** Additional CSS classes for the wrapper */
  @Input() wrapperClass = '';

  /** Lazy loading root margin (px before viewport to start loading) */
  @Input() rootMargin = '200px';

  /** Emit when image successfully loads */
  @Output() imageLoaded = new EventEmitter<void>();

  /** Emit when image fails to load */
  @Output() imageError = new EventEmitter<void>();

  @ViewChild('imageEl') imageEl?: ElementRef<HTMLImageElement>;

  loaded = signal(false);
  hasError = signal(false);
  shouldLoad = signal(false);

  private observer?: IntersectionObserver;
  private hostEl?: Element;

  constructor(private elementRef: ElementRef) {}

  get computedAspectRatio(): string {
    if (this.width && this.height && this.width > 0 && this.height > 0) {
      return `${this.width} / ${this.height}`;
    }
    return this.fallbackRatio;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] && changes['src'].currentValue !== changes['src'].previousValue) {
      this.loaded.set(false);
      this.hasError.set(false);
      // If observer already fired, force a reload cycle by toggling shouldLoad
      if (this.shouldLoad()) {
        this.shouldLoad.set(false);
        // Microtask ensures the template sees false before setting back to true,
        // so the [src] binding re-evaluates and the browser fetches the new URL.
        queueMicrotask(() => this.shouldLoad.set(true));
      }
    }
  }

  ngAfterViewInit(): void {
    this.hostEl = this.elementRef.nativeElement;
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  onImageLoad(): void {
    this.loaded.set(true);
    this.imageLoaded.emit();
  }

  onImageError(): void {
    this.hasError.set(true);
    this.loaded.set(false);
    this.imageError.emit();
  }

  private setupIntersectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined' || !this.hostEl) {
      // Fallback: load immediately if IntersectionObserver not available
      this.shouldLoad.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.shouldLoad.set(true);
            this.observer?.disconnect();
          }
        });
      },
      {
        rootMargin: this.rootMargin,
        threshold: 0,
      }
    );

    this.observer.observe(this.hostEl);
  }
}
