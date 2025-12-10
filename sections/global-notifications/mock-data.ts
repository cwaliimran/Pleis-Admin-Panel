import { Notification, OrganizationOption, EventOption } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: '1',
    title: 'Weekend Festival Sale - 30% Off!',
    message: 'Get your tickets now for all weekend festivals. Limited time offer ending Sunday!',
    image: 'https://cdn.shopify.com/s/files/1/0704/6378/2946/files/8030.webp?v=1765352932',
    destination: {
      type: 'event',
      id: '123',
      name: 'Summer Music Festival',
    },
    sendTime: '2024-12-12T10:00:00',
    status: 'scheduled',
    targeting: {
      location: { name: 'New York', radius: 50 },
      ageRange: { min: 18, max: 35 },
      gender: 'all',
      interests: ['Music', 'Festivals', 'Nightlife'],
    },
    estimatedReach: 45230,
    createdAt: '2024-12-08T10:00:00',
    updatedAt: '2024-12-08T10:00:00',
  },
  {
    _id: '2',
    title: 'New Events Near You',
    message: 'Check out exciting new events happening in your area this month!',
    destination: { type: 'none' },
    sendTime: '2024-12-08T14:30:00',
    status: 'sent',
    targeting: {
      location: { name: 'Los Angeles', radius: 50 },
      gender: 'all',
      interests: [],
    },
    estimatedReach: 128450,
    actualReach: 127890,
    createdAt: '2024-12-07T10:00:00',
    updatedAt: '2024-12-08T14:30:00',
  },
  {
    _id: '3',
    title: 'Exclusive VIP Access',
    message: 'Join our VIP club and get early access to all premium events!',
    image: 'https://cdn.shopify.com/s/files/1/0704/6378/2946/files/4967.webp?v=1765352932',
    destination: {
      type: 'organization',
      id: '456',
      name: 'Elite Events Co.',
    },
    sendTime: '2024-12-15T18:00:00',
    status: 'scheduled',
    targeting: {
      ageRange: { min: 25, max: 45 },
      gender: 'all',
      interests: ['Business', 'Nightlife'],
    },
    estimatedReach: 32100,
    createdAt: '2024-12-09T10:00:00',
    updatedAt: '2024-12-09T10:00:00',
  },
];

// Mock API responses
export const MOCK_API_RESPONSE = {
  success: true,
  message: 'Notification created successfully',
  data: MOCK_NOTIFICATIONS[0],
};

export const MOCK_ORGANIZATIONS: OrganizationOption[] = [
  { _id: '1', name: 'Elite Events Co.' },
  { _id: '2', name: 'Music Masters' },
  { _id: '3', name: 'Sports Arena' },
  { _id: '4', name: 'Tech Conference Group' },
  { _id: '5', name: 'Cultural Events Inc.' },
];

export const MOCK_EVENTS: EventOption[] = [
  { _id: '1', title: 'Summer Music Festival' },
  { _id: '2', title: 'Tech Conference 2024' },
  { _id: '3', title: 'Food & Wine Expo' },
  { _id: '4', title: 'Sports Championship' },
  { _id: '5', title: 'Art Gallery Opening' },
];
