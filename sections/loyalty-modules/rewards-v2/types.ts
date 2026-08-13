// ============================================================
// Rewards V2 — domain types
//
// The view model the components render. `use-rewards-view.ts` maps the wire
// format (`store/Reducer/rewards-v2-api.ts`) onto this once, so nothing below
// the hook deals with the backend's own field names.
// ============================================================

import type { ApiRewardSortBy, ApiRewardStatus, ApiRewardType } from '@/store/Reducer/rewards-v2-api';

export type RewardStatus = ApiRewardStatus;

/**
 * Free-text grouping the admin types in ("Tickets", "Drinks", …) — the form
 * calls it "type for sorting" and the API calls it `sortingType`. Options come
 * from the reward-types endpoint, so there is no fixed union to maintain.
 */
export type RewardType = string;

/** Drives which extra fields the form shows and which detail rows are relevant. */
export type RewardCreationMethod = ApiRewardType;

/** Column keys the table can sort by — the API's own field names. */
export type RewardSortKey = ApiRewardSortBy;

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
  /** Surfaced through promotions rather than the rewards list. */
  isPromotionOnly: boolean;

  // ---- `buyMenuItemReward` only ----
  /** The API links exactly one menu item, and nests its menu inside it. */
  menuId?: string;
  menuName?: string;
  menuItemId?: string;
  menuItemName?: string;

  // ---- `ticketReward` only ----
  /** Ids only — the API does not populate these. */
  eventId?: string;
  ticketId?: string;
  timeSlotId?: string;
  isFastTrack: boolean;

  /** Points a member spends to claim. */
  pointCost: number;
  /** `null` means unlimited. */
  totalLimit: number | null;
  /** `null` means unlimited. */
  maxClaimsPerUser: number | null;
  /** Minimum tier required. `''` when any tier qualifies. */
  tierId: string;
  tierName: string;
  percentOff: number;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  description: string;

  views: number;
  favorites: number;
  claims: number;
  redeemed: number;
  /** Whole percent, computed server-side. */
  conversion: number;
  /** Whole percent, computed server-side. */
  redemptionRate: number;
}

/** Header tiles. Computed by the server across every reward, not the page. */
export interface RewardStats {
  totalViews: number;
  totalFavorites: number;
  totalClaims: number;
  totalRedemptions: number;
  /** `null` while there is nothing to rank. */
  mostClaimed: { name: string; claims: number } | null;
}

export interface RewardsQuery {
  /** 1-based, as shown in the UI and as the API expects it. */
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
