import dayjs from 'dayjs';
import { NEXT_STATUS_BY_ACTION, STATUS_BY_TAB } from './constants';
import { DateRangeFilter, DestructiveActionPayload, Order, OrderActionType, OrderFilters, OrderTabCounts, OrderingStatus } from './types';

// ============================================================
// TEMPORARY IN-MEMORY BACKEND
//
// Stands in for the order-management API until it ships. Keyed by
// organizationId so switching venues behaves like the real thing, and it
// filters/counts server-side the way the endpoint will.
//
// When the real endpoints land, delete this file and rewrite the body of
// `use-order-management.ts` — nothing else imports it.
// ============================================================

const LATENCY_MS = 450;

const delay = (ms = LATENCY_MS) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const uid = () => `mock_${Math.random().toString(36).slice(2, 10)}`;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/** Today at HH:mm, so the seeded data always reads as "Today". */
const todayAt = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return dayjs().hour(hour).minute(minute).second(0).millisecond(0).toISOString();
};

interface VenueRecord {
  orderingStatus: OrderingStatus;
  orders: Order[];
}

const buildSeedRecord = (): VenueRecord => ({
  orderingStatus: {
    isOpen: true,
    openedBy: 'Mario',
    openedAt: todayAt('17:02'),
    venueName: 'PLEIS Vrbani',
  },
  orders: [
    {
      id: uid(),
      orderNumber: 'ORD-Y2M6CU',
      placedAt: todayAt('19:30'),
      customer: { name: 'Mario', username: 'MaxStar', email: 'mario@example.com', tier: 'blue' },
      deliveryType: 'tableDelivery',
      deliveryLabel: 'Table 5',
      paymentType: 'payLater',
      status: 'sent',
      rounds: [
        {
          id: uid(),
          label: 'Initial order',
          status: 'sent',
          items: [
            { id: uid(), name: 'Coffee Machiato', quantity: 1, lineTotal: 3, note: 'No sugar, extra hot' },
            { id: uid(), name: 'Coffee Espresso', quantity: 1, lineTotal: 2 },
          ],
        },
      ],
      subtotal: 5,
      tipAmount: 0,
      total: 5,
    },
    {
      id: uid(),
      orderNumber: 'ORD-GHP5M7',
      placedAt: todayAt('18:38'),
      customer: { name: 'Ana', username: 'AnaK', email: 'ana@example.com', tier: 'gold' },
      deliveryType: 'counterPickup',
      deliveryLabel: 'Counter pickup 1',
      paymentType: 'payLater',
      status: 'preparing',
      rounds: [
        {
          id: uid(),
          label: 'Initial order',
          status: 'delivered',
          items: [{ id: uid(), name: 'Cappuccino', quantity: 2, lineTotal: 5 }],
        },
        {
          id: uid(),
          label: 'Round 2',
          status: 'preparing',
          items: [
            { id: uid(), name: 'Coffee Espresso', quantity: 1, lineTotal: 2 },
            { id: uid(), name: 'Croissant', quantity: 1, lineTotal: 2, note: 'Warmed up' },
          ],
        },
      ],
      subtotal: 9,
      tipAmount: 0,
      total: 9,
    },
    {
      id: uid(),
      orderNumber: 'ORD-T9KL2R',
      placedAt: todayAt('20:05'),
      customer: { name: 'Luka', username: 'LukaM', email: 'luka@example.com', tier: 'vip' },
      deliveryType: 'tableDelivery',
      deliveryLabel: 'Table 2',
      paymentType: 'payLater',
      status: 'waitingForPayment',
      rounds: [
        {
          id: uid(),
          label: 'Initial order',
          status: 'delivered',
          items: [
            { id: uid(), name: 'Caffe Latte', quantity: 1, lineTotal: 3.2 },
            { id: uid(), name: 'Chocolate Cookie', quantity: 1, lineTotal: 2.2 },
          ],
        },
      ],
      subtotal: 5.4,
      tipAmount: 0,
      total: 5.4,
    },
    {
      id: uid(),
      orderNumber: 'ORD-4KD81P',
      placedAt: todayAt('17:12'),
      customer: { name: 'Petra', username: 'PetraH', email: 'petra@example.com', tier: 'blue' },
      deliveryType: 'toGo',
      deliveryLabel: 'To go',
      paymentType: 'payNow',
      status: 'paid',
      rounds: [
        {
          id: uid(),
          label: 'Initial order',
          status: 'delivered',
          items: [{ id: uid(), name: 'Chamomile', quantity: 2, lineTotal: 5 }],
        },
      ],
      subtotal: 5,
      tipAmount: 0,
      total: 5,
    },
    {
      id: uid(),
      orderNumber: 'ORD-QW7B3X',
      placedAt: todayAt('16:44'),
      customer: { name: 'Ivan', username: 'IvanR', email: 'ivan@example.com', tier: 'blue' },
      deliveryType: 'tableDelivery',
      deliveryLabel: 'Table 9',
      paymentType: 'cash',
      status: 'rejected',
      rounds: [
        {
          id: uid(),
          label: 'Initial order',
          status: 'rejected',
          items: [{ id: uid(), name: 'Sandwich Platter', quantity: 1, lineTotal: 12 }],
        },
      ],
      subtotal: 12,
      tipAmount: 0,
      total: 12,
      rejectionReason: 'itemOutOfStock',
      rejectionNote: 'Bread delivery did not arrive.',
    },
  ],
});

