import { DiscountRecord } from './types';

// TODO(v2-api): replace with real discount data once the backend endpoint is ready.
export const mockDiscountsData: DiscountRecord[] = [
  {
    _id: 'discount-1',
    title: 'Summer Happy Hour',
    type: 'percentage',
    value: 15,
    itemIds: ['item-1', 'item-4', 'item-2'],
    startDate: '2026-06-01T18:00',
    endDate: '2026-09-30T20:00',
    status: 'active',
    createdAt: '2026-05-20',
  },
  {
    _id: 'discount-2',
    title: 'Weekend Wine Deal',
    type: 'fixed',
    value: 5,
    itemIds: ['item-10', 'item-11'],
    startDate: '2026-06-07T00:00',
    endDate: '2026-12-31T23:59',
    status: 'active',
    createdAt: '2026-05-25',
  },
  {
    _id: 'discount-3',
    title: 'Launch Promo',
    type: 'percentage',
    value: 20,
    itemIds: ['item-1', 'item-2', 'item-5', 'item-6', 'item-7', 'item-8', 'item-9'],
    startDate: '2026-02-14T00:00',
    endDate: '2026-02-28T23:59',
    status: 'expired',
    createdAt: '2026-02-01',
  },
];
