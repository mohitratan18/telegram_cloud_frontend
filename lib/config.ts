// Environment configuration
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Mohit Vault',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Secure image storage and management',
} as const;

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('Warning: NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:5000');
}
