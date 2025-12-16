import { NextResponse } from 'next/server';

/**
 * DEBUG ONLY - Remove in production
 * Check Firebase environment variables without exposing sensitive data
 */
export async function GET() {
  // IMPORTANT: Remove this route in production or add authentication

  try {
    const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const processedPrivateKey = rawPrivateKey
      ? rawPrivateKey.replace(/\\n/gm, '\n').trim()
      : undefined;

    const envCheck = {
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
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
          // 키가 올바른 PEM 형식인지 추가 검증
          hasPemHeader: rawPrivateKey?.includes('-----BEGIN PRIVATE KEY-----') || false,
          hasPemFooter: rawPrivateKey?.includes('-----END PRIVATE KEY-----') || false,
        },
        processed: {
          format: processedPrivateKey
            ? (processedPrivateKey.includes('BEGIN PRIVATE KEY') ? 'Valid format' : 'Invalid format')
            : 'NOT_SET',
          length: processedPrivateKey?.length || 0,
          hasActualNewline: processedPrivateKey?.includes('\n') || false,
          firstChars: processedPrivateKey?.substring(0, 30) || 'NOT_SET',
          hasPemHeader: processedPrivateKey?.includes('-----BEGIN PRIVATE KEY-----') || false,
          hasPemFooter: processedPrivateKey?.includes('-----END PRIVATE KEY-----') || false,
          // 줄 수 확인
          lineCount: processedPrivateKey?.split('\n').length || 0,
        },
      },

      // 모든 환경변수가 올바르게 설정되었는지 최종 판단
      allRequiredPresent: !!(
        process.env.FIREBASE_ADMIN_PROJECT_ID &&
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
        rawPrivateKey
      ),

      // 권장사항
      recommendations: [],
    };

    // 권장사항 생성
    if (!envCheck.privateKey.raw.hasLiteralBackslashN && !envCheck.privateKey.raw.hasActualNewline) {
      envCheck.recommendations.push('⚠️ Private key seems to have no newlines at all - check if the key was copied correctly');
    }
    if (envCheck.privateKey.raw.hasLiteralBackslashN && !envCheck.privateKey.raw.hasActualNewline) {
      envCheck.recommendations.push('✅ Private key has literal \\n - this is correct for Vercel, it will be converted');
    }
    if (!envCheck.privateKey.raw.hasPemHeader || !envCheck.privateKey.raw.hasPemFooter) {
      envCheck.recommendations.push('❌ Private key is missing PEM header/footer - check if the full key was copied');
    }
    if (!envCheck.allRequiredPresent) {
      envCheck.recommendations.push('❌ Some required environment variables are missing');
    }
    if (envCheck.allRequiredPresent && envCheck.privateKey.processed.hasActualNewline) {
      envCheck.recommendations.push('✅ All environment variables are properly configured');
    }

    return NextResponse.json(envCheck, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error: any) {
    // 에러 발생 시 모든 정보 표시
    const errorResponse = {
      timestamp: new Date().toISOString(),
      status: 'ERROR',
      error: {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Error',
        code: error?.code,
        stack: error?.stack?.split('\n') || [],
      },
      // 에러가 발생해도 기본 환경변수 체크는 시도
      partialEnvCheck: {
        hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      },
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
