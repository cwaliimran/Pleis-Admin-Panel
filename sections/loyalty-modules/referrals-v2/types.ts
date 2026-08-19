// ============================================================
// Referrals V2 — domain types
//
// The view model. `use-referrals-view.ts` maps the wire format in
// `store/Reducer/referrals-v2-api.ts` onto these shapes, so nothing below the
// hook ever sees the backend's field names.
// ============================================================

export type ReferralStatus = 'active' | 'inactive';

/** Column keys the table can sort by. Not wired to the API yet. */
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

/** Empty string means "no sort". */
export type ReferralSortOrder = 'asc' | 'desc' | '';

/**
 * One referral. Read-only — members create these by sharing their code, so
 * there is nothing for an admin to add or edit here.
 */
export interface Referral {
  id: string;
  /** Display name of the member who was invited. */
  user: string;
  /** Display name of the member who invited them. */
  referrer: string;
  /** How many referrals the referrer is allowed in total. */
  refLimit: number;
  /** How many the referrer has made so far. */
  refCount: number;
  /** Points awarded to the invitee. */
  userPoints: number;
  /** Points awarded to the referrer. */
  referrerPoints: number;
  /** ISO datetime. */
  createdAt: string;
  /** ISO datetime. */
  expiryDate: string;
  status: ReferralStatus;
}

/**
 * Header tiles. These are aggregates over every referral, not just the loaded
 * page, so they come from `meta.stats` rather than from the rows.
 */
export interface ReferralStats {
  completed: number;
  pending: number;
  /** Both parties combined. */
  pointsGiven: number;
  topReferrer: { username: string; referrals: number } | null;
}

export interface ReferralsQuery {
  /** 1-based, as shown in the UI and as the API expects it. */
  page: number;
  limit: number;
  /** Free-text search, matched against both the invitee and the referrer. */
  keyword: string;
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
