import { ConditionType, ReservationTypeStatus, TaxPercentage } from './types';

// ============================================================
// Reservation Types — constants
//
// Everything here is specific to reservation types. Page-wide options
// (time slots, cancellation windows) and the shared control classes stay
// in the parent `constants.ts`.
// ============================================================

export const DEFAULT_PAGE_LIMIT = 10;

// ---------- Labels ----------

export const CONDITION_TYPE_CONFIG: Record<ConditionType, { label: string }> = {
  free: { label: 'Free' },
  minimumSpend: { label: 'Minimum spend' },
};

export const RESERVATION_TYPE_STATUS_CONFIG: Record<ReservationTypeStatus, { label: string }> = {
  active: { label: 'Active' },
  inactive: { label: 'Inactive' },
};

// ---------- Options ----------

export const CONDITION_TYPE_OPTIONS: { value: ConditionType; label: string }[] = (Object.keys(CONDITION_TYPE_CONFIG) as ConditionType[]).map(
  (value) => ({ value, label: CONDITION_TYPE_CONFIG[value].label })
);

export const RESERVATION_TYPE_STATUS_OPTIONS: { value: ReservationTypeStatus; label: string }[] = (
  Object.keys(RESERVATION_TYPE_STATUS_CONFIG) as ReservationTypeStatus[]
).map((value) => ({ value, label: RESERVATION_TYPE_STATUS_CONFIG[value].label }));

/** `all` is a UI-only value — the matching query param is simply left off. */
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

// ---------- Table ----------

export const RESERVATION_TYPES_TABLE_HEAD = [
  { id: 'name', label: 'Reservation type', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'maxCapacity', label: 'Max capacity', align: 'left' },
  { id: 'conditionType', label: 'Condition type', align: 'left' },
  { id: 'occasion', label: 'Occasion', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

// ---------- Helpers ----------

/** The suggested value for "Max capacity" before any manual override. */
export const suggestMaxCapacity = (quantity: number, maxPartySize: number) => {
  if (!Number.isFinite(quantity) || !Number.isFinite(maxPartySize)) return 0;
  return Math.max(0, Math.trunc(quantity)) * Math.max(0, Math.trunc(maxPartySize));
};
