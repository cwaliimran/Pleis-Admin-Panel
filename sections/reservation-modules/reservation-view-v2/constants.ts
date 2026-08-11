import type { ApiReservationCondition } from '@/store/Reducer/user-reservations-api';
import { USER_RESERVATION_STATUSES } from '@/store/Reducer/user-reservations-api';
import { CapacityLevel, ListFilter, ReservationStatus } from './types';

export const SLOT_START_HOUR = 0;
export const SLOT_END_HOUR = 23;

export const TIME_SLOTS: string[] = Array.from({ length: SLOT_END_HOUR - SLOT_START_HOUR + 1 }, (_, index) => `${String(SLOT_START_HOUR + index).padStart(2, '0')}:00`);

export const SLOT_WINDOW_LABEL = `Active only when slots are enabled · ${TIME_SLOTS[0]} – ${TIME_SLOTS[TIME_SLOTS.length - 1]} · 1h intervals`;

export const AVERAGE_SLOT_DURATION_MINUTES = 90;

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

export const RESERVATION_STATUS_CONFIG: Record<ReservationStatus, { label: string; chipClass: string }> = {
  pendingPayment: { label: 'Pending payment', chipClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  needsConfirmation: { label: 'Needs confirmation', chipClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  confirmed: { label: 'Confirmed', chipClass: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300' },
  checkedIn: { label: 'Checked in', chipClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' },
  rejected: { label: 'Rejected', chipClass: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300' },
  cancelled: { label: 'Cancelled', chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  completed: { label: 'Completed', chipClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' },
};

export const SELECTABLE_STATUSES: ReservationStatus[] = USER_RESERVATION_STATUSES.filter((status) => status !== 'pendingPayment');

export const RESERVATION_STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = SELECTABLE_STATUSES.map((value) => ({
  value,
  label: RESERVATION_STATUS_CONFIG[value].label,
}));

export const toStatusOption = (value: ReservationStatus) => ({ value, label: RESERVATION_STATUS_CONFIG[value].label });

export const ALL_STATUSES_VALUE = 'all';

export const LIST_FILTER_OPTIONS: { value: ListFilter; label: string }[] = [
  { value: ALL_STATUSES_VALUE, label: 'All statuses' },
  ...RESERVATION_STATUS_OPTIONS,
];

export const USER_RESERVATION_STATUS_OPTIONS = RESERVATION_STATUS_OPTIONS;

export const CONDITION_TYPE_LABELS: Record<ApiReservationCondition, string> = {
  free: 'Free',
  minimumSpend: 'Minimum spend',
};

export const NO_OCCASION_VALUE = '__none__';

export const toIsoDateTime = (date: string, time: string): string => `${date}T${time}:00.000Z`;

export const fromIsoTime = (value?: string): string => {
  if (!value) return '';

  const isoMatch = value.match(/T(\d{2}:\d{2})/);
  if (isoMatch) return isoMatch[1];

  return /^\d{2}:\d{2}$/.test(value) ? value : '';
};

export const fromIsoDate = (value?: string): string => {
  if (!value) return '';

  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
};

export const RESERVATION_LIST_TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'venue', label: 'Organization', align: 'left' },
  { id: 'reservationType', label: 'Reservation type', align: 'left' },
  { id: 'seats', label: 'Seats', align: 'left' },
  { id: 'occasion', label: 'Occasion / Event', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

export const DEFAULT_PAGE_LIMIT = 10;

export const SELECT_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]';

export const SELECT_ITEM_CLASS = 'cursor-pointer';

export const deriveEndTime = (time: string, durationMinutes = AVERAGE_SLOT_DURATION_MINUTES): string => {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return '';

  const total = Math.min(hours * 60 + minutes + durationMinutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export const toSlotKey = (time: string): string => `${time.split(':')[0]}:00`;
