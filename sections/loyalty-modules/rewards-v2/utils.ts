import { Reward } from './types';

/**
 * Share of viewers who went on to claim, as a whole percent. Computed by the
 * server; `null` when the reward is not browsable, since there is no view
 * count to divide by.
 */
export const getConversion = (reward: Reward): number | null => (reward.availableAsReward ? reward.conversion : null);

/** Share of claims that were actually scanned at the venue. */
export const getRedemptionRate = (reward: Reward): number | null => (reward.claims > 0 ? reward.redemptionRate : null);

/** `null` when the reward has no total limit. Never reports a negative. */
export const getRemainingClaims = (reward: Reward): number | null => {
  if (reward.totalLimit === null) return null;
  return Math.max(0, reward.totalLimit - reward.claims);
};

export const getPointsSpent = (reward: Reward): number => reward.claims * reward.pointCost;

/** Browsing metrics collapse to an em dash when the reward is not browsable. */
export const getBrowsingMetric = (reward: Reward, value: number): number | null => (reward.availableAsReward ? value : null);

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);

/** `''` means the reward is open to every tier. */
export const getTierName = (reward: Reward): string => reward.tierName || 'Any tier';
