/**
 * Firebase Admin SDK - Server-side only
 * DO NOT import this file in client components
 *
 * Security: All Firebase operations run on server-side
 * preventing credential exposure and unauthorized access
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { DamageEntry } from '@/src/types';

let adminApp: App;
let adminDb: Firestore;

/**
 * Initialize Firebase Admin SDK (server-side only)
 * Uses service account credentials, never exposed to client
 */
function initializeFirebaseAdmin() {
  // Skip initialization during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️  Skipping Firebase Admin initialization during build');
    return;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
    return;
  }

  // Option 1: Using service account key file (recommended for development)
  // Download from Firebase Console → Project Settings → Service Accounts
  // Place in project root (add to .gitignore!)
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  // Option 2: Using environment variables (recommended for production/Vercel)
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  try {
    if (serviceAccountPath) {
      // Use service account file
      adminApp = initializeApp({
        credential: cert(require(serviceAccountPath)),
      });
    } else if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      // Use environment variables
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      throw new Error(
        'Firebase Admin credentials not configured. ' +
        'Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_ADMIN_* environment variables.'
      );
    }

    adminDb = getFirestore(adminApp);
    console.log('✅ Firebase Admin initialized (server-side only)');

  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

// Initialize on module load (server-side only, skip during build)
if (typeof window === 'undefined') {
  initializeFirebaseAdmin();
}

const COLLECTION_NAME = 'damageEntries';

/**
 * Ensure Firebase Admin is initialized (lazy initialization)
 */
function ensureInitialized() {
  if (!adminDb && getApps().length === 0) {
    initializeFirebaseAdmin();
  }
  if (!adminDb) {
    throw new Error('Firebase Admin is not initialized. Check your environment variables.');
  }
}

/**
 * Save damage entry (SERVER-SIDE ONLY)
 * @param userId - User identifier
 * @param userName - User display name
 * @param damages - Array of 9 damage values
 * @returns Document ID
 */
export async function saveDamageEntryServer(
  userId: string,
  userName: string,
  damages: number[]
): Promise<string> {
  ensureInitialized();

  const entry: Omit<DamageEntry, 'id'> = {
    userId,
    userName,
    damages,
    timestamp: Date.now(),
  };

  const docRef = await adminDb.collection(COLLECTION_NAME).add(entry);
  return docRef.id;
}

/**
 * Get all damage entries (SERVER-SIDE ONLY)
 * @returns All damage entries sorted by timestamp
 */
export async function getAllDamageEntriesServer(): Promise<DamageEntry[]> {
  ensureInitialized();

  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as DamageEntry[];
}

/**
 * Get all user totals (SERVER-SIDE ONLY)
 * Returns only aggregated totals for percentile calculation
 * No sensitive user information exposed
 * @returns Array of total damage values
 */
export async function getAllUserTotalsServer(): Promise<number[]> {
  ensureInitialized();

  const entries = await getAllDamageEntriesServer();
  return entries.map(entry =>
    entry.damages.reduce((sum, damage) => sum + damage, 0)
  );
}

/**
 * Get user-specific entries (SERVER-SIDE ONLY)
 * @param userId - User identifier
 * @returns User's damage entries
 */
export async function getUserDamageEntriesServer(userId: string): Promise<DamageEntry[]> {
  ensureInitialized();

  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as DamageEntry[];
}

/**
 * Update damage entry (SERVER-SIDE ONLY)
 * @param entryId - Document ID
 * @param damages - Updated damage values
 */
export async function updateDamageEntryServer(
  entryId: string,
  damages: number[]
): Promise<void> {
  ensureInitialized();

  await adminDb.collection(COLLECTION_NAME).doc(entryId).update({
    damages,
    timestamp: Date.now(),
  });
}

/**
 * Delete damage entry (SERVER-SIDE ONLY)
 * @param entryId - Document ID
 */
export async function deleteDamageEntryServer(entryId: string): Promise<void> {
  ensureInitialized();

  await adminDb.collection(COLLECTION_NAME).doc(entryId).delete();
}
