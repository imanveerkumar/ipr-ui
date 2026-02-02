import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
          <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          <span class="breadcrumb-current">Settings</span>
        </nav>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="page-title">Settings</h1>
            <p class="page-subtitle">Manage your account and preferences</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="card empty-state">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
           <h3 class="empty-title">Coming Soon</h3>
           <p class="empty-description">We're working hard to bring you these features. Stay tuned for updates!</p>
           <a routerLink="/dashboard" class="btn btn-primary">Return to Dashboard</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F9F4EB;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    @media (max-width: 640px) {
      .container {
        padding: 0 1rem;
      }
    }

    /* Hero Section */
    .hero-section {
      background: #F9F4EB;
      padding: 2rem 0;
      border-bottom: 2px solid #111111;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111111;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      color: #2B57D6;
    }

    .breadcrumb-separator {
      color: #111111;
      opacity: 0.4;
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111111;
    }

    .hero-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .hero-text {
      flex: 1;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: #111111;
      margin: 0 0 0.5rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #111111;
      opacity: 0.7;
      margin: 0;
    }
    
    .content-section {
        padding: 2rem 0;
    }

    .card {
      background: #FFFFFF;
      border: 2px solid #111111;
      box-shadow: 4px 4px 0 #111111;
      padding: 1.5rem;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }
    
    .empty-icon {
        margin-bottom: 0.5rem;
        color: #111111;
    }

    .empty-title {
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0;
        color: #111111;
    }
    
    .empty-description {
        color: #111111;
        opacity: 0.7;
        margin: 0;
        max-width: 400px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 700;
      text-decoration: none;
      border: 2px solid #111111;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #FFFFFF;
      color: #111111;
      box-shadow: 4px 4px 0 #111111;
      border-radius: 0.5rem;
    }

    .btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #111111;
    }

    .btn:active {
        transform: translate(1px, 1px);
        box-shadow: 1px 1px 0 #111111;
    }
    
    .btn-primary {
        background: #FFC60B;
        color: #111111;
    }
    
    .btn-primary:hover {
        background: #ffdb4d;
    }

  `]
})
export class SettingsComponent {}
