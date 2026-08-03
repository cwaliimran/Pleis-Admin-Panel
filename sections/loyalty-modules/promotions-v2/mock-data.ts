import { MenuItemOption, MenuOption, Promotion } from './types';

/**
 * Placeholder dataset for Promotions V2. Replace with the real endpoints once
 * they exist — nothing outside `use-promotions-view.ts` reads this.
 */

export const MOCK_MENUS: MenuOption[] = [
  { id: 'menu-drinks', name: 'Drinks' },
  { id: 'menu-cocktails', name: 'Cocktails' },
  { id: 'menu-food', name: 'Food' },
  { id: 'menu-merch', name: 'Merch' },
];

export const MOCK_MENU_ITEMS: MenuItemOption[] = [
  { id: 'item-coca-cola', menuId: 'menu-drinks', name: 'Coca Cola 0.3L' },
  { id: 'item-pepsi', menuId: 'menu-drinks', name: 'Pepsi 0.3L' },
  { id: 'item-sparkling-water', menuId: 'menu-drinks', name: 'Sparkling Water 0.25L' },
  { id: 'item-espresso', menuId: 'menu-drinks', name: 'Espresso' },
  { id: 'item-house-cocktail', menuId: 'menu-cocktails', name: 'House Cocktail' },
  { id: 'item-aperol-spritz', menuId: 'menu-cocktails', name: 'Aperol Spritz' },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'prm-1',
    title: 'Order Coca Cola To Get Extra Points',
    image: '',
    description: 'Bonus points on every Coca Cola ordered during the campaign.',
    type: 'extraPoints',
    status: 'active',
    menuId: 'menu-drinks',
    qualifyingItemIds: ['item-coca-cola'],
    extraPointsPerPurchase: 100,
    pointsMultiplier: 1,
    discountPercent: 0,
    startDate: '2026-02-22',
    endDate: '2026-02-28',
    activeDaysMode: 'all',
    activeWeekdays: [],
    views: 421,
    favorites: 68,
    participations: 72,
    pointsAwarded: 7200,
  },
  {
    id: 'prm-2',
    title: 'Happy Hour',
    image: '',
    description: 'Points are multiplied during the evening window.',
    type: 'happyHour',
    status: 'active',
    qualifyingItemIds: [],
    extraPointsPerPurchase: 0,
    pointsMultiplier: 1.5,
    discountPercent: 0,
    startDate: '2026-02-22',
    endDate: '2026-02-28',
    activeDaysMode: 'all',
    activeWeekdays: [],
    startTime: '17:00',
    endTime: '19:00',
    views: 512,
    favorites: 94,
    participations: 96,
    pointsAwarded: 11700,
  },
  {
    // Legacy type — kept for its history, superseded by "Challenge Only" rewards.
    // It predates the schedule fields, so it has no active-time block.
    id: 'prm-3',
    title: 'Free Cabaret Lighter',
    image: '',
    description: 'Claim a branded lighter at the venue.',
    type: 'claimPromotion',
    status: 'inactive',
    qualifyingItemIds: [],
    extraPointsPerPurchase: 0,
    pointsMultiplier: 1,
    discountPercent: 0,
    rewardName: 'Cabaret Lighter',
    startDate: '2026-02-22',
    endDate: '2026-02-28',
    activeWeekdays: [],
    views: 175,
    favorites: 25,
    participations: 36,
    pointsAwarded: 0,
  },
];
