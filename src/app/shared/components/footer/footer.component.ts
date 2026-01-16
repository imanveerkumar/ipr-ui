import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <a routerLink="/" class="flex items-center gap-2 mb-4">
              <span class="text-2xl font-display font-bold text-primary-400">Stores</span>
              <span class="text-2xl font-display font-bold text-white">Craft</span>
            </a>
            <p class="text-sm max-w-md">
              The marketplace for digital creators. Sell templates, courses, designs, and more to a global audience.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-white font-semibold mb-4">Platform</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Explore</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a routerLink="/become-creator" class="hover:text-white transition-colors">Become a Creator</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-white font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {{ currentYear }} StoresCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
