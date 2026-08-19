import { PromotionActiveDaysMode, PromotionStatus, PromotionType, Weekday } from './types';

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  extraPoints: 'Extra points for Item',
  happyHour: 'Happy Hour',
  itemDiscount: 'Item on Discount',
  claimPromotion: 'Claim Promotion',
};

export const PROMOTION_TYPE_ORDER: PromotionType[] = ['extraPoints', 'happyHour', 'itemDiscount', 'claimPromotion'];

export const DEPRECATED_PROMOTION_TYPES: PromotionType[] = ['claimPromotion'];

export const isDeprecatedType = (type: PromotionType): boolean => DEPRECATED_PROMOTION_TYPES.includes(type);

export const PROMOTION_TYPE_OPTIONS = PROMOTION_TYPE_ORDER.map((value) => ({
  value,
  label: `${PROMOTION_TYPE_LABELS[value]}${isDeprecatedType(value) ? ' (deprecated)' : ''}`,
}));

export const PROMOTION_TYPE_FORM_OPTIONS = PROMOTION_TYPE_ORDER.filter((type) => !isDeprecatedType(type)).map((value) => ({
  value,
  label: PROMOTION_TYPE_LABELS[value],
}));

export const PROMOTION_DEPRECATION_NOTE =
  'The "Claim Promotion" type is deprecated. This functionality is now covered by Rewards marked "Challenge Only" (e.g. Cabaret Branded Lighter).';

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const HINT_BLUE = 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200';
const HINT_PURPLE = 'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-200';

export const PROMOTION_TYPE_HINTS: Partial<
  Record<PromotionType, { icon: string; className: string; lead: string; emphasis?: string; trail?: string }>
> = {
  extraPoints: {
    icon: '💡',
    className: HINT_BLUE,
    lead: 'Pick one or more menu items. Buying any of these awards',
    emphasis: 'extra points',
    trail: 'on top of the regular amount.',
  },
  happyHour: {
    icon: '💡',
    className: HINT_BLUE,
    lead: 'During the active window, points earned are multiplied. Set start/end time below in',
    emphasis: 'Active Time',
    trail: '.',
  },
  itemDiscount: {
    icon: '🔗',
    className: HINT_PURPLE,
    lead: 'This syncs directly to the menu. Selected items appear discounted during the active period. Editing this promotion updates the menu automatically.',
  },
};

export const PROMOTION_ITEMS_FIELD_LABELS: Partial<Record<PromotionType, string>> = {
  extraPoints: 'Add Qualifying Items',
  itemDiscount: 'Add Items on Discount',
};

export const PROMOTION_ACTIVE_DAYS_LABELS: Record<PromotionActiveDaysMode, string> = {
  all: 'All days (no day restriction)',
  specific: 'Specific days only',
};

export const PROMOTION_ACTIVE_DAYS_OPTIONS = (Object.keys(PROMOTION_ACTIVE_DAYS_LABELS) as PromotionActiveDaysMode[]).map((value) => ({
  value,
  label: PROMOTION_ACTIVE_DAYS_LABELS[value],
}));

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export const WEEKDAY_ORDER: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const WEEKDAY_OPTIONS = WEEKDAY_ORDER.map((value) => ({ value, label: WEEKDAY_LABELS[value] }));

export const POINTS_MULTIPLIER_OPTIONS = [1, 1.5, 2, 3].map((value) => ({
  value: String(value),
  label: `${value}x`,
}));

export const BROWSING_METRIC_CLASS = 'text-emerald-600 dark:text-emerald-400';

export const PROMOTIONS_HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'title', label: 'Title', align: 'left', sortable: true },
  { id: 'type', label: 'Promotion Type', align: 'left', sortable: true },
  { id: 'status', label: 'Status', align: 'left', sortable: true },
  { id: 'views', label: 'Views', align: 'left', sortable: true, className: BROWSING_METRIC_CLASS },
  { id: 'favorites', label: 'Favorites', align: 'left', sortable: true, className: BROWSING_METRIC_CLASS },
  { id: 'participations', label: 'Participations', align: 'left', sortable: true },
  { id: 'pointsAwarded', label: 'Points Awarded', align: 'left', sortable: true },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export const DEFAULT_PAGE_LIMIT = 10;

export const OPTIONS_PAGE_LIMIT = 100;
