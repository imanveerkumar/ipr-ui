import { Component, OnInit, inject, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UiMessageService } from '../../core/services/ui-message.service';
import { UiNotificationContainerComponent, UiBannerComponent, UiTipCardComponent } from '../../shared/components/ui-messages';
import {
  LucideAngularModule,
  Zap, Banknote, CreditCard, HardDrive,
  BookOpen, Music, Film, Paintbrush, Code, Camera, Package, Users, LayoutTemplate, GraduationCap,
  ArrowRight, ChevronDown, X,
  LucideIconData
} from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, UiNotificationContainerComponent, UiBannerComponent, UiTipCardComponent, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <h4 class="sr-only">Homepage</h4>

      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
            <div class="text-center max-w-4xl mx-auto">
              
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-5xl md:text-7xl lg:text-8xl font-bold text-[#111111] mb-6 leading-tight">
                Quick Sell<br class="hidden sm:block">
                <span class="text-[rgb(124_58_237_/_var(--tw-bg-opacity,_1))]">like no one else.</span>
              </h1>

              <!-- Subtext -->
              <p class="text-lg md:text-xl text-[#111111]/70 max-w-2xl mx-auto mb-10 font-medium">
                The fastest way to set up your online shop and start selling. Upload products, share your link, get paid. That simple.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center justify-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black font-bold text-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer">
                  Start selling &#8212; it's free
                  <lucide-icon [img]="ArrowRight" [size]="24" [strokeWidth]="2.5" class="ml-2"></lucide-icon>
                </a>
                <a routerLink="/explore" class="inline-flex items-center justify-center px-8 py-4 bg-white text-[#111111] border-2 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgb(43_87_214)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(43_87_214)] transition-all">
                  Explore stores
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Homepage Cards (tips, promos) -->
      @if (uiMessages.homepageCards().length > 0) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b-2 border-black/10">
          <div class="grid gap-4" [ngClass]="uiMessages.homepageCards().length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'">
            @for (msg of uiMessages.homepageCards(); track msg.id) {
              <app-ui-tip-card [message]="msg" (dismissed)="onDismissMessage($event)" />
            }
          </div>
        </div>
      }

      <!-- Inline Tips -->
      @if (uiMessages.inlineTips().length > 0) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          @for (msg of uiMessages.inlineTips(); track msg.id) {
            <div class="bg-[#F9F4EB]/60 border-2 border-black px-5 py-4 flex items-start gap-3 mb-4 last:mb-0 shadow-[2px_2px_0px_0px_#000]">
              <span class="mt-0.5 flex-shrink-0 text-[#111111]">
                <lucide-icon [img]="Zap" [size]="20" [strokeWidth]="2.5"></lucide-icon>
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-sm md:text-base font-bold text-[#111111]">{{ msg.title }}</p>
                <p *ngIf="msg.body" class="text-sm font-medium text-[#111111]/70 mt-1">{{ msg.body }}</p>
              </div>
              <button *ngIf="msg.dismissible" (click)="onDismissMessage(msg.id)" class="flex-shrink-0 text-[#111111] hover:text-[#FA4B28] transition-colors p-1" aria-label="Dismiss">
                <lucide-icon [img]="XIcon" [size]="20" [strokeWidth]="3"></lucide-icon>
              </button>
            </div>
          }
        </div>
      }

      <!-- How It Works - 3 Steps -->
      <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div class="max-w-7xl mx-auto">
          <h2 class="font-display tracking-tighter text-4xl md:text-5xl font-bold text-[#111111] text-center mb-12">
            Three steps. That's it.
          </h2>

          <div class="grid md:grid-cols-3 gap-6 md:gap-8">
            <!-- Step 1 -->
            <div class="bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgb(255_198_11)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgb(255_198_11)] transition-all duration-200">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-[#FFC60B] border-2 border-black flex items-center justify-center mb-6">
                <span class="font-display text-2xl md:text-3xl font-bold text-[#111111]">1</span>
              </div>
              <h3 class="font-display text-xl md:text-2xl font-bold text-[#111111] mb-3">Create your Store</h3>
              <p class="text-[#111111]/70 font-medium">Sign up and set up your storefront in under a minute. No code needed.</p>
            </div>

            <!-- Step 2 -->
            <div class="bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgb(124_58_237)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgb(124_58_237)] transition-all duration-200 mt-0 md:mt-8">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-[#7C3AED] border-2 border-black flex items-center justify-center mb-6">
                <span class="font-display text-2xl md:text-3xl font-bold text-white">2</span>
              </div>
              <h3 class="font-display text-xl md:text-2xl font-bold text-[#111111] mb-3">Add your products</h3>
              <p class="text-[#111111]/70 font-medium">Upload digital files, physical goods, or memberships. Up to 20GB per file.</p>
            </div>

            <!-- Step 3 -->
            <div class="bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgb(104_224_121)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgb(104_224_121)] transition-all duration-200 mt-0 md:mt-16">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-[#68E079] border-2 border-black flex items-center justify-center mb-6">
                <span class="font-display text-2xl md:text-3xl font-bold text-[#111111]">3</span>
              </div>
              <h3 class="font-display text-xl md:text-2xl font-bold text-[#111111] mb-3">Share & sell</h3>
              <p class="text-[#111111]/70 font-medium">Share your shop link anywhere. Accept payments via Stripe, PayPal, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Quick Sell Section -->
      <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#111111] border-b-2 border-black">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="font-display tracking-tighter text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Why sellers choose us
            </h2>
            <p class="text-[#F9F4EB]/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">Built for speed. Designed for simplicity. No competitor comes close.</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div *ngFor="let benefit of benefits; let i = index" class="bg-[#111111] border-2 border-white p-6 md:p-8 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_#fff] transition-all duration-300">
              <div class="w-12 h-12 bg-white border-2 border-white flex items-center justify-center mb-6">
                <lucide-icon [img]="benefit.icon" [size]="24" [strokeWidth]="2.5" color="#111111"></lucide-icon>
              </div>
              <h4 class="font-display font-bold text-white text-xl mb-3">{{ benefit.title }}</h4>
              <p class="text-white/70 font-medium">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- What You Can Sell -->
      <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F4EB] border-b-2 border-black">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="font-display tracking-tighter text-4xl md:text-5xl font-bold text-[#111111] mb-6">
            Sell anything. Seriously.
          </h2>
          <p class="text-lg md:text-xl text-[#111111]/70 max-w-2xl mx-auto mb-12 font-medium">
            Digital downloads, physical goods, subscriptions - all from one simple storefront.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            <div *ngFor="let item of sellableItems" class="bg-white border-2 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200 flex flex-col items-center">
              <lucide-icon [img]="item.icon" [size]="32" [strokeWidth]="2" color="#111111" class="mb-4"></lucide-icon>
              <span class="text-sm md:text-base font-bold text-[#111111]">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div class="max-w-7xl mx-auto">
          <h2 class="font-display tracking-tighter text-4xl md:text-5xl font-bold text-[#111111] text-center mb-12">
            Loved by creators
          </h2>

          <div class="grid md:grid-cols-3 gap-6 md:gap-8">
            <div *ngFor="let testimonial of testimonials"
                 class="p-6 md:p-8 border-2 border-black transition-all duration-200"
                 [ngClass]="{
                   'bg-[#111111] text-white shadow-[6px_6px_0px_0px_rgb(250_75_40)]': testimonial.featured, 
                   'bg-white text-[#111111] shadow-[6px_6px_0px_0px_#000]': !testimonial.featured
                  }">
              <p class="mb-6 font-medium text-lg leading-relaxed">
                "{{ testimonial.quote }}"
              </p>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 border-2 border-black flex-shrink-0" [style.background-color]="testimonial.color"></div>
                <span class="font-display font-bold text-lg">{{ testimonial.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black bg-[#F9F4EB]">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-display tracking-tighter text-4xl md:text-5xl font-bold text-[#111111] text-center mb-12">
            Questions? Answered.
          </h2>

          <div class="border-2 border-black bg-white shadow-[8px_8px_0px_0px_#000]">
            <div *ngFor="let faq of faqs; let last = last" [class.border-b-2]="!last" class="border-black">
              <button
                (click)="toggleFaq(faq.id)"
                class="w-full text-left px-6 py-5 md:py-6 flex items-center justify-between font-bold text-[#111111] hover:bg-[#F9F4EB] transition-colors duration-200 text-lg md:text-xl">
                {{ faq.question }}
                <div class="w-8 h-8 border-2 border-black flex items-center justify-center bg-white flex-shrink-0 ml-4 group-hover:bg-[#FFC60B]">
                  <lucide-icon [img]="ChevronDown" [size]="20" [strokeWidth]="3" class="transform transition-transform duration-200" [class.rotate-180]="faq.isOpen"></lucide-icon>
                </div>
              </button>
              <div class="overflow-hidden transition-all duration-300 bg-white" [class.max-h-0]="!faq.isOpen" [class.max-h-96]="faq.isOpen">
                <p class="text-[#111111]/80 px-6 pb-6 font-medium text-base md:text-lg border-t-2 border-black mt-0 pt-4">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <h2 class="font-display tracking-tighter text-5xl md:text-7xl font-bold text-[#111111] mb-6">
            Ready to sell?
          </h2>
          <p class="text-xl md:text-2xl text-[#111111]/70 mb-10 font-bold">No signup fees. No monthly charges. Just start.</p>
          <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center justify-center px-10 py-5 bg-[#7C3AED] text-white border-2 border-black font-display font-bold text-xl md:text-2xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer">
            Create your free store
            <lucide-icon [img]="ArrowRight" [size]="28" [strokeWidth]="3" class="ml-3"></lucide-icon>
          </a>
        </div>
      </section>
    </div>

    <!-- UI Messages: Footer Banners -->
    @for (msg of uiMessages.footerBanners(); track msg.id) {
      <app-ui-banner [message]="msg" (dismissed)="onDismissMessage($event)" />
    }

    <!-- UI Messages: Toasts -->
    <app-ui-notification-container />
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  readonly uiMessages = inject(UiMessageService);

  readonly ArrowRight = ArrowRight;
  readonly ChevronDown = ChevronDown;
  readonly Zap = Zap;
  readonly XIcon = X;

  constructor() {
    effect(() => {
      if (this.authService.isLoaded() && this.authService.isSignedIn() && this.authService.isCreator()) {
        this.router.navigate(['/explore']);
      }
    });
  }

  async handleCreatorCtaClick(event: Event) {
    if (this.authService.isSignedIn()) return;
    event.preventDefault();
    await this.authService.openCreatorSignup();
  }

  benefits: { icon: LucideIconData; title: string; description: string }[] = [
    {
      icon: Zap,
      title: 'Instant setup',
      description: 'Go from zero to live store in under 60 seconds. No tech skills required.'
    },
    {
      icon: Banknote,
      title: 'Completely free',
      description: 'No subscription fees, no transaction cuts, no hidden charges. Keep 100% of your revenue.'
    },
    {
      icon: CreditCard,
      title: 'All payments',
      description: 'Stripe, PayPal, Apple Pay, Google Pay, cards - payments go straight to you.'
    },
    {
      icon: HardDrive,
      title: 'Large file support',
      description: 'Upload files up to 20GB. Perfect for courses, software, video packs, and more.'
    },
  ];

  sellableItems: { icon: LucideIconData; name: string }[] = [
    { icon: BookOpen, name: 'eBooks' },
    { icon: Music, name: 'Music' },
    { icon: Film, name: 'Videos' },
    { icon: Paintbrush, name: 'Graphics' },
    { icon: Code, name: 'Software' },
    { icon: Camera, name: 'Photos' },
    { icon: Package, name: 'Physical' },
    { icon: Users, name: 'Memberships' },
    { icon: LayoutTemplate, name: 'Templates' },
    { icon: GraduationCap, name: 'Courses' },
  ];

  testimonials = [
    {
      name: 'Linda Skuja',
      quote: "Literally two clicks and it's done. The fastest checkout I've ever seen.",
      color: '#FA4B28',
      featured: false
    },
    {
      name: 'Brayden McPhee',
      quote: 'So simple my mum could use it. I was selling within minutes.',
      color: '#2B57D6',
      featured: true
    },
    {
      name: 'EfikZara',
      quote: 'The experience is so effortless that conversion rates are through the roof.',
      color: '#68E079',
      featured: false
    },
  ];

  faqs = [
    {
      id: 1,
      question: 'Is it really free?',
      answer: 'Yes, completely free. No subscription fees, no transaction fees, no hidden charges. You keep 100% of your sales revenue.',
      isOpen: false
    },
    {
      id: 2,
      question: 'What payment methods are supported?',
      answer: 'Stripe, PayPal, Apple Pay, Google Pay, and all major credit/debit cards. Payments go directly to your account.',
      isOpen: false
    },
    {
      id: 3,
      question: 'What can I sell?',
      answer: 'Digital downloads (eBooks, music, videos, software, graphics), physical products, memberships, subscriptions - virtually anything.',
      isOpen: false
    },
    {
      id: 4,
      question: "What's the file size limit?",
      answer: 'You can upload files up to 20GB per product. There are no limits on overall storage.',
      isOpen: false
    },
    {
      id: 5,
      question: 'Do I need coding skills?',
      answer: 'Not at all. Set up your shop, add products, and start selling - all without writing a single line of code.',
      isOpen: false
    },
  ];

  ngOnInit() {
    this.uiMessages.loadMessages('homepage');
  }

  onDismissMessage(messageId: string): void {
    this.uiMessages.dismiss(messageId);
  }

  toggleFaq(id: number) {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      faq.isOpen = !faq.isOpen;
    }
  }
}