const store = new Map<string, VenueRecord>();

const read = (organizationId: string): VenueRecord => {
  if (!store.has(organizationId)) {
    store.set(organizationId, buildSeedRecord());
  }
  return store.get(organizationId) as VenueRecord;
};

const isWithinRange = (placedAt: string, range: DateRangeFilter) => {
  const date = dayjs(placedAt);

  if (range === 'today') return date.isSame(dayjs(), 'day');
  if (range === 'yesterday') return date.isSame(dayjs().subtract(1, 'day'), 'day');
  if (range === 'last7days') return date.isAfter(dayjs().subtract(7, 'day').startOf('day'));
  return date.isSame(dayjs(), 'month');
};

const matchesSearch = (order: Order, search: string) => {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return (
    order.orderNumber.toLowerCase().includes(term) ||
    order.customer.name.toLowerCase().includes(term) ||
    order.customer.username.toLowerCase().includes(term) ||
    order.customer.email.toLowerCase().includes(term)
  );
};

export interface MockOrdersResponse {
  orders: Order[];
  counts: OrderTabCounts;
}

export const mockOrderManagementApi = {
  async getOrderingStatus(organizationId: string): Promise<OrderingStatus> {
    await delay();
    return clone(read(organizationId).orderingStatus);
  },

  async getOrders(organizationId: string, filters: OrderFilters): Promise<MockOrdersResponse> {
    await delay();
    const record = read(organizationId);

    // Counts follow the date range but ignore the other filters, so the tab
    // badges stay stable while the user narrows the list.
    const inRange = record.orders.filter((order) => isWithinRange(order.placedAt, filters.dateRange));

    const counts: OrderTabCounts = {
      active: inRange.filter((order) => STATUS_BY_TAB.active.includes(order.status)).length,
      past: inRange.filter((order) => STATUS_BY_TAB.past.includes(order.status)).length,
    };

    const orders = inRange
      .filter((order) => STATUS_BY_TAB[filters.tab].includes(order.status))
      .filter((order) => filters.status === 'all' || order.status === filters.status)
      .filter((order) => filters.deliveryType === 'all' || order.deliveryType === filters.deliveryType)
      .filter((order) => filters.paymentType === 'all' || order.paymentType === filters.paymentType)
      .filter((order) => matchesSearch(order, filters.search))
      .sort((a, b) => dayjs(b.placedAt).valueOf() - dayjs(a.placedAt).valueOf());

    return clone({ orders, counts });
  },

  async setOrderingOpen(organizationId: string, isOpen: boolean, actor: string): Promise<OrderingStatus> {
    await delay();
    const record = read(organizationId);

    record.orderingStatus = {
      ...record.orderingStatus,
      isOpen,
      openedBy: isOpen ? actor : record.orderingStatus.openedBy,
      openedAt: isOpen ? dayjs().toISOString() : record.orderingStatus.openedAt,
    };

    return clone(record.orderingStatus);
  },

  async runOrderAction(organizationId: string, orderId: string, action: OrderActionType, payload?: DestructiveActionPayload): Promise<Order> {
    await delay();
    const record = read(organizationId);

    const order = record.orders.find((candidate) => candidate.id === orderId);
    if (!order) throw new Error('Order not found');

    const nextStatus = NEXT_STATUS_BY_ACTION[action];
    order.status = nextStatus;

    // Delivering the order settles every outstanding round with it.
    if (action === 'delivered' || action === 'reject' || action === 'cancel') {
      order.rounds = order.rounds.map((round) => ({ ...round, status: nextStatus }));
    }

    if (payload) {
      order.rejectionReason = payload.reason;
      order.rejectionNote = payload.note?.trim() || undefined;
    }

    return clone(order);
  },
};
