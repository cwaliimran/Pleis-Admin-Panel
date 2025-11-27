import { QRTypeConfig } from './types';

export const QR_TYPE_CONFIG: Record<string, QRTypeConfig> = {
  'organizer-page': {
    icon: '🏢',
    title: 'Organizer Page QR Code',
    subtitle: 'Direct users to your organizer profile',
    fields: [
      {
        type: 'text',
        id: 'organizerName',
        label: 'Organizer Name',
        placeholder: 'Enter your organizer name',
        required: true,
      },
    ],
    generateUrl: (data) => `https://app.venue.com/organizer/${data.organizerName.replace(/\s+/g, '-').toLowerCase()}`,
  },
  'event-page': {
    icon: '🎉',
    title: 'Event Page QR Code',
    subtitle: 'Link to a specific event',
    fields: [
      {
        type: 'select',
        id: 'eventSelect',
        label: 'Select Event',
        options: [
          { value: 'summer-festival-2025', text: 'Summer Music Festival 2025' },
          { value: 'tech-conference-2025', text: 'Tech Conference 2025' },
          { value: 'food-expo-2025', text: 'Food & Wine Expo 2025' },
          { value: 'charity-gala-2025', text: 'Charity Gala 2025' },
        ],
        required: true,
      },
    ],
    generateUrl: (data) => `https://app.venue.com/event/${data.eventSelect}`,
  },
  'loyalty-page': {
    icon: '⭐',
    title: 'Loyalty Program QR Code',
    subtitle: 'Direct users to your loyalty program',
    fields: [
      {
        type: 'text',
        id: 'loyaltyName',
        label: 'Loyalty Program Name',
        placeholder: 'Enter program name',
        required: true,
      },
      {
        type: 'text',
        id: 'organizerId',
        label: 'Organizer ID',
        placeholder: 'Your organizer ID',
        required: true,
      },
    ],
    generateUrl: (data) => `https://app.venue.com/loyalty/${data.organizerId}/${data.loyaltyName.replace(/\s+/g, '-').toLowerCase()}`,
  },
  'checkin-ordering': {
    icon: '✅',
    title: 'Check-in / Ordering QR Code',
    subtitle: 'Enable venue check-in and ordering',
    fields: [
      {
        type: 'text',
        id: 'venueName',
        label: 'Venue Name',
        placeholder: 'Enter venue name',
        required: true,
      },
      {
        type: 'text',
        id: 'venueId',
        label: 'Venue ID',
        placeholder: 'Your venue ID',
        required: true,
      },
    ],
    generateUrl: (data) => `https://app.venue.com/checkin/${data.venueId}?venue=${encodeURIComponent(data.venueName)}`,
  },
  'checkin-table': {
    icon: '🍽️',
    title: 'Check-in with Table ID',
    subtitle: 'Pre-fill table number for faster service',
    fields: [
      {
        type: 'text',
        id: 'venueName',
        label: 'Venue Name',
        placeholder: 'Enter venue name',
        required: true,
      },
      {
        type: 'text',
        id: 'venueId',
        label: 'Venue ID',
        placeholder: 'Your venue ID',
        required: true,
      },
      {
        type: 'text',
        id: 'tableId',
        label: 'Table Number/ID',
        placeholder: 'e.g., 12, A5, Patio-3',
        required: true,
      },
    ],
    generateUrl: (data) =>
      `https://app.venue.com/checkin/${data.venueId}?table=${encodeURIComponent(data.tableId)}&venue=${encodeURIComponent(data.venueName)}`,
  },
};

export const SIZE_OPTIONS = [
  { value: 512, name: 'Small', dimensions: '512 × 512 px' },
  { value: 1024, name: 'Medium', dimensions: '1024 × 1024 px' },
  { value: 2048, name: 'Large', dimensions: '2048 × 2048 px' },
  { value: 4096, name: 'Extra Large', dimensions: '4096 × 4096 px' },
];

export const MOCK_SAVED_QR_CODES = [
  {
    id: 'savedQR1',
    type: 'checkin-ordering' as const,
    name: 'Main Entrance',
    url: 'https://app.venue.com/checkin/venue123',
    date: 'Nov 5, 2025',
    color: '#1d1d1f',
    bgColor: '#ffffff',
    size: 512 as const,
  },
  {
    id: 'savedQR2',
    type: 'checkin-table' as const,
    name: 'Table 12',
    url: 'https://app.venue.com/checkin/venue123?table=12',
    date: 'Nov 4, 2025',
    color: '#1d1d1f',
    bgColor: '#ffffff',
    size: 512 as const,
  },
  {
    id: 'savedQR3',
    type: 'event-page' as const,
    name: 'Summer Music Festival 2025',
    url: 'https://app.venue.com/event/summer-festival-2025',
    date: 'Nov 3, 2025',
    color: '#1d1d1f',
    bgColor: '#ffffff',
    size: 512 as const,
  },
];

// import { QRTypeConfig } from './types';

