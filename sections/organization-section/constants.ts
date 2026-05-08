import type { FormValues, OperatingHours } from './types';

// ============================================================
// DAYS OF WEEK
// ============================================================

export const DAYS_OF_WEEK = [
  { day: 'Monday', dayKey: 'monday' },
  { day: 'Tuesday', dayKey: 'tuesday' },
  { day: 'Wednesday', dayKey: 'wednesday' },
  { day: 'Thursday', dayKey: 'thursday' },
  { day: 'Friday', dayKey: 'friday' },
  { day: 'Saturday', dayKey: 'saturday' },
  { day: 'Sunday', dayKey: 'sunday' },
] as const;

// ============================================================
// OPERATING HOURS
// ============================================================

export const DEFAULT_OPERATING_HOURS: OperatingHours = {
  from: '00:00',
  to: '00:00',
  isOpen: 'false',
};

// ============================================================
// IMAGE UPLOAD
// ============================================================

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// ============================================================
// FORM DEFAULT VALUES
// ============================================================

export const defaultFormValues: FormValues = {
  description: '',
  minAge: '',
  tags: [],
  categories: [],
  galleryImages: [],
  existingGallery: [],
  venue: '',
  monday: { ...DEFAULT_OPERATING_HOURS },
  tuesday: { ...DEFAULT_OPERATING_HOURS },
  wednesday: { ...DEFAULT_OPERATING_HOURS },
  thursday: { ...DEFAULT_OPERATING_HOURS },
  friday: { ...DEFAULT_OPERATING_HOURS },
  saturday: { ...DEFAULT_OPERATING_HOURS },
  sunday: { ...DEFAULT_OPERATING_HOURS },
  location: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [0, 0],
  },
};

// ============================================================
// SELECT OPTIONS
// ============================================================

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const OPEN_CLOSED_OPTIONS = [
  { label: 'Open', value: 'true' },
  { label: 'Closed', value: 'false' },
];
