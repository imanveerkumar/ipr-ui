import { Injectable, signal, computed } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import { environment } from '../../../environments/environment';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clerk: Clerk | null = null;
  
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

  constructor(private apiService: ApiService) {}

  init() {
    this.initClerk();
    // Set token getter for API service
    this.apiService.setTokenGetter(() => this.getToken());
  }

  private async initClerk() {
    try {
      this.clerk = new Clerk(environment.clerkPublishableKey);
      await this.clerk.load();
      
      this._isLoaded.set(true);
      
      if (this.clerk.user) {
        this._clerkUser.set(this.clerk.user);
        this._isSignedIn.set(true);
        await this.fetchCurrentUser();
      }

      // Listen for auth changes - only fetch user on actual auth state changes
      let previousUserId = this.clerk.user?.id;
      
      this.clerk.addListener((event) => {
        const currentUserId = event.user?.id;
        
        // Only update if user actually changed (sign in/out)
        if (currentUserId !== previousUserId) {
          previousUserId = currentUserId;
          
          if (event.user) {
            this._clerkUser.set(event.user);
            this._isSignedIn.set(true);
            this.fetchCurrentUser();
          } else {
            this._clerkUser.set(null);
            this._isSignedIn.set(false);
            this._user.set(null);
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
      return null;
    }
    try {
      // Get the session token - this is what the backend expects
      const token = await this.clerk.session.getToken();
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async signIn() {
    if (!this.clerk) return;
    await this.clerk.openSignIn();
  }

  async signUp() {
    if (!this.clerk) return;
    await this.clerk.openSignUp();
  }

  async signOut() {
    if (!this.clerk) return;
    await this.clerk.signOut();
    this._user.set(null);
    this._isSignedIn.set(false);
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

  async upgradeToCreator(): Promise<boolean> {
    try {
      const response = await this.apiService.post<User>('/auth/upgrade-to-creator', {});
      if (response.success && response.data) {
        this._user.set(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upgrade to creator:', error);
      return false;
    }
  }

  async refreshUser() {
    await this.fetchCurrentUser();
  }
}
