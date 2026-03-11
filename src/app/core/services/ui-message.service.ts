import { inject, Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { UiMessage, UiMessagesResponse } from '../models';

/**
 * UiMessageService
 *
 * Fetches UI messages from the backend for a given page context and
 * exposes them as reactive signals. The frontend should call
 * `loadMessages(context)` once per page and render the returned
 * messages by placement.
 */
@Injectable({
  providedIn: 'root',
})
export class UiMessageService {
  private readonly api = inject(ApiService);

  /** All messages returned for the current context */
  private readonly _messages = signal<UiMessage[]>([]);

  /** Whether a request is in-flight */
  private readonly _loading = signal(false);

  /** Tracks which context is currently loaded (for dedup) */
  private _currentContext: string | null = null;

  // ─── Public Signals ───────────────────────────────────────────────────

  /** All messages for the current context */
  readonly messages = this._messages.asReadonly();

  /** Loading state */
  readonly loading = this._loading.asReadonly();

  // ─── Filtered by Placement (computed) ─────────────────────────────────

  /** Helper: get messages for a specific placement */
  byPlacement(placement: string): UiMessage[] {
    return this._messages().filter((m) => m.placement === placement);
  }

  /** Top banner messages */
  readonly topBanners = computed(() => this.byPlacement('top-banner'));

  /** Homepage card messages */
  readonly homepageCards = computed(() => this.byPlacement('homepage-card'));

  /** Modal messages */
  readonly modals = computed(() => this.byPlacement('modal'));

  /** Footer banner messages */
  readonly footerBanners = computed(() => this.byPlacement('footer-banner'));

  /** Toast messages */
  readonly toasts = computed(() => this.byPlacement('toast'));

  /** Inline tip messages */
  readonly inlineTips = computed(() => this.byPlacement('inline-tip'));

  // ─── Methods ──────────────────────────────────────────────────────────

  /**
   * Fetch messages for a page context from the backend.
   * Results are stored in the reactive `messages` signal.
   *
   * @param context Page context string (e.g. 'homepage', 'dashboard')
   * @param force   Bypass dedup check and re-fetch
   */
  async loadMessages(context: string, force = false): Promise<void> {
    // Skip if already loaded for this context (unless forced)
    if (!force && this._currentContext === context) {
      return;
    }

    this._loading.set(true);
    this._currentContext = context;

    try {
      const response = await this.api.get<UiMessagesResponse>(
        `/ui/messages?context=${encodeURIComponent(context)}`,
      );

      if (response.success && response.data) {
        this._messages.set(response.data.messages);
      } else {
        this._messages.set([]);
      }
    } catch (err) {
      console.error('Failed to load UI messages:', err);
      this._messages.set([]);
      this._currentContext = null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Dismiss a message for the current user.
   * Removes it from the local state immediately and notifies the backend.
   */
  async dismiss(messageId: string): Promise<void> {
    // Optimistic removal from local state
    this._messages.update((msgs) => msgs.filter((m) => m.id !== messageId));

    try {
      await this.api.post(`/ui/messages/${messageId}/dismiss`, {}, { skipAuthErrorHandling: true });
    } catch (err) {
      console.error('Failed to dismiss UI message:', err);
      // The message is already removed from UI — acceptable degradation
    }
  }

  /**
   * Clear all messages (useful on navigation or context change).
   */
  clear(): void {
    this._messages.set([]);
    this._currentContext = null;
  }
}
