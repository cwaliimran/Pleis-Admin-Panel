import type { EventFormValues } from './types';

export const weekDays = [
  { label: 'MON', value: 'monday' },
  { label: 'TUE', value: 'tuesday' },
  { label: 'WED', value: 'wednesday' },
  { label: 'THU', value: 'thursday' },
  { label: 'FRI', value: 'friday' },
  { label: 'SAT', value: 'saturday' },
  { label: 'SUN', value: 'sunday' },
];

export const defaultValues: EventFormValues = {
  image: null,
  mediaUrl: '',
  mediaType: 'image',
  name: '',
  venue: '',
  categories: [],
  tags: [],
  organizers: [],
  partnerOrganizers: [],
  fromDate: null,
  fromTime: '12:00',
  endDate: null,
  endTime: '13:00',
  description: '',
  eventType: 'oneTime',
  recurring: false,
  recurringType: 'weekly',
  recurringInterval: 1,
  recurringDays: [],
  recurringEnd: 'never',
  recurringEndDate: null,
  recurringEndCount: 1,
  categoryInput: '',
  tagInput: '',
  organizerInput: '',
  partnerOrganizerInput: '',
  organization: '',
  daysOfWeek: [],
  // Ticketing defaults
  type: '',
  quantity: 0,
  price: 0,
  tax: '0',
  number: 1,
  transferPrice: 0,
  features: {
    timeslot: false,
    repeatable: false,
    resale: 'none',
    earlyBirdEnabled: false,
    earlyBirdDate: '',
    earlyBirdPrice: 0,
    lastMinuteEnabled: false,
    lastMinuteDate: '',
    lastMinutePrice: 0,
    fasttrack: false,
    fasttrackQuantity: 0,
    fasttrackPrice: 0,
    reservation: false,
    reservationType: '',
    transfer: false,
  },
};

export const recurringTypeOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Daily', value: 'daily' },
];

export const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'EURO', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
];

export const ticketOptionsData = [
  { label: 'General Admission', value: 'general' },
  { label: 'VIP', value: 'vip' },
  { label: 'Early Bird - 5$', value: 'early-bird' },
];

export const timeOptions = [
  { label: '10:00AM', value: '10:00AM' },
  { label: '11:00AM', value: '11:00AM' },
  { label: '12:00PM', value: '12:00PM' },
  { label: '1:00PM', value: '1:00PM' },
  { label: '2:00PM', value: '2:00PM' },
  { label: '3:00PM', value: '3:00PM' },
];

export const salesChannelOptions = [
  { label: 'Online', value: 'online' },
  { label: 'In-person', value: 'in-person' },
  { label: 'Phone', value: 'phone' },
];

export const ticketTypeOptions = ['Paid', 'Free', 'Donation'];

export const checkboxItems = [
  'Resend to Unopened Users',
  'Include Names on Tickets',
];

// import type { EventFormValues } from './types';

// export const weekDays = [
//   { label: 'MON', value: 'monday' },
//   { label: 'TUE', value: 'tuesday' },
//   { label: 'WED', value: 'wednesday' },
//   { label: 'THU', value: 'thursday' },
//   { label: 'FRI', value: 'friday' },
//   { label: 'SAT', value: 'saturday' },
//   { label: 'SUN', value: 'sunday' },
// ];

// export const defaultValues: EventFormValues = {
//   image: null,
//   mediaUrl: '',
//   mediaType: 'image',
//   name: '',
//   venue: '',
//   categories: [],
//   tags: [],
//   organizers: [],
//   partnerOrganizers: [],
//   fromDate: null,
//   fromTime: '',
//   endDate: null,
//   endTime: '',
//   description: '',
//   eventType: 'oneTime',
//   recurring: false,
//   recurringType: 'weekly',
//   recurringInterval: 1,
//   recurringDays: [],
//   recurringEnd: 'never',
//   recurringEndDate: null,
//   recurringEndCount: 1,
//   categoryInput: '',
//   tagInput: '',
//   organizerInput: '',
//   partnerOrganizerInput: '',
//   organization: '',
//   daysOfWeek: [],
// };

// export const recurringTypeOptions = [
//   { label: 'Weekly', value: 'weekly' },
//   { label: 'Monthly', value: 'monthly' },
//   { label: 'Daily', value: 'daily' },
// ];

// export const currencyOptions = [
//   { label: 'USD', value: 'USD' },
//   { label: 'EURO', value: 'EUR' },
//   { label: 'GBP', value: 'GBP' },
// ];

