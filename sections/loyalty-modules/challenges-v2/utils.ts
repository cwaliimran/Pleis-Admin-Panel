import { CHALLENGE_GOAL_UNITS } from './constants';
import { MOCK_LINKED_REWARDS, MOCK_MENUS, MOCK_MENU_ITEMS, MOCK_TIERS } from './mock-data';
import { Challenge } from './types';

/**
 * Average progress as a share of the target. Used for sorting, so that
 * "0.9 / 1" (90%) outranks "1.4 / 2" (70%) even though 1.4 is the larger number.
 */
export const getProgressRatio = (challenge: Challenge): number => {
  if (challenge.taskValue <= 0) return 0;
  return challenge.avgProgress / challenge.taskValue;
};

/** Share of participants who finished the challenge. */
export const getCompletionRate = (challenge: Challenge): number | null => {
  if (challenge.participants <= 0) return null;
  return Math.round((challenge.completions / challenge.participants) * 100);
};

/** Share of viewers who went on to start it — the "view → join" rate. */
export const getParticipationRate = (challenge: Challenge): number | null => {
  if (challenge.views <= 0) return null;
  return Math.round((challenge.participants / challenge.views) * 100);
};

/** Participants who neither finished nor are still going. Never negative. */
export const getExpiredWithoutCompletion = (challenge: Challenge): number =>
  Math.max(0, challenge.participants - challenge.completions - challenge.inProgress);

/** `null` when the challenge has no total claim limit. */
export const getRemainingClaims = (challenge: Challenge): number | null => {
  if (challenge.claimLimit === null) return null;
  return Math.max(0, challenge.claimLimit - challenge.completions);
};

/** Renders as "0.9 / 1" — progress against the target, in task units. */
export const formatAvgProgress = (challenge: Challenge): string =>
  `${challenge.avgProgress.toLocaleString()} / ${challenge.taskValue.toLocaleString()}`;

/** Renders as "1 visit" or "2 items". */
export const formatGoal = (challenge: Challenge): string => {
  const [singular, plural] = CHALLENGE_GOAL_UNITS[challenge.taskType];
  return `${challenge.taskValue.toLocaleString()} ${challenge.taskValue === 1 ? singular : plural}`;
};

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);

// ---------- Reference lookups ----------
// Swap these for the real option queries when the endpoints land.

export const getTierName = (tierId: string): string => MOCK_TIERS.find((tier) => tier.id === tierId)?.name || 'Any tier';

export const getMenuName = (menuId?: string): string => MOCK_MENUS.find((menu) => menu.id === menuId)?.name || '—';

export const getMenuItemNames = (itemIds: string[]): string[] =>
  itemIds.map((id) => MOCK_MENU_ITEMS.find((item) => item.id === id)?.name).filter((name): name is string => Boolean(name));

export const getLinkedRewardName = (rewardId?: string): string => MOCK_LINKED_REWARDS.find((reward) => reward.id === rewardId)?.name || '—';
