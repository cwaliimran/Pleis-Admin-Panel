// ============================================================
// Reservation Preferences — domain types
//
// Served by `mock-data.ts` through `use-reservation-preferences.ts` until
// the real endpoints exist.
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

// ---------- Reservation types ----------

export type ConditionType = 'free' | 'minimumSpend';

export type ReservationTypeStatus = 'active' | 'inactive';

export type TaxPercentage = 0 | 5 | 13 | 25;

export interface ReservationTypeNote {
  id: string;
  text: string;
}

export interface ReservationType {
  id: string;
  name: string;
  description: string;
  /** Number of tables/booths of this type. */
  quantity: number;
  /** Max persons in a single reservation. */
  maxPartySize: number;
  /** Total seats. Defaults to quantity × maxPartySize but can be overridden. */
  maxCapacity: number;
  conditionType: ConditionType;
  bonusPoints: number;
  taxPercentage: TaxPercentage;
  /** When true every request for this type must be approved by hand. */
  requiresConfirmation: boolean;
  asksForOccasion: boolean;
  status: ReservationTypeStatus;
  /** false → the type exists but is managed manually by the organizer. */
  visibleToGuests: boolean;
  /** Free-text notes surfaced to the guest in the Reservation detail (Wallet). */
  importantInformation: ReservationTypeNote[];
}

export type ReservationTypePayload = Omit<ReservationType, 'id'>;

export interface ReservationTypeFilters {
  conditionType: ConditionType | 'all';
  status: ReservationTypeStatus | 'all';
}

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
