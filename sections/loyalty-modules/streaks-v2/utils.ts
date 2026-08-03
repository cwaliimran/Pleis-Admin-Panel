import { STREAK_BADGE_ORDER, STREAK_BADGE_RANK, STREAK_COUNT_BASE_LABELS } from './constants';
import { StreakBadge, StreakRules } from './types';

/** Unbadged members sort below every badged one. */
export const getBadgeRank = (badge: StreakBadge | null): number => (badge ? STREAK_BADGE_RANK[badge] : 0);

/** Renders as "3 / 7 / 14 / 30" — the badge ladder in tier order. */
export const formatThresholdLadder = (rules: StreakRules): string => STREAK_BADGE_ORDER.map((badge) => rules.thresholds[badge]).join(' / ');

/** Renders as "Week · 3 / 7 / 14 / 30" for the Current Rules tile. */
export const formatRulesSummary = (rules: StreakRules): string =>
  `${STREAK_COUNT_BASE_LABELS[rules.countBase]} · ${formatThresholdLadder(rules)}`;
