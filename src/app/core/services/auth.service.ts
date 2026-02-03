import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';
import { environment } from '../../../environments/environment';
import { User } from '../models';
import { ApiService } from './api.service';
import { GlobalLoaderService } from './global-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clerk: Clerk | null = null;
  private postAuthRedirectUrl: string | null = null;
  private readonly postAuthStorageKey = 'post_auth_redirect_url';
  
  // Signals for reactive state
  private _isLoaded = signal(false);
  private _isSignedIn = signal(false);
  private _user = signal<User | null>(null);
  private _clerkUser = signal<any>(null);

  // Public computed signals
  readonly isLoaded = computed(() => this._isLoaded());
  readonly isSignedIn = computed(() => this._isSignedIn());
  readonly user = computed(() => this._user());
  readonly clerkUser = computed(() => this._clerkUser());
  readonly isCreator = computed(() => {
    const user = this._user();
    return user?.role === 'CREATOR' || user?.role === 'ADMIN';
  });
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

  private globalLoader = inject(GlobalLoaderService);

  constructor(private apiService: ApiService, private router: Router) {}

  init() {
    this.initClerk();
    // Set token getter for API service
    this.apiService.setTokenGetter(() => this.getToken());
    // Set sign out handler for automatic logout on auth failures
    this.apiService.setSignOutHandler(() => this.signOut());
  }

  private async initClerk() {
    try {
      this.clerk = new Clerk(environment.clerkPublishableKey);
      await this.clerk.load({
        // Use custom router functions to prevent page reloads
        routerPush: (to: string) => {
          // Don't navigate - just stay on current page
          // The auth listener will handle the state update
          return Promise.resolve();
        },
        routerReplace: (to: string) => {
          // Don't navigate - just stay on current page
          return Promise.resolve();
        },
      });
      
      this._isLoaded.set(true);
      
      if (this.clerk.user) {
        // User is already signed in on page load
        this._clerkUser.set(this.clerk.user);
        this._isSignedIn.set(true);
        await this.fetchCurrentUser();
        this.handlePostAuthRedirect();
      }

      // Listen for auth changes - only fetch user on actual auth state changes
      let previousUserId = this.clerk.user?.id;
      
      this.clerk.addListener(async (event) => {
        const currentUserId = event.user?.id;
        
        // Only update if user actually changed (sign in/out)
        if (currentUserId !== previousUserId) {
          previousUserId = currentUserId;
          
          if (event.user) {
            // User just signed in - show loader
            this.globalLoader.show('Signing in...');
            
            this._clerkUser.set(event.user);
            this._isSignedIn.set(true);
            await this.fetchCurrentUser();
            this.handlePostAuthRedirect();
            
            // Hide loader after a brief delay
            setTimeout(() => {
              this.globalLoader.hide();
            }, 500);
          } else {
            this._clerkUser.set(null);
            this._isSignedIn.set(false);
            this._user.set(null);

            // If the user signs out from another tab or session, redirect to home
            try {
              this.router.navigateByUrl('/', { replaceUrl: true });
            } catch (err) {
              // ignore navigation failures
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize Clerk:', error);
      this._isLoaded.set(true);
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.clerk?.session) {
      console.warn('⚠️ No Clerk session available');
      return null;
    }
    try {
      // Get the session token - this is what the backend expects
      const token = await this.clerk.session.getToken();
      return token;
    } catch (error) {
      console.error('❌ Failed to get token - session may have expired:', error);
      // Session token retrieval failed - likely expired
      // The session listener should handle this, but we can also check
      if (!this.clerk?.user) {
        console.warn('🚪 User session expired - clearing state');
        this._clerkUser.set(null);
        this._isSignedIn.set(false);
        this._user.set(null);
      }
      return null;
    }
  }

  async signIn() {
    if (!this.clerk) return;
    // Open sign-in modal - custom router prevents redirects
    await this.clerk.openSignIn();
  }

  async openCreatorSignup() {
    this.setPostAuthRedirect('/become-creator');
    await this.signUp();
  }

  async signUp() {
    if (!this.clerk) return;
    // Open sign-up modal - custom router prevents redirects
    await this.clerk.openSignUp();
  }

  async signOut() {
    if (!this.clerk) return;
    
    // Show loader during sign out
    this.globalLoader.show('Signing out...');
    
    try {
      await this.clerk.signOut();
      this._user.set(null);
      this._isSignedIn.set(false);

      // Navigate to home to ensure protected routes are no longer accessible
      try {
        await this.router.navigateByUrl('/', { replaceUrl: true });
      } catch (err) {
        // ignore navigation errors
      }
    } finally {
      // Hide loader after a brief delay to allow page refresh
      setTimeout(() => {
        this.globalLoader.hide();
      }, 500);
    }
  }

  async openUserProfile() {
    if (!this.clerk) return;
    await this.clerk.openUserProfile();
  }

  private async fetchCurrentUser() {
    try {
      const response = await this.apiService.get<User>('/auth/me');
      if (response.success && response.data) {
        this._user.set(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  }

  async upgradeToCreator(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.apiService.post<User>('/auth/upgrade-to-creator', {});
      if (response.success && response.data) {
        this._user.set(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error: any) {
      console.error('Failed to upgrade to creator:', error);
      return { success: false, message: error.message || 'Failed to upgrade' };
    }
  }

  async refreshUser() {
    await this.fetchCurrentUser();
  }

  private setPostAuthRedirect(url: string) {
    this.postAuthRedirectUrl = url;
    try {
      sessionStorage.setItem(this.postAuthStorageKey, url);
    } catch (err) {
      // ignore storage failures
    }
  }

  private consumePostAuthRedirect(): string | null {
    const url = this.postAuthRedirectUrl || sessionStorage.getItem(this.postAuthStorageKey);
    if (url) {
      this.postAuthRedirectUrl = null;
      try {
        sessionStorage.removeItem(this.postAuthStorageKey);
      } catch (err) {
        // ignore storage failures
      }
    }
    return url;
  }

  private handlePostAuthRedirect() {
    const url = this.consumePostAuthRedirect();
    if (!url) return;
    try {
      this.router.navigateByUrl(url, { replaceUrl: true });
    } catch (err) {
      // ignore navigation errors
    }
  }
}
