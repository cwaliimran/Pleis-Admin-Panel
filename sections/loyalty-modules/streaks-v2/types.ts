// ============================================================
// Streaks V2 — domain types
//
// Served by `mock-data.ts` through `use-streaks-view.ts` until the real
// endpoints exist. The query/meta shapes deliberately mirror the RTK Query
// list contract (`{ data, meta }`) so swapping the hook for a generated
// `useGetStreaksQuery` is a drop-in change.
// ============================================================

/** Badge tiers, ordered worst to best — see `STREAK_BADGE_RANK`. */
export type StreakBadge = 'bronze' | 'silver' | 'gold' | 'platinum';

/** The period a streak is counted in. */
export type StreakCountBase = 'day' | 'week' | 'month';

/** Column keys the table can sort by. Sent to the API as `sortBy`. */
export type StreakSortKey = 'username' | 'name' | 'streak' | 'longestStreak' | 'highestBadge' | 'visits' | 'lastVisitAt';

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
  longestStreak: number;
  /** Who holds `longestStreak`. */
  longestStreakUsername: string;
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
