import { NextResponse } from 'next/server';

/**
 * DEBUG ONLY - Firebase connection test
 * Tests actual Firebase Admin initialization and connection
 * 모바일에서 확인 가능하도록 모든 에러를 화면에 표시
 */
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    phase: process.env.NEXT_PHASE,
    platform: process.platform,
    nodeVersion: process.version,
    envVarsPresent: {
      projectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    },
    envVarValues: {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'NOT_SET',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'NOT_SET',
    },
    steps: [],
  };

  try {
    diagnostics.steps.push('1️⃣ Checking private key format...');

    // Check private key format
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (privateKey) {
      const processedKey = privateKey
        .replace(/^["']|["']$/g, '')  // Remove leading/trailing quotes
        .replace(/\\n/gm, '\n')        // Convert literal \n to actual newlines
        .trim();
      diagnostics.privateKeyDiagnostics = {
        raw: {
          length: privateKey.length,
          hasBeginMarker: privateKey.includes('BEGIN PRIVATE KEY'),
          hasEndMarker: privateKey.includes('END PRIVATE KEY'),
          hasLiteralBackslashN: privateKey.includes('\\n'),
          hasActualNewline: privateKey.includes('\n'),
          firstChars: privateKey.substring(0, 50),
          lastChars: privateKey.substring(privateKey.length - 50),
        },
        processed: {
          length: processedKey.length,
          hasActualNewline: processedKey.includes('\n'),
          firstChars: processedKey.substring(0, 50),
          lastChars: processedKey.substring(processedKey.length - 50),
          lineCount: processedKey.split('\n').length,
          lines: processedKey.split('\n').map((line, i) => ({
            index: i,
            length: line.length,
            preview: line.substring(0, 30) + (line.length > 30 ? '...' : ''),
          })),
        },
      };
      diagnostics.steps.push('✅ Private key format checked');
    } else {
      diagnostics.steps.push('❌ Private key not found in environment variables');
      throw new Error('FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set');
    }

    diagnostics.steps.push('2️⃣ Importing Firebase Admin SDK...');

    // Try to initialize Firebase Admin
    const { initializeApp, getApps, cert } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');

    diagnostics.steps.push('✅ Firebase Admin SDK imported successfully');
    diagnostics.steps.push('3️⃣ Checking existing Firebase apps...');

    diagnostics.firebaseApps = {
      count: getApps().length,
      names: getApps().map(app => app.name),
    };

    diagnostics.steps.push(`Found ${getApps().length} existing Firebase app(s)`);

    // Try to initialize if not already initialized
    let app;
    if (getApps().length === 0) {
      diagnostics.steps.push('4️⃣ Initializing new Firebase app...');

      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
          ?.replace(/^["']|["']$/g, '')  // Remove leading/trailing quotes
          .replace(/\\n/gm, '\n')        // Convert literal \n to actual newlines
          .trim(),
      };

      diagnostics.initializationAttempt = {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKeyPresent: !!serviceAccount.privateKey,
        privateKeyLength: serviceAccount.privateKey?.length,
        privateKeyHasNewlines: serviceAccount.privateKey?.includes('\n'),
      };

      try {
        app = initializeApp({
          credential: cert(serviceAccount as any),
        });
        diagnostics.initialization = 'SUCCESS';
        diagnostics.steps.push('✅ Firebase Admin initialized successfully');
      } catch (error: any) {
        diagnostics.initialization = 'FAILED';
        diagnostics.initializationError = {
          message: error.message || 'Unknown error',
          code: error.code || 'NO_CODE',
          name: error.name || 'Error',
          stack: error.stack?.split('\n') || [],
          // Firebase 특정 에러 정보
          errorInfo: error.errorInfo,
          codePrefix: error.codePrefix,
        };
        diagnostics.steps.push('❌ Firebase initialization failed: ' + error.message);
        throw error;
      }
    } else {
      app = getApps()[0];
      diagnostics.initialization = 'ALREADY_INITIALIZED';
      diagnostics.steps.push('4️⃣ Using existing Firebase app');
    }

    diagnostics.steps.push('5️⃣ Accessing Firestore...');

    // Try to access Firestore
    try {
      const db = getFirestore(app);
      diagnostics.firestore = 'ACCESSIBLE';
      diagnostics.steps.push('✅ Firestore accessible');

      diagnostics.steps.push('6️⃣ Testing Firestore read operation...');

      // Try a simple operation
      const testCollection = db.collection('_test_connection');
      const snapshot = await testCollection.limit(1).get();
      diagnostics.firestoreRead = {
        status: 'SUCCESS',
        docsCount: snapshot.size,
        empty: snapshot.empty,
      };
      diagnostics.steps.push(`✅ Firestore read successful (found ${snapshot.size} docs)`);
    } catch (error: any) {
      diagnostics.firestore = 'FAILED';
      diagnostics.firestoreError = {
        message: error.message || 'Unknown error',
        code: error.code || 'NO_CODE',
        name: error.name || 'Error',
        stack: error.stack?.split('\n') || [],
        details: error.details,
      };
      diagnostics.steps.push('❌ Firestore access failed: ' + error.message);
      throw error;
    }

    diagnostics.overall = 'SUCCESS ✅';
    diagnostics.summary = '모든 테스트가 성공적으로 완료되었습니다!';

    return NextResponse.json(diagnostics, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error: any) {
    diagnostics.overall = 'FAILED ❌';
    diagnostics.summary = 'Firebase 연결 테스트 실패';
    diagnostics.mainError = {
      message: error?.message || 'Unknown error',
      code: error?.code || 'NO_CODE',
      name: error?.name || 'Error',
      stack: error?.stack?.split('\n') || [],
      // 모든 가능한 에러 속성 포함
      errorInfo: error?.errorInfo,
      codePrefix: error?.codePrefix,
      details: error?.details,
      // Error 객체의 모든 키 표시
      allErrorKeys: Object.keys(error || {}),
      // Error를 문자열로 변환
      stringified: String(error),
    };

    // 가능한 해결방법 제시
    diagnostics.troubleshooting = [] as string[];

    if (!diagnostics.envVarsPresent.projectId) {
      diagnostics.troubleshooting.push('❌ FIREBASE_ADMIN_PROJECT_ID 환경변수가 설정되지 않았습니다.');
    }
    if (!diagnostics.envVarsPresent.clientEmail) {
      diagnostics.troubleshooting.push('❌ FIREBASE_ADMIN_CLIENT_EMAIL 환경변수가 설정되지 않았습니다.');
    }
    if (!diagnostics.envVarsPresent.privateKey) {
      diagnostics.troubleshooting.push('❌ FIREBASE_ADMIN_PRIVATE_KEY 환경변수가 설정되지 않았습니다.');
    }

    if (error?.message?.includes('DECODER') || error?.message?.includes('unsupported')) {
      diagnostics.troubleshooting.push('🔑 Private key 디코딩 실패: Vercel 환경변수에서 private key를 큰따옴표 없이 입력했는지 확인하세요.');
      diagnostics.troubleshooting.push('💡 Vercel에서 환경변수 값을 입력할 때 큰따옴표로 감싸지 마세요. 값만 직접 붙여넣으세요.');
    }

    if (error?.code === 'auth/invalid-credential' || error?.message?.includes('credential')) {
      diagnostics.troubleshooting.push('🔑 Private key 형식이 올바르지 않을 수 있습니다. /api/debug/env 에서 확인하세요.');
    }

    if (error?.message?.includes('PERMISSION_DENIED')) {
      diagnostics.troubleshooting.push('🔒 Firestore 권한이 없습니다. Firebase Console에서 Firestore 설정을 확인하세요.');
    }

    return NextResponse.json(diagnostics, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
