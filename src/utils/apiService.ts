/**
 * Client-side API service
 * All Firebase operations now go through secure server-side API routes
 * No direct Firebase access from client
 */

import { DamageEntry } from '../types';

const API_BASE = '/api';

/**
 * Save damage entry via server API
 * @param userId - User identifier
 * @param userName - User display name
 * @param damages - Array of 9 damage values
 * @returns Entry ID
 */
export async function saveDamageEntry(
  userId: string,
  userName: string,
  damages: number[]
): Promise<string> {
  const response = await fetch(`${API_BASE}/damage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      userName,
      damages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save damage entry');
  }

  const data = await response.json();
  return data.entryId;
}

/**
 * Get all damage entries via server API
 * @returns All damage entries
 */
export async function getAllDamageEntries(): Promise<DamageEntry[]> {
  const response = await fetch(`${API_BASE}/damage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch damage entries');
  }

  const data = await response.json();
  return data.entries;
}

/**
 * Get all user totals via server API
 * Server only returns aggregated totals, no sensitive data
 * @returns Array of total damage values
 */
export async function getAllUserTotals(): Promise<number[]> {
  const response = await fetch(`${API_BASE}/damage/totals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user totals');
  }

  const data = await response.json();
  return data.totals;
}
