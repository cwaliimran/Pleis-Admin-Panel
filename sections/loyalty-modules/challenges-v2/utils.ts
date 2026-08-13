import { CHALLENGE_GOAL_UNITS } from './constants';
import { Challenge } from './types';

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
