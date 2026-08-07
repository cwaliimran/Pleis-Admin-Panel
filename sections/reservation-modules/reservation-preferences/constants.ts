import { CancellationWindowHours, OffsetMinutes, ReservationPreferences, SlotDurationMinutes } from './types';

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

// Reservation-type options, table head and helpers live with the section
// that uses them — see `reservation-types/constants.ts`.

// ============================================================
// Shared control styling
//
// shadcn's Select ships `cursor-default` on both the trigger and its items;
// every dropdown on this page is clickable, so both get `cursor-pointer`.
// ============================================================

export const SELECT_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]';

export const SELECT_ITEM_CLASS = 'cursor-pointer';

// ============================================================
// Defaults
//
// What an organization that has never been saved starts from, and the
// fallback for any single field the backend leaves out or sends a value
// for that its dropdown does not offer. Nothing is enabled by default —
// an unconfigured organization should not read as live.
// ============================================================

export const DEFAULT_PREFERENCES: ReservationPreferences = {
  reservationSystemEnabled: false,
  timeSlots: {
    useTimeSlots: false,
    averageSlotDurationMinutes: 90,
    reservationStartOffsetMinutes: 0,
    reservationEndOffsetMinutes: 0,
  },
  automaticResponse: {
    autoConfirmWhenCapacity: false,
    maxGuestsForAutoConfirm: 1,
    autoRejectWhenNoCapacity: false,
  },
  cancellationPolicy: {
    freeCancellationHours: 0,
  },
};
