import { ReferralStatus } from './types';

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
