import { MOCK_EVENTS, MOCK_MENUS, MOCK_MENU_ITEMS, MOCK_TIERS } from './mock-data';
import { Reward } from './types';

/**
 * Share of viewers who went on to claim, as a whole percent.
 * `null` when the reward is not browsable — there is no view count to divide by.
 */
export const getConversion = (reward: Reward): number | null => {
  if (!reward.availableAsReward || reward.views <= 0) return null;
  return Math.round((reward.claims / reward.views) * 100);
};

/** Share of claims that were actually scanned at the venue. */
export const getRedemptionRate = (reward: Reward): number | null => {
  if (reward.claims <= 0) return null;
  return Math.round((reward.redeemed / reward.claims) * 100);
};

/** `null` when the reward has no total limit. Never reports a negative. */
export const getRemainingClaims = (reward: Reward): number | null => {
  if (reward.totalLimit === null) return null;
  return Math.max(0, reward.totalLimit - reward.claims);
};

export const getPointsSpent = (reward: Reward): number => reward.claims * reward.pointCost;

/** Browsing metrics collapse to an em dash when the reward is not browsable. */
export const getBrowsingMetric = (reward: Reward, value: number): number | null => (reward.availableAsReward ? value : null);

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);

// ---------- Reference lookups ----------
// Swap these for the real option queries when the endpoints land.

export const getTierName = (tierId: string): string => MOCK_TIERS.find((tier) => tier.id === tierId)?.name || 'Any tier';

export const getMenuName = (menuId?: string): string => MOCK_MENUS.find((menu) => menu.id === menuId)?.name || '—';

export const getEventName = (eventId?: string): string => MOCK_EVENTS.find((event) => event.id === eventId)?.name || '—';

export const getMenuItemNames = (menuItemIds: string[]): string[] =>
  menuItemIds.map((id) => MOCK_MENU_ITEMS.find((item) => item.id === id)?.name).filter((name): name is string => Boolean(name));
