import { ChallengeRewardType, ChallengeStatus, ChallengeTaskType } from './types';

/** Wording follows the list column, which reads as an instruction. */
export const CHALLENGE_TASK_TYPE_LABELS: Record<ChallengeTaskType, string> = {
  visit: 'Visit X Times',
  earnPoints: 'Earn X Points',
  referUsers: 'Refer X Users',
  buyMenuItem: 'By Item X Times',
};

export const CHALLENGE_TASK_TYPE_OPTIONS = (Object.keys(CHALLENGE_TASK_TYPE_LABELS) as ChallengeTaskType[]).map((value) => ({
  value,
  label: CHALLENGE_TASK_TYPE_LABELS[value],
}));

/** Singular/plural unit for the goal, e.g. "1 visit" or "2 items". */
export const CHALLENGE_GOAL_UNITS: Record<ChallengeTaskType, [string, string]> = {
  visit: ['visit', 'visits'],
  earnPoints: ['point', 'points'],
  referUsers: ['user', 'users'],
  buyMenuItem: ['item', 'items'],
};

export const CHALLENGE_REWARD_TYPE_LABELS: Record<ChallengeRewardType, string> = {
  points: 'Point Reward',
  menuItem: 'Menu Item',
  linkedReward: 'Linked Reward',
  customReward: 'Custom Reward',
  specialTicket: 'Special Ticket',
};

/**
 * Offered by both the form and the filter. `customReward` and `specialTicket`
 * are left out — they are legacy, and only kept in the labels above so records
 * still holding them render.
 */
export const CHALLENGE_REWARD_TYPE_OPTIONS: { value: ChallengeRewardType; label: string }[] = (
  ['points', 'menuItem', 'linkedReward'] as ChallengeRewardType[]
).map((value) => ({ value, label: CHALLENGE_REWARD_TYPE_LABELS[value] }));

/** The chip itself comes from `CustomBadge` + `getStatusVariant`, as elsewhere. */
export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const CHALLENGE_STATUS_OPTIONS = (Object.keys(CHALLENGE_STATUS_LABELS) as ChallengeStatus[]).map((value) => ({
  value,
  label: CHALLENGE_STATUS_LABELS[value],
}));

// ---------- Form hints ----------

const HINT_BLUE = 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200';
const HINT_PURPLE = 'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-200';

/** Only `buyMenuItem` needs explaining — the other tasks are self-evident. */
export const CHALLENGE_TASK_TYPE_HINT = {
  className: HINT_BLUE,
  lead: 'Pick one or more qualifying items. Any of these will count toward the goal — e.g.',
  emphasis: '5x',
  trail: 'means 5 purchases drawn from this list.',
};

export const CHALLENGE_REWARD_TYPE_HINTS: Partial<
  Record<ChallengeRewardType, { className: string; lead: string; emphasis?: string; trail?: string }>
> = {
  menuItem: {
    className: HINT_BLUE,
    lead: 'Link one or more menu items as the reward. When the user claims it, they choose which item and get a',
    emphasis: 'QR code',
    trail: 'for that specific item.',
  },
  linkedReward: {
    className: HINT_PURPLE,
    lead: 'Use an existing reward as the payout. Typically used for "Challenge Only" rewards like merch or branded items.',
  },
  customReward: {
    className: HINT_PURPLE,
    lead: 'Legacy free-text payout. Existing challenges keep it, but new ones should use a linked reward instead.',
  },
  specialTicket: {
    className: HINT_PURPLE,
    lead: 'Legacy event ticket payout. Existing challenges keep it; it cannot be edited here.',
  },
};

// ---------- Table ----------

/**
 * Views and favorites describe how the challenge performs *while browsing*, so
 * they are tinted apart from the participation counts.
 */
export const BROWSING_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

/**
 * `sortKey` is what the API expects as `sortBy`. Status has no sort — the
 * endpoint does not accept it — so it is rendered as a plain column.
 */
export const CHALLENGES_HEAD_LABEL = [
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', sortable: true, sortKey: 'title' },
  { id: 'taskType', label: 'Task Type', align: 'left', sortable: true, sortKey: 'taskType' },
  { id: 'rewardType', label: 'Reward Type', align: 'left', sortable: true, sortKey: 'rewardType' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'views', label: 'Views', align: 'left', sortable: true, sortKey: 'views', className: BROWSING_METRIC_CLASS },
  { id: 'favorites', label: 'Favorites', align: 'left', sortable: true, sortKey: 'favorites', className: BROWSING_METRIC_CLASS },
  { id: 'participants', label: 'Participants', align: 'left', sortable: true, sortKey: 'participants' },
  { id: 'completions', label: 'Completions', align: 'left', sortable: true, sortKey: 'completions' },
  { id: 'avgProgress', label: 'Avg Progress', align: 'left', sortable: true, sortKey: 'avgProgress' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export const DEFAULT_PAGE_LIMIT = 10;

/** How long the calculator waits after typing before asking the server. */
export const CALCULATOR_DEBOUNCE_MS = 500;

/** Reference-data dropdowns are unpaginated in this form. */
export const OPTIONS_PAGE_LIMIT = '100';
