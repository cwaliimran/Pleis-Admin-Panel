import { StreakBadge, StreakCountBase } from './types';

export const STREAK_BADGE_LABELS: Record<StreakBadge, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

/**
 * Worst to best. Drives the threshold ladder, the order the badges are sent to
 * the API in, and the order the rule modal lists its fields.
 */
export const STREAK_BADGE_ORDER: StreakBadge[] = ['bronze', 'silver', 'gold', 'platinum'];

/** Tier colour for the dot beside the badge name. */
export const STREAK_BADGE_DOT_CLASS: Record<StreakBadge, string> = {
  bronze: 'bg-amber-600',
  silver: 'bg-slate-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-cyan-400',
};

export const STREAK_BADGE_OPTIONS = STREAK_BADGE_ORDER.map((value) => ({
  value,
  label: STREAK_BADGE_LABELS[value],
}));

export const STREAK_COUNT_BASE_LABELS: Record<StreakCountBase, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

export const STREAK_COUNT_BASE_OPTIONS = (Object.keys(STREAK_COUNT_BASE_LABELS) as StreakCountBase[]).map((value) => ({
  value,
  label: STREAK_COUNT_BASE_LABELS[value],
}));

/** Lower-case form used inside the "increases by 1 each …" sentence. */
export const STREAK_COUNT_BASE_NOUN: Record<StreakCountBase, string> = {
  day: 'day',
  week: 'week',
  month: 'month',
};

/**
 * The badge column is an achievement rather than a raw count, so it carries the
 * same accent the other modules use for their headline metrics.
 */
export const BADGE_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

/** 24-hour clock — the design shows 23:48, which `formatStr` has no entry for. */
export const STREAK_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

/**
 * `sortKey` is what the API expects as `sortBy` — the backend's own field
 * names, which differ from the column ids for the two name columns. Highest
 * Badge is deliberately not sortable: the endpoint accepts no badge sort.
 */
export const STREAKS_HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'username', label: 'Username', align: 'left', sortable: true, sortKey: 'userName' },
  { id: 'name', label: 'Name', align: 'left', sortable: true, sortKey: 'userFirstName' },
  { id: 'streak', label: 'Streak', align: 'left', sortable: true, sortKey: 'streak' },
  { id: 'longestStreak', label: 'Longest Streak', align: 'left', sortable: true, sortKey: 'longestStreak' },
  { id: 'highestBadge', label: 'Highest Badge', align: 'left', className: BADGE_METRIC_CLASS },
  { id: 'visits', label: 'Visits', align: 'left', sortable: true, sortKey: 'visits' },
  { id: 'lastVisitAt', label: 'Last Visit At', align: 'left', sortable: true, sortKey: 'lastVisitAt' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export const DEFAULT_PAGE_LIMIT = 10;

/**
 * What the Streak Rules modal opens with when the company has no rule set yet.
 * The thresholds stay blank so the ladder is a deliberate choice rather than an
 * accepted default; only the count base is pre-picked.
 */
export const DEFAULT_STREAK_COUNT_BASE: StreakCountBase = 'week';
