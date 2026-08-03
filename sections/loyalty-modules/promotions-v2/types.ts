// ============================================================
// Promotions V2 — domain types
//
// Served by `mock-data.ts` through `use-promotions-view.ts` until the real
// endpoints exist. The query/meta shapes deliberately mirror the RTK Query
// list contract (`{ data, meta }`) so swapping the hook for a generated
// `useGetPromotionsQuery` is a drop-in change.
// ============================================================

export type PromotionStatus = 'active' | 'inactive';

/**
 * `claimPromotion` is legacy — its job is now done by Rewards flagged
 * "Challenge Only". Existing records still render, but it is marked deprecated
 * everywhere it appears and cannot be picked when creating. See
 * `DEPRECATED_PROMOTION_TYPES`.
 */
export type PromotionType = 'extraPoints' | 'happyHour' | 'itemDiscount' | 'claimPromotion';

/** Whether the promotion runs every day or only on chosen weekdays. */
export type PromotionActiveDaysMode = 'all' | 'specific';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** Column keys the table can sort by. Sent to the API as `sortBy`. */
export type PromotionSortKey = 'title' | 'type' | 'status' | 'views' | 'favorites' | 'participations' | 'pointsAwarded';

/** Empty string means "no sort" and is omitted from the request. */
export type PromotionSortOrder = 'asc' | 'desc' | '';

export interface Promotion {
  id: string;
  title: string;
  /** Empty string falls back to the initial-letter avatar. */
  image: string;
  description: string;
  type: PromotionType;
  status: PromotionStatus;

  // ---------- Type-specific ----------

  /** Menu the selected items are drawn from. */
  menuId?: string;
  /**
   * Items the promotion applies to — purchases that qualify for
   * `extraPoints`, or the items marked down for `itemDiscount`.
   */
  qualifyingItemIds: string[];
  /** `extraPoints` only. */
  extraPointsPerPurchase: number;
  /** `happyHour` only, e.g. 1.5 for 1.5x points. */
  pointsMultiplier: number;
  /** `itemDiscount` only, as a whole percent off. */
  discountPercent: number;
  /** `claimPromotion` only — the legacy reward handed out. */
  rewardName?: string;

  // ---------- Schedule ----------

  /** ISO `yyyy-MM-dd`. */
  startDate: string;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;

  /** Absent means the type has no schedule at all — legacy records only. */
  activeDaysMode?: PromotionActiveDaysMode;
  /** Only meaningful when `activeDaysMode` is `specific`. */
  activeWeekdays: Weekday[];
  /** 24h `HH:mm`. Both ends absent means no time restriction. */
  startTime?: string;
  endTime?: string;

  // ---------- Analytics (server-owned) ----------

  views: number;
  favorites: number;
  /** Uses — claims, for a legacy claim promotion. */
  participations: number;
  pointsAwarded: number;
}

/** Values the form collects — the analytics counters stay server-owned. */
export type PromotionPayload = Omit<Promotion, 'id' | 'views' | 'favorites' | 'participations' | 'pointsAwarded'>;

/** Header tiles. Derived from every promotion, not just the current page. */
export interface PromotionStats {
  totalViews: number;
  totalFavorites: number;
  totalParticipations: number;
  pointsAwarded: number;
  /** `null` while there is nothing to rank. */
  mostEngaged: { title: string; uses: number } | null;
}

export interface PromotionsQuery {
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
  search: string;
  /** Empty string means every type. */
  type: PromotionType | '';
  /** Only promotions starting on or after this date. */
  startDateFrom?: Date;
  /** Only promotions ending on or before this date. */
  endDateTo?: Date;
  sortBy: PromotionSortKey | '';
  sortOrder: PromotionSortOrder;
}

export interface PromotionsMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

// ---------- Reference data ----------

export interface MenuOption {
  id: string;
  name: string;
}

export interface MenuItemOption {
  id: string;
  menuId: string;
  name: string;
}
