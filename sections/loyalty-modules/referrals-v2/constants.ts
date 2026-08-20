import { ReferralSortKey, ReferralStatus } from './types';

/** The chip itself comes from `CustomBadge` + `getStatusVariant`, as elsewhere. */
export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const REFERRAL_STATUS_OPTIONS = (Object.keys(REFERRAL_STATUS_LABELS) as ReferralStatus[]).map((value) => ({
  value,
  label: REFERRAL_STATUS_LABELS[value],
}));

/** Status is the outcome column, so it carries the accent the other modules use. */
export const STATUS_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

interface ReferralsHeadLabel {
  id: string;
  label: string;
  align: string;
  sortable?: boolean;
  /** Typed so a mistyped column never sends a `sortBy` the API rejects. */
  sortKey?: ReferralSortKey;
  className?: string;
}

export const REFERRALS_HEAD_LABEL: ReferralsHeadLabel[] = [
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'user' },
  { id: 'referrer', label: 'Referrer', align: 'left', sortable: true, sortKey: 'referrerUserName' },
  { id: 'refLimit', label: 'Ref Limit', align: 'left', sortable: true, sortKey: 'referralLimit' },
  { id: 'refCount', label: 'Ref Count', align: 'left', sortable: true, sortKey: 'loyaltyReferralsCount' },
  { id: 'userPoints', label: 'User Points', align: 'left', sortable: true, sortKey: 'userReward' },
  { id: 'referrerPoints', label: 'Referrer Points', align: 'left', sortable: true, sortKey: 'referrerReward' },
  { id: 'createdAt', label: 'Created At', align: 'left', sortable: true, sortKey: 'createdAt' },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left', sortable: true, sortKey: 'expiryDate' },
  { id: 'status', label: 'Status', align: 'left', sortable: true, sortKey: 'status', className: STATUS_METRIC_CLASS },
];

export const DEFAULT_PAGE_LIMIT = 10;
