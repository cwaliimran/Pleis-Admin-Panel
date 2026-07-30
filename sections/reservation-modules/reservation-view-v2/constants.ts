import { CapacityLevel, ListFilter, ReservationStatus } from './types';

// ============================================================
// Time slots
// ============================================================

export const SLOT_START_HOUR = 12;
export const SLOT_END_HOUR = 23;

/** 12:00 … 23:00, one per hour — the window the venue accepts bookings in. */
export const TIME_SLOTS: string[] = Array.from({ length: SLOT_END_HOUR - SLOT_START_HOUR + 1 }, (_, index) => `${String(SLOT_START_HOUR + index).padStart(2, '0')}:00`);

export const SLOT_WINDOW_LABEL = `Active only when slots are enabled · ${TIME_SLOTS[0]} – ${TIME_SLOTS[TIME_SLOTS.length - 1]} · 1h intervals`;

/** Average slot duration, used to derive the internal end time. */
export const AVERAGE_SLOT_DURATION_MINUTES = 90;

// ============================================================
// Capacity bands
// ============================================================

export const CAPACITY_CONFIG: Record<CapacityLevel, { label: string; chipClass: string; dotClass: string; barClass: string }> = {
  empty: {
    label: 'No reservations',
    chipClass: 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-500',
    dotClass: 'bg-gray-300 dark:bg-gray-600',
    barClass: 'bg-gray-300 dark:bg-gray-600',
  },
  low: {
    label: '< 70% capacity',
    chipClass: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
    dotClass: 'bg-green-500',
    barClass: 'bg-green-500',
  },
  medium: {
    label: '70 – 90% capacity',
    chipClass: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    dotClass: 'bg-amber-500',
    barClass: 'bg-amber-500',
  },
  high: {
    label: '> 90% capacity',
    chipClass: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
    dotClass: 'bg-red-500',
    barClass: 'bg-red-500',
  },
};

export const CAPACITY_LEGEND: CapacityLevel[] = ['low', 'medium', 'high', 'empty'];

export const getCapacityLevel = (bookedSeats: number, capacity: number): CapacityLevel => {
  if (bookedSeats <= 0 || capacity <= 0) return 'empty';

  const ratio = bookedSeats / capacity;
  if (ratio > 0.9) return 'high';
  if (ratio >= 0.7) return 'medium';
  return 'low';
};

// ============================================================
// Status
// ============================================================

export const RESERVATION_STATUS_CONFIG: Record<ReservationStatus, { label: string; chipClass: string }> = {
  new: { label: 'New', chipClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  confirmed: { label: 'Confirmed', chipClass: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' },
  cancelled: { label: 'Cancelled', chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
};

export const RESERVATION_STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = (
  Object.keys(RESERVATION_STATUS_CONFIG) as ReservationStatus[]
).map((value) => ({ value, label: RESERVATION_STATUS_CONFIG[value].label }));

export const LIST_FILTER_OPTIONS: { value: ListFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'new', label: 'New' },
];

// ============================================================
// Occasions
//
// Mirrors the list managed in Reservation Preferences → Occasions.
// ============================================================

export const OCCASION_OPTIONS: string[] = [
  'Birthday',
  'Business meal',
  'Date night',
  'Celebration',
  'Anniversary',
  'Casual visit',
  'Visiting from abroad',
  'Other',
];

/** `Select` cannot hold an empty string value, so "no occasion" needs a sentinel. */
export const NO_OCCASION_VALUE = '__none__';

// ============================================================
// Table
// ============================================================

export const RESERVATION_LIST_TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'venue', label: 'Organization', align: 'left' },
  { id: 'seats', label: 'Seats', align: 'left' },
  { id: 'occasion', label: 'Occasion / Event', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

// ============================================================
// Shared control styling
// ============================================================

export const SELECT_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]';

export const SELECT_ITEM_CLASS = 'cursor-pointer';

// ============================================================
// Helpers
// ============================================================

/** Start time plus the average slot duration, clamped to the same day. */
export const deriveEndTime = (time: string, durationMinutes = AVERAGE_SLOT_DURATION_MINUTES): string => {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return '';

  const total = Math.min(hours * 60 + minutes + durationMinutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Which hourly slot a reservation belongs to — 19:30 lands in the 19:00 slot. */
export const toSlotKey = (time: string): string => `${time.split(':')[0]}:00`;
