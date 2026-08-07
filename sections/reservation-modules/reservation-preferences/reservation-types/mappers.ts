import type { ApiReservationType, ApiReservationTypesMeta, ReservationTypeBody } from '@/store/Reducer/reservation-types-api';
import { DEFAULT_PAGE_LIMIT } from './constants';
import { ReservationType, ReservationTypePagination, ReservationTypePayload, TaxPercentage } from './types';

// ============================================================
// Wire ↔ view model
//
// The only place that knows both shapes. Everything downstream works with
// `ReservationType` alone.
// ============================================================

/**
 * Notes arrive as bare strings, so the id is synthesised from the record and
 * the position — stable across renders, which is all the modal's rows need.
 */
const toNotes = (notes: string[] | undefined, recordId: string) =>
  (notes ?? []).map((text, index) => ({ id: `${recordId}_note_${index}`, text }));

export const mapApiReservationType = (type: ApiReservationType): ReservationType => ({
  id: type._id,
  name: type.name ?? '',
  description: type.description ?? '',
  quantity: type.numberOfTables ?? 0,
  maxPartySize: type.maxPartySize ?? 0,
  maxCapacity: type.maxCapacity ?? 0,
  conditionType: type.conditionType ?? 'free',
  bonusPoints: type.bonosPoints ?? 0,
  // Cast rather than clamped: a value outside the dropdown's options is kept
  // as-is and simply fails the modal's `oneOf` check until the user picks one.
  taxPercentage: (type.tax ?? 0) as TaxPercentage,
  requiresConfirmation: type.requireConfirmationToApprove ?? false,
  asksForOccasion: type.occasionRequired ?? false,
  // `deleted` records are filtered out by the query, so anything not active reads as inactive.
  status: type.status === 'active' ? 'active' : 'inactive',
  visibleToGuests: type.isVisibleToGuest ?? true,
  importantInformation: toNotes(type.notes, type._id),
});

export const mapApiReservationTypes = (types: ApiReservationType[]): ReservationType[] => types.map(mapApiReservationType);

export const mapPagination = (
  meta: ApiReservationTypesMeta | null | undefined,
  fallbackPage: number,
  fallbackLimit: number
): ReservationTypePagination => ({
  currentPage: meta?.currentPage ?? fallbackPage,
  totalPages: meta?.totalPages ?? 0,
  totalRecords: meta?.totalRecords ?? 0,
  limit: meta?.limit ?? fallbackLimit ?? DEFAULT_PAGE_LIMIT,
  totalMaxCapacity: meta?.totalMaxCapacity ?? 0,
});

/** View model → wire. Shared by create and update, which send the same fields. */
export const toReservationTypeBody = (payload: ReservationTypePayload): ReservationTypeBody => ({
  name: payload.name,
  description: payload.description,
  numberOfTables: Number(payload.quantity),
  maxPartySize: Number(payload.maxPartySize),
  maxCapacity: Number(payload.maxCapacity),
  tax: Number(payload.taxPercentage),
  conditionType: payload.conditionType,
  bonosPoints: Number(payload.bonusPoints),
  requireConfirmationToApprove: payload.requiresConfirmation,
  occasionRequired: payload.asksForOccasion,
  isVisibleToGuest: payload.visibleToGuests,
  status: payload.status,
  // The local ids exist only for the modal's rows — the wire wants bare strings.
  notes: payload.importantInformation.map((note) => note.text),
});
