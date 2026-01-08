import type { EventFormValues } from './types';

export const weekDays = [
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
  { label: 'Sat', value: 'Saturday' },
  { label: 'Sun', value: 'Sunday' },
];

export const recurringTypeOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export const defaultValues: EventFormValues = {
  image: null,
  mediaUrl: '',
  mediaType: 'image',
  name: '',
  description: '',
  organization: '',
  venue: '',
  partnerOrganization: '',
  categories: [],
  tags: [],
  eventType: 'oneTime',
  fromDate: null,
  fromTime: '',
  endDate: null,
  endTime: '',
  recurring: false,
  recurringType: 'daily',
  recurringInterval: 1,
  recurringDays: [],
  recurringEnd: 'never',
  recurringEndDate: null,
  recurringEndCount: 1,
  categoryInput: '',
  tagInput: '',
  organizerInput: '',
  partnerOrganizerInput: '',
  partnerOrganizers: [],
  organizers: [],
  daysOfWeek: [],

  // Step 3 - Ticketing defaults
  ticketing: {
    title: '',
    quantity: 0,
    price: 0,
    taxPercentage: 0,
    publishSettings: {
      publishType: 'instant' as const,
      scheduledDate: '',
    },
    timingSlots: {
      enabled: false,
      dateTimeSlots: [],
    },
    repeatable: {
      isRepeatable: false,
      visits: 1,
    },
    resaleProtection: 'none',
    transferFee: null,
    timeSensitivePricing: {
      earlyBird: {
        enabled: false,
        endDate: '',
        discountedPrice: 0,
      },
      lastMinute: {
        enabled: false,
        startDate: '',
        discountedPrice: 0,
      },
    },
    fastTrackEntry: {
      enabled: false,
      quantity: 0,
      extraPrice: 0,
    },
    requiresReservation: {
      enabled: false,
      type: '',
    },
  },
};
