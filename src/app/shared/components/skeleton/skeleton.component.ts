import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton component for loading placeholders
 * Provides consistent skeleton loading states across the app
 * Mobile-first approach with responsive sizing
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
      [class]="customClass"
      [ngClass]="{
        'h-4 w-16': variant === 'text-sm',
        'h-5 w-20': variant === 'text-md',
        'h-6 w-24 md:h-7 md:w-28': variant === 'text-lg',
        'h-8 w-12 md:h-10 md:w-16': variant === 'stat-value',
        'h-3 w-10 md:h-4 md:w-14': variant === 'stat-label',
        'h-6 w-6 md:h-8 md:h-8': variant === 'icon',
        'aspect-square': variant === 'image',
        'h-full w-full': variant === 'full',
        'rounded-full': rounded
      }"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .animate-pulse {
      animation: shimmer 1.5s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: 'text-sm' | 'text-md' | 'text-lg' | 'stat-value' | 'stat-label' | 'icon' | 'image' | 'full' = 'text-md';
  @Input() width?: string;
  @Input() height?: string;
  @Input() rounded = false;
  @Input() customClass = '';
}

/**
 * Stat skeleton component specifically for stat cards in hero sections
 * Maintains consistent layout during API loading
 */
@Component({
  selector: 'app-stat-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
      <!-- Icon skeleton -->
      <div 
        class="w-6 h-6 md:w-8 md:h-8 rounded-lg animate-pulse"
        [style.background-color]="iconBgColor"
      ></div>
      <div class="text-center md:text-left">
        <!-- Value skeleton -->
        <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
        <!-- Label skeleton -->
        <div class="h-2.5 md:h-3 w-12 md:w-16 bg-[#111111]/5 rounded animate-pulse"></div>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `]
})
export class StatSkeletonComponent {
  @Input() iconBgColor = '#E5E7EB';
}

/**
 * Stats row skeleton for hero sections
 * Shows 3 skeleton stat items matching the app's design
 */
@Component({
  selector: 'app-stats-skeleton',
  standalone: true,
  imports: [CommonModule, StatSkeletonComponent],
  template: `
    <div class="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-8">
      <app-stat-skeleton [iconBgColor]="colors[0]"></app-stat-skeleton>
      <app-stat-skeleton [iconBgColor]="colors[1]"></app-stat-skeleton>
      <app-stat-skeleton [iconBgColor]="colors[2]"></app-stat-skeleton>
    </div>
  `
})
export class StatsSkeletonComponent {
  @Input() colors: string[] = ['#68E079', '#FA4B28', '#2B57D6'];
}
