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

  } catch (error) {
    console.error('Error saving damage entry:', error);
    return NextResponse.json(
      { error: 'Failed to save damage entry' },
      { status: 500 }
    );
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

  } catch (error) {
    console.error('Error fetching damage entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch damage entries' },
      { status: 500 }
    );
  }
}
