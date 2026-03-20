import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'mustard-light' | 'mustard-dark';

export interface ThemeOption {
  id: Theme;
  label: string;
  icon: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'light', label: 'Light', icon: 'sun' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'mustard-light', label: 'Mustard Light', icon: 'mustard-light' },
  { id: 'mustard-dark', label: 'Mustard Dark', icon: 'mustard-dark' },
];

const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private loadTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['light', 'dark', 'mustard-light', 'mustard-dark'].includes(stored)) {
        return stored as Theme;
      }
    } catch {
      // localStorage may be unavailable
    }
    return 'light';
  }

  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be unavailable
    }
  }
}
