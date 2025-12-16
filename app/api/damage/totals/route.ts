import { NextResponse } from 'next/server';
import { getAllUserTotalsServer } from '@/lib/firebaseAdmin';

/**
 * GET /api/damage/totals - Get all user totals for percentile calculation
 * Server-side only Firebase operation for security
 * Returns only aggregated totals, no sensitive user data
 */
export async function GET() {
  try {
    const totals = await getAllUserTotalsServer();

    return NextResponse.json({
      success: true,
      totals
    });

  } catch (error: any) {
    console.error('Error fetching user totals:', error);

    // 개발 환경에서는 상세한 에러 정보 제공 (모바일 디버깅용)
    const errorResponse: any = {
      error: 'Failed to fetch user totals',
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
