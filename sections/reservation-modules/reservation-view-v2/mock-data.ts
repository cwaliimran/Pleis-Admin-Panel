import { addDays, format } from 'date-fns';
import { TIME_SLOTS, deriveEndTime, toSlotKey } from './constants';
import {
  ConditionOption,
  DaySummary,
  Reservation,
  ReservationPayload,
  ReservationQuery,
  ReservationTypeOption,
  SlotSummary,
  TypeOccupancy,
  VenueOption,
} from './types';

// ============================================================
// TEMPORARY IN-MEMORY BACKEND
//
// Stands in for the reservation API until it ships. Keyed by
// organizationId so switching organizations behaves like the real thing.
//
// When the real endpoints land, delete this file and rewrite the body of
// `use-reservation-view.ts` — nothing else imports it.
// ============================================================

const LATENCY_MS = 350;

const delay = (ms = LATENCY_MS) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const uid = () => `mock_${Math.random().toString(36).slice(2, 10)}`;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// ---------- Reference data ----------

const VENUES: VenueOption[] = [
  { id: 'venue_cabaret', name: 'PLEIS Cabaret', address: 'Ilica 42' },
  { id: 'venue_rooftop', name: 'PLEIS Rooftop', address: 'Tkalčićeva 19' },
  { id: 'venue_beach', name: 'PLEIS Beach', address: 'Split, Bačvice' },
];

const RESERVATION_TYPES: ReservationTypeOption[] = [
  { id: 'type_standard', name: 'Standard table', totalSeats: 96 },
  { id: 'type_vip', name: 'VIP booth', totalSeats: 48 },
  { id: 'type_terrace', name: 'Terrace', totalSeats: 40 },
];

const CONDITIONS: ConditionOption[] = [
  { id: 'condition_free', label: 'Free' },
  { id: 'condition_min_spend', label: 'Minimum spend — €50' },
];

const GUEST_NAMES = [
  'Marko Horvat',
  'Ivana Kovač',
  'Tomislav Marić',
  'Ana Jurić',
  'Luka Novak',
  'Petra Babić',
  'Ivan Vuković',
  'Marija Knežević',
  'Josip Perić',
  'Lucija Šarić',
  'Nikola Matić',
  'Dora Pavlović',
];

const OCCASIONS = ['Birthday', 'Business meal', 'Date night', 'Celebration', 'Anniversary', 'Casual visit', ''];

const EVENTS = ['', '', '', 'Live Jazz Night', 'DJ Set — Marko B.'];

const LOYALTY_TIERS = ['Blue', 'Gold', 'VIP'];

/** "Marko Horvat" → "marko.h@email.hr", matching how the app derives it. */
const toEmail = (fullName: string) => {
  const [first = '', last = ''] = fullName.toLowerCase().split(' ');
  return `${first}.${last.charAt(0)}@email.hr`;
};

/**
 * Deterministic pseudo-random source. Seeding from the date string keeps the
 * generated week stable across re-renders instead of reshuffling every fetch.
 */
const createRandom = (seed: string) => {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), hash | 1);
    hash ^= hash + Math.imul(hash ^ (hash >>> 7), hash | 61);
    return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(random: () => number, values: T[]): T => values[Math.floor(random() * values.length)];

/** Evening slots get the bulk of the bookings, the way a real venue would. */
const pickSlot = (random: () => number): string => {
  const weighted = random() ** 0.55;
  return TIME_SLOTS[Math.min(TIME_SLOTS.length - 1, Math.floor(weighted * TIME_SLOTS.length))];
};

const buildDayReservations = (organizationId: string, date: string): Reservation[] => {
  const random = createRandom(`${organizationId}:${date}`);
  const count = 5 + Math.floor(random() * 22);

  return Array.from({ length: count }, () => {
    const venue = pick(random, VENUES);
    const type = pick(random, RESERVATION_TYPES);
    const slot = pickSlot(random);
    const minutes = random() < 0.45 ? '30' : '00';
    const time = `${slot.split(':')[0]}:${minutes}`;
    const hasPleisId = random() > 0.3;
    const guestName = pick(random, GUEST_NAMES);
    const reservationsMade = 2 + Math.floor(random() * 20);

    return {
      id: uid(),
      guestName,
      pleisId: hasPleisId ? `PID ${40000 + Math.floor(random() * 20000)}` : undefined,
      sourceLabel: hasPleisId ? undefined : 'Phone reservation',
      phoneNumber: hasPleisId ? undefined : `+385 91 ${100 + Math.floor(random() * 900)} ${1000 + Math.floor(random() * 9000)}`,
      guestProfile: hasPleisId
        ? {
            fullName: guestName,
            email: toEmail(guestName),
            loyaltyTier: pick(random, LOYALTY_TIERS),
            reservationsMade,
            // Used can never exceed made — a guest cannot honour a booking twice.
            reservationsUsed: Math.max(0, reservationsMade - Math.floor(random() * 4)),
          }
        : undefined,
      venueId: venue.id,
      venueName: venue.name,
      reservationTypeId: type.id,
      seats: 2 + Math.floor(random() * 7),
      quantity: 1 + Math.floor(random() * 2),
      date,
      time,
      endTime: deriveEndTime(time),
      conditionId: pick(random, CONDITIONS).id,
      occasion: pick(random, OCCASIONS),
      note: '',
      status: random() > 0.72 ? 'new' : 'confirmed',
      eventName: pick(random, EVENTS) || undefined,
    } satisfies Reservation;
  });
};

