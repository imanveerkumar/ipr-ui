import { Component, ElementRef, HostListener, signal, inject, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { 
  ExploreService, 
  SearchSuggestions, 
  SearchSuggestionProduct, 
  SearchSuggestionStore, 
  SearchSuggestionCreator 
} from '../../../core/services/explore.service';
import { SubdomainService } from '../../../core/services/subdomain.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  styles: [`
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
      width: 100%;
      max-width: 100vw;
    }

    /* === HEADER WRAPPER === */
    .header-wrapper {
      position: sticky;
      top: 0;
      z-index: 50;
    }

    /* === PROMO BANNER === */
    .promo-banner {
      background-color: var(--star-blue);
      background-image: 
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      color: #fff;
      text-align: center;
      padding: 8px 2.5rem 8px 1rem;
      font-size: 0.75rem;
      letter-spacing: 0.3px;
      position: relative;
      border-bottom: 2px solid var(--text-black);
    }

    @media (min-width: 640px) {
      .promo-banner {
        padding: 10px 1rem;
        font-size: 0.8125rem;
      }
    }

    .promo-text {
      font-family: 'DM Sans', sans-serif;
      display: inline-block;
    }

    .promo-highlight {
      font-family: 'Caveat', cursive;
      font-size: 1rem;
      color: var(--btn-yellow);
    }

    @media (min-width: 640px) {
      .promo-highlight {
        font-size: 1.25rem;
      }
    }

    .promo-link {
      color: var(--btn-yellow);
      text-decoration: none;
      font-weight: 600;
      margin-left: 4px;
      transition: opacity 0.2s;
      display: inline-block;
    }

    @media (min-width: 640px) {
      .promo-link {
        margin-left: 8px;
      }
    }

    .promo-link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .promo-close {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      color: #fff;
      cursor: pointer;
      padding: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;
    }

    @media (min-width: 640px) {
      .promo-close {
        right: 1rem;
        padding: 4px;
      }
    }

    .promo-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .promo-close svg {
      width: 14px;
      height: 14px;
    }

    /* === MAIN HEADER === */
    .header {
      background-color: var(--bg-beige);
      border-bottom: 2px solid var(--text-black);
      position: relative;
      margin-bottom: 0;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .header-inner {
        height: 60px;
        gap: 1rem;
      }
    }

    @media (min-width: 768px) {
      .header-container {
        padding: 0 2rem;
      }
      .header-inner {
        height: 72px;
        gap: 2rem;
      }
      .header {
        margin-bottom: 0;
      }
    }

    /* === LOGO === */
    .logo {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      flex-shrink: 0;
      cursor: pointer;
    }

    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 1.25rem;
      font-weight: 900;
      color: var(--text-black);
      letter-spacing: -1px;
      line-height: 1;
    }

    @media (min-width: 640px) {
      .logo {
        gap: 8px;
      }
      .logo-text {
        font-size: 1.5rem;
      }
    }

    @media (min-width: 768px) {
      .logo-text {
        font-size: 1.875rem;
      }
    }

    .mascot {
      display: none;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    @media (min-width: 480px) {
      .mascot {
        display: flex;
      }
    }

    @media (min-width: 640px) {
      .mascot {
        width: 36px;
        height: 36px;
      }
    }

    @media (min-width: 768px) {
      .mascot {
        width: 44px;
        height: 44px;
      }
    }

    .mascot svg {
      width: 100%;
      height: 100%;
    }

    /* === DESKTOP NAVIGATION === */
    .nav-desktop {
      display: none;
      align-items: center;
      gap: 0.25rem;
    }

    @media (min-width: 1024px) {
      .nav-desktop {
        display: flex;
      }
    }

    .nav-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-black);
      text-decoration: none;
      border: 2px solid transparent;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background-color: rgba(0,0,0,0.05);
    }

    .nav-link.active {
      background-color: var(--ticket-green);
      border-color: var(--text-black);
    }

    /* === SEARCH SECTION === */
    .search-section {
      flex: 1;
      max-width: 400px;
      display: none;
    }

    @media (min-width: 768px) {
      .search-section {
        display: block;
      }
    }

    .search-container {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 10px 16px 10px 44px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      color: var(--text-black);
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50px;
      outline: none;
      transition: all 0.2s;
    }

    .search-input::placeholder {
      color: #888;
    }

    .search-input:focus {
      box-shadow: 4px 4px 0px var(--text-black);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #888;
      pointer-events: none;
    }

    /* === ACTIONS SECTION === */
    .actions-section {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      .actions-section {
        gap: 0.75rem;
      }
    }

    .icon-btn {
      position: relative;
      display: none;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-black);
      transition: all 0.2s;
      text-decoration: none;
    }

    @media (min-width: 640px) {
      .icon-btn {
        display: flex;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
    }

    @media (min-width: 768px) {
      .icon-btn {
        width: 44px;
        height: 44px;
      }
    }

    .icon-btn:hover {
      box-shadow: 3px 3px 0px var(--text-black);
      transform: translate(-1px, -1px);
    }

    .icon-btn.active {
      background: var(--ticket-green);
      border-color: var(--text-black);
    }

    .icon-btn svg {
      width: 20px;
      height: 20px;
    }

    .icon-btn-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background: var(--bg-red);
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.6875rem;
      font-weight: 700;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--text-black);
    }

    .mobile-search-btn {
      display: flex;
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }

    @media (min-width: 768px) {
      .mobile-search-btn {
        display: none;
      }
    }

    /* === AUTH BUTTONS === */
    .auth-buttons {
      display: none;
      align-items: center;
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .auth-buttons {
        display: flex;
      }
    }

    .btn-login {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-black);
      padding: 8px 16px;
      background: transparent;
      border: 2px solid var(--text-black);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-login:hover {
      background: rgba(0,0,0,0.05);
    }

    .btn-signup {
      font-family: 'Caveat', cursive;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-black);
      padding: 8px 20px;
      background: var(--btn-yellow);
      border: 2px solid var(--text-black);
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 4px 4px 0px var(--text-black);
    }

    .btn-signup:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--text-black);
    }

    /* === PROFILE BUTTON === */
    .profile-container {
      position: relative;
      display: none;
    }

    @media (min-width: 640px) {
      .profile-container {
        display: block;
      }
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px;
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .profile-btn:hover {
      box-shadow: 3px 3px 0px var(--text-black);
      transform: translate(-1px, -1px);
    }

    .profile-btn.active {
      background: var(--ticket-green);
    }

    .profile-avatar,
    .profile-avatar-placeholder {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--text-black);
    }

    .profile-avatar {
      object-fit: cover;
    }

    .profile-avatar-placeholder {
      background: var(--star-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .profile-info {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      padding-right: 8px;
    }

    @media (min-width: 640px) {
      .profile-info {
        display: flex;
      }
    }

    .profile-greeting {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.625rem;
      color: #666;
    }

    .profile-name {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-black);
    }

    .profile-chevron {
      display: none;
      width: 16px;
      height: 16px;
      color: var(--text-black);
      transition: transform 0.2s;
      margin-right: 4px;
    }

    @media (min-width: 640px) {
      .profile-chevron {
        display: block;
      }
    }

    .profile-btn.active .profile-chevron {
      transform: rotate(180deg);
    }

    /* === HAMBURGER BUTTON === */
    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 2px solid var(--text-black);
      background: var(--btn-yellow);
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
      box-shadow: 2px 2px 0px var(--text-black);
      flex-shrink: 0;
    }

    @media (min-width: 640px) {
      .hamburger-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        box-shadow: 3px 3px 0px var(--text-black);
      }
    }

    @media (min-width: 1024px) {
      .hamburger-btn {
        display: none;
      }
    }

    .hamburger-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0px var(--text-black);
    }

    .hamburger-btn:active {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--text-black);
    }

    .hamburger-btn.active {
      background: var(--bg-red);
    }

    .hamburger-icon {
      width: 18px;
      height: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    @media (min-width: 640px) {
      .hamburger-icon {
        width: 20px;
        height: 14px;
      }
    }

    .hamburger-line {
      width: 100%;
      height: 2px;
      background: var(--text-black);
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
    }

    .hamburger-btn.active .hamburger-line:nth-child(1) {
      transform: translateY(5px) rotate(45deg);
    }

    .hamburger-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .hamburger-btn.active .hamburger-line:nth-child(3) {
      transform: translateY(-5px) rotate(-45deg);
    }

    @media (min-width: 640px) {
      .hamburger-btn.active .hamburger-line:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }
      .hamburger-btn.active .hamburger-line:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }
    }

    /* === DROPDOWN MENU === */
    .dropdown-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      width: 240px;
      background: var(--bg-beige);
      border: 2px solid var(--text-black);
      border-radius: 12px;
      box-shadow: 6px 6px 0px var(--text-black);
      padding: 8px;
      z-index: 1000;
      animation: dropdown-enter 0.2s ease-out;
    }

    @keyframes dropdown-enter {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      padding: 12px;
      border-bottom: 2px dashed var(--text-black);
      margin-bottom: 8px;
    }

    .dropdown-user-email {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8125rem;
      color: #666;
      margin: 0;
      word-break: break-word;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-black);
      text-decoration: none;
      background: none;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .dropdown-item:hover {
      background: var(--ticket-green);
    }

    .dropdown-item svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .dropdown-divider {
      height: 2px;
      background: var(--text-black);
      margin: 8px 4px;
      opacity: 0.2;
    }

    .dropdown-item.danger {
      color: #dc2626;
    }

    .dropdown-item.danger:hover {
      background: #fecaca;
    }

    /* === MOBILE MENU === */
    .mobile-menu-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 45;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    }

    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .mobile-menu {
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      max-width: 90vw;
      background: var(--bg-beige);
      z-index: 55;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 2px solid var(--text-black);
      overflow-y: auto;
    }

    @media (min-width: 640px) {
      .mobile-menu {
        width: 360px;
      }
    }

    @media (min-width: 1024px) {
      .mobile-menu,
      .mobile-menu-overlay {
        display: none !important;
      }
    }

    .mobile-menu.active {
      transform: translateX(0);
    }

    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 2px solid var(--text-black);
      background: #fff;
    }

    .mobile-menu-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 2px solid var(--text-black);
      background: var(--bg-red);
      border-radius: 8px;
      cursor: pointer;
      color: #fff;
      transition: all 0.2s;
    }

    .mobile-menu-close:hover {
      box-shadow: 2px 2px 0px var(--text-black);
    }

    .mobile-menu-close svg {
      width: 18px;
      height: 18px;
    }

    /* === MOBILE SEARCH === */
    .mobile-search {
      padding: 1rem 1.25rem;
      border-bottom: 2px dashed var(--text-black);
    }

    .mobile-search-container {
      position: relative;
    }

    .mobile-search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      color: var(--text-black);
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50px;
      outline: none;
    }

    .mobile-search-input:focus {
      box-shadow: 3px 3px 0px var(--text-black);
    }

    .mobile-search-container .search-icon {
      left: 14px;
    }

    /* === MOBILE USER INFO === */
    .mobile-user-info {
      padding: 1.25rem;
      background: linear-gradient(135deg, var(--ticket-green), #a8f0b0);
      border-bottom: 2px solid var(--text-black);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--text-black);
    }

    .mobile-user-avatar-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--star-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      border: 2px solid var(--text-black);
      flex-shrink: 0;
    }

    .mobile-user-details {
      flex: 1;
      min-width: 0;
    }

    .mobile-user-greeting {
      font-family: 'Caveat', cursive;
      font-size: 1rem;
      color: var(--text-black);
      margin: 0 0 2px;
    }

    .mobile-user-email {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-black);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* === MOBILE NAV === */
    .mobile-nav {
      padding: 1rem;
    }

    .mobile-nav-section {
      margin-bottom: 0.5rem;
    }

    .mobile-nav-section-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      padding: 0.5rem 1rem;
      margin: 0;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-black);
      border: 2px solid transparent;
      border-radius: 10px;
      margin: 4px 0;
      transition: all 0.2s;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }

    .mobile-nav-link:hover,
    .mobile-nav-link:active {
      background: rgba(0,0,0,0.05);
    }

    .mobile-nav-link.active {
      background: var(--btn-yellow);
      border-color: var(--text-black);
      box-shadow: 3px 3px 0px var(--text-black);
    }

    .mobile-nav-link svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .mobile-nav-badge {
      background: var(--bg-red);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: auto;
      border: 2px solid var(--text-black);
    }

    .mobile-nav-divider {
      height: 2px;
      background: var(--text-black);
      margin: 1rem 0.5rem;
      opacity: 0.15;
    }

    .mobile-nav-link.danger {
      color: #dc2626;
    }

    .mobile-nav-link.danger:hover {
      background: #fecaca;
    }

    /* === MOBILE AUTH === */
    .mobile-auth-section {
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-top: 2px dashed var(--text-black);
      margin-top: auto;
    }

    .mobile-auth-btn-primary {
      font-family: 'Caveat', cursive;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-black);
      padding: 12px 24px;
      background: var(--btn-yellow);
      border: 2px solid var(--text-black);
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 4px 4px 0px var(--text-black);
      text-align: center;
    }

    .mobile-auth-btn-primary:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px var(--text-black);
    }

    .mobile-auth-btn-secondary {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-black);
      padding: 12px 24px;
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .mobile-auth-btn-secondary:hover {
      background: rgba(0,0,0,0.05);
    }

    /* === SKELETON LOADER === */
    .skeleton-loader {
      width: 40px;
      height: 40px;
      background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 50%;
      border: 2px solid var(--text-black);
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* === SEARCH DROPDOWN === */
    .search-dropdown-wrapper {
      position: relative;
      width: 100%;
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--bg-beige);
      border: 2px solid var(--text-black);
      border-radius: 16px;
      box-shadow: 6px 6px 0px var(--text-black);
      z-index: 100;
      max-height: 70vh;
      overflow-y: auto;
      animation: dropdown-enter 0.2s ease-out;
    }

    .search-dropdown-section {
      padding: 12px;
      border-bottom: 2px dashed var(--text-black);
    }

    .search-dropdown-section:last-child {
      border-bottom: none;
    }

    .search-dropdown-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .search-dropdown-section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin: 0;
    }

    .search-dropdown-section-title svg {
      width: 16px;
      height: 16px;
    }

    .search-dropdown-section-badge {
      background: var(--text-black);
      color: #fff;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
    }

    .search-dropdown-see-all {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--star-blue);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: opacity 0.2s;
    }

    .search-dropdown-see-all:hover {
      opacity: 0.7;
    }

    .search-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s;
      text-decoration: none;
      color: inherit;
    }

    .search-item:hover,
    .search-item.active {
      background: rgba(0, 0, 0, 0.05);
    }

    .search-item-image {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 2px solid var(--text-black);
      object-fit: cover;
      flex-shrink: 0;
      background: #fff;
    }

    .search-item-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid var(--text-black);
      object-fit: cover;
      flex-shrink: 0;
      background: var(--star-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
    }

    .search-item-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .search-item-image-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 2px solid var(--text-black);
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .search-item-image-placeholder svg {
      width: 20px;
      height: 20px;
      color: #999;
    }

    .search-item-content {
      flex: 1;
      min-width: 0;
    }

    .search-item-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-black);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-item-subtitle {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      color: #666;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-item-price {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-black);
      flex-shrink: 0;
    }

    .search-item-badge {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.625rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 12px;
      background: var(--ticket-green);
      border: 1px solid var(--text-black);
      color: var(--text-black);
      flex-shrink: 0;
    }

    .search-empty {
      padding: 24px 16px;
      text-align: center;
    }

    .search-empty-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 12px;
      background: var(--bg-beige);
      border: 2px solid var(--text-black);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-empty-icon svg {
      width: 24px;
      height: 24px;
      color: #666;
    }

    .search-empty-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #666;
      margin: 0 0 4px;
    }

    .search-empty-hint {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      color: #999;
      margin: 0;
    }

    .search-loading {
      padding: 24px 16px;
      text-align: center;
    }

    .search-loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e0e0e0;
      border-top-color: var(--btn-yellow);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .search-loading-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .search-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 45;
      display: none;
    }

    .search-overlay.active {
      display: block;
    }

    /* === MOBILE SEARCH OVERLAY === */
    .mobile-search-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg-beige);
      z-index: 60;
      display: flex;
      flex-direction: column;
      transform: translateY(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .mobile-search-overlay.active {
      transform: translateY(0);
    }

    @media (min-width: 768px) {
      .mobile-search-overlay {
        display: none !important;
      }
    }

    .mobile-search-overlay-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 2px solid var(--text-black);
      background: #fff;
    }

    .mobile-search-overlay-back {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 2px solid var(--text-black);
      background: #fff;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .mobile-search-overlay-back:hover {
      background: var(--bg-beige);
    }

    .mobile-search-overlay-back svg {
      width: 20px;
      height: 20px;
      color: var(--text-black);
    }

    .mobile-search-overlay-input-container {
      flex: 1;
      position: relative;
    }

    .mobile-search-overlay-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      color: var(--text-black);
      background: var(--bg-beige);
      border: 2px solid var(--text-black);
      border-radius: 50px;
      outline: none;
    }

    .mobile-search-overlay-input:focus {
      box-shadow: 3px 3px 0px var(--text-black);
    }

    .mobile-search-overlay-input-container .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #888;
      pointer-events: none;
    }

    .mobile-search-overlay-body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .mobile-search-tabs {
      display: flex;
      padding: 12px 16px;
      gap: 8px;
      border-bottom: 2px dashed var(--text-black);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .mobile-search-tabs::-webkit-scrollbar {
      display: none;
    }

    .mobile-search-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-black);
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .mobile-search-tab.active {
      background: var(--btn-yellow);
      box-shadow: 2px 2px 0px var(--text-black);
    }

    .mobile-search-tab svg {
      width: 16px;
      height: 16px;
    }

    .mobile-search-results {
      padding: 12px 16px;
    }

    .mobile-search-results-empty {
      padding: 48px 16px;
      text-align: center;
    }

    .mobile-search-results-empty-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: #fff;
      border: 2px solid var(--text-black);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-search-results-empty-icon svg {
      width: 32px;
      height: 32px;
      color: #999;
    }

    .mobile-search-results-empty-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-black);
      margin: 0 0 4px;
    }

    .mobile-search-results-empty-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .mobile-search-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s;
      margin-bottom: 8px;
      background: #fff;
      border: 2px solid var(--text-black);
    }

    .mobile-search-item:active {
      transform: scale(0.98);
    }

    .mobile-search-item-image {
      width: 56px;
      height: 56px;
      border-radius: 10px;
      border: 2px solid var(--text-black);
      object-fit: cover;
      flex-shrink: 0;
      background: #f0f0f0;
    }

    .mobile-search-item-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid var(--text-black);
      object-fit: cover;
      flex-shrink: 0;
      background: var(--star-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .mobile-search-item-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .mobile-search-item-content {
      flex: 1;
      min-width: 0;
    }

    .mobile-search-item-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-black);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-search-item-subtitle {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #666;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-search-item-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    .mobile-search-item-price {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-black);
    }

    .mobile-search-item-badge {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 12px;
      background: var(--ticket-green);
      border: 1px solid var(--text-black);
      color: var(--text-black);
    }
  `],
  template: `
    <div class="header-wrapper">
      <!-- Promo Banner -->
      @if (showPromoBanner() && (!auth.isSignedIn() || !auth.isCreator())) {
        <div class="promo-banner">
          <span class="promo-text">
            🎉 <span class="promo-highlight">New Year Sale!</span> Get 30% off on premium products
            <a routerLink="/explore" class="promo-link">Shop Now →</a>
          </span>
          <button class="promo-close" (click)="closePromoBanner()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
      
      <!-- Main Header -->
      <header class="header" [class.cart-open]="cartService.isOpen()">
        <div class="header-container">
          <div class="header-inner">
            <!-- Logo -->
            <a class="logo" (click)="handleLogoClick()">
              <span class="logo-text">StoresCraft.     </span>

            </a>
            
            <!-- Desktop Navigation -->
            <nav class="nav-desktop">
              <a routerLink="/explore" routerLinkActive="active" class="nav-link">
                Explore
              </a>
              @if (auth.isSignedIn()) {
                <a routerLink="/library" routerLinkActive="active" class="nav-link">
                  Library
                </a>
                @if (auth.isCreator()) {
                  <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                    Dashboard
                  </a>
                }
              }
            </nav>
            
            <!-- Search Section -->
            <div class="search-section">
              <div class="search-dropdown-wrapper">
                <div class="search-container">
                  <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Search products, stores, creators..."
                    [(ngModel)]="searchQuery"
                    (input)="onSearchInput()"
                    (focus)="onSearchFocus()"
                    (keydown)="onSearchKeydown($event)"
                    #desktopSearchInput
                  >
                  <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                
                <!-- Search Dropdown -->
                @if (showSearchDropdown()) {
                  <div class="search-dropdown">
                    @if (isSearching()) {
                      <div class="search-loading">
                        <div class="search-loading-spinner"></div>
                        <p class="search-loading-text">Searching...</p>
                      </div>
                    } @else if (!searchQuery || searchQuery.trim().length === 0) {
                      <div class="search-empty">
                        <div class="search-empty-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                          </svg>
                        </div>
                        <p class="search-empty-text">Start typing to search</p>
                        <p class="search-empty-hint">Search for products, stores, or creators</p>
                      </div>
                    } @else if (hasNoResults()) {
                      <div class="search-empty">
                        <div class="search-empty-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                          </svg>
                        </div>
                        <p class="search-empty-text">No results found</p>
                        <p class="search-empty-hint">Try a different search term</p>
                      </div>
                    } @else {
                      <!-- Products Section -->
                      @if (searchSuggestions()?.products?.length) {
                        <div class="search-dropdown-section">
                          <div class="search-dropdown-section-header">
                            <p class="search-dropdown-section-title">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                              </svg>
                              Products
                              <span class="search-dropdown-section-badge">{{ searchSuggestions()?.totalProducts }}</span>
                            </p>
                            <button class="search-dropdown-see-all" (click)="seeAllProducts()">See all →</button>
                          </div>
                          @for (product of searchSuggestions()?.products; track product.id) {
                            <div class="search-item" (click)="navigateToProduct(product)">
                              @if (product.coverImageUrl) {
                                <img [src]="product.coverImageUrl" [alt]="product.title" class="search-item-image">
                              } @else {
                                <div class="search-item-image-placeholder">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                  </svg>
                                </div>
                              }
                              <div class="search-item-content">
                                <p class="search-item-title">{{ product.title }}</p>
                                <p class="search-item-subtitle">{{ product.storeName }}</p>
                              </div>
                              <span class="search-item-price">{{ formatPrice(product.price, product.currency) }}</span>
                            </div>
                          }
                        </div>
                      }
                      
                      <!-- Stores Section -->
                      @if (searchSuggestions()?.stores?.length) {
                        <div class="search-dropdown-section">
                          <div class="search-dropdown-section-header">
                            <p class="search-dropdown-section-title">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                              </svg>
                              Stores
                              <span class="search-dropdown-section-badge">{{ searchSuggestions()?.totalStores }}</span>
                            </p>
                            <button class="search-dropdown-see-all" (click)="seeAllStores()">See all →</button>
                          </div>
                          @for (store of searchSuggestions()?.stores; track store.id) {
                            <div class="search-item" (click)="navigateToStore(store)">
                              @if (store.logoUrl) {
                                <img [src]="store.logoUrl" [alt]="store.name" class="search-item-image">
                              } @else {
                                <div class="search-item-avatar">{{ store.name.charAt(0).toUpperCase() }}</div>
                              }
                              <div class="search-item-content">
                                <p class="search-item-title">{{ store.name }}</p>
                                <p class="search-item-subtitle">{{ store.productCount }} products</p>
                              </div>
                              <span class="search-item-badge">Store</span>
                            </div>
                          }
                        </div>
                      }
                      
                      <!-- Creators Section -->
                      @if (searchSuggestions()?.creators?.length) {
                        <div class="search-dropdown-section">
                          <div class="search-dropdown-section-header">
                            <p class="search-dropdown-section-title">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                              </svg>
                              Creators
                              <span class="search-dropdown-section-badge">{{ searchSuggestions()?.totalCreators }}</span>
                            </p>
                            <button class="search-dropdown-see-all" (click)="seeAllCreators()">See all →</button>
                          </div>
                          @for (creator of searchSuggestions()?.creators; track creator.id) {
                            <div class="search-item" (click)="navigateToCreator(creator)">
                              <div class="search-item-avatar">
                                @if (creator.avatarUrl) {
                                  <img [src]="creator.avatarUrl" [alt]="creator.displayName || creator.username">
                                } @else {
                                  {{ (creator.displayName || creator.username).charAt(0).toUpperCase() }}
                                }
                              </div>
                              <div class="search-item-content">
                                <p class="search-item-title">{{ creator.displayName || creator.username }}</p>
                                <p class="search-item-subtitle">@{{ creator.username }} · {{ creator.storeCount }} stores</p>
                              </div>
                              <span class="search-item-badge">Creator</span>
                            </div>
                          }
                        </div>
                      }
                    }
                  </div>
                }
              </div>
            </div>
            
            <!-- Search Overlay for closing dropdown -->
            <div 
              class="search-overlay" 
              [class.active]="showSearchDropdown()"
              (click)="closeSearchDropdown()">
            </div>
            
            <!-- Actions Section -->
            <div class="actions-section">
              <!-- Mobile Search Button -->
              <button class="icon-btn mobile-search-btn" (click)="openMobileSearch()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
              
              @if (auth.isLoaded()) {
                <!-- Cart - visible on all pages except home, for all users -->
                @if (!isHomePage()) {
                  <button class="icon-btn" (click)="openCart()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    @if (cartService.itemCount() > 0) {
                      <span class="icon-btn-badge">{{ cartService.itemCount() > 99 ? '99+' : cartService.itemCount() }}</span>
                    }
                  </button>
                }

                @if (auth.isSignedIn()) {
                  <!-- Favorites -->
                  <a class="icon-btn" routerLink="/wishlist" routerLinkActive="active">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </a>
                  
                  <!-- Profile -->
                  <div class="profile-container">
                    <button 
                      (click)="toggleProfileMenu($event)" 
                      class="profile-btn"
                      [class.active]="profileMenuOpen()">
                      @if (auth.user()?.avatarUrl) {
                        <img [src]="auth.user()?.avatarUrl" alt="Profile" class="profile-avatar">
                      } @else {
                        <div class="profile-avatar-placeholder">
                          {{ getUserInitial() }}
                        </div>
                      }
                      <div class="profile-info">
                        <span class="profile-greeting">Welcome back</span>
                        <span class="profile-name">{{ getUserName() }}</span>
                      </div>
                      <svg class="profile-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    
                    @if (profileMenuOpen()) {
                      <div class="dropdown-overlay" (click)="closeProfileMenu()"></div>
                      <div class="dropdown-menu">
                        <div class="dropdown-header">
                          <p class="dropdown-user-email">{{ auth.user()?.email }}</p>
                        </div>
                        <a routerLink="/settings" class="dropdown-item" (click)="closeProfileMenu()">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          Settings
                        </a>
                        <a routerLink="/orders" class="dropdown-item" (click)="closeProfileMenu()">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                          Orders
                        </a>
                        @if (!auth.isCreator()) {
                          <a routerLink="/become-creator" class="dropdown-item" (click)="closeProfileMenu()">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                            Become a Creator
                          </a>
                        }
                        <div class="dropdown-divider"></div>
                        <button (click)="signOut()" class="dropdown-item danger">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="auth-buttons">
                    <button (click)="signIn()" class="btn-login">Log in</button>
                    <button (click)="signUp()" class="btn-signup">Get Started</button>
                  </div>
                }
                
                <!-- Hamburger Menu (Mobile) -->
                <button 
                  class="hamburger-btn" 
                  [class.active]="mobileMenuOpen()"
                  (click)="toggleMobileMenu()">
                  <div class="hamburger-icon">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                  </div>
                </button>
              } @else {
                <div class="skeleton-loader"></div>
              }
            </div>
          </div>
        </div>
        
      </header>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div 
      class="mobile-menu-overlay" 
      [class.active]="mobileMenuOpen()"
      (click)="closeMobileMenu()">
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" [class.active]="mobileMenuOpen()">
      <div class="mobile-menu-header">
        <a class="logo" (click)="handleLogoClick()">
          <span class="logo-text">StoresCraft</span>
          <div class="mascot">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="white" stroke="black" stroke-width="3"/>
              <path d="M30 40C30 40 35 35 40 40" stroke="black" stroke-width="3" stroke-linecap="round"/>
              <path d="M60 40C60 40 65 35 70 40" stroke="black" stroke-width="3" stroke-linecap="round"/>
              <path d="M30 65C30 65 50 80 70 65" stroke="black" stroke-width="3" stroke-linecap="round"/>
              <path d="M75 55L90 45" stroke="black" stroke-width="3" stroke-linecap="round"/>
              <circle cx="85" cy="40" r="2" fill="black"/>
            </svg>
          </div>
        </a>
        <button class="mobile-menu-close" (click)="closeMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Search -->
      <div class="mobile-search">
        <div class="mobile-search-container" (click)="openMobileSearchFromMenu()">
          <input 
            type="text" 
            class="mobile-search-input" 
            placeholder="Search products..."
            readonly
          >
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      
      @if (auth.isSignedIn()) {
        <!-- User Info -->
        <div class="mobile-user-info">
          @if (auth.user()?.avatarUrl) {
            <img [src]="auth.user()?.avatarUrl" alt="Profile" class="mobile-user-avatar">
          } @else {
            <div class="mobile-user-avatar-placeholder">
              {{ getUserInitial() }}
            </div>
          }
          <div class="mobile-user-details">
            <p class="mobile-user-greeting">Welcome back! 👋</p>
            <p class="mobile-user-email">{{ auth.user()?.email }}</p>
          </div>
        </div>
      }
      
      <div class="mobile-nav">
        <!-- Navigation Section -->
        <div class="mobile-nav-section">
          <p class="mobile-nav-section-title">Browse</p>
          <a routerLink="/explore" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Explore
          </a>
          @if (!isHomePage()) {
            <button class="mobile-nav-link" (click)="openCart(); closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Cart
              @if (cartService.itemCount() > 0) {
                <span class="mobile-nav-badge">{{ cartService.itemCount() > 99 ? '99+' : cartService.itemCount() }}</span>
              }
            </button>
          }
          @if (auth.isSignedIn()) {
            <a routerLink="/library" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              My Library
            </a>
            <a routerLink="/wishlist" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              Wishlist
            </a>
            @if (auth.isCreator()) {
              <a routerLink="/dashboard" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                Dashboard
              </a>
            }
          }
        </div>
        
        @if (auth.isSignedIn()) {
          <div class="mobile-nav-divider"></div>
          
          <!-- Account Section -->
          <div class="mobile-nav-section">
            <p class="mobile-nav-section-title">Account</p>
            <a routerLink="/settings" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Settings
            </a>
            <a routerLink="/orders" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Orders
            </a>
            @if (!auth.isCreator()) {
              <a routerLink="/become-creator" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Become a Creator
              </a>
            }
          </div>
          
          <div class="mobile-nav-divider"></div>
          
          <button (click)="signOut()" class="mobile-nav-link danger">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        } @else {
          <div class="mobile-auth-section">
            <button (click)="signUpMobile()" class="mobile-auth-btn-primary">Get Started Free</button>
            <button (click)="signInMobile()" class="mobile-auth-btn-secondary">Log in</button>
          </div>
        }
      </div>
    </div>
    
    <!-- Mobile Search Overlay -->
    <div class="mobile-search-overlay" [class.active]="mobileSearchOpen()">
      <div class="mobile-search-overlay-header">
        <button class="mobile-search-overlay-back" (click)="closeMobileSearch()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div class="mobile-search-overlay-input-container">
          <input 
            type="text" 
            class="mobile-search-overlay-input" 
            placeholder="Search products, stores, creators..."
            [(ngModel)]="mobileSearchQuery"
            (input)="onMobileSearchInput()"
            #mobileSearchInput
          >
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      
      <!-- Mobile Search Tabs -->
      <div class="mobile-search-tabs">
        <button 
          class="mobile-search-tab" 
          [class.active]="mobileSearchTab() === 'all'"
          (click)="setMobileSearchTab('all')">
          All
        </button>
        <button 
          class="mobile-search-tab" 
          [class.active]="mobileSearchTab() === 'products'"
          (click)="setMobileSearchTab('products')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          Products
          @if (mobileSearchSuggestions()?.totalProducts) {
            <span>({{ mobileSearchSuggestions()?.totalProducts }})</span>
          }
        </button>
        <button 
          class="mobile-search-tab" 
          [class.active]="mobileSearchTab() === 'stores'"
          (click)="setMobileSearchTab('stores')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          Stores
          @if (mobileSearchSuggestions()?.totalStores) {
            <span>({{ mobileSearchSuggestions()?.totalStores }})</span>
          }
        </button>
        <button 
          class="mobile-search-tab" 
          [class.active]="mobileSearchTab() === 'creators'"
          (click)="setMobileSearchTab('creators')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Creators
          @if (mobileSearchSuggestions()?.totalCreators) {
            <span>({{ mobileSearchSuggestions()?.totalCreators }})</span>
          }
        </button>
      </div>
      
      <!-- Mobile Search Body -->
      <div class="mobile-search-overlay-body">
        @if (isMobileSearching()) {
          <div class="search-loading" style="padding: 48px 16px;">
            <div class="search-loading-spinner"></div>
            <p class="search-loading-text">Searching...</p>
          </div>
        } @else if (!mobileSearchQuery || mobileSearchQuery.trim().length === 0) {
          <div class="mobile-search-results-empty">
            <div class="mobile-search-results-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p class="mobile-search-results-empty-title">Search StoresCraft</p>
            <p class="mobile-search-results-empty-text">Find amazing products, stores, and creators</p>
          </div>
        } @else if (hasMobileNoResults()) {
          <div class="mobile-search-results-empty">
            <div class="mobile-search-results-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
            </div>
            <p class="mobile-search-results-empty-title">No results found</p>
            <p class="mobile-search-results-empty-text">Try a different search term</p>
          </div>
        } @else {
          <div class="mobile-search-results">
            <!-- Products -->
            @if ((mobileSearchTab() === 'all' || mobileSearchTab() === 'products') && mobileSearchSuggestions()?.products?.length) {
              @if (mobileSearchTab() === 'all') {
                <div class="search-dropdown-section-header" style="margin-bottom: 12px;">
                  <p class="search-dropdown-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    Products
                  </p>
                </div>
              }
              @for (product of getMobileProducts(); track product.id) {
                <div class="mobile-search-item" (click)="navigateToProduct(product)">
                  @if (product.coverImageUrl) {
                    <img [src]="product.coverImageUrl" [alt]="product.title" class="mobile-search-item-image">
                  } @else {
                    <div class="search-item-image-placeholder" style="width: 56px; height: 56px; border-radius: 10px;">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                  }
                  <div class="mobile-search-item-content">
                    <p class="mobile-search-item-title">{{ product.title }}</p>
                    <p class="mobile-search-item-subtitle">{{ product.storeName }}</p>
                  </div>
                  <div class="mobile-search-item-meta">
                    <span class="mobile-search-item-price">{{ formatPrice(product.price, product.currency) }}</span>
                  </div>
                </div>
              }
            }
            
            <!-- Stores -->
            @if ((mobileSearchTab() === 'all' || mobileSearchTab() === 'stores') && mobileSearchSuggestions()?.stores?.length) {
              @if (mobileSearchTab() === 'all') {
                <div class="search-dropdown-section-header" style="margin: 16px 0 12px;">
                  <p class="search-dropdown-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                    Stores
                  </p>
                </div>
              }
              @for (store of getMobileStores(); track store.id) {
                <div class="mobile-search-item" (click)="navigateToStore(store)">
                  @if (store.logoUrl) {
                    <img [src]="store.logoUrl" [alt]="store.name" class="mobile-search-item-image" style="border-radius: 50%;">
                  } @else {
                    <div class="mobile-search-item-avatar">{{ store.name.charAt(0).toUpperCase() }}</div>
                  }
                  <div class="mobile-search-item-content">
                    <p class="mobile-search-item-title">{{ store.name }}</p>
                    <p class="mobile-search-item-subtitle">{{ store.productCount }} products</p>
                  </div>
                  <div class="mobile-search-item-meta">
                    <span class="mobile-search-item-badge">Store</span>
                  </div>
                </div>
              }
            }
            
            <!-- Creators -->
            @if ((mobileSearchTab() === 'all' || mobileSearchTab() === 'creators') && mobileSearchSuggestions()?.creators?.length) {
              @if (mobileSearchTab() === 'all') {
                <div class="search-dropdown-section-header" style="margin: 16px 0 12px;">
                  <p class="search-dropdown-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Creators
                  </p>
                </div>
              }
              @for (creator of getMobileCreators(); track creator.id) {
                <div class="mobile-search-item" (click)="navigateToCreator(creator)">
                  <div class="mobile-search-item-avatar">
                    @if (creator.avatarUrl) {
                      <img [src]="creator.avatarUrl" [alt]="creator.displayName || creator.username">
                    } @else {
                      {{ (creator.displayName || creator.username).charAt(0).toUpperCase() }}
                    }
                  </div>
                  <div class="mobile-search-item-content">
                    <p class="mobile-search-item-title">{{ creator.displayName || creator.username }}</p>
                    <p class="mobile-search-item-subtitle">@{{ creator.username }} · {{ creator.storeCount }} stores</p>
                  </div>
                  <div class="mobile-search-item-meta">
                    <span class="mobile-search-item-badge">Creator</span>
                  </div>
                </div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class NavbarComponent implements OnDestroy {
  private exploreService = inject(ExploreService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  cartService = inject(CartService);
  confirmService = inject(ConfirmService);
  
  profileMenuOpen = signal(false);
  mobileMenuOpen = signal(false);
  isScrolled = signal(false);
  showPromoBanner = signal(true);
  
  // Desktop search state
  showSearchDropdown = signal(false);
  searchQuery = '';
  isSearching = signal(false);
  searchSuggestions = signal<SearchSuggestions | null>(null);
  private searchTimeout: any;
  
  // Mobile search state
  mobileSearchOpen = signal(false);
  mobileSearchQuery = '';
  isMobileSearching = signal(false);
  mobileSearchSuggestions = signal<SearchSuggestions | null>(null);
  mobileSearchTab = signal<'all' | 'products' | 'stores' | 'creators'>('all');
  private mobileSearchTimeout: any;

  constructor(
    public auth: AuthService,
    private elementRef: ElementRef
  ) {}
  
  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.mobileSearchTimeout) {
      clearTimeout(this.mobileSearchTimeout);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeAllMenus();
    this.closeSearchDropdown();
    this.closeMobileSearch();
  }

  // === SEARCH METHODS ===
  
  onSearchFocus() {
    this.showSearchDropdown.set(true);
  }
  
  onSearchInput() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
      this.searchSuggestions.set(null);
      return;
    }
    
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }
  
  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchQuery.trim()) {
      this.closeSearchDropdown();
      this.router.navigate(['/explore'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
  
  async performSearch() {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
      this.searchSuggestions.set(null);
      return;
    }
    
    this.isSearching.set(true);
    
    try {
      const suggestions = await this.exploreService.getSearchSuggestions(this.searchQuery.trim(), 5);
      this.searchSuggestions.set(suggestions);
    } catch (error) {
      console.error('Search failed:', error);
      this.searchSuggestions.set(null);
    } finally {
      this.isSearching.set(false);
    }
  }
  
  closeSearchDropdown() {
    this.showSearchDropdown.set(false);
  }
  
  hasNoResults(): boolean {
    const suggestions = this.searchSuggestions();
    if (!suggestions) return false;
    return suggestions.products.length === 0 && 
           suggestions.stores.length === 0 && 
           suggestions.creators.length === 0;
  }
  
  // === MOBILE SEARCH METHODS ===
  
  openMobileSearch() {
    this.mobileSearchOpen.set(true);
    this.mobileSearchQuery = this.searchQuery; // Sync with desktop search
    document.body.style.overflow = 'hidden';
    
    // Focus the input after a brief delay to allow animation
    setTimeout(() => {
      const input = document.querySelector('.mobile-search-overlay-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }
  
  closeMobileSearch() {
    this.mobileSearchOpen.set(false);
    document.body.style.overflow = '';
  }
  
  openMobileSearchFromMenu() {
    this.closeMobileMenu();
    setTimeout(() => {
      this.openMobileSearch();
    }, 50);
  }
  
  onMobileSearchInput() {
    if (this.mobileSearchTimeout) {
      clearTimeout(this.mobileSearchTimeout);
    }
    
    if (!this.mobileSearchQuery || this.mobileSearchQuery.trim().length === 0) {
      this.mobileSearchSuggestions.set(null);
      return;
    }
    
    this.mobileSearchTimeout = setTimeout(() => {
      this.performMobileSearch();
    }, 300);
  }
  
  async performMobileSearch() {
    if (!this.mobileSearchQuery || this.mobileSearchQuery.trim().length === 0) {
      this.mobileSearchSuggestions.set(null);
      return;
    }
    
    this.isMobileSearching.set(true);
    
    try {
      const suggestions = await this.exploreService.getSearchSuggestions(this.mobileSearchQuery.trim(), 10);
      this.mobileSearchSuggestions.set(suggestions);
    } catch (error) {
      console.error('Mobile search failed:', error);
      this.mobileSearchSuggestions.set(null);
    } finally {
      this.isMobileSearching.set(false);
    }
  }
  
  setMobileSearchTab(tab: 'all' | 'products' | 'stores' | 'creators') {
    this.mobileSearchTab.set(tab);
  }
  
  hasMobileNoResults(): boolean {
    const suggestions = this.mobileSearchSuggestions();
    if (!suggestions) return false;
    return suggestions.products.length === 0 && 
           suggestions.stores.length === 0 && 
           suggestions.creators.length === 0;
  }
  
  getMobileProducts(): SearchSuggestionProduct[] {
    return this.mobileSearchSuggestions()?.products || [];
  }
  
  getMobileStores(): SearchSuggestionStore[] {
    return this.mobileSearchSuggestions()?.stores || [];
  }
  
  getMobileCreators(): SearchSuggestionCreator[] {
    return this.mobileSearchSuggestions()?.creators || [];
  }
  
  // === NAVIGATION METHODS ===
  
  navigateToProduct(product: SearchSuggestionProduct) {
    this.closeSearchDropdown();
    this.closeMobileSearch();
    const storeUrl = this.subdomainService.getStoreUrl(product.storeSlug, `/product/${product.slug}`);
    window.location.href = storeUrl;
  }
  
  navigateToStore(store: SearchSuggestionStore) {
    this.closeSearchDropdown();
    this.closeMobileSearch();
    const storeUrl = this.subdomainService.getStoreUrl(store.slug);
    window.location.href = storeUrl;
  }
  
  navigateToCreator(creator: SearchSuggestionCreator) {
    this.closeSearchDropdown();
    this.closeMobileSearch();
    // Navigate to explore with creator filter (for now)
    this.router.navigate(['/explore'], { queryParams: { q: creator.username, tab: 'creators' } });
  }
  
  seeAllProducts() {
    this.closeSearchDropdown();
    this.router.navigate(['/explore'], { queryParams: { q: this.searchQuery, tab: 'products' } });
  }
  
  seeAllStores() {
    this.closeSearchDropdown();
    this.router.navigate(['/explore'], { queryParams: { q: this.searchQuery, tab: 'stores' } });
  }
  
  seeAllCreators() {
    this.closeSearchDropdown();
    this.router.navigate(['/explore'], { queryParams: { q: this.searchQuery, tab: 'creators' } });
  }
  
  // === UTILITY METHODS ===
  
  formatPrice(price: number, currency: string = 'INR'): string {
    const amount = price / 100; // Convert from paise to rupees
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  getUserInitial(): string {
    const email = this.auth.user()?.email;
    return email ? email.charAt(0).toUpperCase() : 'U';
  }

  getUserName(): string {
    const email = this.auth.user()?.email;
    return email ? email.split('@')[0] : 'User';
  }

  closePromoBanner() {
    this.showPromoBanner.set(false);
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.profileMenuOpen.update(v => !v);
  }

  closeProfileMenu() {
    this.profileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  closeAllMenus() {
    this.closeProfileMenu();
    this.closeMobileMenu();
    this.closeSearchDropdown();
    this.closeMobileSearch();
  }

  handleLogoClick() {
    this.closeAllMenus();
    if (this.auth.isSignedIn() && this.auth.isCreator()) {
      this.router.navigate(['/explore']);
    } else {
      this.router.navigate(['/']);
    }
  }

  async signIn() {
    await this.auth.signIn();
  }

  async signUp() {
    await this.auth.openCreatorSignup();
  }

  async signInMobile() {
    this.closeMobileMenu();
    await this.auth.signIn();
  }

  async signUpMobile() {
    this.closeMobileMenu();
    await this.auth.openCreatorSignup();
  }

  async signOut() {
    this.closeAllMenus();

    const confirmed = await this.confirmService.confirm({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      accent: 'yellow', // modal background/header uses mustard
      confirmColor: 'danger' // confirm button should be red for sign out
    });

    if (!confirmed) return;

    await this.auth.signOut();
  }

  openCart() {
    this.closeAllMenus();
    this.cartService.open();
  }

  isHomePage(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/';
  }
}
