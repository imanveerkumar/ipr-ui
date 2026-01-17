import { Component, OnInit, signal, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestAccessService } from '../../core/services/guest-access.service';
import { AuthService } from '../../core/services/auth.service';

type AuthStep = 'input' | 'checking' | 'choose-method' | 'otp' | 'clerk-redirect' | 'success' | 'not-found';
type AuthMethod = 'email' | 'phone';

interface UserCheckResult {
  exists: boolean;
  hasClerkAccount: boolean;
  hasGuestPurchases: boolean;
}

@Component({
  selector: 'app-purchases-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        (click)="closeModal()"
      >
        <!-- Modal - Bottom sheet on mobile, centered on desktop -->
        <div 
          class="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto safe-area-bottom"
          (click)="$event.stopPropagation()"
        >
          <!-- Mobile drag handle -->
          <div class="sm:hidden flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900">
                Access Your Purchases
              </h2>
              <button 
                (click)="closeModal()"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Enter your email or phone used during purchase
            </p>
          </div>

          <!-- Content -->
          <div class="p-6">
            @switch (step()) {
              @case ('input') {
                <!-- Method Tabs -->
                <div class="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button 
                    (click)="setMethod('email')"
                    [class]="method() === 'email' 
                      ? 'flex-1 py-2.5 px-4 rounded-lg bg-white shadow-sm font-medium text-gray-900 transition-all' 
                      : 'flex-1 py-2.5 px-4 rounded-lg font-medium text-gray-500 hover:text-gray-700 transition-all'"
                  >
                    Email
                  </button>
                  <button 
                    (click)="setMethod('phone')"
                    [class]="method() === 'phone' 
                      ? 'flex-1 py-2.5 px-4 rounded-lg bg-white shadow-sm font-medium text-gray-900 transition-all' 
                      : 'flex-1 py-2.5 px-4 rounded-lg font-medium text-gray-500 hover:text-gray-700 transition-all'"
                  >
                    Phone
                  </button>
                </div>

                <!-- Input Field -->
                @if (method() === 'email') {
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email"
                      [(ngModel)]="email"
                      placeholder="you@example.com"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-gray-900"
                      (keydown.enter)="checkUser()"
                    >
                  </div>
                } @else {
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      [(ngModel)]="phone"
                      placeholder="+91 9876543210"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all text-gray-900"
                      (keydown.enter)="checkUser()"
                    >
                  </div>
                }

                <!-- Error Message -->
                @if (error()) {
                  <div class="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p class="text-sm text-red-600">{{ error() }}</p>
                  </div>
                }

                <!-- Submit Button -->
                <button 
                  (click)="checkUser()"
                  [disabled]="loading() || !isInputValid()"
                  class="w-full py-3.5 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  @if (loading()) {
                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Checking...</span>
                  } @else {
                    <span>Continue</span>
                  }
                </button>
              }

              @case ('checking') {
                <!-- Checking State -->
                <div class="text-center py-8">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-gray-600" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                  <p class="text-gray-600">Looking up your account...</p>
                </div>
              }

              @case ('not-found') {
                <!-- No User Found State -->
                <div class="text-center py-6">
                  <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">No Purchases Found</h3>
                  <p class="text-gray-600 mb-6 text-sm">
                    We couldn't find any purchases associated with<br>
                    <span class="font-medium text-gray-900">{{ method() === 'email' ? email : phone }}</span>
                  </p>
                  <p class="text-gray-500 text-xs mb-6">
                    Make sure you're using the same email or phone number you used during checkout.
                  </p>
                  <div class="space-y-3">
                    <button 
                      (click)="goBack()"
                      class="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors min-h-[48px]"
                    >
                      Try Different Email/Phone
                    </button>
                    <button 
                      (click)="closeModal()"
                      class="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors min-h-[48px]"
                    >
                      Browse Products
                    </button>
                  </div>
                </div>
              }

              @case ('choose-method') {
                <!-- Choose Login Method (when both Clerk & Guest exist) -->
                <div class="py-2">
                  <div class="text-center mb-6">
                    <div class="w-14 h-14 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                      <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <p class="text-gray-600 text-sm">
                      Account found for<br>
                      <span class="font-medium text-gray-900">{{ method() === 'email' ? email : phone }}</span>
                    </p>
                  </div>

                  @if (userCheckResult()?.hasClerkAccount) {
                    <button 
                      (click)="loginWithClerk()"
                      class="w-full py-4 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mb-3 min-h-[56px]"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>Sign In with Account</span>
                    </button>
                    <p class="text-xs text-gray-500 text-center mb-4">
                      Access all your purchases and library
                    </p>
                  }

                  @if (userCheckResult()?.hasGuestPurchases && !userCheckResult()?.hasClerkAccount) {
                    <button 
                      (click)="continueAsGuest()"
                      class="w-full py-4 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 min-h-[56px]"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span>Verify via OTP</span>
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                      We'll send a verification code to your {{ method() }}
                    </p>
                  }

                  @if (userCheckResult()?.hasGuestPurchases && userCheckResult()?.hasClerkAccount) {
                    <div class="relative my-4">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                      </div>
                      <div class="relative flex justify-center text-xs">
                        <span class="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <button 
                      (click)="continueAsGuest()"
                      class="w-full py-3.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <span>Continue as Guest</span>
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                      Verify with OTP for this store only
                    </p>
                  }

                  <button 
                    (click)="goBack()"
                    class="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Use different email/phone
                  </button>
                </div>
              }

              @case ('clerk-redirect') {
                <!-- Clerk Redirect State -->
                <div class="text-center py-8">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-gray-600" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                  <p class="text-gray-600">Opening sign in...</p>
                </div>
              }

              @case ('otp') {
                <!-- OTP Header -->
                <div class="text-center mb-6">
                  <div class="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p class="text-gray-600">
                    Enter the 6-digit code sent to<br>
                    <span class="font-medium text-gray-900">{{ method() === 'email' ? email : phone }}</span>
                  </p>
                </div>

                <!-- OTP Input -->
                <div class="flex gap-2 sm:gap-3 justify-center mb-6">
                  @for (digit of [0, 1, 2, 3, 4, 5]; track digit) {
                    <input 
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      maxlength="1"
                      [id]="'otp-' + digit"
                      [(ngModel)]="otpDigits[digit]"
                      (input)="onOtpInput($event, digit)"
                      (keydown)="onOtpKeydown($event, digit)"
                      (paste)="onOtpPaste($event)"
                      class="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                    >
                  }
                </div>

                <!-- Error Message -->
                @if (error()) {
                  <div class="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p class="text-sm text-red-600">{{ error() }}</p>
                  </div>
                }

                <!-- Verify Button -->
                <button 
                  (click)="verifyOtp()"
                  [disabled]="loading() || !isOtpComplete()"
                  class="w-full py-3.5 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  @if (loading()) {
                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Verifying...</span>
                  } @else {
                    <span>Verify Code</span>
                  }
                </button>

                <!-- Resend Link -->
                <div class="text-center mt-4">
                  <button 
                    (click)="goBack()"
                    class="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Change {{ method() }}
                  </button>
                  <span class="mx-2 text-gray-300">|</span>
                  <button 
                    (click)="resendOtp()"
                    [disabled]="resendCooldown() > 0"
                    class="text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  >
                    @if (resendCooldown() > 0) {
                      Resend in {{ resendCooldown() }}s
                    } @else {
                      Resend Code
                    }
                  </button>
                </div>
              }

              @case ('success') {
                <!-- Success State -->
                <div class="text-center py-4">
                  <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Verification Successful!</h3>
                  <p class="text-gray-600 mb-6">You now have access to your purchased products.</p>
                  <button 
                    (click)="onSuccess()"
                    class="w-full py-3.5 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors min-h-[48px]"
                  >
                    View My Purchases
                  </button>
                </div>
              }
            }
          </div>

          <!-- Footer -->
          @if (step() === 'input') {
            <div class="px-6 pb-6">
              <div class="pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-400 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `]
})
export class PurchasesAuthModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() authenticated = new EventEmitter<{ type: 'guest' | 'clerk' }>();

  private guestAccess = inject(GuestAccessService);
  private authService = inject(AuthService);

  // State
  isOpen = signal(false);
  step = signal<AuthStep>('input');
  method = signal<AuthMethod>('email');
  loading = signal(false);
  error = signal<string | null>(null);
  resendCooldown = signal(0);
  userCheckResult = signal<UserCheckResult | null>(null);

  // Form data
  email = '';
  phone = '';
  otpDigits: string[] = ['', '', '', '', '', ''];

  private cooldownInterval: any = null;

  ngOnInit() {}

  open() {
    this.isOpen.set(true);
    this.resetState();
  }

  closeModal() {
    this.isOpen.set(false);
    this.closed.emit();
    this.resetState();
  }

  private resetState() {
    this.step.set('input');
    this.error.set(null);
    this.email = '';
    this.phone = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.resendCooldown.set(0);
    this.userCheckResult.set(null);
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  setMethod(method: AuthMethod) {
    this.method.set(method);
    this.error.set(null);
  }

  isInputValid(): boolean {
    if (this.method() === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    } else {
      return /^\+?[0-9]{10,15}$/.test(this.phone.replace(/[\s\-\(\)]/g, ''));
    }
  }

  isOtpComplete(): boolean {
    return this.otpDigits.every(d => d.length === 1);
  }

  /**
   * Check if user exists (either as Clerk user or guest with purchases)
   */
  async checkUser() {
    if (!this.isInputValid()) return;

    this.loading.set(true);
    this.error.set(null);
    this.step.set('checking');

    try {
      const identifier = this.method() === 'email' ? this.email : this.phone;
      const result = await this.guestAccess.checkUserExists(identifier, this.method());
      this.userCheckResult.set(result);

      if (!result.exists) {
        // No user found
        this.step.set('not-found');
      } else if (result.hasClerkAccount && !result.hasGuestPurchases) {
        // Only Clerk account exists - redirect directly to Clerk
        await this.loginWithClerk();
      } else if (result.hasGuestPurchases && !result.hasClerkAccount) {
        // Only guest purchases - send OTP directly
        await this.sendOtp();
      } else {
        // Both exist - let user choose
        this.step.set('choose-method');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Failed to check user');
      this.step.set('input');
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithClerk() {
    this.step.set('clerk-redirect');
    try {
      // Close modal and trigger Clerk sign-in
      await this.authService.signIn();
      this.closeModal();
      
      // Emit that user should authenticate via Clerk
      this.authenticated.emit({ type: 'clerk' });
    } catch (err: any) {
      this.error.set('Failed to open sign in');
      this.step.set('choose-method');
    }
  }

  async continueAsGuest() {
    await this.sendOtp();
  }

  async sendOtp() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const identifier = this.method() === 'email' ? this.email : this.phone;
      await this.guestAccess.requestOtp(identifier, this.method());
      this.step.set('otp');
      this.startResendCooldown();
      
      // Focus first OTP input
      setTimeout(() => {
        document.getElementById('otp-0')?.focus();
      }, 100);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to send verification code');
      this.step.set('input');
    } finally {
      this.loading.set(false);
    }
  }

  async resendOtp() {
    if (this.resendCooldown() > 0) return;
    
    this.loading.set(true);
    this.error.set(null);

    try {
      const identifier = this.method() === 'email' ? this.email : this.phone;
      await this.guestAccess.requestOtp(identifier, this.method());
      this.startResendCooldown();
      this.otpDigits = ['', '', '', '', '', ''];
    } catch (err: any) {
      this.error.set(err.message || 'Failed to resend code');
    } finally {
      this.loading.set(false);
    }
  }

  private startResendCooldown() {
    this.resendCooldown.set(60);
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    this.cooldownInterval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        this.resendCooldown.set(0);
        clearInterval(this.cooldownInterval);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }

  async verifyOtp() {
    if (!this.isOtpComplete()) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const identifier = this.method() === 'email' ? this.email : this.phone;
      const code = this.otpDigits.join('');
      await this.guestAccess.verifyOtp(identifier, this.method(), code);
      this.step.set('success');
    } catch (err: any) {
      this.error.set(err.message || 'Verification failed');
      // Clear OTP on error
      this.otpDigits = ['', '', '', '', '', ''];
      document.getElementById('otp-0')?.focus();
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.step.set('input');
    this.error.set(null);
    this.otpDigits = ['', '', '', '', '', ''];
    this.userCheckResult.set(null);
  }

  onSuccess() {
    this.authenticated.emit({ type: 'guest' });
    this.closeModal();
  }

  // OTP Input Handlers
  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      this.otpDigits[index] = '';
      return;
    }

    // Move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    // Auto-submit when complete
    if (this.isOtpComplete()) {
      this.verifyOtp();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    digits.forEach((digit, i) => {
      this.otpDigits[i] = digit;
    });

    // Focus the next empty input or the last one
    const nextEmpty = this.otpDigits.findIndex(d => !d);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    document.getElementById(`otp-${focusIndex}`)?.focus();

    // Auto-submit if complete
    if (this.isOtpComplete()) {
      setTimeout(() => this.verifyOtp(), 100);
    }
  }
}
