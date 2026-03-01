export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  clerkPublishableKey: 'pk_test_b3V0Z29pbmctZmxlYS0zMC5jbGVyay5hY2NvdW50cy5kZXYk',
  razorpayKeyId: 'rzp_test_your_key_here',
  baseDomain: 'localhost',
  subdomain: false,
  // list of subdomains that cannot be used for stores
  reservedSubdomains: [
    'api', 'www', 'app', 'admin', 'auth', 'cdn', 'static', 'assets', 'media',
    'files', 'upload', 'uploads', 'img', 'images', 'js', 'css', 'fonts',
    'dev', 'test', 'staging', 'stage', 'prod', 'production', 'qa', 'uat',
    'beta', 'alpha', 'sandbox', 'preview', 'mail', 'smtp', 'imap', 'pop',
    'ftp', 'sftp', 'ssh', 'ns1', 'ns2', 'ns3', 'dns', 'mx', 'cpanel',
    'webmail', 'autodiscover', 'autoconfig', 'dashboard', 'status', 'support',
    'help', 'docs', 'documentation', 'blog', 'careers', 'jobs', 'legal',
    'privacy', 'terms', 'billing', 'payments', 'checkout', 'account',
    'accounts', 'settings', 'profile', 'profiles', 'system', 'internal',
    'root', 'null', 'undefined', 'localhost', 'whatsapp', 'instagram',
    'meta', 'mcp', 'ai', 'auto'
  ]
};
