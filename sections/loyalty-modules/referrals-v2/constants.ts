import { ReferralStatus } from './types';

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

/**
 * Lifecycle order — also the order the filter lists them in, so sorting the
 * column ascending reads the same way as the dropdown.
 */
export const REFERRAL_STATUS_ORDER: ReferralStatus[] = ['completed', 'pending', 'cancelled'];

export const REFERRAL_STATUS_RANK: Record<ReferralStatus, number> = {
  completed: 1,
  pending: 2,
  cancelled: 3,
};

/**
 * `getStatusVariant` only knows active/inactive/pending/…, so referral statuses
 * map to `CustomBadge` variants here instead.
 */
export const REFERRAL_STATUS_VARIANT: Record<ReferralStatus, 'success' | 'warning' | 'error'> = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'error',
};

export const REFERRAL_STATUS_OPTIONS = REFERRAL_STATUS_ORDER.map((value) => ({
  value,
  label: REFERRAL_STATUS_LABELS[value],
}));

/** Status is the outcome column, so it carries the accent the other modules use. */
export const STATUS_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

export const REFERRALS_HEAD_LABEL = [
  { id: 'user', label: 'User', align: 'left', sortable: true },
  { id: 'referrer', label: 'Referrer', align: 'left', sortable: true },
  { id: 'refLimit', label: 'Ref Limit', align: 'left', sortable: true },
  { id: 'refCount', label: 'Ref Count', align: 'left', sortable: true },
  { id: 'userPoints', label: 'User Points', align: 'left', sortable: true },
  { id: 'referrerPoints', label: 'Referrer Points', align: 'left', sortable: true },
  { id: 'createdAt', label: 'Created At', align: 'left', sortable: true },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left', sortable: true },
  { id: 'status', label: 'Status', align: 'left', sortable: true, className: STATUS_METRIC_CLASS },
];

export const DEFAULT_PAGE_LIMIT = 10;
