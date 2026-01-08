import { ModuleConfig, PricingConfig } from './types';

export const PRICING_CONFIG: PricingConfig = {
  modules: {
    ordering: { price: 30, commission: 5 },
    loyalty: { price: 25, commission: 3 },
    reservations: { price: 30, commission: 4 },
  },
  analytics: 20,
  bundleDiscounts: {
    2: 10,
    3: 15,
  },
  multiOrgPricing: {
    1: 100,
    2: 80,
    3: 70,
    4: 65,
    5: 60,
    6: 55,
  },
  yearlyDiscount: 15,
  ticketingCommission: 8,
};

export const MODULES: ModuleConfig[] = [
  {
    id: 'ordering',
    name: 'Ordering',
    description: 'Enable food & drink ordering and package preorders within the app',
    icon: '🛍️',
    color: 'blue',
    features: ['In-app ordering', 'Menu management', 'Package preorders', 'Order tracking'],
  },
  {
    id: 'loyalty',
    name: 'Loyalty',
    description: 'Unlock loyalty programs, points tracking, and reward management',
    icon: '🎁',
    color: 'purple',
    features: ['Points tracking', 'Reward management', 'Customer retention', 'Loyalty analytics'],
  },
  {
    id: 'reservations',
    name: 'Reservations',
    description: 'Enable in-app reservations and table management features with ease',
    icon: '📅',
    color: 'green',
    features: ['Table reservations', 'Booking management', 'Capacity control', 'Guest notifications'],
  },
];

export const ORGANIZATION_COUNTS = [1, 2, 3, 4, 5, 6];

export const ANALYTICS_FEATURES = [
  'Revenue tracking',
  'Customer behavior insights',
  'Performance metrics',
  'Custom reports',
  'Data export',
  'Trend analysis',
];

export const FREE_PLAN_FEATURES = [
  '1 Organization (venue/location)',
  'Event posting & management',
  `Basic ticketing (${PRICING_CONFIG.ticketingCommission}% commission per ticket)`,
];

// import { ModuleConfig, PricingConfig } from './types';

// export const PRICING_CONFIG: PricingConfig = {
//   modules: {
//     ordering: { price: 30, commission: 5 },
//     loyalty: { price: 25, commission: 3 },
//     reservations: { price: 30, commission: 4 },
//   },
//   analytics: 20,
//   bundleDiscounts: {
//     2: 10,
//     3: 15,
//   },
//   multiOrgPricing: {
//     1: 100,
//     2: 80,
//     3: 70,
//     4: 65,
//     5: 60,
//     6: 55,
//   },
//   yearlyDiscount: 15,
//   ticketingCommission: 8,
// };

// export const MODULES: ModuleConfig[] = [
//   {
//     id: 'ordering',
//     name: 'Ordering',
//     description: 'Enable food & drink ordering and package preorders within the app',
//     icon: '🛍️',
//     color: 'blue',
//     features: ['In-app ordering', 'Menu management', 'Package preorders', 'Order tracking'],
//   },
//   {
//     id: 'loyalty',
//     name: 'Loyalty',
//     description: 'Unlock loyalty programs, points tracking, and reward management',
//     icon: '🎁',
//     color: 'purple',
//     features: ['Points tracking', 'Reward management', 'Customer retention', 'Loyalty analytics'],
//   },
//   {
//     id: 'reservations',
//     name: 'Reservations',
//     description: 'Enable in-app reservations and table management features with ease',
//     icon: '📅',
//     color: 'green',
//     features: ['Table reservations', 'Booking management', 'Capacity control', 'Guest notifications'],
//   },
// ];

// export const ORGANIZATION_COUNTS = [1, 2, 3, 4, 5, 6];

// export const ANALYTICS_FEATURES = [
//   'Revenue tracking',
//   'Customer behavior insights',
//   'Performance metrics',
//   'Custom reports',
//   'Data export',
//   'Trend analysis',
// ];

// export const FREE_PLAN_FEATURES = [
//   '1 Organization (venue/location)',
//   'Event posting & management',
//   `Basic ticketing (${PRICING_CONFIG.ticketingCommission}% commission per ticket)`,
// ];
