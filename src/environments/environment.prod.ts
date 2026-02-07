export const environment = {
  production: true,
  apiUrl: 'https://ipr-api.vercel.app/api/v1',
  clerkPublishableKey: 'pk_test_b3V0Z29pbmctZmxlYS0zMC5jbGVyay5hY2NvdW50cy5kZXYk',
  razorpayKeyId: 'rzp_live_your_key_here',
  // Toggle subdomain routing. When true storefronts will be accessible at storename.yoursite.com.
  // You can control this at build time via the env var `Subdomain`.
  subdomain: false,
  // Base domain for subdomain routing (e.g., 'yoursite.com')
  // Stores will be accessible at storename.yoursite.com
  baseDomain: 'imanveer.com',
};
