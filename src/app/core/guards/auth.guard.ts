import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for Clerk to load
  while (!authService.isLoaded()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (authService.isSignedIn()) {
    return true;
  }

  // Redirect to home page for unauthenticated users
  router.navigate(['/']);
  return false;
};

export const creatorGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for Clerk to load
  while (!authService.isLoaded()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.isSignedIn()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.isCreator()) {
    return true;
  }

  // Redirect to become-creator page
  router.navigate(['/become-creator']);
  return false;
};

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for Clerk to load
  while (!authService.isLoaded()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.isSignedIn()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const nonCreatorGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for Clerk to load
  while (!authService.isLoaded()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.isSignedIn()) {
    router.navigate(['/']);
    return false;
  }

  // Wait for user data to load
  while (!authService.user()) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!authService.isCreator()) {
    return true;
  }

  // Redirect creators to dashboard
  router.navigate(['/dashboard']);
  return false;
};
