import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Masonry Grid Component
 *
 * Pinterest-style masonry layout that distributes items into columns
 * based on the shortest column height. Uses CSS for positioning
 * and JavaScript for column assignment.
 *
 * Features:
 * - Responsive column count (configurable breakpoints)
 * - Items distributed to shortest column to minimize gaps
 * - Smooth transitions on layout changes
 * - Works with any content via ng-template
 * - Aspect ratio-driven height estimation for pre-layout
 * - Neo-brutalist design consistent with app theme
 */
@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="masonry-grid" [ngClass]="gridClass">
      <div
        *ngFor="let column of columns; let colIdx = index"
        class="masonry-column flex flex-col"
        [style.gap]="gap + 'px'"
      >
        <div
          *ngFor="let item of column; trackBy: trackByFn"
          class="masonry-item"
        >
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: getOriginalIndex(item) }"
          ></ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .masonry-grid {
      display: flex;
      width: 100%;
    }

    .masonry-column {
      flex: 1;
      min-width: 0;
    }

    .masonry-item {
      break-inside: avoid;
    }
  `]
})
export class MasonryGridComponent<T = any> implements OnInit, OnChanges, OnDestroy {
  /** Array of items to display */
  @Input() items: T[] = [];

  /** Gap between items in pixels */
  @Input() gap = 16;

  /** Number of columns at mobile (<640px) */
  @Input() colsMobile = 2;

  /** Number of columns at tablet (640px-1023px) */
  @Input() colsTablet = 3;

  /** Number of columns at desktop (>=1024px) */
  @Input() colsDesktop = 4;

  /** Number of columns at large desktop (>=1280px) */
  @Input() colsLargeDesktop = 5;

  /** Function to extract aspect ratio (width/height) from item for height estimation */
  @Input() getItemRatio?: (item: T) => number;

  /** Custom trackBy key extractor */
  @Input() trackBy?: (item: T) => any;

  /** Additional CSS classes for the grid container */
  @Input() gridClass = '';

  /** Template for rendering each item */
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  columns: T[][] = [];
  private currentCols = 0;
  private resizeTimeout?: any;
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.currentCols = this.getColumnCount();
    this.distributeItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['colsMobile'] || changes['colsTablet'] || changes['colsDesktop'] || changes['colsLargeDesktop']) {
      this.currentCols = this.getColumnCount();
      this.distributeItems();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      const newCols = this.getColumnCount();
      if (newCols !== this.currentCols) {
        this.currentCols = newCols;
        this.distributeItems();
      }
    }, 150);
  }

  trackByFn = (_index: number, item: T): any => {
    if (this.trackBy) {
      return this.trackBy(item);
    }
    return (item as any)?.id ?? _index;
  };

  getOriginalIndex(item: T): number {
    return this.items.indexOf(item);
  }

  /**
   * Get responsive column count based on window width
   */
  private getColumnCount(): number {
    if (typeof window === 'undefined') return this.colsDesktop;

    const width = window.innerWidth;
    if (width >= 1280) return this.colsLargeDesktop;
    if (width >= 1024) return this.colsDesktop;
    if (width >= 640) return this.colsTablet;
    return this.colsMobile;
  }

  /**
   * Distribute items into columns using shortest-column-first algorithm.
   * Uses aspect ratio estimation when available for better pre-layout.
   */
  private distributeItems(): void {
    const cols = this.currentCols;
    const columns: T[][] = Array.from({ length: cols }, () => []);
    const columnHeights: number[] = new Array(cols).fill(0);

    for (const item of this.items) {
      // Find shortest column
      let shortestIdx = 0;
      let shortestHeight = columnHeights[0];
      for (let i = 1; i < cols; i++) {
        if (columnHeights[i] < shortestHeight) {
          shortestHeight = columnHeights[i];
          shortestIdx = i;
        }
      }

      columns[shortestIdx].push(item);

      // Estimate height for this item
      if (this.getItemRatio) {
        const ratio = this.getItemRatio(item);
        // Ratio = width/height, so estimated height = 1/ratio (normalized)
        columnHeights[shortestIdx] += ratio > 0 ? 1 / ratio : 1;
      } else {
        // Without aspect ratio info, assume equal heights
        columnHeights[shortestIdx] += 1;
      }
    }

    this.columns = columns;
    this.cdr.markForCheck();
  }
}
