// ============================================================
// Reservation Management V2 — domain types
//
// Served by `mock-data.ts` through `use-reservation-view.ts` until the
// real endpoints exist.
// ============================================================

export type UserType = 'organizer' | 'super-admin';

export type ReservationStatus = 'new' | 'confirmed' | 'cancelled';

/** Segmented control above the reservation list. */
export type ListFilter = 'all' | 'confirmed' | 'new';

/** Capacity bands driving the time-slot chip colours. */
export type CapacityLevel = 'empty' | 'low' | 'medium' | 'high';

// ---------- Reference data ----------

export interface VenueOption {
  id: string;
  name: string;
  /** Street line shown after the name, e.g. "Ilica 42". */
  address: string;
}

export interface ReservationTypeOption {
  id: string;
  name: string;
  /** Total bookable seats for this type. */
  totalSeats: number;
}

export interface ConditionOption {
  id: string;
  label: string;
}

// ---------- Summaries ----------

export interface DaySummary {
  /** ISO `yyyy-MM-dd`. */
  date: string;
  reservationCount: number;
}

export interface SlotSummary {
  /** 24h `HH:mm`. */
  time: string;
  bookedSeats: number;
  capacity: number;
}

export interface TypeOccupancy {
  typeId: string;
  name: string;
  bookedSeats: number;
  totalSeats: number;
}

// ---------- Reservation ----------

/** Read-only account data, shown behind "Show user info". Pleis guests only. */
export interface GuestProfile {
  fullName: string;
  email: string;
  loyaltyTier: string;
  reservationsMade: number;
  reservationsUsed: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  /** Present when the guest booked through the app. */
  pleisId?: string;
  /** Shown under the name when there is no Pleis ID, e.g. "Phone reservation". */
  sourceLabel?: string;
  phoneNumber?: string;
  venueId: string;
  venueName: string;
  reservationTypeId: string;
  /** Number of guests. */
  seats: number;
  /** Number of tables of the chosen type. */
  quantity: number;
  /** ISO `yyyy-MM-dd`. */
  date: string;
  /** 24h `HH:mm`. */
  time: string;
  /** Internal only — start time plus the average slot duration. */
  endTime: string;
  conditionId: string;
  /** Empty string means no occasion was picked. */
  occasion: string;
  note: string;
  status: ReservationStatus;
  /** Linked event, shown in the list alongside the occasion. */
  eventName?: string;
  /** Absent for phone / walk-in guests with no Pleis account. */
  guestProfile?: GuestProfile;
}

/** `venueName` and `guestProfile` are derived server-side, never submitted. */
export type ReservationPayload = Omit<Reservation, 'id' | 'venueName' | 'guestProfile'>;

// ---------- Query shape ----------

export interface ReservationQuery {
  /** ISO `yyyy-MM-dd` — the day whose reservations are listed. */
  date: string;
  /** `null` means every slot that day. */
  slot: string | null;
  /** `null` means every reservation type. */
  typeId: string | null;
  filter: ListFilter;
}
