import { NextResponse } from 'next/server';

/**
 * DEBUG ONLY - Remove in production
 * Check Firebase environment variables without exposing sensitive data
 */
export async function GET() {
  // IMPORTANT: Remove this route in production or add authentication

  const envCheck = {
    hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    hasServiceAccountPath: !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH,

    // Safe to show (not sensitive)
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'NOT_SET',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'NOT_SET',

    // NEVER expose the actual key, only check format
    privateKeyFormat: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? (process.env.FIREBASE_ADMIN_PRIVATE_KEY.includes('BEGIN PRIVATE KEY') ? 'Valid format' : 'Invalid format')
      : 'NOT_SET',

    privateKeyHasNewlines: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('\n') || false,
  };

  return NextResponse.json(envCheck);
}
