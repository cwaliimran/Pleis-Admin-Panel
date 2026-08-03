import { EventOption, MenuItemOption, MenuOption, Reward, TierOption } from './types';

/**
 * Placeholder dataset for Rewards V2. Replace with the real endpoints once they
 * exist — nothing outside `use-rewards-view.ts` reads this.
 */

export const MOCK_TIERS: TierOption[] = [
  { id: 'tier-starter', name: 'Starter' },
  { id: 'tier-bronze', name: 'Bronze' },
  { id: 'tier-silver', name: 'Silver' },
  { id: 'tier-gold', name: 'Gold' },
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

export const MOCK_EVENTS: EventOption[] = [
  { id: 'event-phantom', name: 'Phantom Of The Opera' },
  { id: 'event-cabaret', name: 'Cabaret Night' },
  { id: 'event-members-night', name: 'Members Night' },
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'rwd-1',
    name: 'Phantom Of The Opera Ticket',
    image: '',
    type: 'Tickets',
    status: 'inactive',
    creationMethod: 'ticketReward',
    availableAsReward: true,
    challengeOnly: false,
    eventId: 'event-phantom',
    menuItemIds: [],
    pointCost: 200,
    totalLimit: 5,
    maxClaimsPerUser: 1,
    tierLimit: 'tier-starter',
    percentOff: 0,
    endDate: '2026-05-30',
    description: 'Exclusive seat for the Phantom Of The Opera run, claimable with loyalty points.',
    statusNote: 'Event has ended — reward set to inactive. Historical claim data is preserved below.',
    views: 87,
    favorites: 24,
    claims: 5,
    redeemed: 4,
  },
  {
    id: 'rwd-2',
    name: 'Coco Cola',
    image: '',
    type: 'Drinks',
    status: 'active',
    creationMethod: 'buyMenuItemReward',
    availableAsReward: true,
    challengeOnly: false,
    menuId: 'menu-drinks',
    menuItemIds: ['item-coca-cola', 'item-pepsi', 'item-sparkling-water'],
    pointCost: 200,
    totalLimit: null,
    maxClaimsPerUser: 3,
    tierLimit: 'tier-starter',
    percentOff: 0,
    endDate: '2026-12-31',
    description: 'Any soft drink from the list, on the house.',
    views: 1247,
    favorites: 286,
    claims: 128,
    redeemed: 119,
  },
  {
    id: 'rwd-3',
    name: 'Members Access Free Tickets',
    image: '',
    type: 'Tickets',
    status: 'active',
    creationMethod: 'ticketReward',
    availableAsReward: true,
    challengeOnly: false,
    eventId: 'event-members-night',
    menuItemIds: [],
    pointCost: 350,
    totalLimit: 60,
    maxClaimsPerUser: 2,
    tierLimit: 'tier-silver',
    percentOff: 0,
    endDate: '2026-11-15',
    description: 'Members-only entry, released monthly.',
    views: 198,
    favorites: 64,
    claims: 41,
    redeemed: 28,
  },
  {
    // Not browsable — only claimable through a challenge, so it has no views
    // or favorites to report.
    id: 'rwd-4',
    name: 'Cabaret Branded Lighter',
    image: '',
    type: 'Merch',
    status: 'active',
    creationMethod: 'customReward',
    availableAsReward: false,
    challengeOnly: true,
    menuItemIds: [],
    pointCost: 120,
    totalLimit: 200,
    maxClaimsPerUser: 1,
    tierLimit: '',
    percentOff: 0,
    endDate: '2026-09-30',
    description: 'Branded lighter handed out at the venue after completing a challenge.',
    views: 0,
    favorites: 0,
    claims: 138,
    redeemed: 90,
  },
];
