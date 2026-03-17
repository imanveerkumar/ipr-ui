import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Hero -->
      <section class="hero-section">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/" class="breadcrumb-link">Home</a>
            <svg class="breadcrumb-sep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            <span class="breadcrumb-current">Contact Us</span>
          </nav>
          <h1 class="page-title">Contact Us</h1>
          <p class="page-subtitle">Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </section>

      <!-- Content -->
      <section class="content-section">
        <div class="container">
          <div class="grid">
            <!-- Contact Form -->
            <div class="card form-card">
              <h2 class="section-heading">Send us a message</h2>

              @if (submitted) {
                <div class="success-msg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div>
                    <strong>Message sent!</strong>
                    <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              } @else {
                <form (ngSubmit)="onSubmit()" class="form">
                  <div class="form-group">
                    <label for="name" class="label">Name</label>
                    <input id="name" type="text" [(ngModel)]="form.name" name="name" class="input" placeholder="Your name" required />
                  </div>
                  <div class="form-group">
                    <label for="email" class="label">Email</label>
                    <input id="email" type="email" [(ngModel)]="form.email" name="email" class="input" placeholder="you&#64;example.com" required />
                  </div>
                  <div class="form-group">
                    <label for="subject" class="label">Subject</label>
                    <select id="subject" [(ngModel)]="form.subject" name="subject" class="input">
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="creator">Creator Account</option>
                      <option value="report">Report an Issue</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="message" class="label">Message</label>
                    <textarea id="message" [(ngModel)]="form.message" name="message" class="input textarea" placeholder="Tell us what's on your mind..." rows="5" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-submit" [disabled]="!form.name || !form.email || !form.message">
                    Send Message
                  </button>
                </form>
              }
            </div>

            <!-- Contact Info Sidebar -->
            <div class="sidebar">
              <div class="card info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3>Email</h3>
                <p>support&#64;thebluemustard.com</p>
              </div>

              <div class="card info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3>Social</h3>
                <div class="social-links">
                  <a href="https://twitter.com/mannveer_" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                  <a href="https://instagram.com/manveer.png" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
              </div>

              <div class="card info-card">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3>Response Time</h3>
                <p>We typically respond within 24–48 hours on business days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--background);
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero */
    .hero-section {
      padding: 2rem 0 1.5rem;
      border-bottom: 2px solid var(--border);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--foreground);
      text-decoration: none;
    }

    .breadcrumb-link:hover { color: var(--primary); }
    .breadcrumb-sep { color: var(--foreground); opacity: 0.4; }

    .breadcrumb-current {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--foreground);
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--foreground);
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--muted);
      margin: 0;
      font-weight: 500;
    }

    /* Content */
    .content-section {
      padding: 2rem 0 4rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .grid { grid-template-columns: 1.5fr 1fr; }
    }

    .card {
      background: var(--surface);
      border: 2px solid var(--border);
      box-shadow: 4px 4px 0px 0px var(--border);
      padding: 2rem;
    }

    .section-heading {
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--foreground);
      margin: 0 0 1.5rem;
    }

    /* Form */
    .form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--foreground);
    }

    .input {
      padding: 0.75rem;
      border: 2px solid var(--border);
      background: var(--secondary);
      font-size: 1rem;
      font-family: inherit;
      color: var(--foreground);
      outline: none;
      transition: box-shadow 0.15s;
    }

    .input::placeholder {
      color: var(--muted);
    }

    .input:focus {
      box-shadow: 3px 3px 0px 0px var(--primary);
    }

    .textarea {
      resize: vertical;
      min-height: 120px;
    }

    .btn-submit {
      align-self: flex-start;
      padding: 0.875rem 2rem;
      background: var(--accent);
      color: var(--on-accent);
      font-size: 1rem;
      font-weight: 800;
      border: 2px solid var(--border);
      box-shadow: 4px 4px 0px 0px var(--border);
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      font-family: inherit;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px 0px var(--border);
    }

    .btn-submit:active:not(:disabled) {
      transform: translate(0, 0);
      box-shadow: none;
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Success */
    .success-msg {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1.25rem;
      background: var(--success);
      border: 2px solid var(--border);
      color: var(--on-success);
    }

    .success-msg strong {
      display: block;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }

    .success-msg p {
      margin: 0;
      font-size: 0.95rem;
      opacity: 0.95;
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-card {
      padding: 1.5rem;
    }

    .info-icon {
      width: 44px;
      height: 44px;
      background: var(--accent);
      border: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      color: var(--on-accent);
    }

    .info-card h3 {
      font-size: 1rem;
      font-weight: 800;
      color: var(--foreground);
      margin: 0 0 0.5rem;
    }

    .info-card p {
      font-size: 0.925rem;
      color: var(--muted);
      margin: 0;
      line-height: 1.5;
    }

    .social-links {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .social-links a {
      color: var(--primary);
      font-size: 0.925rem;
      font-weight: 600;
      text-decoration: underline;
    }

    .social-links a:hover { color: var(--foreground); }

    @media (max-width: 640px) {
      .container { padding: 0 1rem; }
      .page-title { font-size: 1.75rem; }
      .card { padding: 1.5rem 1.25rem; }
    }
  `]
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  submitted = false;

  onSubmit() {
    // In a real app, this would call an API endpoint
    this.submitted = true;
  }
}
