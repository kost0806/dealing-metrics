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

  } catch (error) {
    console.error('Error fetching user totals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user totals' },
      { status: 500 }
    );
  }
}
