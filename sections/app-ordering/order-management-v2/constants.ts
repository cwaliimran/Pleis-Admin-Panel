import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { DateRangeFilter, DeliveryType, LoyaltyTier, OrderActionType, OrderStatus, OrderTab, PaymentType, RejectionReason } from './types';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

// ============================================================
// Status
// ============================================================

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; chipClass: string; dotClass: string }> = {
  sent: {
    label: 'Sent',
    chipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    dotClass: 'bg-blue-500',
  },
  preparing: {
    label: 'Preparing',
    chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  delivered: {
    label: 'Delivered',
    chipClass: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300',
    dotClass: 'bg-green-500',
  },
  waitingForPayment: {
    label: 'Waiting for payment',
    chipClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
    dotClass: 'bg-orange-500',
  },
  paid: {
    label: 'Paid',
    chipClass: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300',
    dotClass: 'bg-green-500',
  },
  canceled: {
    label: 'Canceled',
    chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
  rejected: {
    label: 'Rejected',
    chipClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    dotClass: 'bg-red-500',
  },
};

/** Which statuses live under which tab. */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['sent', 'preparing', 'delivered', 'waitingForPayment'];
export const PAST_ORDER_STATUSES: OrderStatus[] = ['paid', 'canceled', 'rejected'];

export const STATUS_BY_TAB: Record<OrderTab, OrderStatus[]> = {
  active: ACTIVE_ORDER_STATUSES,
  past: PAST_ORDER_STATUSES,
};

// ============================================================
// Delivery / payment / loyalty
// ============================================================

export const DELIVERY_TYPE_CONFIG: Record<DeliveryType, { label: string; chipClass: string }> = {
  tableDelivery: { label: 'Table delivery', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  counterPickup: { label: 'Counter pickup', chipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  toGo: { label: 'To go', chipClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' },
};

export const PAYMENT_TYPE_CONFIG: Record<PaymentType, { label: string }> = {
  payNow: { label: 'Pay now' },
  payLater: { label: 'Pay later' },
  cash: { label: 'Cash' },
};

export const LOYALTY_TIER_CONFIG: Record<LoyaltyTier, { label: string; chipClass: string }> = {
  blue: { label: 'BLUE', chipClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' },
  gold: { label: 'GOLD', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  vip: { label: 'VIP', chipClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300' },
};

// ============================================================
// Tabs & filter dropdowns
// ============================================================

export const ORDER_TAB_CONFIG: { id: OrderTab; label: string }[] = [
  { id: 'active', label: 'Active Orders' },
  { id: 'past', label: 'Past Orders' },
];

export const STATUS_FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...([...ACTIVE_ORDER_STATUSES, ...PAST_ORDER_STATUSES] as OrderStatus[]).map((status) => ({
    value: status,
    label: ORDER_STATUS_CONFIG[status].label,
  })),
];

export const DELIVERY_FILTER_OPTIONS: { value: DeliveryType | 'all'; label: string }[] = [
  { value: 'all', label: 'All delivery types' },
  ...(Object.keys(DELIVERY_TYPE_CONFIG) as DeliveryType[]).map((type) => ({
    value: type,
    label: DELIVERY_TYPE_CONFIG[type].label,
  })),
];

export const PAYMENT_FILTER_OPTIONS: { value: PaymentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All payment types' },
  ...(Object.keys(PAYMENT_TYPE_CONFIG) as PaymentType[]).map((type) => ({
    value: type,
    label: PAYMENT_TYPE_CONFIG[type].label,
  })),
];

export const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'thisMonth', label: 'This month' },
];

// ============================================================
// Actions
//
// Staff advance an order with one primary button; the secondary button is
// always the destructive escape hatch. Terminal statuses have neither.
// ============================================================

interface ActionConfig {
  type: OrderActionType;
  label: string;
}

export const PRIMARY_ACTION_BY_STATUS: Partial<Record<OrderStatus, ActionConfig>> = {
  sent: { type: 'confirm', label: 'Confirm' },
  preparing: { type: 'delivered', label: 'Delivered' },
  delivered: { type: 'requestPayment', label: 'Request Payment' },
  waitingForPayment: { type: 'markAsPaid', label: 'Mark as Paid' },
};

export const SECONDARY_ACTION_BY_STATUS: Partial<Record<OrderStatus, ActionConfig>> = {
  sent: { type: 'reject', label: 'Reject' },
  preparing: { type: 'cancel', label: 'Cancel' },
  delivered: { type: 'cancel', label: 'Cancel' },
  waitingForPayment: { type: 'cancel', label: 'Cancel' },
};

/** Where each advancing action moves the order. */
export const NEXT_STATUS_BY_ACTION: Record<OrderActionType, OrderStatus> = {
  confirm: 'preparing',
  delivered: 'delivered',
  requestPayment: 'waitingForPayment',
  markAsPaid: 'paid',
  reject: 'rejected',
  cancel: 'canceled',
};

export const ACTION_SUCCESS_MESSAGE: Record<OrderActionType, string> = {
  confirm: 'Order confirmed',
  delivered: 'Order marked as delivered',
  requestPayment: 'Payment requested',
  markAsPaid: 'Order marked as paid',
  reject: 'Order rejected',
  cancel: 'Order canceled',
};

export const REJECTION_REASON_OPTIONS: { value: RejectionReason; label: string }[] = [
  { value: 'itemOutOfStock', label: 'Item out of stock' },
  { value: 'venueTooBusy', label: 'Venue too busy / closing' },
  { value: 'customerRequest', label: 'Customer request' },
  { value: 'customerNotFound', label: 'Customer not found at table' },
  { value: 'other', label: 'Other' },
];

export const DESTRUCTIVE_ACTION_COPY = {
  reject: {
    title: 'Reject order',
    lead: 'was never accepted and nothing has been prepared. This cannot be undone.',
    confirmLabel: 'Reject order',
  },
  cancel: {
    title: 'Cancel order',
    lead: 'is already in progress. This cannot be undone.',
    confirmLabel: 'Cancel order',
  },
} as const;

// ============================================================
// Formatting helpers
// ============================================================

export const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

/** "Today 19:30" / "Yesterday 16:44" / "12 Mar 09:05". */
export const formatOrderTime = (value: string) => {
  const date = dayjs(value);
  if (!date.isValid()) return '-';
  if (date.isToday()) return `Today ${date.format('HH:mm')}`;
  if (date.isYesterday()) return `Yesterday ${date.format('HH:mm')}`;
  return date.format('D MMM HH:mm');
};

/** "today 17:02" — lower case, for use inside a sentence. */
export const formatOpenedAt = (value: string | null) => {
  if (!value) return '';
  return formatOrderTime(value)
    .replace(/^Today/, 'today')
    .replace(/^Yesterday/, 'yesterday');
};

export const getOrderItemCount = (order: { rounds: { items: { quantity: number }[] }[] }) =>
  order.rounds.reduce((total, round) => total + round.items.reduce((sum, item) => sum + item.quantity, 0), 0);
