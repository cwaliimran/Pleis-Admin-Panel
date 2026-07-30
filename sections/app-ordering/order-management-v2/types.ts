// ============================================================
// Order Management V2 — domain types
//
// Served by `mock-data.ts` through `use-order-management.ts` until the
// real endpoints exist.
// ============================================================

export type UserType = 'organizer' | 'super-admin';

/**
 * The full order lifecycle. Staff advance it left to right:
 * sent → preparing → delivered → waitingForPayment → paid
 * `rejected` leaves from `sent`, `canceled` from anywhere after it.
 */
export type OrderStatus = 'sent' | 'preparing' | 'delivered' | 'waitingForPayment' | 'paid' | 'canceled' | 'rejected';

export type DeliveryType = 'tableDelivery' | 'counterPickup' | 'toGo';

export type PaymentType = 'payNow' | 'payLater' | 'cash';

export type LoyaltyTier = 'blue' | 'gold' | 'vip';

export type OrderTab = 'active' | 'past';

export type DateRangeFilter = 'today' | 'yesterday' | 'last7days' | 'thisMonth';

/** Actions that advance the order. `reject`/`cancel` are the destructive pair. */
export type OrderActionType = 'confirm' | 'delivered' | 'requestPayment' | 'markAsPaid' | 'reject' | 'cancel';

/** Destructive actions collect a reason; the two differ only in copy. */
export type DestructiveActionType = Extract<OrderActionType, 'reject' | 'cancel'>;

export type RejectionReason = 'itemOutOfStock' | 'venueTooBusy' | 'customerRequest' | 'customerNotFound' | 'other';

// ---------- Order shape ----------

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  /** Line total for the whole quantity, not the unit price. */
  lineTotal: number;
  /** Customer instruction, e.g. "No sugar, extra hot". */
  note?: string;
}

/**
 * Orders can be added to after they're placed. Each batch is a round with
 * its own delivery state, so staff can deliver round 1 while round 2 is
 * still being prepared.
 */
export interface OrderRound {
  id: string;
  label: string;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderCustomer {
  name: string;
  /** Without the leading "@". */
  username: string;
  email: string;
  tier: LoyaltyTier;
  avatarUrl?: string | null;
}

export interface Order {
  id: string;
  /** Display reference without the leading "#", e.g. "ORD-Y2M6CU". */
  orderNumber: string;
  placedAt: string;
  customer: OrderCustomer;
  deliveryType: DeliveryType;
  /** The specific delivery option chosen, e.g. "Table 5" or "Counter pickup 1". */
  deliveryLabel: string;
  paymentType: PaymentType;
  status: OrderStatus;
  rounds: OrderRound[];
  subtotal: number;
  /** Tip — booked separately as "Napojnica" at 0% tax. */
  tipAmount: number;
  total: number;
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
}

// ---------- Ordering switch ----------

export interface OrderingStatus {
  isOpen: boolean;
  openedBy: string | null;
  openedAt: string | null;
  venueName: string;
}

// ---------- Filters ----------

export interface OrderFilters {
  tab: OrderTab;
  search: string;
  status: OrderStatus | 'all';
  deliveryType: DeliveryType | 'all';
  paymentType: PaymentType | 'all';
  dateRange: DateRangeFilter;
}

export interface OrderTabCounts {
  active: number;
  past: number;
}

export interface DestructiveActionPayload {
  reason: RejectionReason;
  note?: string;
}
