import {
  CancellationWindowHours,
  ConditionType,
  OffsetMinutes,
  ReservationTypeStatus,
  SlotDurationMinutes,
  TaxPercentage,
} from './types';

// ============================================================
// Time slots
// ============================================================

export const SLOT_DURATION_OPTIONS: { value: SlotDurationMinutes; label: string }[] = [
  { value: 90, label: '90 min' },
  { value: 60, label: '60 min' },
  { value: 120, label: '120 min' },
];

/** Shared by both the start and the end offset dropdowns. */
export const OFFSET_OPTIONS: { value: OffsetMinutes; label: string }[] = [
  { value: 0, label: '0 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 75, label: '75 min' },
  { value: 90, label: '90 min' },
];

// ============================================================
// Cancellation policy
// ============================================================

export const CANCELLATION_WINDOW_OPTIONS: { value: CancellationWindowHours; label: string }[] = [
  { value: 0, label: 'Not allowed' },
  { value: 6, label: '6 hours before' },
  { value: 12, label: '12 hours before' },
  { value: 24, label: '24 hours before' },
  { value: 48, label: '48 hours before' },
  { value: 72, label: '72 hours before' },
];

// ============================================================
// Reservation types
// ============================================================

export const CONDITION_TYPE_CONFIG: Record<ConditionType, { label: string }> = {
  free: { label: 'Free' },
  minimumSpend: { label: 'Minimum spend' },
};

export const RESERVATION_TYPE_STATUS_CONFIG: Record<ReservationTypeStatus, { label: string }> = {
  active: { label: 'Active' },
  inactive: { label: 'Inactive' },
};

export const CONDITION_TYPE_OPTIONS: { value: ConditionType; label: string }[] = (Object.keys(CONDITION_TYPE_CONFIG) as ConditionType[]).map(
  (value) => ({ value, label: CONDITION_TYPE_CONFIG[value].label })
);

export const RESERVATION_TYPE_STATUS_OPTIONS: { value: ReservationTypeStatus; label: string }[] = (
  Object.keys(RESERVATION_TYPE_STATUS_CONFIG) as ReservationTypeStatus[]
).map((value) => ({ value, label: RESERVATION_TYPE_STATUS_CONFIG[value].label }));

export const CONDITION_TYPE_FILTER_OPTIONS: { value: ConditionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All condition types' },
  ...CONDITION_TYPE_OPTIONS,
];

export const STATUS_FILTER_OPTIONS: { value: ReservationTypeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...RESERVATION_TYPE_STATUS_OPTIONS,
];

export const TAX_PERCENTAGE_OPTIONS: { value: TaxPercentage; label: string }[] = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 13, label: '13%' },
  { value: 25, label: '25%' },
];

export const RESERVATION_TYPES_TABLE_HEAD = [
  { id: 'name', label: 'Reservation type', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'maxCapacity', label: 'Max capacity', align: 'left' },
  { id: 'conditionType', label: 'Condition type', align: 'left' },
  { id: 'occasion', label: 'Occasion', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

// ============================================================
// Shared control styling
//
// shadcn's Select ships `cursor-default` on both the trigger and its items;
// every dropdown on this page is clickable, so both get `cursor-pointer`.
// ============================================================

export const SELECT_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]';

export const SELECT_ITEM_CLASS = 'cursor-pointer';

// ============================================================
// Helpers
// ============================================================

/** The suggested value for "Max capacity" before any manual override. */
export const suggestMaxCapacity = (quantity: number, maxPartySize: number) => {
  if (!Number.isFinite(quantity) || !Number.isFinite(maxPartySize)) return 0;
  return Math.max(0, Math.trunc(quantity)) * Math.max(0, Math.trunc(maxPartySize));
};

/** Only active types contribute — inactive ones are not bookable on their own. */
export const getTotalMaxCapacity = (types: { status: ReservationTypeStatus; maxCapacity: number }[]) =>
  types.filter((type) => type.status === 'active').reduce((total, type) => total + type.maxCapacity, 0);
