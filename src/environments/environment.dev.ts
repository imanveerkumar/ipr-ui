export const environment = {
  production: false,
  apiUrl: 'https://9os37clv2g.execute-api.ap-south-1.amazonaws.com/api/v1', // aws dev
  clerkPublishableKey: 'pk_test_ZW5hYmxpbmctaGFtc3Rlci01OC5jbGVyay5hY2NvdW50cy5kZXYk',
  razorpayKeyId: 'rzp_test_S1LNcKJX2HFDdb',
  subdomain: true,
  // Base domain for the dev deployment — storefronts live at <slug>.dev.imanveer.com
  baseDomain: 'dev.imanveer.com',
  // Primary domain that hosts Clerk auth; satellite domains point here for session handshake
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
