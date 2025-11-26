export const RESERVATION_TYPE_OPTIONS = [
  { value: 'regular', label: 'Regular' },
  { value: 'vip', label: 'VIP' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'private', label: 'Private' },
  { value: 'bar', label: 'Bar' },
  { value: 'window', label: 'Window' },
] as const;

export const CONDITION_OPTIONS = [
  { label: 'Fixed Price - User pays full amount', value: 'fixedPrice' },
  { label: 'Minimum Spend on Location', value: 'minimumSpendOnLocation' },
  { label: 'Prepay Option - Deducted from ordering', value: 'prepayOption' },
  { label: 'No Condition - Free reservation', value: 'noCondition' },
  { label: 'Ticket Requirement', value: 'ticketRequirement' },
  { label: 'Custom Text Condition', value: 'customText' },
] as const;

export const TICKET_TYPE_OPTIONS = [
  { label: 'VIP Event Pass', value: 'vipEventPass' },
  { label: 'General Admission', value: 'generalAdmission' },
  { label: 'Premium Access', value: 'premiumAccess' },
] as const;

export const TAX_OPTIONS = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '13', label: '13%' },
  { value: '25', label: '25%' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ERROR_MESSAGES = {
  NEEDS_CONFIRMATION_REQUIRED: 'Needs confirmation must be enabled for all reservations',
  NO_DATE_SLOTS: 'Please add at least one date with time slots',
  DATE_REQUIRED: 'All date slots must have a date selected',
  NO_TIME_SLOTS: 'Each date must have at least one time slot',
  TIME_REQUIRED: 'All time slots must have start and end times',
  FIX_VALIDATION_ERRORS: 'Please fix timing slot validation errors. Ensure all dates and times are within the event schedule.',
  TIME_OVERLAP: 'Time slots cannot overlap. Each slot must start after the previous one ends.',
  TIME_ORDER: 'Start time must be before end time',
  DATE_OUT_OF_RANGE: (minDate: string, maxDate: string) => `Date must be between ${minDate} and ${maxDate}`,
  TIME_OUT_OF_RANGE: (startTime: string, endTime: string) => `Time must be within event schedule: ${startTime} to ${endTime}`,
  START_TIME_BEFORE_EVENT: (eventTime: string) => `Start time cannot be before event start time (${eventTime})`,
  END_TIME_AFTER_EVENT: (eventTime: string) => `End time cannot be after event end time (${eventTime})`,
} as const;
