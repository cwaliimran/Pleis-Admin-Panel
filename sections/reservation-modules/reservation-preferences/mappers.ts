import type {
  ApiAutomaticResponse,
  ApiCancellationPolicy,
  ApiReservationPreferences,
  ApiTimeSlotsSetting,
} from '@/store/Reducer/reservation-preferences-api';
import { CANCELLATION_WINDOW_OPTIONS, DEFAULT_PREFERENCES, OFFSET_OPTIONS, SLOT_DURATION_OPTIONS } from './constants';
import { CancellationWindowHours, OffsetMinutes, ReservationPreferences, SlotDurationMinutes } from './types';

// ============================================================
// Wire ↔ view model
//
// The only place that knows both shapes. Everything downstream works with
// `ReservationPreferences` alone.
//
// Two shapes differ beyond naming:
//   • the backend spells sub-setting toggles as `status: 'enabled' | 'disabled'`
//   • cancellation is a status + hours pair, which the UI collapses into a
//     single dropdown where `0` reads as "Not allowed"
// ============================================================

/**
 * Keeps a value only if the matching dropdown actually offers it. Anything
 * else falls back to the default rather than leaving a Select rendering blank.
 */
const pickOption = <T extends number>(value: number | undefined, options: readonly { value: T }[], fallback: T): T =>
  options.some((option) => option.value === value) ? (value as T) : fallback;

const mapTimeSlots = (setting: ApiTimeSlotsSetting | null | undefined): ReservationPreferences['timeSlots'] => ({
  useTimeSlots: setting?.status === 'enabled',
  averageSlotDurationMinutes: pickOption<SlotDurationMinutes>(
    setting?.averageSlotDurationInMinutes,
    SLOT_DURATION_OPTIONS,
    DEFAULT_PREFERENCES.timeSlots.averageSlotDurationMinutes
  ),
  reservationStartOffsetMinutes: pickOption<OffsetMinutes>(
    setting?.bookingOpensAfterMinutes,
    OFFSET_OPTIONS,
    DEFAULT_PREFERENCES.timeSlots.reservationStartOffsetMinutes
  ),
  reservationEndOffsetMinutes: pickOption<OffsetMinutes>(
    setting?.bookingClosesBeforeMinutes,
    OFFSET_OPTIONS,
    DEFAULT_PREFERENCES.timeSlots.reservationEndOffsetMinutes
  ),
});

const mapAutomaticResponse = (response: ApiAutomaticResponse | null | undefined): ReservationPreferences['automaticResponse'] => ({
  autoConfirmWhenCapacity: response?.autoAccept ?? DEFAULT_PREFERENCES.automaticResponse.autoConfirmWhenCapacity,
  maxGuestsForAutoConfirm: response?.maxGuestPerReservationForAutoAccept ?? DEFAULT_PREFERENCES.automaticResponse.maxGuestsForAutoConfirm,
  autoRejectWhenNoCapacity: response?.autoReject ?? DEFAULT_PREFERENCES.automaticResponse.autoRejectWhenNoCapacity,
});

const mapCancellationPolicy = (policy: ApiCancellationPolicy | null | undefined): ReservationPreferences['cancellationPolicy'] => ({
  // A disabled policy is "Not allowed", which the dropdown represents as 0.
  freeCancellationHours:
    policy?.status === 'enabled'
      ? pickOption<CancellationWindowHours>(
          policy?.hoursBeforeReservation,
          CANCELLATION_WINDOW_OPTIONS,
          DEFAULT_PREFERENCES.cancellationPolicy.freeCancellationHours
        )
      : 0,
});

/** `null` — an organization that has never saved — maps to the UI defaults. */
export const mapApiReservationPreferences = (preferences: ApiReservationPreferences | null | undefined): ReservationPreferences => ({
  reservationSystemEnabled: preferences?.isReservationEnabled ?? DEFAULT_PREFERENCES.reservationSystemEnabled,
  timeSlots: mapTimeSlots(preferences?.timeSlotsSetting),
  automaticResponse: mapAutomaticResponse(preferences?.automaticResponse),
  cancellationPolicy: mapCancellationPolicy(preferences?.cancellationPolicy),
});

/** View model → wire. The whole document goes over on every save. */
export const toReservationPreferencesBody = (preferences: ReservationPreferences) => ({
  isReservationEnabled: preferences.reservationSystemEnabled,
  timeSlotsSetting: {
    status: preferences.timeSlots.useTimeSlots ? ('enabled' as const) : ('disabled' as const),
    bookingOpensAfterMinutes: preferences.timeSlots.reservationStartOffsetMinutes,
    bookingClosesBeforeMinutes: preferences.timeSlots.reservationEndOffsetMinutes,
    averageSlotDurationInMinutes: preferences.timeSlots.averageSlotDurationMinutes,
  },
  automaticResponse: {
    autoAccept: preferences.automaticResponse.autoConfirmWhenCapacity,
    autoReject: preferences.automaticResponse.autoRejectWhenNoCapacity,
    maxGuestPerReservationForAutoAccept: Number(preferences.automaticResponse.maxGuestsForAutoConfirm),
  },
  cancellationPolicy: {
    // The single dropdown carries both fields: 0 means the policy is off.
    status: preferences.cancellationPolicy.freeCancellationHours > 0 ? ('enabled' as const) : ('disabled' as const),
    hoursBeforeReservation: preferences.cancellationPolicy.freeCancellationHours,
  },
});
