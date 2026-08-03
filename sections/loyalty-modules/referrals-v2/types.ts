// ============================================================
// Referrals V2 — domain types
//
// Served by `mock-data.ts` through `use-referrals-view.ts` until the real
// endpoints exist. The query/meta shapes deliberately mirror the RTK Query
// list contract (`{ data, meta }`) so swapping the hook for a generated
// `useGetReferralsQuery` is a drop-in change.
// ============================================================

export type ReferralStatus = 'completed' | 'pending' | 'cancelled';

/** Column keys the table can sort by. Sent to the API as `sortBy`. */
export type ReferralSortKey =
  | 'user'
  | 'referrer'
  | 'refLimit'
  | 'refCount'
  | 'userPoints'
  | 'referrerPoints'
  | 'createdAt'
  | 'expiryDate'
  | 'status';

/** Empty string means "no sort" and is omitted from the request. */
export type ReferralSortOrder = 'asc' | 'desc' | '';

/**
 * One referral. Read-only — members create these by sharing their code, so
 * there is nothing for an admin to add or edit here.
 */
export interface Referral {
  id: string;
  /** Username of the member who was invited. */
  user: string;
  /** Username of the member who invited them. */
  referrer: string;
  /** How many referrals the referrer is allowed in total. */
  refLimit: number;
  /** How many the referrer has made so far. */
  refCount: number;
  /** Points awarded to the invitee. Zero until the referral completes. */
  userPoints: number;
  /** Points awarded to the referrer. Zero until the referral completes. */
  referrerPoints: number;
  /** ISO `yyyy-MM-dd`. */
  createdAt: string;
  /** ISO `yyyy-MM-dd`. The referral is cancelled if it is not met by then. */
  expiryDate: string;
  status: ReferralStatus;
}

/** Programme-wide settings, shown on the Current Settings tile. */
export interface ReferralSettings {
  /** Points each side earns when a referral completes. */
  pointsPerReferral: number;
  /** Maximum referrals one member may make. */
  referralLimitPerUser: number;
}

/**
 * Header tiles. These are aggregates over every referral, not just the loaded
 * page, so the server owns them — the list alone cannot produce them.
 */
export interface ReferralStats {
  completed: number;
  pending: number;
  /** Both parties combined. */
  pointsGiven: number;
  topReferrer: { username: string; referrals: number } | null;
}

export interface ReferralsQuery {
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
  /** Substring match on the invitee's username. */
  user: string;
  /** Substring match on the referrer's username. */
  referrer: string;
  /** Empty string means every status. */
  status: ReferralStatus | '';
  sortBy: ReferralSortKey | '';
  sortOrder: ReferralSortOrder;
}

export interface ReferralsMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
