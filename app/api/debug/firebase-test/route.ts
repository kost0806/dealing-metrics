import { NextResponse } from 'next/server';

/**
 * DEBUG ONLY - Firebase connection test
 * Tests actual Firebase Admin initialization and connection
 */
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    phase: process.env.NEXT_PHASE,
    envVarsPresent: {
      projectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    },
    envVarValues: {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'NOT_SET',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'NOT_SET',
    },
  };

  try {
    // Check private key format
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (privateKey) {
      diagnostics.privateKeyDiagnostics = {
        length: privateKey.length,
        hasBeginMarker: privateKey.includes('BEGIN PRIVATE KEY'),
        hasEndMarker: privateKey.includes('END PRIVATE KEY'),
        hasLiteralBackslashN: privateKey.includes('\\n'),
        hasActualNewline: privateKey.includes('\n'),
        firstChars: privateKey.substring(0, 50),
        afterReplace: {
          length: privateKey.replace(/\\n/g, '\n').length,
          hasActualNewline: privateKey.replace(/\\n/g, '\n').includes('\n'),
          firstChars: privateKey.replace(/\\n/g, '\n').substring(0, 50),
        },
      };
    }

    // Try to initialize Firebase Admin
    const { initializeApp, getApps, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    diagnostics.firebaseApps = {
      count: getApps().length,
      names: getApps().map(app => app.name),
    };

    // Try to initialize if not already initialized
    let app;
    if (getApps().length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      diagnostics.initializationAttempt = {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKeyPresent: !!serviceAccount.privateKey,
        privateKeyLength: serviceAccount.privateKey?.length,
      };

      try {
        app = initializeApp({
          credential: cert(serviceAccount as any),
        });
        diagnostics.initialization = 'SUCCESS';
      } catch (error: any) {
        diagnostics.initialization = 'FAILED';
        diagnostics.initializationError = {
          message: error.message,
          code: error.code,
          stack: error.stack?.split('\n').slice(0, 5),
        };
        throw error;
      }
    } else {
      app = getApps()[0];
      diagnostics.initialization = 'ALREADY_INITIALIZED';
    }

    // Try to access Firestore
    try {
      const db = getFirestore(app);
      diagnostics.firestore = 'ACCESSIBLE';

      // Try a simple operation
      const testCollection = db.collection('_test_connection');
      const snapshot = await testCollection.limit(1).get();
      diagnostics.firestoreRead = {
        status: 'SUCCESS',
        docsCount: snapshot.size,
      };
    } catch (error: any) {
      diagnostics.firestore = 'FAILED';
      diagnostics.firestoreError = {
        message: error.message,
        code: error.code,
      };
      throw error;
    }

    diagnostics.overall = 'SUCCESS';
    return NextResponse.json(diagnostics);

  } catch (error: any) {
    diagnostics.overall = 'FAILED';
    diagnostics.error = {
      message: error.message,
      code: error.code,
      name: error.name,
    };

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
