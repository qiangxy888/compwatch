// Validate and sanitize user-provided URLs
// Prevents SSRF attacks (Server-Side Request Forgery)

const BLOCKED_HOSTS = [
  'localhost', '127.0.0.1', '0.0.0.0', '::1',
  'metadata.google.internal', // GCP metadata
  '169.254.169.254', // AWS/GCP metadata endpoint
  'metadata.google',
];

const BLOCKED_PREFIXES = [
  '10.', '172.16.', '172.17.', '172.18.', '172.19.',
  '172.20.', '172.21.', '172.22.', '172.23.', '172.24.',
  '172.25.', '172.26.', '172.27.', '172.28.', '172.29.',
  '172.30.', '172.31.', '192.168.', 'fc00:', 'fe80:',
];

export function validateMonitorUrl(urlString: string): { valid: boolean; error?: string; url?: URL } {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Only allow http/https
  if (!['http:', 'https:'].includes(url.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  // Block internal/private hosts
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    return { valid: false, error: 'Internal URLs are not allowed' };
  }

  for (const prefix of BLOCKED_PREFIXES) {
    if (hostname.startsWith(prefix)) {
      return { valid: false, error: 'Private network URLs are not allowed' };
    }
  }

  // Block file:// and other schemes that might slip through
  if (url.port && !['80', '443', '8080', '8443'].includes(url.port)) {
    return { valid: false, error: 'Non-standard ports are not allowed' };
  }

  // Max URL length
  if (urlString.length > 2048) {
    return { valid: false, error: 'URL too long (max 2048 characters)' };
  }

  return { valid: true, url };
}
