// ============================================================
// Order Management V2 — domain types
//
// The status / pickup / payment vocabularies are the backend's, aliased
// here so the section reads naturally and there is exactly one source of
// truth. `mappers.ts` turns the wire shape into the view model below.
// ============================================================

import type {
  ApiDateRange,
  ApiOrderStatus,
  ApiOrderTab,
  ApiPaymentMethod,
  ApiPaymentStatus,
  ApiPickupType,
} from '@/store/Reducer/order-management-v2-api';

export type UserType = 'organizer' | 'super-admin';

/**
 * The full order lifecycle as the backend models it. Staff advance it left
 * to right: pending → confirmed → sent → pendingPayment → completed.
 * `rejected` leaves from `pending`, `cancelled` from anywhere after it.
 */
export type OrderStatus = ApiOrderStatus;

export type DeliveryType = ApiPickupType;

export type PaymentType = ApiPaymentMethod;

export type PaymentStatus = ApiPaymentStatus;

/** Loyalty tier key as the backend sends it, e.g. "essential". */
export type LoyaltyTier = string;

export type OrderTab = ApiOrderTab;

export type DateRangeFilter = ApiDateRange;

/** Actions that advance the order. `reject`/`cancel` are the destructive pair. */
export type OrderActionType = 'confirm' | 'delivered' | 'markAsPaid' | 'reject' | 'cancel';

/** Destructive actions collect a reason; the two differ only in copy. */
export type DestructiveActionType = Extract<OrderActionType, 'reject' | 'cancel'>;

export type RejectionReason = 'itemOutOfStock' | 'venueTooBusy' | 'customerRequest' | 'customerNotFound' | 'other';

// ---------- Order shape ----------

export interface OrderItem {
  id: string;
  /**
   * The menu item this line refers to. Delivery is keyed on this, not on
   * `id` — two lines of the same menu item share it and deliver together.
   */
  menuItemId: string;
  name: string;
  quantity: number;
  /** Line total for the whole quantity, not the unit price. */
  lineTotal: number;
  /** Customer instruction, e.g. "No sugar, extra hot". Not yet sent by the API. */
  note?: string;
}

/**
 * Orders can be added to after they're placed, so staff can deliver one
 * batch while another is still being prepared. The API tracks delivery per
 * item, so a round here is the set of items sharing a delivery state.
 */
export interface OrderRound {
  id: string;
  label: string;
  isDelivered: boolean;
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
  /** Display reference without the leading "#", e.g. "ORD-C352Y8". */
  orderNumber: string;
  placedAt: string;
  customer: OrderCustomer;
  deliveryType: DeliveryType;
  /** The specific delivery option chosen, e.g. "Table 5" or "Counter pickup". */
  deliveryLabel: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  rounds: OrderRound[];
  subtotal: number;
  /** Tip — booked separately as "Napojnica" at 0% tax. Not yet sent by the API. */
  tipAmount: number;
  // tip: number;
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
  /** `all` sends no `range` param at all — the backend then decides the window. */
  dateRange: DateRangeFilter | 'all';
}

export interface OrderTabCounts {
  active: number;
  past: number;
}

/** Server-side paging state, mirrored from the list response `meta`. */
export interface OrderPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

export interface DestructiveActionPayload {
  reason: RejectionReason;
  note?: string;
}
