// ============================================================
// Reservation Preferences — view model
//
// Covers the page-level settings only. The wire shape lives in
// `store/Reducer/reservation-preferences-api.ts`; `mappers.ts` is the only
// place that knows both.
// ============================================================

export type UserType = 'organizer' | 'super-admin';

// ---------- Time slots ----------

export type SlotDurationMinutes = 60 | 90 | 120;

/** Offsets are expressed in minutes from opening / before closing. */
export type OffsetMinutes = 0 | 15 | 30 | 45 | 60 | 75 | 90;

export interface TimeSlotSettings {
  /** Master toggle — when off, the three fields below do not apply. */
  useTimeSlots: boolean;
  averageSlotDurationMinutes: SlotDurationMinutes;
  reservationStartOffsetMinutes: OffsetMinutes;
  reservationEndOffsetMinutes: OffsetMinutes;
}

// ---------- Automatic response ----------

export interface AutomaticResponseSettings {
  autoConfirmWhenCapacity: boolean;
  /** Requests above this party size always require manual review. */
  maxGuestsForAutoConfirm: number;
  autoRejectWhenNoCapacity: boolean;
}

// Occasions own their types — see `occasions/types.ts`. They persist through
// their own endpoints rather than the page-level save, so they are not part
// of the aggregate below.

// ---------- Cancellation policy ----------

/** Hours before the reservation; `0` means cancellation is not allowed at all. */
export type CancellationWindowHours = 0 | 6 | 12 | 24 | 48 | 72;

export interface CancellationPolicySettings {
  freeCancellationHours: CancellationWindowHours;
}

// Reservation types own their types — see `reservation-types/types.ts`. Like
// occasions, they persist through their own endpoints rather than the
// page-level save, so they are not part of the aggregate below.

// ---------- Aggregate ----------

/**
 * Everything behind the page-level "Save settings" button. Reservation types
 * and occasions are deliberately not part of this — they persist on their own.
 */
export interface ReservationPreferences {
  /** Master switch for the whole reservation section in the user app. */
  reservationSystemEnabled: boolean;
  timeSlots: TimeSlotSettings;
  automaticResponse: AutomaticResponseSettings;
  cancellationPolicy: CancellationPolicySettings;
}
