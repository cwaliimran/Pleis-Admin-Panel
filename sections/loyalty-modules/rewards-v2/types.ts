// ============================================================
// Rewards V2 — domain types
//
// Served by `mock-data.ts` through `use-rewards-view.ts` until the real
// endpoints exist. The query/meta shapes deliberately mirror the RTK Query
// list contract (`{ data, meta }`) so swapping the hook for a generated
// `useGetRewardsQuery` is a drop-in change.
// ============================================================

export type RewardStatus = 'active' | 'inactive';

/**
 * Free-text grouping the admin types in ("Tickets", "Drinks", …) — the form
 * calls it "type for sorting". The filter's options are derived from whatever
 * values exist, so there is no fixed union to maintain.
 */
export type RewardType = string;

/** Drives which extra fields the form shows and which detail rows are relevant. */
export type RewardCreationMethod = 'customReward' | 'buyMenuItemReward' | 'ticketReward';

/** Column keys the table can sort by. Sent to the API as `sortBy`. */
export type RewardSortKey = 'name' | 'type' | 'status' | 'views' | 'favorites' | 'claims' | 'redeemed' | 'conversion';

/** Empty string means "no sort" and is omitted from the request. */
export type RewardSortOrder = 'asc' | 'desc' | '';

export interface Reward {
  id: string;
  name: string;
  /** Empty string falls back to the initial-letter avatar. */
  image: string;
  type: RewardType;
  status: RewardStatus;
  creationMethod: RewardCreationMethod;

  /**
   * When false the reward is invisible to browsing — it can only be claimed
   * through a challenge. Views, favorites and conversion are then meaningless
   * and render as "—" rather than 0.
   */
  availableAsReward: boolean;
  /** Obtainable only by completing a challenge, never by spending points. */
  challengeOnly: boolean;

  /** `buyMenuItemReward` only. The claimer picks one of `menuItemIds`. */
  menuId?: string;
  menuItemIds: string[];
  /** `ticketReward` only. */
  eventId?: string;

  /** Points a member spends to claim. */
  pointCost: number;
  /** `null` means unlimited. */
  totalLimit: number | null;
  /** `null` means unlimited. */
  maxClaimsPerUser: number | null;
  /** Id of the minimum tier required, `''` when any tier qualifies. */
  tierLimit: string;
  percentOff: number;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  description: string;

  /** Explains an unusual state on the detail modal, e.g. why it went inactive. */
  statusNote?: string;

  views: number;
  favorites: number;
  claims: number;
  redeemed: number;
}

/** Values the form collects. Ids are resolved to names for display elsewhere. */
export type RewardPayload = Omit<Reward, 'id' | 'views' | 'favorites' | 'claims' | 'redeemed' | 'statusNote'>;

/** Header tiles. Derived from every reward, not just the current page. */
export interface RewardStats {
  totalViews: number;
  totalFavorites: number;
  totalClaims: number;
  totalRedemptions: number;
  /** `null` while there is nothing to rank. */
  mostClaimed: { name: string; claims: number } | null;
}

export interface RewardsQuery {
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
  search: string;
  /** Empty string means every type. */
  type: RewardType | '';
  /** Empty string means every status. */
  status: RewardStatus | '';
  sortBy: RewardSortKey | '';
  sortOrder: RewardSortOrder;
}

export interface RewardsMeta {
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

export interface EventOption {
  id: string;
  name: string;
}

export interface TierOption {
  id: string;
  name: string;
}