// export const QR_TYPE_CONFIG: Record<string, QRTypeConfig> = {
//   'organizer-page': {
//     icon: '🏢',
//     title: 'Organizer Page QR Code',
//     subtitle: 'Direct users to your organizer profile',
//     fields: [
//       {
//         type: 'text',
//         id: 'organizerName',
//         label: 'Organizer Name',
//         placeholder: 'Enter your organizer name',
//         required: true,
//       },
//     ],
//     generateUrl: (data) => `https://app.venue.com/organizer/${data.organizerName.replace(/\s+/g, '-').toLowerCase()}`,
//   },
//   'event-page': {
//     icon: '🎉',
//     title: 'Event Page QR Code',
//     subtitle: 'Link to a specific event',
//     fields: [
//       {
//         type: 'select',
//         id: 'eventSelect',
//         label: 'Select Event',
//         options: [
//           { value: '', text: 'Choose an event' },
//           { value: 'summer-festival-2025', text: 'Summer Music Festival 2025' },
//           { value: 'tech-conference-2025', text: 'Tech Conference 2025' },
//           { value: 'food-expo-2025', text: 'Food & Wine Expo 2025' },
//           { value: 'charity-gala-2025', text: 'Charity Gala 2025' },
//         ],
//         required: true,
//       },
//     ],
//     generateUrl: (data) => `https://app.venue.com/event/${data.eventSelect}`,
//   },
//   'loyalty-page': {
//     icon: '⭐',
//     title: 'Loyalty Program QR Code',
//     subtitle: 'Direct users to your loyalty program',
//     fields: [
//       {
//         type: 'text',
//         id: 'loyaltyName',
//         label: 'Loyalty Program Name',
//         placeholder: 'Enter program name',
//         required: true,
//       },
//       {
//         type: 'text',
//         id: 'organizerId',
//         label: 'Organizer ID',
//         placeholder: 'Your organizer ID',
//         required: true,
//       },
//     ],
//     generateUrl: (data) => `https://app.venue.com/loyalty/${data.organizerId}/${data.loyaltyName.replace(/\s+/g, '-').toLowerCase()}`,
//   },
//   'checkin-ordering': {
//     icon: '✅',
//     title: 'Check-in / Ordering QR Code',
//     subtitle: 'Enable venue check-in and ordering',
//     fields: [
//       {
//         type: 'text',
//         id: 'venueName',
//         label: 'Venue Name',
//         placeholder: 'Enter venue name',
//         required: true,
//       },
//       {
//         type: 'text',
//         id: 'venueId',
//         label: 'Venue ID',
//         placeholder: 'Your venue ID',
//         required: true,
//       },
//     ],
//     generateUrl: (data) => `https://app.venue.com/checkin/${data.venueId}?venue=${encodeURIComponent(data.venueName)}`,
//   },
//   'checkin-table': {
//     icon: '🍽️',
//     title: 'Check-in with Table ID',
//     subtitle: 'Pre-fill table number for faster service',
//     fields: [
//       {
//         type: 'text',
//         id: 'venueName',
//         label: 'Venue Name',
//         placeholder: 'Enter venue name',
//         required: true,
//       },
//       {
//         type: 'text',
//         id: 'venueId',
//         label: 'Venue ID',
//         placeholder: 'Your venue ID',
//         required: true,
//       },
//       {
//         type: 'text',
//         id: 'tableId',
//         label: 'Table Number/ID',
//         placeholder: 'e.g., 12, A5, Patio-3',
//         required: true,
//       },
//     ],
//     generateUrl: (data) =>
//       `https://app.venue.com/checkin/${data.venueId}?table=${encodeURIComponent(data.tableId)}&venue=${encodeURIComponent(data.venueName)}`,
//   },
// };

// export const SIZE_OPTIONS = [
//   { value: 512, name: 'Small', dimensions: '512 × 512 px' },
//   { value: 1024, name: 'Medium', dimensions: '1024 × 1024 px' },
//   { value: 2048, name: 'Large', dimensions: '2048 × 2048 px' },
//   { value: 4096, name: 'Extra Large', dimensions: '4096 × 4096 px' },
// ];

// export const MOCK_SAVED_QR_CODES = [
//   {
//     id: 'savedQR1',
//     type: 'checkin-ordering' as const,
//     name: 'Main Entrance',
//     url: 'https://app.venue.com/checkin/venue123',
//     date: 'Nov 5, 2025',
//     color: '#1d1d1f',
//     bgColor: '#ffffff',
//     size: 512 as const,
//   },
//   {
//     id: 'savedQR2',
//     type: 'checkin-table' as const,
//     name: 'Table 12',
//     url: 'https://app.venue.com/checkin/venue123?table=12',
//     date: 'Nov 4, 2025',
//     color: '#1d1d1f',
//     bgColor: '#ffffff',
//     size: 512 as const,
//   },
//   {
//     id: 'savedQR3',
//     type: 'event-page' as const,
//     name: 'Summer Music Festival 2025',
//     url: 'https://app.venue.com/event/summer-festival-2025',
//     date: 'Nov 3, 2025',
//     color: '#1d1d1f',
//     bgColor: '#ffffff',
//     size: 512 as const,
//   },
// ];
