import { Challenge, LinkedRewardOption, MenuItemOption, MenuOption, TierOption } from './types';

/**
 * Placeholder dataset for Challenges V2. Replace with the real endpoints once
 * they exist — nothing outside `use-challenges-view.ts` reads this.
 */

export const MOCK_TIERS: TierOption[] = [
  { id: 'tier-starter', name: 'Starter' },
  { id: 'tier-insider', name: 'Insider' },
  { id: 'tier-vip', name: 'VIP' },
  { id: 'tier-legend', name: 'Legend' },
];

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

/** Existing rewards a challenge can hand out. Backed by the rewards list in production. */
export const MOCK_LINKED_REWARDS: LinkedRewardOption[] = [
  { id: 'rwd-4', name: 'Cabaret Branded Lighter' },
  { id: 'rwd-3', name: 'Members Access Free Tickets' },
  { id: 'rwd-2', name: 'Coco Cola' },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'chl-1',
    name: 'Visit Us This Week',
    image: '',
    description: 'Drop by the venue this week to collect bonus points.',
    taskType: 'visit',
    rewardType: 'points',
    status: 'active',
    taskValue: 1,
    qualifyingItemIds: [],
    pointReward: 100,
    rewardItemIds: [],
    repeatable: false,
    claimLimit: null,
    endDate: '2026-05-30',
    tierLimit: 'tier-starter',
    views: 682,
    favorites: 94,
    participants: 198,
    completions: 142,
    inProgress: 38,
    avgProgress: 0.9,
  },
  {
    id: 'chl-2',
    name: 'Visit Now To Get Additional Points',
    image: '',
    description: 'Buy any two qualifying drinks and pick a free item.',
    taskType: 'buyMenuItem',
    rewardType: 'menuItem',
    status: 'active',
    taskValue: 2,
    qualifyingMenuId: 'menu-drinks',
    qualifyingItemIds: ['item-coca-cola', 'item-pepsi'],
    pointReward: 0,
    rewardMenuId: 'menu-drinks',
    rewardItemIds: ['item-espresso', 'item-house-cocktail'],
    repeatable: true,
    claimLimit: 500,
    endDate: '2026-02-28',
    tierLimit: 'tier-starter',
    views: 212,
    favorites: 48,
    participants: 65,
    completions: 45,
    inProgress: 12,
    avgProgress: 1.4,
  },
];
