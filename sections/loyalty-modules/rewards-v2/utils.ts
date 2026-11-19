import { Reward } from './types';

/**
 * Counts and rates from the list payload. The API sends a number, `0`, an
 * empty string, or an empty array for rewards that have no activity yet.
 * Every one of those displays as 0.
 */
export const toMetric = (value: unknown): number => {
  if (Array.isArray(value)) {
    if (value.length === 0) return 0;
    return toMetric(value[0]);
  }

  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

/** `null` when the reward has no total limit. Never reports a negative. */
export const getRemainingClaims = (reward: Reward): number | null => {
  if (reward.totalLimit === null) return null;
  return Math.max(0, reward.totalLimit - reward.claims);
};

export const getPointsSpent = (reward: Reward): number => reward.claims * reward.pointCost;

export const formatMetric = (value: number, suffix = ''): string => `${value.toLocaleString()}${suffix}`;

/** `''` means the reward is open to every tier. */
export const getTierName = (reward: Reward): string => reward.tierName || 'Any tier';
