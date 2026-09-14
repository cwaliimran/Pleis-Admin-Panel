import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import { Ban, BellRing, CalendarClock, CircleAlert, CircleCheck, CircleCheckBig, CircleDashed, CircleX, Clock, CreditCard, PackageCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ComboPriceMode,
  DateRangeFilter,
  DeliveryType,
  LoyaltyTier,
  OrderActionType,
  OrderStatus,
  OrderTab,
  PaymentStatus,
  PaymentTiming,
  PaymentType,
  RejectionReason,
} from './types';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

// ---------- Badges ----------

export type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'orange' | 'indigo' | 'teal' | 'gray';

export const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  red: 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
  purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300',
  orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300',
  teal: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300',
  gray: 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400',
};

export interface BadgeConfig {
  label: string;
  icon: LucideIcon;
  tone: BadgeTone;
}

// ---------- Status ----------

export const ORDER_STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
  pending: { label: 'Pending', icon: Clock, tone: 'amber' },
  confirmed: { label: 'Confirmed', icon: CircleCheck, tone: 'blue' },
  ready: { label: 'Ready', icon: BellRing, tone: 'teal' },
  // `sent` is the wire name; it means every item is handed over and only the
  // payment is outstanding, so staff see it as "Delivered".
  sent: { label: 'Delivered', icon: PackageCheck, tone: 'purple' },
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
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'ready', 'sent', 'pendingPayment', 'preorder'];
export const PAST_ORDER_STATUSES: OrderStatus[] = ['completed', 'cancelled', 'rejected'];

export const STATUS_BY_TAB: Record<OrderTab, OrderStatus[]> = {
  active: ACTIVE_ORDER_STATUSES,
  past: PAST_ORDER_STATUSES,
};

// ---------- Round delivery state ----------

export const ROUND_DELIVERY_CONFIG: Record<'delivered' | 'pending', BadgeConfig> = {
  delivered: { label: 'Delivered', icon: CircleCheck, tone: 'green' },
  pending: { label: 'Not delivered', icon: Clock, tone: 'amber' },
};

export const getRoundDeliveryConfig = (isDelivered: boolean) => (isDelivered ? ROUND_DELIVERY_CONFIG.delivered : ROUND_DELIVERY_CONFIG.pending);

// ---------- Combos ----------

export const COMBO_PRICE_MODE_LABEL: Record<ComboPriceMode, string> = {
  fixed_amount_off_sum: 'Fixed amount off',
  fixed_combo_price: 'Fixed combo price',
  percentage_off_sum: 'Percentage off',
};

export const getComboPriceModeLabel = (mode: ComboPriceMode | '') => {
  if (!mode) return '';
  return COMBO_PRICE_MODE_LABEL[mode] || humanizeKey(mode.replace(/_/g, ' '));
};

export const getOrderComboCount = (order: { combos?: { quantity: number }[] }) =>
  (order.combos ?? []).reduce((total, combo) => total + combo.quantity, 0);

// ---------- Delivery / payment / loyalty ----------

