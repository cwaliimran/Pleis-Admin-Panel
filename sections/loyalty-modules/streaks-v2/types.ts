// ============================================================
// Streaks V2 — domain types
//
// The view model the components render. `use-streaks-view.ts` maps the wire
// format (`store/Reducer/streaks-v2-api.ts`) onto this once, so nothing below
// the hook deals with the backend's own field names.
// ============================================================

import type { ApiStreakBadge, ApiStreakCountBase, ApiUserStreakSortBy } from '@/store/Reducer/streaks-v2-api';

/** Badge tiers, ordered worst to best — see `STREAK_BADGE_ORDER`. */
export type StreakBadge = ApiStreakBadge;

/** The period a streak is counted in. */
export type StreakCountBase = ApiStreakCountBase;

/**
 * Column keys the table can sort by — the API's own field names. Note there is
 * no badge sort, so the Highest Badge column is not sortable.
 */
export type StreakSortKey = ApiUserStreakSortBy;

/** Empty string means "no sort" and is omitted from the request. */
export type StreakSortOrder = 'asc' | 'desc' | '';

/** One member's streak record. Read-only — the app maintains these. */
export interface StreakMember {
  id: string;
  username: string;
  name: string;
  /** Empty string falls back to the initial-letter avatar. */
  photo: string;
  /** Current run. Resets to 0 when a period is missed. */
  streak: number;
  longestStreak: number;
  /** Kept even after the streak resets. `null` before the first badge. */
  highestBadge: StreakBadge | null;
  visits: number;
  /** ISO datetime. */
  lastVisitAt: string;
}

/**
 * Global rules, edited through the Streak Rules modal and applied to every
 * member. `thresholds` is the number of consecutive visits each badge needs.
 *
 * The whole object is `null` until a rule set has been saved for the company —
 * the API answers with an empty `data` object in that case.
 */
export interface StreakRules {
  countBase: StreakCountBase;
  thresholds: Record<StreakBadge, number>;
}

/**
 * Header tiles. These are aggregates over the whole member base, not just the
 * loaded page, so the server owns them — the list alone cannot produce them.
 */
export interface StreakStats {
  avgStreakPerUser: number;
  /** The figure only — the API does not say who holds it. */
  longestStreak: number;
  /** Every badge ever handed out, all tiers combined. */
  badgesAwarded: number;
  topStreaker: { username: string; visits: number } | null;
}

export interface StreaksQuery {
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
  search: string;
  /** Empty string means every badge. */
  badge: StreakBadge | '';
  /** Only members whose last visit is on or after this date. */
  lastVisitFrom?: Date;
  sortBy: StreakSortKey | '';
  sortOrder: StreakSortOrder;
}

export interface StreaksMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
