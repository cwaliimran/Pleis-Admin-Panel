import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { Ban, CalendarClock, CircleAlert, CircleCheck, CircleCheckBig, CircleDashed, CircleX, Clock, CreditCard, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  DateRangeFilter,
  DeliveryType,
  LoyaltyTier,
  OrderActionType,
  OrderStatus,
  OrderTab,
  PaymentStatus,
  PaymentType,
  RejectionReason,
} from './types';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

// ============================================================
// Badge system
//
// Soft-tinted pill, hairline border, leading icon. One tone table keeps
// every badge in the table visually consistent in both themes.
// ============================================================

export type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'orange' | 'indigo' | 'gray';

export const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  red: 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
  purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300',
  orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300',
  gray: 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400',
};

export interface BadgeConfig {
  label: string;
  icon: LucideIcon;
  tone: BadgeTone;
}

// ============================================================
// Status
// ============================================================

export const ORDER_STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
  pending: { label: 'Pending', icon: Clock, tone: 'amber' },
  confirmed: { label: 'Confirmed', icon: CircleCheck, tone: 'blue' },
  sent: { label: 'Sent', icon: Truck, tone: 'purple' },
  pendingPayment: { label: 'Pending Payment', icon: CreditCard, tone: 'orange' },
  completed: { label: 'Completed', icon: CircleCheckBig, tone: 'green' },
  cancelled: { label: 'Cancelled', icon: Ban, tone: 'gray' },
  rejected: { label: 'Rejected', icon: CircleX, tone: 'red' },
  preorder: { label: 'Preorder', icon: CalendarClock, tone: 'indigo' },
};

/** Tolerant lookup — a status the UI does not know about must not blank the row. */
export const getOrderStatusConfig = (status: OrderStatus): BadgeConfig =>
  ORDER_STATUS_CONFIG[status] || { label: humanizeKey(status), icon: CircleDashed, tone: 'gray' };

/** Which statuses live under which tab. */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'sent', 'pendingPayment', 'preorder'];
export const PAST_ORDER_STATUSES: OrderStatus[] = ['completed', 'cancelled', 'rejected'];

export const STATUS_BY_TAB: Record<OrderTab, OrderStatus[]> = {
  active: ACTIVE_ORDER_STATUSES,
  past: PAST_ORDER_STATUSES,
};

// ============================================================
// Round delivery state
//
// The API tracks delivery per item, so a round is the set of items sharing
// one delivery state rather than a batch with its own status.
// ============================================================

export const ROUND_DELIVERY_CONFIG: Record<'delivered' | 'pending', BadgeConfig> = {
  delivered: { label: 'Delivered', icon: CircleCheck, tone: 'green' },
  pending: { label: 'Not delivered', icon: Clock, tone: 'amber' },
};

export const getRoundDeliveryConfig = (isDelivered: boolean) => (isDelivered ? ROUND_DELIVERY_CONFIG.delivered : ROUND_DELIVERY_CONFIG.pending);

// ============================================================
// Delivery / payment / loyalty
// ============================================================

