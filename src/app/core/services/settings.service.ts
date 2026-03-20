import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AllSettings, UserSettings } from '../models';

interface UsernameAvailabilityResponse {
  username: string;
  available: boolean;
  reason?: 'unchanged';
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(ApiService);

  async getAllSettings() {
    return this.api.get<AllSettings>('/settings');
  }

  async updateProfile(data: Record<string, any>) {
    return this.api.patch<any>('/settings/profile', data, {
      skipDeduplication: true,
    });
  }

  async checkUsernameAvailability(username: string) {
    return this.api.get<UsernameAvailabilityResponse>(
      `/settings/username-availability?username=${encodeURIComponent(username)}`,
      {
        skipDeduplication: true,
      },
    );
  }

  async updateAccountSettings(data: Record<string, any>) {
    return this.api.patch<UserSettings>('/settings/account', data, {
      skipDeduplication: true,
    });
  }

  async updatePayoutSettings(data: Record<string, any>) {
    return this.api.patch<UserSettings>('/settings/payout', data, {
      skipDeduplication: true,
    });
  }

  async updatePrivacySettings(data: Record<string, any>) {
    return this.api.patch<UserSettings>('/settings/privacy', data, {
      skipDeduplication: true,
    });
  }

  async deleteAccount() {
    return this.api.delete<any>('/settings/account', {
      skipDeduplication: true,
    });
  }

  async exportData() {
    return this.api.get<any>('/settings/export');
  }
}
