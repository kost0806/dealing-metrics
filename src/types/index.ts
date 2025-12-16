export interface DamageEntry {
  id: string;
  userId: string;
  userName: string;
  damages: number[];
  timestamp: number;
}

export interface DamageMetrics {
  total: number;
  average: number;
  median: number;
  standardDeviation: number;
  percentile: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