// export const ticketOptionsData = [
//   { label: 'General Admission', value: 'general' },
//   { label: 'VIP', value: 'vip' },
//   { label: 'Early Bird - 5$', value: 'early-bird' },
// ];

// export const timeOptions = [
//   { label: '10:00AM', value: '10:00AM' },
//   { label: '11:00AM', value: '11:00AM' },
//   { label: '12:00PM', value: '12:00PM' },
//   { label: '1:00PM', value: '1:00PM' },
//   { label: '2:00PM', value: '2:00PM' },
//   { label: '3:00PM', value: '3:00PM' },
// ];

// export const salesChannelOptions = [
//   { label: 'Online', value: 'online' },
//   { label: 'In-person', value: 'in-person' },
//   { label: 'Phone', value: 'phone' },
// ];

// export const ticketTypeOptions = ['Paid', 'Free', 'Donation'];

// export const checkboxItems = [
//   'Resend to Unopened Users',
//   'Include Names on Tickets',
// ];

// import type { EventFormValues } from './types';

// export const weekDays = [
//   { label: 'MON', value: 'monday' },
//   { label: 'TUE', value: 'tuesday' },
//   { label: 'WED', value: 'wednesday' },
//   { label: 'THU', value: 'thursday' },
//   { label: 'FRI', value: 'friday' },
//   { label: 'SAT', value: 'saturday' },
//   { label: 'SUN', value: 'sunday' },
// ];

// export const defaultValues: EventFormValues = {
//   image: null,
//   mediaUrl: '',
//   mediaType: 'image',
//   name: '',
//   venue: '',
//   categories: [],
//   tags: [],
//   organizers: [],
//   partnerOrganizers: [],
//   fromDate: null,
//   fromTime: '12:00',
//   endDate: null,
//   endTime: '13:00',
//   description: '',
//   eventType: 'oneTime',
//   recurring: false,
//   recurringType: 'weekly',
//   recurringInterval: 1,
//   recurringDays: [],
//   recurringEnd: 'never',
//   recurringEndDate: null,
//   recurringEndCount: 1,
//   categoryInput: '',
//   tagInput: '',
//   organizerInput: '',
//   partnerOrganizerInput: '',
//   organization: '',
//   daysOfWeek: [],
//   // Ticketing defaults
//   type: '',
//   quantity: undefined,
//   price: undefined,
//   tax: '0',
//   number: undefined,
//   transferPrice: undefined,
//   features: {
//     timeslot: false,
//     repeatable: false,
//     resale: 'none',
//     earlyBirdEnabled: false,
//     earlyBirdDate: '',
//     earlyBirdPrice: undefined,
//     lastMinuteEnabled: false,
//     lastMinuteDate: '',
//     lastMinutePrice: undefined,
//     fasttrack: false,
//     fasttrackQuantity: undefined,
//     fasttrackPrice: undefined,
//     reservation: false,
//     reservationType: '',
//     transfer: false,
//   },
// };

// export const recurringTypeOptions = [
//   { label: 'Weekly', value: 'weekly' },
//   { label: 'Monthly', value: 'monthly' },
//   { label: 'Daily', value: 'daily' },
// ];

// export const currencyOptions = [
//   { label: 'USD', value: 'USD' },
//   { label: 'EURO', value: 'EUR' },
//   { label: 'GBP', value: 'GBP' },
// ];

// export const ticketOptionsData = [
//   { label: 'General Admission', value: 'general' },
//   { label: 'VIP', value: 'vip' },
//   { label: 'Early Bird - 5$', value: 'early-bird' },
// ];

// export const timeOptions = [
//   { label: '10:00AM', value: '10:00AM' },
//   { label: '11:00AM', value: '11:00AM' },
//   { label: '12:00PM', value: '12:00PM' },
//   { label: '1:00PM', value: '1:00PM' },
//   { label: '2:00PM', value: '2:00PM' },
//   { label: '3:00PM', value: '3:00PM' },
// ];

// export const salesChannelOptions = [
//   { label: 'Online', value: 'online' },
//   { label: 'In-person', value: 'in-person' },
//   { label: 'Phone', value: 'phone' },
// ];

// export const ticketTypeOptions = ['Paid', 'Free', 'Donation'];

// export const checkboxItems = [
//   'Resend to Unopened Users',
//   'Include Names on Tickets',
// ];
