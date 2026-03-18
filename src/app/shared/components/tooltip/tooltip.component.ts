import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  template: `
    <span class="tooltip-anchor" [class.tooltip-disabled]="disabled()">
      <ng-content></ng-content>
      @if (!disabled()) {
        <span class="tooltip-bubble" [class.tooltip-top]="placement() === 'top'" [class.tooltip-bottom]="placement() === 'bottom'">
          {{ text() }}
        </span>
      }
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .tooltip-anchor {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .tooltip-bubble {
      position: absolute;
      left: 50%;
      background: var(--foreground);
      color: var(--background);
      border: 2px solid var(--text-black, var(--foreground));
      border-radius: 8px;
      padding: 4px 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.6875rem;
      font-weight: 700;
      white-space: nowrap;
      line-height: 1;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
      z-index: 80;
    }

    .tooltip-top {
      bottom: calc(100% + 8px);
      transform: translateX(-50%) translateY(4px);
    }

    .tooltip-bottom {
      top: calc(100% + 8px);
      transform: translateX(-50%) translateY(-4px);
    }

    /* Only show tooltip on hover; do not keep it visible after click (focus doesn't keep it open) */
    .tooltip-anchor:hover .tooltip-bubble {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .tooltip-disabled .tooltip-bubble {
      display: none;
    }
  `],
})
export class TooltipComponent {
  text = input.required<string>();
  placement = input<'top' | 'bottom'>('bottom');
  disabled = input(false);
}