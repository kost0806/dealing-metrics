import { NextRequest, NextResponse } from 'next/server';
import {
  saveDamageEntryServer,
  getAllDamageEntriesServer,
  getAllUserTotalsServer
} from '@/lib/firebaseAdmin';

/**
 * POST /api/damage - Save damage entry
 * Server-side only Firebase operation for security
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, userName, damages } = await request.json();

    // Server-side validation
    if (!userId || !userName || !Array.isArray(damages)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    if (damages.length !== 9) {
      return NextResponse.json(
        { error: 'Exactly 9 damage values required' },
        { status: 400 }
      );
    }

    // Validate damage values
    const allValid = damages.every(d => typeof d === 'number' && d >= 0);
    if (!allValid) {
      return NextResponse.json(
        { error: 'Invalid damage values' },
        { status: 400 }
      );
    }

    // Save via Firebase Admin (server-side only)
    const entryId = await saveDamageEntryServer(userId, userName, damages);

    return NextResponse.json({
      success: true,
      entryId
    });

  } catch (error: any) {
    console.error('Error saving damage entry:', error);

    // 개발 환경에서는 상세한 에러 정보 제공 (모바일 디버깅용)
    const errorResponse: any = {
      error: 'Failed to save damage entry',
      message: error?.message || 'Unknown error',
    };

    if (process.env.NODE_ENV !== 'production') {
      errorResponse.debug = {
        name: error?.name,
        code: error?.code,
        stack: error?.stack?.split('\n').slice(0, 5),
        errorInfo: error?.errorInfo,
      };
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET /api/damage - Get all damage entries
 * Server-side only Firebase operation for security
 */
export async function GET() {
  try {
    const entries = await getAllDamageEntriesServer();

    return NextResponse.json({
      success: true,
      entries
    });

  } catch (error: any) {
    console.error('Error fetching damage entries:', error);

    // 개발 환경에서는 상세한 에러 정보 제공 (모바일 디버깅용)
    const errorResponse: any = {
      error: 'Failed to fetch damage entries',
      message: error?.message || 'Unknown error',
    };

    if (process.env.NODE_ENV !== 'production') {
      errorResponse.debug = {
        name: error?.name,
        code: error?.code,
        stack: error?.stack?.split('\n').slice(0, 5),
        errorInfo: error?.errorInfo,
      };
    }

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
