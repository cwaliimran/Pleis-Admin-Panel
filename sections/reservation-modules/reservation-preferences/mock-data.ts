import { ReservationPreferences, ReservationType, ReservationTypePayload } from './types';

// ============================================================
// TEMPORARY IN-MEMORY BACKEND
//
// Stands in for the reservation-preferences API until it ships. Keyed by
// organizationId so switching organizations behaves like the real thing.
//
// When the real endpoints land, delete this file and rewrite the body of
// `use-reservation-preferences.ts` — nothing else imports it.
// ============================================================

const LATENCY_MS = 400;

const delay = (ms = LATENCY_MS) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const uid = () => `mock_${Math.random().toString(36).slice(2, 10)}`;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

interface OrganizationRecord {
  preferences: ReservationPreferences;
  reservationTypes: ReservationType[];
}

const buildSeedRecord = (): OrganizationRecord => ({
  preferences: {
    reservationSystemEnabled: true,
    timeSlots: {
      useTimeSlots: true,
      averageSlotDurationMinutes: 90,
      reservationStartOffsetMinutes: 45,
      reservationEndOffsetMinutes: 60,
    },
    automaticResponse: {
      autoConfirmWhenCapacity: true,
      maxGuestsForAutoConfirm: 8,
      autoRejectWhenNoCapacity: false,
    },
    cancellationPolicy: {
      freeCancellationHours: 48,
    },
  },
  reservationTypes: [
    {
      id: uid(),
      name: 'Standard table',
      description: 'Main hall',
      quantity: 24,
      maxPartySize: 4,
      maxCapacity: 96,
      conditionType: 'free',
      bonusPoints: 0,
      taxPercentage: 25,
      requiresConfirmation: false,
      asksForOccasion: true,
      status: 'active',
      visibleToGuests: true,
      importantInformation: [{ id: uid(), text: 'Please arrive at least 15 minutes before your reservation time.' }],
    },
    {
      id: uid(),
      name: 'VIP booth',
      description: 'Club — person limit per table',
      quantity: 6,
      maxPartySize: 8,
      maxCapacity: 48,
      conditionType: 'minimumSpend',
      bonusPoints: 50,
      taxPercentage: 25,
      requiresConfirmation: true,
      asksForOccasion: true,
      status: 'active',
      visibleToGuests: true,
      importantInformation: [
        { id: uid(), text: 'Please arrive at least 15 minutes before your reservation time.' },
        { id: uid(), text: 'A smart-casual dress code is in effect.' },
      ],
    },
    {
      id: uid(),
      name: 'Terrace (event)',
      description: 'Used alongside Events',
      quantity: 10,
      maxPartySize: 4,
      maxCapacity: 40,
      conditionType: 'minimumSpend',
      bonusPoints: 0,
      taxPercentage: 25,
      requiresConfirmation: true,
      asksForOccasion: false,
      status: 'inactive',
      visibleToGuests: false,
      importantInformation: [],
    },
  ],
});

const store = new Map<string, OrganizationRecord>();

const read = (organizationId: string): OrganizationRecord => {
  if (!store.has(organizationId)) {
    store.set(organizationId, buildSeedRecord());
  }
  return store.get(organizationId) as OrganizationRecord;
};

export const mockReservationPreferencesApi = {
  async getPreferences(organizationId: string): Promise<ReservationPreferences> {
    await delay();
    return clone(read(organizationId).preferences);
  },

  async savePreferences(organizationId: string, preferences: ReservationPreferences): Promise<ReservationPreferences> {
    await delay();
    const record = read(organizationId);

    record.preferences = clone(preferences);

    return clone(record.preferences);
  },

  async getReservationTypes(organizationId: string): Promise<ReservationType[]> {
    await delay();
    return clone(read(organizationId).reservationTypes);
  },

  async createReservationType(organizationId: string, payload: ReservationTypePayload): Promise<ReservationType> {
    await delay();
    const record = read(organizationId);

    const created: ReservationType = { ...clone(payload), id: uid() };
    record.reservationTypes = [...record.reservationTypes, created];

    return clone(created);
  },

  async updateReservationType(organizationId: string, id: string, payload: ReservationTypePayload): Promise<ReservationType> {
    await delay();
    const record = read(organizationId);

    const existing = record.reservationTypes.find((type) => type.id === id);
    if (!existing) throw new Error('Reservation type not found');

    const updated: ReservationType = { ...clone(payload), id };
    record.reservationTypes = record.reservationTypes.map((type) => (type.id === id ? updated : type));

    return clone(updated);
  },

  async deleteReservationType(organizationId: string, id: string): Promise<void> {
    await delay();
    const record = read(organizationId);

    if (!record.reservationTypes.some((type) => type.id === id)) throw new Error('Reservation type not found');
    record.reservationTypes = record.reservationTypes.filter((type) => type.id !== id);
  },
};
