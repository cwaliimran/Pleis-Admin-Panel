import { CHALLENGE_GOAL_UNITS } from './constants';
import { Challenge, ChallengeItemRef } from './types';

/**
 * The menu the form's filter should open on. Only meaningful when every item
 * shares one menu — a mixed selection returns `null` so the picker stays
 * unfiltered and no already-chosen item is hidden behind the wrong menu.
 */
export const getSharedMenu = (items: ChallengeItemRef[]): { id: string; name: string } | null => {
  const [first] = items;
  if (!first?.menuId) return null;

  const shared = items.every((item) => item.menuId === first.menuId);
  return shared ? { id: first.menuId, name: first.menuName } : null;
};

/** Share of participants who finished. Computed server-side. */
export const getCompletionRate = (challenge: Challenge): number | null =>
  challenge.participants > 0 ? challenge.completionRate : null;

/** Share of viewers who went on to start it — the "view → join" rate. */
export const getParticipationRate = (challenge: Challenge): number | null =>
  challenge.views > 0 ? challenge.participationRate : null;

/** `null` when the challenge has no total claim limit. Never negative. */
export const getRemainingClaims = (challenge: Challenge): number | null => {
  if (challenge.claimLimit === null) return null;
  return Math.max(0, challenge.claimLimit - challenge.completions);
};

/**
 * Average progress toward the target. The API reports it as a whole percent
 * rather than a raw count, so it renders as "55%" and not "0.9 / 1".
 */
export const formatAvgProgress = (challenge: Challenge): string => `${challenge.avgProgress.toLocaleString()}%`;

/** Renders as "1 visit" or "2 items". */
export const formatGoal = (challenge: Challenge): string => {
  const [singular, plural] = CHALLENGE_GOAL_UNITS[challenge.taskType];
  return `${challenge.taskValue.toLocaleString()} ${challenge.taskValue === 1 ? singular : plural}`;
};

export const formatMetric = (value: number | null, suffix = ''): string => (value === null ? '—' : `${value.toLocaleString()}${suffix}`);

/** `''` means the challenge is open to every tier. */
export const getTierName = (challenge: Challenge): string => challenge.tierName || 'Any tier';

/**
 * Menu-item picker label: "Chicken Mandi, Coca-Cola, 400g".
 * The preset name lives on `presetType.type.name`. Amount is the backend string unchanged.
 * A bare id for `presetType` is skipped.
 */
export const formatMenuItemOptionLabel = (item: {
  title?: string;
  amountQuantity?: string;
  presetType?: { name?: string; title?: string; type?: { name?: string } | string | null } | string | null;
}): string => {
  const preset = item.presetType;
  const nestedType = preset && typeof preset === 'object' ? preset.type : null;
  const presetName =
    nestedType && typeof nestedType === 'object' ? nestedType.name || '' : preset && typeof preset === 'object' ? preset.name || preset.title || '' : '';
  const amount = item.amountQuantity?.trim() ?? '';

  return [presetName, item.title, amount].filter(Boolean).join(', ');
};

export const formatChallengeItemLabel = (item: ChallengeItemRef): string =>
  formatMenuItemOptionLabel({
    title: item.name,
    amountQuantity: item.amountQuantity,
    presetType: item.presetType,
  });
