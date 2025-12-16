import { NextResponse } from 'next/server';

/**
 * DEBUG ONLY - Remove in production
 * Check Firebase environment variables without exposing sensitive data
 */
export async function GET() {
  // IMPORTANT: Remove this route in production or add authentication

  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const processedPrivateKey = rawPrivateKey
    ? rawPrivateKey.replace(/\\n/gm, '\n').trim()
    : undefined;

  const envCheck = {
    hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    hasPrivateKey: !!rawPrivateKey,
    hasServiceAccountPath: !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH,

    // Safe to show (not sensitive)
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'NOT_SET',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'NOT_SET',

    // NEVER expose the actual key, only check format
    privateKey: {
      raw: {
        format: rawPrivateKey
          ? (rawPrivateKey.includes('BEGIN PRIVATE KEY') ? 'Valid format' : 'Invalid format')
          : 'NOT_SET',
        length: rawPrivateKey?.length || 0,
        hasLiteralBackslashN: rawPrivateKey?.includes('\\n') || false,
        hasActualNewline: rawPrivateKey?.includes('\n') || false,
        firstChars: rawPrivateKey?.substring(0, 30) || 'NOT_SET',
      },
      processed: {
        format: processedPrivateKey
          ? (processedPrivateKey.includes('BEGIN PRIVATE KEY') ? 'Valid format' : 'Invalid format')
          : 'NOT_SET',
        length: processedPrivateKey?.length || 0,
        hasActualNewline: processedPrivateKey?.includes('\n') || false,
        firstChars: processedPrivateKey?.substring(0, 30) || 'NOT_SET',
      },
    },
  };

  return NextResponse.json(envCheck);
}
