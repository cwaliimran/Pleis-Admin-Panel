import { ModuleType, PricingConfig, Subscription } from './types';

export const MODULE_NAMES: Record<ModuleType, string> = {
  ordering: 'Ordering',
  ticketing: 'Ticketing',
  reservations: 'Reservations',
  analytics: 'Analytics',
};

export const DEFAULT_PRICING: PricingConfig = {
  modules: {
    ordering: 30,
    reservations: 30,
    ticketing: 25,
    analytics: 20,
  },
  commissions: {
    ordering: 5,
    ticketing: 3,
    reservations: 4,
  },
  bundleDiscounts: {
    twoModules: 10,
    threeModules: 15,
  },
  multiOrgPricing: [
    { orgs: 1, percentage: 100 },
    { orgs: 2, percentage: 80 },
    { orgs: 3, percentage: 70 },
    { orgs: 4, percentage: 65 },
    { orgs: 5, percentage: 60 },
    { orgs: 6, percentage: 55 },
  ],
  yearlyDiscount: 15,
};

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    organizer: 'City Events Co',
    modules: ['ordering', 'ticketing', 'analytics'],
    organizations: 3,
    billing: 'yearly',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    monthlyPrice: 180,
    commissions: { ordering: 5, ticketing: 3, reservations: 0 },
  },
  {
    id: '2',
    organizer: 'Downtown Restaurants',
    modules: ['ordering', 'reservations'],
    organizations: 1,
    billing: 'monthly',
    startDate: '2024-06-01',
    endDate: '2024-07-01',
    status: 'active',
    monthlyPrice: 54,
    commissions: { ordering: 5, ticketing: 0, reservations: 4 },
  },
  {
    id: '3',
    organizer: 'Nightlife Hub',
    modules: ['ticketing', 'reservations', 'analytics'],
    organizations: 2,
    billing: 'yearly',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    status: 'active',
    monthlyPrice: 140,
    commissions: { ordering: 0, ticketing: 3, reservations: 4 },
  },
];