export const DELIVERY_TYPE_CONFIG: Record<DeliveryType, { label: string; chipClass: string }> = {
  tableService: { label: 'Table service', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  counter: { label: 'Counter pickup', chipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  togo: { label: 'To go', chipClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' },
};

export const getDeliveryTypeConfig = (type: DeliveryType) =>
  DELIVERY_TYPE_CONFIG[type] || { label: humanizeKey(type), chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

export const PAYMENT_TYPE_CONFIG: Record<PaymentType, { label: string }> = {
  applePay: { label: 'Apple Pay' },
  card: { label: 'Card' },
  cash: { label: 'Cash' },
  payLater: { label: 'Pay Later' },
};

export const getPaymentTypeLabel = (type: PaymentType) => PAYMENT_TYPE_CONFIG[type]?.label || humanizeKey(type);

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, BadgeConfig> = {
  paid: { label: 'Paid', icon: CircleCheck, tone: 'green' },
  pending: { label: 'Pending', icon: Clock, tone: 'amber' },
  failed: { label: 'Failed', icon: CircleAlert, tone: 'red' },
};

export const getPaymentStatusConfig = (status: PaymentStatus): BadgeConfig =>
  PAYMENT_STATUS_CONFIG[status] || { label: humanizeKey(status), icon: CircleDashed, tone: 'gray' };

/**
 * Tier keys come from the loyalty club, so the list is open-ended. Known
 * keys get their own colour, anything else falls back to a neutral chip.
 */
export const LOYALTY_TIER_CONFIG: Record<string, { label: string; chipClass: string }> = {
  essential: { label: 'ESSENTIAL', chipClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' },
  blue: { label: 'BLUE', chipClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' },
  gold: { label: 'GOLD', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  vip: { label: 'VIP', chipClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300' },
};

export const getLoyaltyTierConfig = (tier: LoyaltyTier) =>
  LOYALTY_TIER_CONFIG[tier] || { label: tier.toUpperCase(), chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

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

export const DATE_RANGE_OPTIONS: { value: DateRangeFilter | 'all'; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'thisMonth', label: 'This month' },
];

export const DEFAULT_PAGE_LIMIT = 20;

/** What the view boots with, and what "Clear filters" restores. */
export const DEFAULT_ORDER_FILTERS = {
  search: '',
  status: 'all',
  deliveryType: 'all',
  paymentType: 'all',
  dateRange: 'all',
} as const;

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
  pending: { type: 'confirm', label: 'Confirm' },
  confirmed: { type: 'delivered', label: 'Delivered' },
  // `sent` is already out for delivery — anything still outstanding is
  // handed over per item from the expanded panel, not from the row.
};

export const SECONDARY_ACTION_BY_STATUS: Partial<Record<OrderStatus, ActionConfig>> = {
  pending: { type: 'reject', label: 'Reject' },
  confirmed: { type: 'cancel', label: 'Cancel' },
  sent: { type: 'cancel', label: 'Cancel' },
  pendingPayment: { type: 'cancel', label: 'Cancel' },
};

/** Statuses where an unpaid order can still be settled. */
export const MARK_AS_PAID_STATUSES: OrderStatus[] = ['confirmed', 'sent', 'pendingPayment'];

/**
 * Items can only be handed over once the order has been accepted — nothing
 * is prepared before that, and terminal orders are done with.
 */
export const DELIVERABLE_STATUSES: OrderStatus[] = ['confirmed', 'sent', 'pendingPayment'];

export const MARK_AS_PAID_ACTION: ActionConfig = { type: 'markAsPaid', label: 'Mark as Paid' };

/** Only rewritable while nothing is committed — unaccepted and unpaid. */
export const isOrderEditable = (order: { status: OrderStatus; paymentStatus: PaymentStatus }) =>
  order.status === 'pending' && order.paymentStatus === 'pending';

/** How many menu items the picker reveals at a time. Paginates rendering, not fetching. */
export const MENU_ITEM_PAGE_SIZE = 15;

export const MIN_ITEM_QUANTITY = 1;
export const MAX_ITEM_QUANTITY = 99;

/**
 * Only these write `status` directly. `markAsPaid` writes `paymentStatus`
 * and `delivered` goes through the delivery endpoint, so neither is here.
 */
export const NEXT_STATUS_BY_ACTION: Partial<Record<OrderActionType, OrderStatus>> = {
  confirm: 'confirmed',
  reject: 'rejected',
  cancel: 'cancelled',
};

export const ACTION_SUCCESS_MESSAGE: Record<OrderActionType, string> = {
  confirm: 'Order confirmed',
  delivered: 'All items marked as delivered',
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

/** The API stores the reason as plain text, so it gets the label, not the key. */
export const getRejectionReasonLabel = (reason: RejectionReason) =>
  REJECTION_REASON_OPTIONS.find((option) => option.value === reason)?.label || humanizeKey(reason);

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

/** "pendingPayment" → "Pending Payment". Last resort for unmapped keys. */
export function humanizeKey(value: string) {
  if (!value) return '';
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());
}

export const formatCurrency = (amount: number) => `€${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;

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