export const DELIVERY_TYPE_CONFIG: Record<DeliveryType, { label: string; chipClass: string }> = {
  tableDelivery: { label: 'Table delivery', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  counterPickup: { label: 'Counter pickup', chipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  toGo: { label: 'To go', chipClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' },
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

/** Tinted by what it means for the staff: green is settled up front, amber is still owed. */
export const PAYMENT_TIMING_CONFIG: Record<PaymentTiming, { label: string; chipClass: string }> = {
  payNow: { label: 'Pay now', chipClass: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300' },
  payLater: { label: 'Pay later', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
};

export const getPaymentTimingConfig = (timing: PaymentTiming) =>
  PAYMENT_TIMING_CONFIG[timing] || { label: humanizeKey(timing), chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, BadgeConfig> = {
  paid: { label: 'Paid', icon: CircleCheck, tone: 'green' },
  pending: { label: 'Pending', icon: Clock, tone: 'amber' },
  failed: { label: 'Failed', icon: CircleAlert, tone: 'red' },
};

export const getPaymentStatusConfig = (status: PaymentStatus): BadgeConfig =>
  PAYMENT_STATUS_CONFIG[status] || { label: humanizeKey(status), icon: CircleDashed, tone: 'gray' };

/** Open-ended — the loyalty club owns the keys, so unknowns get a neutral chip. */
export const LOYALTY_TIER_CONFIG: Record<string, { label: string; chipClass: string }> = {
  essential: { label: 'ESSENTIAL', chipClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' },
  blue: { label: 'BLUE', chipClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' },
  gold: { label: 'GOLD', chipClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  vip: { label: 'VIP', chipClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300' },
};

export const getLoyaltyTierConfig = (tier: LoyaltyTier) =>
  LOYALTY_TIER_CONFIG[tier] || { label: tier.toUpperCase(), chipClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };

// ---------- Tabs & filter dropdowns ----------

export const ORDER_TAB_CONFIG: { id: OrderTab; label: string }[] = [
  { id: 'active', label: 'Active Orders' },
  { id: 'past', label: 'Past Orders' },
];

/** Not offered as a filter; they keep their badge in the table. */
export const NON_FILTERABLE_STATUSES: OrderStatus[] = ['preorder'];

export const STATUS_FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...([...ACTIVE_ORDER_STATUSES, ...PAST_ORDER_STATUSES] as OrderStatus[])
    .filter((status) => !NON_FILTERABLE_STATUSES.includes(status))
    .map((status) => ({
      value: status,
      label: ORDER_STATUS_CONFIG[status].label,
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

/** The delivery-option list is a filter dropdown, so it is fetched in one go. */
export const DELIVERY_OPTIONS_FETCH_LIMIT = 100;

/** What the view boots with, and what "Clear filters" restores. */
export const DEFAULT_ORDER_FILTERS = {
  search: '',
  status: 'all',
  deliveryOptionId: 'all',
  paymentType: 'all',
  dateRange: 'all',
} as const;

// ---------- Actions ----------
//
// Staff advance an order with one primary button; the secondary is always
// the destructive escape hatch. Terminal statuses have neither.

interface ActionConfig {
  type: OrderActionType;
  label: string;
}

export const SECONDARY_ACTION_BY_STATUS: Partial<Record<OrderStatus, ActionConfig>> = {
  pending: { type: 'reject', label: 'Reject' },
  confirmed: { type: 'cancel', label: 'Cancel' },
  ready: { type: 'cancel', label: 'Cancel' },
  sent: { type: 'cancel', label: 'Cancel' },
  pendingPayment: { type: 'cancel', label: 'Cancel' },
};

export const MARK_AS_PAID_ACTION: ActionConfig = { type: 'markAsPaid', label: 'Mark as Paid' };

/**
 * Only these can be settled by hand. Every other method is settled by the
 * payment provider, so staff have nothing to confirm and the button would
 * let them mark an order paid that never was.
 */
export const MARK_AS_PAID_PAYMENT_TYPES: PaymentType[] = ['card', 'cash'];

/**
 * A `payLater` order that is collected rather than carried to the customer.
 * These get called "Ready" first, so whoever is waiting can be told.
 */
export const PICKUP_TYPES_NEEDING_READY: DeliveryType[] = ['toGo', 'counterPickup'];

/**
 * Items can only be handed over once the order has been accepted — nothing
 * is prepared before that, and terminal orders are done with.
 */
export const DELIVERABLE_STATUSES: OrderStatus[] = ['confirmed', 'ready', 'sent', 'pendingPayment'];

/** Everything the flow rules read. Narrower than `Order` so it stays testable. */
type ActionableOrder = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  paymentTiming: PaymentTiming;
  deliveryType: DeliveryType;
};

/**
 * A collected order is called Ready before it is handed over. `payNow` has
 * to clear payment first — nothing is prepared for collection until the
 * money has landed — whereas `payLater` is collected at handover.
 */
const needsReadyFirst = (order: ActionableOrder) =>
  order.status === 'confirmed' &&
  PICKUP_TYPES_NEEDING_READY.includes(order.deliveryType) &&
  (order.paymentTiming === 'payLater' || order.paymentStatus === 'paid');

/**
 * `payNow` means exactly that: the money lands before anything leaves the
 * counter, so an unpaid order cannot be handed over at all. `payLater` is
 * collected at handover, so it delivers while still unpaid. Either way a
 * pickup order has to be called Ready first.
 */
export const canDeliverOrderItems = (order: ActionableOrder) => {
  if (!DELIVERABLE_STATUSES.includes(order.status)) return false;
  if (needsReadyFirst(order)) return false;

  return order.paymentTiming === 'payLater' || order.paymentStatus === 'paid';
};

/**
 * `payNow` settles before handover, so the button appears as soon as the
 * order is confirmed. `payLater` settles after, so it waits until the order
 * is actually out — `sent` is what delivering everything leaves behind.
 */
export const canMarkOrderAsPaid = (order: ActionableOrder) => {
  if (order.paymentStatus === 'paid') return false;
  if (!MARK_AS_PAID_PAYMENT_TYPES.includes(order.paymentType)) return false;

  const settleableStatuses: OrderStatus[] =
    order.paymentTiming === 'payLater' ? ['sent', 'pendingPayment'] : ['confirmed', 'ready', 'sent', 'pendingPayment'];

  return settleableStatuses.includes(order.status);
};

/**
 * The one button that moves the order along — a matrix, not a status lookup:
 *
 *   payNow,   table delivery  → Confirm → (Mark as Paid) → Delivered
 *   payNow,   to go / counter → Confirm → (Mark as Paid) → Ready → Delivered
 *   payLater, table delivery  → Confirm → Delivered → (Mark as Paid)
 *   payLater, to go / counter → Confirm → Ready → Delivered → (Mark as Paid)
 *
 * Mark as Paid is bracketed because it renders separately, beside this one —
 * see `canMarkOrderAsPaid`. On a `payNow` order it is the only thing offered
 * until payment lands, and for a provider-settled method (applePay) not even
 * that: the row waits, showing nothing but Cancel.
 *
 * `sent` has no primary action of its own — anything still outstanding is
 * handed over per item from the expanded panel, not from the row.
 */
export const getPrimaryAction = (order: ActionableOrder): ActionConfig | null => {
  if (order.status === 'pending') return { type: 'confirm', label: 'Confirm' };
  if (needsReadyFirst(order)) return { type: 'ready', label: 'Ready' };

  // Only ever offered on the row while there is a whole order to hand over.
  const canHandOver = order.status === 'confirmed' || order.status === 'ready';
  if (canHandOver && canDeliverOrderItems(order)) return { type: 'delivered', label: 'Delivered' };

  return null;
};

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
  ready: 'ready',
  reject: 'rejected',
  cancel: 'cancelled',
};

export const ACTION_SUCCESS_MESSAGE: Record<OrderActionType, string> = {
  confirm: 'Order confirmed',
  ready: 'Order marked as ready',
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

// ---------- Formatting helpers ----------

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

// ---------- Price breakdown ----------
//
// The backend owns every figure — nothing is recomputed. A line that comes
// back as 0 is not part of this order, so it is dropped rather than shown
// as "€0.00". `subtotal` and `total` always render.

type BreakdownKey = 'saleDiscount' | 'promoDiscount' | 'voucherDiscount' | 'tax' | 'tipAmount';

export interface OrderSummaryLine {
  key: BreakdownKey;
  label: string;
  amount: number;
  /** Subtracted from the subtotal, so it renders with a leading minus. */
  isDeduction: boolean;
}

const SUMMARY_LINE_CONFIG: { key: BreakdownKey; label: string; isDeduction: boolean }[] = [
  { key: 'saleDiscount', label: 'Sale discount', isDeduction: true },
  { key: 'promoDiscount', label: 'Promo discount', isDeduction: true },
  { key: 'voucherDiscount', label: 'Voucher', isDeduction: true },
  { key: 'tax', label: 'Tax', isDeduction: false },
  { key: 'tipAmount', label: 'Napojnica (0% tax)', isDeduction: false },
];

export const getOrderSummaryLines = (order: Record<BreakdownKey, number> & { promoCode?: string }): OrderSummaryLine[] =>
  SUMMARY_LINE_CONFIG.filter(({ key }) => Number.isFinite(order[key]) && order[key] !== 0).map(({ key, label, isDeduction }) => ({
    key,
    label: key === 'promoDiscount' && order.promoCode ? `${label} · ${order.promoCode}` : label,
    amount: order[key],
    isDeduction,
  }));
