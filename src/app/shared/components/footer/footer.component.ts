import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <!-- TOP SECTION (RED with Grid) -->
      <div class="footer-top">
        <div class="wave-border-top"></div>
        
        <div class="cta-container">
          <!-- Ticket -->
          <div class="ticket">
            <strong>CREATE</strong>
            <span>Your Store</span>
          </div>

          <!-- Main CTA Button -->
          <a routerLink="/become-creator" class="book-btn">
            <u>Get Started</u>
          </a>

          <!-- Starburst -->
          <div class="starburst">
            Sale!
          </div>
        </div>

        <div class="wave-border"></div>
      </div>

      <!-- BOTTOM SECTION (BEIGE) -->
      <div class="footer-bottom">
        <div class="bottom-content">
          <!-- Expandable Section -->
          <div class="expandable-section">
            <button (click)="toggleExpanded()" class="expand-btn">
              More Info <span [class.rotated]="isExpanded">▼</span>
            </button>
            <div *ngIf="isExpanded" class="expanded-content">
              <a href="#" class="footer-link">Privacy Policy</a>
              <a href="#" class="footer-link">About</a>
              <a href="#" class="footer-link">Contact Us</a>
              <a href="#" class="footer-link">Terms of Service</a>
              <a href="#" class="footer-link">FAQ</a>
            </div>
          </div>

          <!-- Logo and Social Row -->
          <div class="logo-row">
            <div class="logo-container">
              <span class="logo-text">StoresCraft</span>
              <div class="mascot">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="white" stroke="black" stroke-width="3"/>
                  <path d="M30 40C30 40 35 35 40 40" stroke="black" stroke-width="3" stroke-linecap="round"/>
                  <path d="M60 40C60 40 65 35 70 40" stroke="black" stroke-width="3" stroke-linecap="round"/>
                  <path d="M30 65C30 65 50 80 70 65" stroke="black" stroke-width="3" stroke-linecap="round"/>
                  <path d="M75 55L90 45" stroke="black" stroke-width="3" stroke-linecap="round"/>
                  <circle cx="85" cy="40" r="2" fill="black"/>
                </svg>
              </div>
            </div>

            <div class="social-icons">
              <a href="#" class="social-icon" aria-label="Twitter/X">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* === CSS Variables === */
    :host {
      --bg-red: #FA4B28;
      --bg-beige: #F9F4EB;
      --btn-yellow: #FFC60B;
      --ticket-green: #68E079;
      --star-blue: #2B57D6;
      --text-black: #111111;
      --grid-line: rgba(0, 0, 0, 0.8);
      
      display: block;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
    }

    /* === TOP SECTION (RED) === */
    .footer-top {
      position: relative;
      background-color: var(--bg-red);
      background-image: 
        linear-gradient(var(--grid-line) 2px, transparent 2px),
        linear-gradient(90deg, var(--grid-line) 2px, transparent 2px);
      background-size: 50px 50px;
      background-position: center top;
      padding: 60px 16px 100px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-top: 2px solid var(--text-black);
    }

    @media (min-width: 768px) {
      .footer-top {
        background-size: 100px 100px;
        padding: 80px 20px 120px 20px;
      }
    }

    /* Scalloped Wave Border - Bottom */
    .wave-border {
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 30px;
      background-color: transparent;
      background-image: radial-gradient(circle at 20px 0, transparent 20px, var(--bg-beige) 21px);
      background-size: 40px 30px;
      background-repeat: repeat-x;
    }

    @media (min-width: 768px) {
      .wave-border {
        height: 40px;
        background-image: radial-gradient(circle at 25px 0, transparent 25px, var(--bg-beige) 26px);
        background-size: 50px 40px;
      }
    }

    /* Scalloped Wave Border - Top */
    .wave-border-top {
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 25px;
      background-image: radial-gradient(circle at 20px 25px, var(--bg-red) 20px, transparent 21px);
      background-size: 40px 25px;
      background-repeat: repeat-x;
      z-index: 10;
    }

    @media (min-width: 768px) {
      .wave-border-top {
        height: 30px;
        background-image: radial-gradient(circle at 25px 30px, var(--bg-red) 25px, transparent 26px);
        background-size: 50px 30px;
      }
    }

    /* CTA Container */
    .cta-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 30px;
      width: 100%;
      max-width: 1000px;
      position: relative;
    }

    @media (min-width: 768px) {
      .cta-container {
        flex-direction: row;
        gap: 60px;
      }
    }

    /* === TICKET === */
    .ticket {
      background-color: var(--ticket-green);
      border: 2px solid var(--text-black);
      padding: 12px 24px;
      transform: rotate(-10deg);
      box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
      text-align: center;
      font-family: 'DM Sans', sans-serif;
      text-transform: uppercase;
      font-size: 12px;
      line-height: 1.2;
      position: relative;
    }

    @media (min-width: 768px) {
      .ticket {
        padding: 15px 30px;
        font-size: 14px;
      }
    }

    .ticket strong {
      display: block;
      font-size: 10px;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }

    @media (min-width: 768px) {
      .ticket strong {
        font-size: 12px;
      }
    }

    .ticket span {
      font-family: 'Caveat', cursive;
      font-size: 22px;
      text-transform: none;
      display: block;
      transform: rotate(-5deg);
    }

    @media (min-width: 768px) {
      .ticket span {
        font-size: 28px;
      }
    }

    /* === MAIN BUTTON === */
    .book-btn {
      background-color: var(--btn-yellow);
      border: 3px solid var(--text-black);
      padding: 12px 40px;
      border-radius: 50px;
      font-family: 'Caveat', cursive;
      font-size: 32px;
      color: var(--text-black);
      text-decoration: none;
      box-shadow: 6px 8px 0px var(--text-black);
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      z-index: 5;
      display: inline-block;
    }

    @media (min-width: 768px) {
      .book-btn {
        padding: 15px 60px;
        font-size: 42px;
        box-shadow: 8px 10px 0px var(--text-black);
      }
    }

    .book-btn u {
      text-decoration-thickness: 3px;
    }

    .book-btn:hover {
      transform: translate(2px, 2px);
      box-shadow: 4px 6px 0px var(--text-black);
    }

    @media (min-width: 768px) {
      .book-btn:hover {
        box-shadow: 6px 8px 0px var(--text-black);
      }
    }

    /* === STARBURST === */
    .starburst {
      width: 90px;
      height: 90px;
      background: var(--star-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Caveat', cursive;
      font-size: 24px;
      transform: rotate(15deg);
      clip-path: polygon(
        20% 0%, 30% 10%, 45% 0%, 55% 10%, 70% 0%, 80% 10%, 95% 0%, 
        100% 20%, 90% 30%, 100% 45%, 90% 55%, 100% 70%, 90% 80%, 100% 95%,
        80% 100%, 70% 90%, 55% 100%, 45% 90%, 30% 100%, 20% 90%, 5% 100%, 
        0% 80%, 10% 70%, 0% 55%, 10% 45%, 0% 30%, 10% 20%, 0% 5%
      );
    }

    @media (min-width: 768px) {
      .starburst {
        width: 120px;
        height: 120px;
        font-size: 32px;
      }
    }

    /* === BOTTOM SECTION (BEIGE) === */
    .footer-bottom {
      background-color: var(--bg-beige);
      padding: 40px 20px 30px 20px;
      color: var(--text-black);
    }

    @media (min-width: 768px) {
      .footer-bottom {
        padding: 60px 40px 40px 40px;
      }
    }

    .bottom-content {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    @media (min-width: 768px) {
      .bottom-content {
        gap: 40px;
      }
    }

    /* Description Text */
    .footer-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      max-width: 500px;
      text-align: center;
      align-self: center;
    }

    @media (min-width: 768px) {
      .footer-text {
        font-size: 18px;
        text-align: left;
        align-self: flex-end;
      }
    }

    /* Expandable Section */
    .expandable-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    @media (min-width: 768px) {
      .expandable-section {
        align-items: flex-end;
      }
    }

    .expand-btn {
      background: none;
      border: 2px solid var(--text-black);
      padding: 8px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--text-black);
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.2s;
    }

    .expand-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .expand-btn span {
      transition: transform 0.3s;
      font-size: 12px;
    }

    .expand-btn span.rotated {
      transform: rotate(180deg);
    }

    .expanded-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 200px;
    }

    @media (min-width: 768px) {
      .expanded-content {
        flex-direction: row;
        gap: 16px;
        max-width: none;
      }
    }

    .footer-link {
      color: var(--text-black);
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: var(--bg-red);
      text-decoration: underline;
    }

    /* Logo and Socials Row */
    .logo-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      width: 100%;
    }

    @media (min-width: 768px) {
      .logo-row {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        gap: 30px;
      }
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 48px;
      font-weight: 900;
      color: var(--text-black);
      letter-spacing: -2px;
      line-height: 1;
    }

    @media (min-width: 768px) {
      .logo-text {
        font-size: 80px;
      }
    }

    .mascot {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
    }

    @media (min-width: 768px) {
      .mascot {
        height: 80px;
        width: 80px;
      }
    }

    .mascot svg {
      height: 100%;
      width: auto;
    }

    /* Social Icons */
    .social-icons {
      display: flex;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .social-icons {
        gap: 20px;
      }
    }

    .social-icon {
      text-decoration: none;
      color: var(--text-black);
      border: 2px solid var(--text-black);
      border-radius: 8px;
      width: 44px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 0.2s;
    }

    @media (min-width: 768px) {
      .social-icon {
        width: 50px;
        height: 50px;
      }
    }

    .social-icon:hover {
      background-color: #eee;
    }
  `],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  isExpanded = false;

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