interface OrganizationRecord {
  reservations: Reservation[];
}

/** Seeded two weeks either side of today so any picked week has data. */
const buildSeedRecord = (organizationId: string): OrganizationRecord => {
  const today = new Date();
  const reservations: Reservation[] = [];

  for (let offset = -14; offset <= 14; offset += 1) {
    reservations.push(...buildDayReservations(organizationId, format(addDays(today, offset), 'yyyy-MM-dd')));
  }

  return { reservations };
};

const store = new Map<string, OrganizationRecord>();

const read = (organizationId: string): OrganizationRecord => {
  if (!store.has(organizationId)) {
    store.set(organizationId, buildSeedRecord(organizationId));
  }
  return store.get(organizationId) as OrganizationRecord;
};

/** Cancelled bookings free their seats, so they never count toward occupancy. */
const countsTowardCapacity = (reservation: Reservation) => reservation.status !== 'cancelled';

const TOTAL_VENUE_SEATS = RESERVATION_TYPES.reduce((total, type) => total + type.totalSeats, 0);

export interface ReservationBoardResponse {
  days: DaySummary[];
  slots: SlotSummary[];
  types: TypeOccupancy[];
  reservations: Reservation[];
}

export const mockReservationApi = {
  getVenues: async (): Promise<VenueOption[]> => clone(VENUES),

  getReservationTypes: async (): Promise<ReservationTypeOption[]> => clone(RESERVATION_TYPES),

  getConditions: async (): Promise<ConditionOption[]> => clone(CONDITIONS),

  async getBoard(organizationId: string, weekDates: string[], query: ReservationQuery): Promise<ReservationBoardResponse> {
    await delay();
    const all = read(organizationId).reservations;

    // Week strip — one count per day, regardless of slot/type/status filters.
    const days: DaySummary[] = weekDates.map((date) => ({
      date,
      reservationCount: all.filter((reservation) => reservation.date === date && countsTowardCapacity(reservation)).length,
    }));

    const forDay = all.filter((reservation) => reservation.date === query.date && countsTowardCapacity(reservation));

    // Slot strip — seats booked that day, narrowed by type when one is picked.
    const forSlotStrip = query.typeId ? forDay.filter((reservation) => reservation.reservationTypeId === query.typeId) : forDay;
    const slotCapacity = query.typeId ? RESERVATION_TYPES.find((type) => type.id === query.typeId)?.totalSeats || TOTAL_VENUE_SEATS : TOTAL_VENUE_SEATS;

    const slots: SlotSummary[] = TIME_SLOTS.map((time) => ({
      time,
      bookedSeats: forSlotStrip
        .filter((reservation) => toSlotKey(reservation.time) === time)
        .reduce((total, reservation) => total + reservation.seats, 0),
      capacity: slotCapacity,
    }));

    // Type occupancy — for the selected day, narrowed to the selected slot.
    const forTypeStrip = query.slot ? forDay.filter((reservation) => toSlotKey(reservation.time) === query.slot) : forDay;

    const types: TypeOccupancy[] = RESERVATION_TYPES.map((type) => ({
      typeId: type.id,
      name: type.name,
      bookedSeats: forTypeStrip
        .filter((reservation) => reservation.reservationTypeId === type.id)
        .reduce((total, reservation) => total + reservation.seats, 0),
      totalSeats: type.totalSeats,
    }));

    // The list itself honours every selection, including cancelled rows.
    const reservations = all
      .filter((reservation) => reservation.date === query.date)
      .filter((reservation) => !query.slot || toSlotKey(reservation.time) === query.slot)
      .filter((reservation) => !query.typeId || reservation.reservationTypeId === query.typeId)
      .filter((reservation) => query.filter === 'all' || reservation.status === query.filter)
      .sort((a, b) => a.time.localeCompare(b.time) || a.guestName.localeCompare(b.guestName));

    return clone({ days, slots, types, reservations });
  },

  async createReservation(organizationId: string, payload: ReservationPayload): Promise<Reservation> {
    await delay();
    const record = read(organizationId);

    const venue = VENUES.find((candidate) => candidate.id === payload.venueId);
    const created: Reservation = { ...clone(payload), id: uid(), venueName: venue?.name || '' };
    record.reservations = [...record.reservations, created];

    return clone(created);
  },

  async updateReservation(organizationId: string, id: string, payload: ReservationPayload): Promise<Reservation> {
    await delay();
    const record = read(organizationId);

    const existing = record.reservations.find((reservation) => reservation.id === id);
    if (!existing) throw new Error('Reservation not found');

    const venue = VENUES.find((candidate) => candidate.id === payload.venueId);
    // The linked account is read-only — it survives an edit untouched.
    const updated: Reservation = { ...clone(payload), id, venueName: venue?.name || '', guestProfile: existing.guestProfile };
    record.reservations = record.reservations.map((reservation) => (reservation.id === id ? updated : reservation));

    return clone(updated);
  },

  async deleteReservation(organizationId: string, id: string): Promise<void> {
    await delay();
    const record = read(organizationId);

    if (!record.reservations.some((reservation) => reservation.id === id)) throw new Error('Reservation not found');
    record.reservations = record.reservations.filter((reservation) => reservation.id !== id);
  },

  async setStatus(organizationId: string, id: string, status: Reservation['status']): Promise<Reservation> {
    await delay();
    const record = read(organizationId);

    const existing = record.reservations.find((reservation) => reservation.id === id);
    if (!existing) throw new Error('Reservation not found');

    existing.status = status;
    return clone(existing);
  },
};
