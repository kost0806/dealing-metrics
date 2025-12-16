import { DamageMetrics } from '../types';

/**
 * Calculate total damage from array of damage values
 */
export const calculateTotal = (damages: number[]): number => {
  return damages.reduce((sum, damage) => sum + damage, 0);
};

/**
 * Calculate average damage per round
 */
export const calculateAverage = (damages: number[]): number => {
  if (damages.length === 0) return 0;
  return calculateTotal(damages) / damages.length;
};

/**
 * Calculate median damage value
 */
export const calculateMedian = (damages: number[]): number => {
  if (damages.length === 0) return 0;

  const sorted = [...damages].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

/**
 * Calculate standard deviation of damage values
 */
export const calculateStandardDeviation = (damages: number[]): number => {
  if (damages.length === 0) return 0;

  const avg = calculateAverage(damages);
  const squareDiffs = damages.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, value) => sum + value, 0) / damages.length;

  return Math.sqrt(avgSquareDiff);
};

/**
 * Calculate user's percentile ranking compared to all users
 * @param userTotal - User's total damage
 * @param allTotals - Array of all users' total damages
 * @returns Percentile (0-100)
 */
export const calculatePercentile = (userTotal: number, allTotals: number[]): number => {
  if (allTotals.length === 0) return 0;

  const sortedTotals = [...allTotals].sort((a, b) => a - b);
  const rank = sortedTotals.filter(total => total < userTotal).length;

  return Math.round((rank / sortedTotals.length) * 100);
};

/**
 * Calculate all metrics for a user's damage entries
 */
export const calculateAllMetrics = (
  damages: number[],
  allUserTotals: number[] = []
): DamageMetrics => {
  const total = calculateTotal(damages);

  return {
    total,
    average: calculateAverage(damages),
    median: calculateMedian(damages),
    standardDeviation: calculateStandardDeviation(damages),
    percentile: calculatePercentile(total, allUserTotals),
  };
};

/**
 * Validate damage input (must be 9 entries of non-negative numbers)
 */
export const validateDamageInput = (damages: number[]): { valid: boolean; error?: string } => {
  if (damages.length !== 9) {
    return { valid: false, error: '정확히 9개의 딜량을 입력해야 합니다.' };
  }

  if (damages.some(d => d < 0)) {
    return { valid: false, error: '딜량은 음수일 수 없습니다.' };
  }

  if (damages.some(d => isNaN(d))) {
    return { valid: false, error: '유효한 숫자를 입력해주세요.' };
  }

  return { valid: true };
};
