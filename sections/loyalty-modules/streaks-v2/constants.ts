import { StreakBadge, StreakCountBase } from './types';

export const STREAK_BADGE_LABELS: Record<StreakBadge, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

/** Worst to best. Drives both the sort order and the threshold ladder. */
export const STREAK_BADGE_ORDER: StreakBadge[] = ['bronze', 'silver', 'gold', 'platinum'];

export const STREAK_BADGE_RANK: Record<StreakBadge, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
};

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

export const STREAKS_HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'username', label: 'Username', align: 'left', sortable: true },
  { id: 'name', label: 'Name', align: 'left', sortable: true },
  { id: 'streak', label: 'Streak', align: 'left', sortable: true },
  { id: 'longestStreak', label: 'Longest Streak', align: 'left', sortable: true },
  { id: 'highestBadge', label: 'Highest Badge', align: 'left', sortable: true, className: BADGE_METRIC_CLASS },
  { id: 'visits', label: 'Visits', align: 'left', sortable: true },
  { id: 'lastVisitAt', label: 'Last Visit At', align: 'left', sortable: true },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export const DEFAULT_PAGE_LIMIT = 10;
