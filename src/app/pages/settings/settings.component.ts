import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { ToasterService } from '../../core/services/toaster.service';
import { AuthService } from '../../core/services/auth.service';
import { User, UserSettings } from '../../core/models';

type SettingsTab = 'profile' | 'account' | 'payout' | 'privacy';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
          <svg class="breadcrumb-sep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="breadcrumb-current">Settings</span>
        </nav>
        <div class="hero-text">
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your account, profile, and preferences</p>
        </div>
      </div>
    </section>

    <!-- Tabs + Content -->
    <section class="content-section">
      <div class="container">
        <div class="settings-layout">
          <!-- Sidebar Tabs (desktop) / Horizontal scroll (mobile) -->
          <nav class="tabs-nav">
            @for (tab of tabs; track tab.key) {
              <button
                class="tab-btn"
                [class.active]="activeTab() === tab.key"
                (click)="activeTab.set(tab.key)">
                <span class="tab-icon" [innerHTML]="tab.icon"></span>
                <span class="tab-label">{{ tab.label }}</span>
              </button>
            }
          </nav>

          <!-- Content Panel -->
          <div class="settings-panel">
            @if (loading()) {
              <div class="skeleton-card">
                <div class="skeleton-line w-third h-6 mb-4"></div>
                <div class="skeleton-line w-full h-10 mb-3"></div>
                <div class="skeleton-line w-full h-10 mb-3"></div>
                <div class="skeleton-line w-two-thirds h-10 mb-3"></div>
                <div class="skeleton-line w-quarter h-10 mt-6"></div>
              </div>
            } @else {
              <!-- Profile Settings -->
              @if (activeTab() === 'profile') {
                <div class="card">
                  <h2 class="card-title">Profile Settings</h2>
                  <p class="card-description">Manage your public identity and storefront presence.</p>

                  <div class="form-grid">
                    <!-- Avatar -->
                    <div class="form-group full-width">
                      <label class="form-label">Profile Photo</label>
                      <div class="avatar-row">
                        <div class="avatar-preview">
                          @if (profileForm.avatarUrl) {
                            <img [src]="profileForm.avatarUrl" alt="Avatar" class="avatar-img" />
                          } @else {
                            <span class="avatar-placeholder">{{ getInitials() }}</span>
                          }
                        </div>
                        <div class="avatar-actions">
                          <input
                            type="url"
                            class="form-input"
                            placeholder="https://example.com/photo.jpg"
                            [(ngModel)]="profileForm.avatarUrl"
                          />
                          <span class="form-hint">Enter a URL for your profile photo</span>
                        </div>
                      </div>
                    </div>

                    <!-- Display Name -->
                    <div class="form-group">
                      <label class="form-label">Display Name</label>
                      <input type="text" class="form-input" placeholder="Your display name" [(ngModel)]="profileForm.displayName" maxlength="50" />
                    </div>

                    <!-- Username -->
                    <div class="form-group">
                      <label class="form-label">Username</label>
                      <div class="input-with-prefix">
                        <span class="input-prefix">&#64;</span>
                        <input type="text" class="form-input prefix" placeholder="username" [(ngModel)]="profileForm.username" maxlength="30" />
                      </div>
                      <span class="form-hint">Lowercase letters, numbers, and underscores only</span>
                    </div>

                    <!-- Bio -->
                    <div class="form-group full-width">
                      <label class="form-label">Bio</label>
                      <textarea class="form-input textarea" placeholder="Tell the world about yourself..." [(ngModel)]="profileForm.bio" maxlength="500" rows="3"></textarea>
                      <span class="form-hint">{{ (profileForm.bio.length || 0) }}/500</span>
                    </div>

                    <!-- Website -->
                    <div class="form-group full-width">
                      <label class="form-label">Website</label>
                      <input type="url" class="form-input" placeholder="https://yourwebsite.com" [(ngModel)]="profileForm.websiteUrl" />
                    </div>

                    <!-- Social Links -->
                    <div class="form-group full-width">
                      <label class="form-label section-label">Social Links</label>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">Twitter / X</label>
                      <div class="input-with-prefix">
                        <span class="input-prefix">&#64;</span>
                        <input type="text" class="form-input prefix" placeholder="handle" [(ngModel)]="profileForm.twitterHandle" maxlength="15" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">Instagram</label>
                      <div class="input-with-prefix">
                        <span class="input-prefix">&#64;</span>
                        <input type="text" class="form-input prefix" placeholder="handle" [(ngModel)]="profileForm.instagramHandle" maxlength="30" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">YouTube</label>
                      <div class="input-with-prefix">
                        <span class="input-prefix">&#64;</span>
                        <input type="text" class="form-input prefix" placeholder="channel" [(ngModel)]="profileForm.youtubeHandle" maxlength="50" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label-sm">GitHub</label>
                      <div class="input-with-prefix">
                        <span class="input-prefix">&#64;</span>
                        <input type="text" class="form-input prefix" placeholder="username" [(ngModel)]="profileForm.githubHandle" maxlength="39" />
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label class="form-label-sm">LinkedIn</label>
                      <input type="url" class="form-input" placeholder="https://linkedin.com/in/yourprofile" [(ngModel)]="profileForm.linkedinUrl" />
                    </div>
                  </div>

                  <div class="card-actions">
                    <button class="btn btn-primary" (click)="saveProfile()" [disabled]="saving()">
                      {{ saving() ? 'Saving...' : 'Save Profile' }}
                    </button>
                  </div>
                </div>
              }

              <!-- Account Settings -->
              @if (activeTab() === 'account') {
                <div class="card">
                  <h2 class="card-title">Account Settings</h2>
                  <p class="card-description">Manage basic account preferences.</p>

                  <div class="form-grid">
                    <!-- Email (read-only, managed by Clerk) -->
                    <div class="form-group full-width">
                      <label class="form-label">Email Address</label>
                      <input type="email" class="form-input readonly" [value]="profile()?.email || ''" readonly />
                      <span class="form-hint">Email is managed through your authentication provider</span>
                    </div>

                    <!-- Language -->
                    <div class="form-group">
                      <label class="form-label">Language</label>
                      <select class="form-input select" [(ngModel)]="accountForm.language">
                        @for (lang of languages; track lang.value) {
                          <option [value]="lang.value">{{ lang.label }}</option>
                        }
                      </select>
                    </div>

                    <!-- Timezone -->
                    <div class="form-group">
                      <label class="form-label">Timezone</label>
                      <select class="form-input select" [(ngModel)]="accountForm.timezone">
                        @for (tz of timezones; track tz.value) {
                          <option [value]="tz.value">{{ tz.label }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <div class="card-actions">
                    <button class="btn btn-primary" (click)="saveAccountSettings()" [disabled]="saving()">
                      {{ saving() ? 'Saving...' : 'Save Account Settings' }}
                    </button>
                  </div>
                </div>

                <!-- Security Card -->
                <div class="card mt-card">
                  <h2 class="card-title">Security</h2>
                  <p class="card-description">Protect your account.</p>

                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label class="form-label">Password</label>
                      <p class="hint-text">Password management is handled through your authentication provider (Clerk). Use the sign-in page to reset your password.</p>
                    </div>

                    <div class="form-group full-width">
                      <div class="toggle-row">
                        <div class="toggle-info">
                          <span class="form-label">Two-Factor Authentication</span>
                          <span class="form-hint">Add an extra layer of security to your account</span>
                        </div>
                        <button
                          class="toggle-switch"
                          [class.active]="privacyForm.twoFactorEnabled"
                          (click)="privacyForm.twoFactorEnabled = !privacyForm.twoFactorEnabled; savePrivacySettings()">
                          <span class="toggle-knob"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Data & Account Card -->
                <div class="card mt-card">
                  <h2 class="card-title">Data & Account</h2>

                  <div class="action-rows">
                    <div class="action-row">
                      <div class="action-info">
                        <span class="action-title">Export Your Data</span>
                        <span class="action-desc">Download a copy of your profile, orders, and settings</span>
                      </div>
                      <button class="btn btn-secondary btn-sm" (click)="exportData()" [disabled]="exporting()">
                        {{ exporting() ? 'Exporting...' : 'Export Data' }}
                      </button>
                    </div>

                    <div class="action-row danger">
                      <div class="action-info">
                        <span class="action-title danger-text">Delete Account</span>
                        <span class="action-desc">Permanently deactivate your account and remove your data</span>
                      </div>
                      <button class="btn btn-danger btn-sm" (click)="confirmDeleteAccount()">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              }

              <!-- Payment & Payout Settings -->
              @if (activeTab() === 'payout') {
                <div class="card">
                  <h2 class="card-title">Payment & Payout Settings</h2>
                  <p class="card-description">Configure how you receive earnings from your sales.</p>

                  <div class="form-grid">
                    <!-- Payout Provider -->
                    <div class="form-group">
                      <label class="form-label">Payout Provider</label>
                      <select class="form-input select" [(ngModel)]="payoutForm.payoutProvider">
                        <option value="">Select provider</option>
                        <option value="razorpay">Razorpay</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <!-- Account ID -->
                    <div class="form-group">
                      <label class="form-label">Account ID / Reference</label>
                      <input type="text" class="form-input" placeholder="Account reference" [(ngModel)]="payoutForm.payoutAccountId" maxlength="100" />
                      <span class="form-hint">Your payout provider account identifier</span>
                    </div>

                    <!-- Currency -->
                    <div class="form-group">
                      <label class="form-label">Currency</label>
                      <select class="form-input select" [(ngModel)]="payoutForm.payoutCurrency">
                        @for (cur of currencies; track cur.value) {
                          <option [value]="cur.value">{{ cur.label }}</option>
                        }
                      </select>
                    </div>

                    <!-- Payout Schedule -->
                    <div class="form-group">
                      <label class="form-label">Payout Schedule</label>
                      <select class="form-input select" [(ngModel)]="payoutForm.payoutSchedule">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <!-- Tax ID -->
                    <div class="form-group full-width">
                      <label class="form-label">Tax ID / GST Number</label>
                      <input type="text" class="form-input" placeholder="e.g., GSTIN, PAN, TIN" [(ngModel)]="payoutForm.taxId" maxlength="50" />
                      <span class="form-hint">Required for tax reporting in some regions</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    <button class="btn btn-primary" (click)="savePayoutSettings()" [disabled]="saving()">
                      {{ saving() ? 'Saving...' : 'Save Payout Settings' }}
                    </button>
                  </div>
                </div>

                <!-- Earnings Summary Placeholder -->
                <div class="card mt-card">
                  <h2 class="card-title">Earnings Summary</h2>
                  <div class="info-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    <span>Detailed earnings breakdown and payout history will be available soon. Visit the <a routerLink="/dashboard/sales" class="info-link">Sales Dashboard</a> for current revenue data.</span>
                  </div>
                </div>
              }

              <!-- Privacy Settings -->
              @if (activeTab() === 'privacy') {
                <div class="card">
                  <h2 class="card-title">Privacy Settings</h2>
                  <p class="card-description">Control what information is visible to others.</p>

                  <div class="toggle-list">
                    <div class="toggle-row">
                      <div class="toggle-info">
                        <span class="form-label">Public Profile</span>
                        <span class="form-hint">Make your profile visible to everyone</span>
                      </div>
                      <button
                        class="toggle-switch"
                        [class.active]="privacyForm.profilePublic"
                        (click)="privacyForm.profilePublic = !privacyForm.profilePublic">
                        <span class="toggle-knob"></span>
                      </button>
                    </div>

                    <div class="toggle-row">
                      <div class="toggle-info">
                        <span class="form-label">Show Sales Metrics</span>
                        <span class="form-hint">Display total sales count on your public profile</span>
                      </div>
                      <button
                        class="toggle-switch"
                        [class.active]="privacyForm.showSalesMetrics"
                        (click)="privacyForm.showSalesMetrics = !privacyForm.showSalesMetrics">
                        <span class="toggle-knob"></span>
                      </button>
                    </div>

                    <div class="toggle-row">
                      <div class="toggle-info">
                        <span class="form-label">Show Follower Count</span>
                        <span class="form-hint">Display follower/subscriber count publicly</span>
                      </div>
                      <button
                        class="toggle-switch"
                        [class.active]="privacyForm.showFollowerCount"
                        (click)="privacyForm.showFollowerCount = !privacyForm.showFollowerCount">
                        <span class="toggle-knob"></span>
                      </button>
                    </div>

                    <div class="toggle-row">
                      <div class="toggle-info">
                        <span class="form-label">Hide Contact Email</span>
                        <span class="form-hint">Hide your email address from public pages</span>
                      </div>
                      <button
                        class="toggle-switch"
                        [class.active]="privacyForm.hideContactEmail"
                        (click)="privacyForm.hideContactEmail = !privacyForm.hideContactEmail">
                        <span class="toggle-knob"></span>
                      </button>
                    </div>
                  </div>

                  <div class="card-actions">
                    <button class="btn btn-primary" (click)="savePrivacySettings()" [disabled]="saving()">
                      {{ saving() ? 'Saving...' : 'Save Privacy Settings' }}
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Delete Account Confirmation Modal -->
    @if (showDeleteModal()) {
      <div class="modal-overlay" (click)="showDeleteModal.set(false)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3 class="modal-title">Delete Account</h3>
          <p class="modal-text">This action will permanently deactivate your account. All your stores, products, and data will be inaccessible. This cannot be undone.</p>
          <p class="modal-text"><strong>Type your username to confirm:</strong></p>
          <input
            type="text"
            class="form-input"
            placeholder="Enter your username"
            [(ngModel)]="deleteConfirmation"
          />
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showDeleteModal.set(false)">Cancel</button>
            <button
              class="btn btn-danger"
              [disabled]="deleteConfirmation !== profile()?.username"
              (click)="deleteAccount()">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--secondary); color: var(--foreground); }

    .container { max-width: 1024px; margin: 0 auto; padding: 0 1.5rem; }
    @media (max-width: 640px) { .container { padding: 0 1rem; } }

    /* Hero */
    .hero-section { background: var(--secondary); padding: 1.5rem 0; border-bottom: 2px solid var(--border); }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .breadcrumb-link { font-size: 0.875rem; font-weight: 500; color: var(--foreground); text-decoration: none; }
    .breadcrumb-link:hover { color: var(--primary); }
    .breadcrumb-sep { color: var(--foreground); opacity: 0.4; }
    .breadcrumb-current { font-size: 0.875rem; font-weight: 700; color: var(--foreground); }
    .page-title { font-size: 2rem; font-weight: 800; color: var(--foreground); margin: 0 0 0.25rem; letter-spacing: -0.02em; }
    .page-subtitle { font-size: 1rem; color: var(--foreground); opacity: 0.6; margin: 0; }

    /* Settings Layout */
    .content-section { padding: 1.5rem 0 3rem; }
    .settings-layout { display: flex; gap: 1.5rem; }

    /* Tabs Nav */
    .tabs-nav {
      display: flex; flex-direction: column; gap: 0.25rem;
      min-width: 220px; position: sticky; top: 1.5rem; align-self: flex-start;
    }
    .tab-btn {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border: 2px solid transparent;
      background: transparent; font-size: 0.9375rem; font-weight: 600;
      color: var(--foreground); opacity: 0.6; cursor: pointer; transition: all 0.15s;
      text-align: left; border-radius: 0;
    }
    .tab-btn:hover { opacity: 1; background: var(--surface-hover); }
    .tab-btn.active {
      opacity: 1; background: var(--surface); border: 2px solid var(--border);
      box-shadow: 3px 3px 0 var(--border);
    }
    .tab-icon { display: flex; align-items: center; width: 20px; height: 20px; }
    .tab-icon ::ng-deep svg { width: 20px; height: 20px; }

    /* Mobile: horizontal scrolling tabs */
    @media (max-width: 768px) {
      .settings-layout { flex-direction: column; gap: 1rem; }
      .tabs-nav {
        flex-direction: row; min-width: 0; position: static;
        overflow-x: auto; -webkit-overflow-scrolling: touch;
        gap: 0.5rem; padding-bottom: 0.25rem;
        scrollbar-width: none;
      }
      .tabs-nav::-webkit-scrollbar { display: none; }
      .tab-btn {
        white-space: nowrap; padding: 0.625rem 1rem;
        font-size: 0.875rem; flex-shrink: 0;
      }
    }

    /* Cards */
    .settings-panel { flex: 1; min-width: 0; }
    .card {
      background: var(--surface); border: 2px solid var(--border);
      box-shadow: 4px 4px 0 var(--border); padding: 1.5rem;
    }
    .mt-card { margin-top: 1.5rem; }
    .card-title { font-size: 1.25rem; font-weight: 800; color: var(--foreground); margin: 0 0 0.25rem; }
    .card-description { font-size: 0.875rem; color: var(--foreground); opacity: 0.6; margin: 0 0 1.5rem; }
    .card-actions { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--surface-hover); display: flex; justify-content: flex-end; gap: 0.75rem; }

    /* Form Grid */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

    .form-label { font-size: 0.875rem; font-weight: 700; color: var(--foreground); }
    .form-label-sm { font-size: 0.8125rem; font-weight: 600; color: var(--foreground); }
    .section-label { font-size: 1rem; font-weight: 800; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--surface-hover); }
    .form-hint { font-size: 0.75rem; color: var(--muted); }
    .hint-text { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.5; }

    .form-input {
      width: 100%; padding: 0.625rem 0.75rem; font-size: 0.9375rem;
      border: 2px solid var(--border); background: var(--surface); color: var(--foreground);
      transition: box-shadow 0.15s; outline: none;
      font-family: inherit; box-sizing: border-box;
    }
    .form-input:focus { box-shadow: 3px 3px 0 var(--border); }
    .form-input.readonly { background: var(--secondary); opacity: 0.7; cursor: not-allowed; }
    .form-input.textarea { resize: vertical; min-height: 80px; }
    .form-input.select { cursor: pointer; appearance: auto; }
    .form-input.prefix { border-left: none; }

    .input-with-prefix { display: flex; }
    .input-prefix {
      display: flex; align-items: center; padding: 0 0.75rem;
      background: var(--secondary); border: 2px solid var(--border); border-right: none;
      font-size: 0.9375rem; font-weight: 600; color: var(--muted);
      user-select: none;
    }

    /* Avatar */
    .avatar-row { display: flex; align-items: flex-start; gap: 1rem; }
    .avatar-preview {
      width: 64px; height: 64px; min-width: 64px;
      border: 2px solid var(--border); background: var(--secondary);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder { font-size: 1.25rem; font-weight: 800; color: var(--foreground); opacity: 0.4; }
    .avatar-actions { flex: 1; display: flex; flex-direction: column; gap: 0.375rem; }
    @media (max-width: 480px) {
      .avatar-row { flex-direction: column; }
      .avatar-preview { width: 56px; height: 56px; min-width: 56px; }
    }

    /* Toggle Switch */
    .toggle-list { display: flex; flex-direction: column; }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 0; border-bottom: 1px solid var(--surface-hover); gap: 1rem;
    }
    .toggle-row:last-child { border-bottom: none; }
    .toggle-info { display: flex; flex-direction: column; gap: 0.125rem; flex: 1; }
    .toggle-switch {
      position: relative; width: 48px; height: 28px; min-width: 48px;
      border: 2px solid var(--border); background: var(--secondary); cursor: pointer;
      transition: background 0.2s; padding: 0; border-radius: 0;
    }
    .toggle-switch.active { background: var(--success); }
    .toggle-knob {
      position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
      background: var(--border); transition: transform 0.2s;
    }
    .toggle-switch.active .toggle-knob { transform: translateX(20px); }

    /* Action Rows */
    .action-rows { display: flex; flex-direction: column; }
    .action-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 0; border-bottom: 1px solid var(--surface-hover); gap: 1rem;
    }
    .action-row:first-child { padding-top: 0.5rem; }
    .action-row:last-child { border-bottom: none; padding-bottom: 0; }
    .action-info { display: flex; flex-direction: column; gap: 0.125rem; flex: 1; }
    .action-title { font-size: 0.9375rem; font-weight: 700; color: var(--foreground); }
    .action-desc { font-size: 0.8125rem; color: var(--muted); }
    .danger-text { color: var(--danger); }
    @media (max-width: 480px) {
      .action-row { flex-direction: column; align-items: flex-start; }
    }

    /* Info Box */
    .info-box {
      display: flex; align-items: flex-start; gap: 0.75rem;
      padding: 1rem; background: var(--secondary); border: 1px solid var(--border);
      font-size: 0.875rem; color: var(--foreground); opacity: 0.8; line-height: 1.5;
    }
    .info-box svg { min-width: 20px; margin-top: 1px; }
    .info-link { color: var(--primary); font-weight: 600; text-decoration: underline; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0.75rem 1.5rem; font-size: 0.9375rem; font-weight: 700;
      border: 2px solid var(--border); cursor: pointer; transition: all 0.15s;
      background: var(--surface); color: var(--foreground); box-shadow: 3px 3px 0 var(--border);
      font-family: inherit; white-space: nowrap; border-radius: 0;
    }
    .btn:hover { transform: translate(1px, 1px); box-shadow: 2px 2px 0 var(--border); }
    .btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--border); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: 3px 3px 0 var(--border); }
    .btn-primary { background: var(--accent); }
    .btn-primary:hover { filter: brightness(0.96); }
    .btn-secondary { background: var(--secondary); }
    .btn-danger { background: var(--danger-bg); color: var(--danger); border-color: var(--danger); box-shadow: 3px 3px 0 var(--danger); }
    .btn-danger:hover { background: var(--danger-bg); transform: translate(1px, 1px); box-shadow: 2px 2px 0 var(--danger); }
    .btn-danger:disabled { box-shadow: 3px 3px 0 var(--danger); }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }

    /* Skeleton */
    .skeleton-card { background: var(--surface); border: 2px solid var(--border); box-shadow: 4px 4px 0 var(--border); padding: 1.5rem; }
    .skeleton-line { background: var(--secondary); border-radius: 2px; animation: pulse 1.5s infinite; }
    .w-third { width: 33%; }
    .w-two-thirds { width: 66%; }
    .w-quarter { width: 25%; }
    .w-full { width: 100%; }
    .h-6 { height: 1.5rem; }
    .h-10 { height: 2.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: var(--overlay);
      display: flex; align-items: center; justify-content: center;
      z-index: 50; padding: 1rem;
    }
    .modal-card {
      background: var(--surface); border: 2px solid var(--border); box-shadow: 6px 6px 0 var(--border);
      padding: 2rem; max-width: 480px; width: 100%;
    }
    .modal-title { font-size: 1.25rem; font-weight: 800; color: var(--danger); margin: 0 0 1rem; }
    .modal-text { font-size: 0.9375rem; color: var(--foreground); margin: 0 0 1rem; line-height: 1.5; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
  `],
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private toaster = inject(ToasterService);
  auth = inject(AuthService);

  // State
  loading = signal(true);
  saving = signal(false);
  exporting = signal(false);
  activeTab = signal<SettingsTab>('profile');
  showDeleteModal = signal(false);
  deleteConfirmation = '';

  profile = signal<User | null>(null);
  settings = signal<UserSettings | null>(null);

  // Tab definitions
  tabs: { key: SettingsTab; label: string; icon: string }[] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      key: 'account',
      label: 'Account',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    },
    {
      key: 'payout',
      label: 'Payment & Payout',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    },
    {
      key: 'privacy',
      label: 'Privacy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    },
  ];

  // Form models
  profileForm = {
    displayName: '',
    username: '',
    bio: '',
    avatarUrl: '',
    websiteUrl: '',
    twitterHandle: '',
    instagramHandle: '',
    youtubeHandle: '',
    linkedinUrl: '',
    githubHandle: '',
  };

  accountForm = {
    language: 'en',
    timezone: 'UTC',
  };

  payoutForm = {
    payoutProvider: '',
    payoutAccountId: '',
    payoutCurrency: 'INR',
    payoutSchedule: 'monthly',
    taxId: '',
  };

  privacyForm = {
    profilePublic: true,
    showSalesMetrics: false,
    showFollowerCount: true,
    hideContactEmail: false,
    twoFactorEnabled: false,
  };

  // Static data
  languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'ko', label: 'Korean' },
  ];

  timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'America/New_York', label: 'US Eastern (ET)' },
    { value: 'America/Chicago', label: 'US Central (CT)' },
    { value: 'America/Denver', label: 'US Mountain (MT)' },
    { value: 'America/Los_Angeles', label: 'US Pacific (PT)' },
    { value: 'Europe/London', label: 'UK (GMT/BST)' },
    { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan (JST)' },
    { value: 'Asia/Shanghai', label: 'China (CST)' },
    { value: 'Australia/Sydney', label: 'Australia (AEST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  ];

  currencies = [
    { value: 'INR', label: '₹ INR (Indian Rupee)' },
    { value: 'USD', label: '$ USD (US Dollar)' },
    { value: 'EUR', label: '€ EUR (Euro)' },
    { value: 'GBP', label: '£ GBP (British Pound)' },
  ];

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    this.loading.set(true);
    try {
      const response = await this.settingsService.getAllSettings();
      if (response.success && response.data) {
        const { profile, settings } = response.data;
        this.profile.set(profile);
        this.settings.set(settings);
        this.populateForms(profile, settings);
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to load settings');
    } finally {
      this.loading.set(false);
    }
  }

  private populateForms(profile: User, settings: UserSettings) {
    this.profileForm = {
      displayName: profile.displayName || '',
      username: profile.username || '',
      bio: profile.bio || '',
      avatarUrl: profile.avatarUrl || '',
      websiteUrl: profile.websiteUrl || '',
      twitterHandle: profile.twitterHandle || '',
      instagramHandle: profile.instagramHandle || '',
      youtubeHandle: profile.youtubeHandle || '',
      linkedinUrl: profile.linkedinUrl || '',
      githubHandle: profile.githubHandle || '',
    };

    this.accountForm = {
      language: settings.language || 'en',
      timezone: settings.timezone || 'UTC',
    };

    this.payoutForm = {
      payoutProvider: settings.payoutProvider || '',
      payoutAccountId: settings.payoutAccountId || '',
      payoutCurrency: settings.payoutCurrency || 'INR',
      payoutSchedule: settings.payoutSchedule || 'monthly',
      taxId: settings.taxId || '',
    };

    this.privacyForm = {
      profilePublic: settings.profilePublic ?? true,
      showSalesMetrics: settings.showSalesMetrics ?? false,
      showFollowerCount: settings.showFollowerCount ?? true,
      hideContactEmail: settings.hideContactEmail ?? false,
      twoFactorEnabled: settings.twoFactorEnabled ?? false,
    };
  }

  getInitials(): string {
    const name = this.profileForm.displayName || this.profileForm.username || '';
    return name.slice(0, 2).toUpperCase();
  }

  async saveProfile() {
    if (this.saving()) return;
    if (this.profileForm.username && !/^[a-z0-9_]+$/.test(this.profileForm.username)) {
      this.toaster.error('Username can only contain lowercase letters, numbers, and underscores');
      return;
    }

    this.saving.set(true);
    try {
      const data: Record<string, any> = {};
      Object.entries(this.profileForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data[key] = value || undefined;
        }
      });
      if (this.profileForm.username) data['username'] = this.profileForm.username;

      const response = await this.settingsService.updateProfile(data);
      if (response.success) {
        this.toaster.success('Profile updated successfully');
        this.profile.set(response.data);
        // Refresh the global user state so navbar/avatar updates immediately
        this.auth.refreshUser();
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to update profile');
    } finally {
      this.saving.set(false);
    }
  }

  async saveAccountSettings() {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const response = await this.settingsService.updateAccountSettings(this.accountForm);
      if (response.success) {
        this.toaster.success('Account settings updated');
        this.settings.set(response.data ?? null);
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to update account settings');
    } finally {
      this.saving.set(false);
    }
  }

  async savePayoutSettings() {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const data: Record<string, any> = { ...this.payoutForm };
      if (!data['payoutProvider']) data['payoutProvider'] = undefined;
      if (!data['payoutAccountId']) data['payoutAccountId'] = undefined;
      if (!data['taxId']) data['taxId'] = undefined;

      const response = await this.settingsService.updatePayoutSettings(data);
      if (response.success) {
        this.toaster.success('Payout settings updated');
        this.settings.set(response.data ?? null);
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to update payout settings');
    } finally {
      this.saving.set(false);
    }
  }

  async savePrivacySettings() {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const response = await this.settingsService.updatePrivacySettings(this.privacyForm);
      if (response.success) {
        this.toaster.success('Privacy settings updated');
        this.settings.set(response.data ?? null);
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to update privacy settings');
    } finally {
      this.saving.set(false);
    }
  }

  async exportData() {
    if (this.exporting()) return;
    this.exporting.set(true);
    try {
      const response = await this.settingsService.exportData();
      if (response.success && response.data) {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'account-data-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.toaster.success('Data exported successfully');
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to export data');
    } finally {
      this.exporting.set(false);
    }
  }

  confirmDeleteAccount() {
    this.deleteConfirmation = '';
    this.showDeleteModal.set(true);
  }

  async deleteAccount() {
    if (this.deleteConfirmation !== this.profile()?.username) return;
    try {
      const response = await this.settingsService.deleteAccount();
      if (response.success) {
        this.toaster.success('Account deactivated');
        this.showDeleteModal.set(false);
      }
    } catch (err: any) {
      this.toaster.error(err.message || 'Failed to delete account');
    }
  }
}
