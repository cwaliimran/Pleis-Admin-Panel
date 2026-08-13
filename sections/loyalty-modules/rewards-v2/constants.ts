import { RewardCreationMethod, RewardStatus } from './types';

/** The chip itself comes from `CustomBadge` + `getStatusVariant`, as elsewhere. */
export const REWARD_STATUS_LABELS: Record<RewardStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const REWARD_STATUS_OPTIONS = (Object.keys(REWARD_STATUS_LABELS) as RewardStatus[]).map((value) => ({
  value,
  label: REWARD_STATUS_LABELS[value],
}));

// ---------- Creation method ----------

export const REWARD_CREATION_METHOD_LABELS: Record<RewardCreationMethod, string> = {
  customReward: 'Custom Reward',
  buyMenuItemReward: 'From Menu Items',
  ticketReward: 'Ticket Reward',
};

/** The form's dropdown wording differs slightly from the display label. */
export const REWARD_CREATION_METHOD_OPTIONS: { value: RewardCreationMethod; label: string }[] = [
  { value: 'customReward', label: 'Custom Reward' },
  { value: 'buyMenuItemReward', label: 'From Menu Items' },
  { value: 'ticketReward', label: 'Add Ticket Reward' },
];

/** The hint banner shown under the creation-method dropdown. */
export const REWARD_CREATION_METHOD_HINTS: Record<RewardCreationMethod, { text: string; className: string }> = {
  customReward: {
    text: 'Build a standalone reward (merch, perks, branded items) that members redeem with points. Use the calculator below to set a fair point value.',
    className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200',
  },
  buyMenuItemReward: {
    text: "Link one or more menu items to this reward. When members claim it, they'll pick which item they want. Use the calculator below to set the point value.",
    className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200',
  },
  ticketReward: {
    text: 'Create exclusive tickets available only through loyalty rewards. These are not for sale and grant special access to events.',
    className: 'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-200',
  },
};

/**
 * Business rule that is still being confirmed, so it is surfaced as a banner
 * rather than encoded anywhere.
 */
export const REWARD_REDEEM_DELAY_NOTICE = {
  lead: 'After a user claims this reward, it becomes available to redeem the',
  emphasis: 'next day (23 h delay).',
  caveat: '(to be confirmed)',
};

// ---------- Table ----------

/**
 * Views, favorites and conversion describe how the reward performs *while
 * browsing*, so they are tinted apart from the claim/redeem counts.
 */
export const BROWSING_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

/**
 * `sortKey` is what the API expects as `sortBy` — the backend's own field
 * names, which differ from the column ids the UI uses.
 */
export const REWARDS_HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', sortable: true, sortKey: 'title' },
  { id: 'type', label: 'Type', align: 'left', sortable: true, sortKey: 'sortingType' },
  { id: 'status', label: 'Status', align: 'left', sortable: true, sortKey: 'status' },
  { id: 'views', label: 'Views', align: 'left', sortable: true, sortKey: 'views', className: BROWSING_METRIC_CLASS },
  { id: 'favorites', label: 'Favorites', align: 'left', sortable: true, sortKey: 'favoritesCount', className: BROWSING_METRIC_CLASS },
  { id: 'claims', label: 'Claims', align: 'left', sortable: true, sortKey: 'claimed' },
  { id: 'redeemed', label: 'Redeemed', align: 'left', sortable: true, sortKey: 'redeemed' },
  { id: 'conversion', label: 'Conversion', align: 'left', sortable: true, sortKey: 'conversion', className: BROWSING_METRIC_CLASS },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export const DEFAULT_PAGE_LIMIT = 10;

/**
 * The types endpoint returns one row per reward rather than a distinct list,
 * so it is asked for far more than a page's worth and deduped in the hook.
 */
export const REWARD_TYPE_OPTIONS_LIMIT = 200;

/** How long the calculator waits after typing before asking the server. */
export const CALCULATOR_DEBOUNCE_MS = 500;

/** Reference-data dropdowns are unpaginated in this form. */
export const OPTIONS_PAGE_LIMIT = '100';
