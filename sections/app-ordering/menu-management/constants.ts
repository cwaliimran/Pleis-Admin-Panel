import { MenuTab } from './types';

export const TAB_CONFIG: Array<{ id: MenuTab; label: string }> = [
  { id: 'all', label: 'All Items' },
  { id: 'limited', label: 'Limited-Time' },
  { id: 'upsells', label: 'Upsell Items' },
  { id: 'out-of-stock', label: 'Out of Stock' },
];

export const CATEGORY_OPTIONS = [
  { value: 'drinks', label: 'Drinks' },
  { value: 'food', label: 'Food' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'merchandise', label: 'Merchandise' },
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'recent', label: 'Recently Added' },
] as const;

export const AVAILABILITY_OPTIONS = [
  {
    value: 'preorder-only',
    label: 'Preorders Only',
    description: 'Available exclusively for users placing orders before the event starts.',
  },
  {
    value: 'preorder-and-event',
    label: 'Preorders + Event',
    description: 'Available during both the preorder period and throughout the event itself.',
  },
  {
    value: 'preorder-unlock',
    label: 'Preorder-Exclusive Unlock',
    description: 'Only users who preordered can purchase again at the venue. Special advance purchase incentive.',
  },
] as const;

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage Off' },
  { value: 'fixed', label: 'Fixed Amount Off' },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  drinks: '🍹',
  food: '🍔',
  desserts: '🍰',
  merchandise: '👕',
};
