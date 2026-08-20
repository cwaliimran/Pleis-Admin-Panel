// ============================================================
// Reservation Types — view model
//
// The wire shape lives in `store/Reducer/reservation-types-api.ts`;
// `mappers.ts` is the only place that knows both.
// ============================================================

export type ConditionType = 'free' | 'minimumSpend';

/** The two states the UI can write. `deleted` is a backend filter value only. */
export type ReservationTypeStatus = 'active' | 'inactive';

export type TaxPercentage = 0 | 5 | 13 | 25;

/**
 * `notes` is a plain `string[]` on the wire. The id exists only so the modal
 * can key and edit rows; it is dropped on the way back out.
 */
export interface ReservationTypeNote {
  id: string;
  text: string;
}

export interface ReservationType {
  /** The record's `_id`. */
  id: string;
  name: string;
  description: string;
  /** Number of tables/booths of this type. `numberOfTables` on the wire. */
  quantity: number;
  /** Max persons in a single reservation. */
  maxPartySize: number;
  /** Total seats. Defaults to quantity × maxPartySize but can be overridden. */
  maxCapacity: number;
  conditionType: ConditionType;
  /** Only meaningful when `conditionType` is `minimumSpend`. */
  minimumSpend?: number;
  /** `bonosPoints` on the wire — the backend's spelling. */
  bonusPoints: number;
  /** `tax` on the wire. */
  taxPercentage: TaxPercentage;
  /** `requireConfirmationToApprove` on the wire. */
  requiresConfirmation: boolean;
  /** `occasionRequired` on the wire. */
  asksForOccasion: boolean;
  status: ReservationTypeStatus;
  /** `isVisibleToGuest` on the wire. false → managed manually by the organizer. */
  visibleToGuests: boolean;
  /** Free-text notes surfaced to the guest in the Reservation detail (Wallet). */
  importantInformation: ReservationTypeNote[];
}

/** What the modal submits — every writable field, no id. */
export type ReservationTypePayload = Omit<ReservationType, 'id'>;

export interface ReservationTypeFilters {
  conditionType: ConditionType | 'all';
  status: ReservationTypeStatus | 'all';
}

export interface ReservationTypePagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  /** Seats across the organization, as reported by the backend. */
  totalMaxCapacity: number;
}
