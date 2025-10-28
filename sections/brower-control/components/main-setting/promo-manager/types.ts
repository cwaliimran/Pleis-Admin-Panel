export interface PromoEvent {
  id: number;
  eventId: number;
  eventName: string;
  position: number;
}

export interface MockEvent {
  id: number;
  name: string;
  category: string;
  date: string;
}

export interface DraggablePromoItemProps {
  promo: PromoEvent;
  onEdit: (promo: PromoEvent) => void;
  onDelete: (id: number) => void;
  isOverlay?: boolean;
}

export interface ReorderPayload {
  movedId: string;
  previousOrder: number;
  newOrder: number;
}

// Mock data for events
export const mockEvents: MockEvent[] = [
  {
    id: 1,
    name: 'Summer Music Festival',
    category: 'Music',
    date: '2024-07-15',
  },
  {
    id: 2,
    name: 'Tech Conference 2024',
    category: 'Technology',
    date: '2024-08-20',
  },
  { id: 3, name: 'Food & Wine Expo', category: 'Food', date: '2024-09-10' },
  { id: 4, name: 'Art Gallery Opening', category: 'Art', date: '2024-07-25' },
  {
    id: 5,
    name: 'Marathon Championship',
    category: 'Sports',
    date: '2024-10-05',
  },
  {
    id: 6,
    name: 'Business Networking',
    category: 'Business',
    date: '2024-08-15',
  },
  {
    id: 7,
    name: 'Comedy Night Special',
    category: 'Entertainment',
    date: '2024-09-20',
  },
  {
    id: 8,
    name: 'Photography Workshop',
    category: 'Education',
    date: '2024-11-12',
  },
  {
    id: 9,
    name: 'Charity Gala Dinner',
    category: 'Charity',
    date: '2024-12-01',
  },
  {
    id: 10,
    name: 'Winter Sports Festival',
    category: 'Sports',
    date: '2024-12-15',
  },
  {
    id: 11,
    name: 'Jazz Concert Series',
    category: 'Music',
    date: '2024-11-30',
  },
  {
    id: 12,
    name: 'Startup Pitch Competition',
    category: 'Business',
    date: '2024-10-18',
  },
  {
    id: 13,
    name: 'Fashion Week Showcase',
    category: 'Fashion',
    date: '2024-09-25',
  },
  {
    id: 14,
    name: 'Science Fair Exhibition',
    category: 'Education',
    date: '2024-11-08',
  },
];
