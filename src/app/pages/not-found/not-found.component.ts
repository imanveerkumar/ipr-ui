import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container">
        <div class="content-card">
            <h1 class="error-code">404</h1>
            <h2 class="error-title">Page Not Found</h2>
            <p class="error-message">
                Oops! The page you are looking for has vanished or doesn't exist.
            </p>
            <a routerLink="/" class="btn btn-cta">
                Go Back Home
            </a>
        </div>
    </div>
  `,
  styles: [`
    :host {
        display: block;
        min-height: 100vh;
        background-color: #F9F4EB;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .not-found-container {
        width: 100%;
        max-width: 480px;
        text-align: center;
    }

    .content-card {
        background: #ffffff;
        border: 2px solid #111111;
        box-shadow: 4px 4px 0px 0px #111111;
        padding: 3rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .error-code {
        font-size: 6rem;
        font-weight: 900;
        line-height: 1;
        color: #111111;
        margin: 0 0 1rem;
        letter-spacing: -0.05em;
    }

    .error-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #111111;
        margin: 0 0 1rem;
        text-transform: uppercase;
        letter-spacing: -0.02em;
    }

    .error-message {
        font-size: 1rem;
        color: #111111;
        opacity: 0.7;
        margin: 0 0 2rem;
        line-height: 1.5;
        max-width: 300px;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.875rem 2rem;
        font-size: 1rem;
        font-weight: 700;
        text-decoration: none;
        border: 2px solid #111111;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.1s;
        font-family: inherit;
        background: #FFC60B;
        color: #111111;
    }

    .btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 4px 4px 0px 0px #111111;
    }

    .btn:active {
        transform: translate(0, 0);
        box-shadow: none;
    }

    @media (max-width: 640px) {
        .content-card {
            padding: 2rem 1.5rem;
        }

        .error-code {
            font-size: 4rem;
        }

        .error-title {
            font-size: 1.25rem;
        }
    }
  `]
})
export class NotFoundComponent {}
