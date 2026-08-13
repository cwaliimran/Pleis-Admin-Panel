import { STREAK_BADGE_ORDER, STREAK_COUNT_BASE_LABELS } from './constants';
import { StreakRules } from './types';

/** Renders as "3 / 7 / 14 / 30" — the badge ladder in tier order. */
export const formatThresholdLadder = (rules: StreakRules): string => STREAK_BADGE_ORDER.map((badge) => rules.thresholds[badge]).join(' / ');

/**
 * Renders as "Week · 3 / 7 / 14 / 30" for the Current Rules tile, or "Not set"
 * while the company has no rule set saved.
 */
export const formatRulesSummary = (rules: StreakRules | null): string =>
  rules ? `${STREAK_COUNT_BASE_LABELS[rules.countBase]} · ${formatThresholdLadder(rules)}` : 'Not set';
