import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <!-- BOTTOM SECTION (BEIGE) -->
      <div class="footer-bottom">
        <div class="bottom-content">
          <!-- Expandable Section -->
          <div class="expandable-section">
            <button (click)="toggleExpanded()" class="expand-btn">
              More Info <span [class.rotated]="isExpanded">▼</span>
            </button>
            <div *ngIf="isExpanded" class="expanded-content">
              <a routerLink="/privacy" class="footer-link">Privacy Policy</a>
              <a routerLink="/about" class="footer-link">About</a>
              <a routerLink="/contact" class="footer-link">Contact Us</a>
              <a routerLink="/terms" class="footer-link">Terms of Service</a>
              <a routerLink="/faq" class="footer-link">FAQ</a>
            </div>
          </div>

          <!-- Logo and Social Row -->
          <div class="logo-row">
            <div class="logo-container">
              <span class="logo-text">BlueMustard</span>
              <div class="mascot">
                <svg fill="currentColor" width="60" height="60" viewBox="96.631 514.201 32.951 32.951" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M113.107,547.151a16.475,16.475,0,1,1,16.475-16.475A16.494,16.494,0,0,1,113.107,547.151Zm0-30.95a14.475,14.475,0,1,0,14.475,14.475A14.492,14.492,0,0,0,113.107,516.2Z"/>
                    
                    <path d="M113.107,542.035a8.766,8.766,0,0,1-8.756-8.755,1,1,0,0,1,2,0,6.756,6.756,0,0,0,13.511,0,1,1,0,0,1,2,0A8.766,8.766,0,0,1,113.107,542.035Z"/>
                    
                    <path d="M105.43,530.218a1,1,0,0,1-1-1v-4.862a1,1,0,0,1,2,0v4.862A1,1,0,0,1,105.43,530.218Z"/>
                    
                    <path d="M121.046,530.218a1,1,0,0,1-1-1v-4.862a1,1,0,0,1,2,0v4.862A1,1,0,0,1,121.046,530.218Z"/>
                  </g>
                </svg>
              </div>
            </div>

            <div class="social-icons">
              <a href="https://twitter.com/mannveer_" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Twitter/X">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/manveer.png" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
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
      --bg-red: var(--danger);
      --bg-beige: var(--secondary);
      --text-black: var(--foreground);
      
      display: block;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
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
