// ============================================================
// Order Management V2 — domain types
//
// The status / pickup / payment vocabularies are the backend's, aliased
// here so the section reads naturally and there is exactly one source of
// truth. `mappers.ts` turns the wire shape into the view model below.
// ============================================================

import type {
  ApiComboPriceMode,
  ApiDateRange,
  ApiOrder,
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

export type ComboPriceMode = ApiComboPriceMode;

export interface OrderComboItem {
  id: string;
  menuItemId: string;
  name: string;
}

/** A combo line on an order. It sits beside the rounds rather than inside one. */
export interface OrderCombo {
  id: string;
  comboId: string;
  name: string;
  description: string;
  quantity: number;
  /** Always `false` until the API starts returning a delivery state for combos. */
  isDelivered: boolean;
  priceMode: ComboPriceMode | '';
  /** Member-item sum for one unit, before the combo rule. */
  unitPrice: number;
  unitFinalPrice: number;
  /** Line total for the whole quantity. */
  lineTotal: number;
  items: OrderComboItem[];
}

export interface OrderCustomer {
  /** The user `_id`. Sent back as `userId` when the order is rewritten. */
  id: string;
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
  deliveryOption: {
    id: string;
    title: string;
  };
  placedAt: string;
  customer: OrderCustomer;
  deliveryType: DeliveryType;
  /** The specific delivery option chosen, e.g. "Table 5" or "Counter pickup". */
  deliveryLabel: string;
  /** Raw table number, empty unless `tableService`. `deliveryLabel` folds it in for display. */
  tableNumber: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  rounds: OrderRound[];
  /** Empty for orders placed without one. Not editable — no backend flow yet. */
  combos: OrderCombo[];
  /** `itemsTotal` — already includes combos, at their pre-discount price. */
  subtotal: number;
  saleDiscount: number;
  promoDiscount: number;
  voucherDiscount: number;
  tax: number;
  /** Empty unless a promo code was applied; shown against the promo discount. */
  promoCode: string;
  /** Tip — booked separately as "Napojnica" at 0% tax. Adds to the total. */
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

// ---------- Updating an order ----------

/** One selectable menu item in the add-item picker. */
export interface MenuItemOption {
  id: string;
  name: string;
  /** Unit price after any discount. The admin never edits it. */
  price: number;
  /** Sub-category the menu groups it under, e.g. "Fast Food". */
  category?: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
}

/** One selectable combo in the add-combo picker. */
export interface ComboOption {
  id: string;
  name: string;
  description: string;
  priceMode: ComboPriceMode | '';
  /** What one unit is billed at. The admin never edits it. */
  price: number;
  /** Member-item sum before the combo rule, for the struck-through price. */
  originalPrice: number;
  isAvailable: boolean;
  items: { id: string; name: string }[];
}

/** A line as the update modal holds it. Keyed on the menu item, like every write here. */
export interface OrderDraftItem {
  menuItemId: string;
  name: string;
  quantity: number;
  /** Read-only — derived from the order line, or from the picked menu item. */
  unitPrice: number;
  /** Added during this edit rather than already on the order. */
  isNew: boolean;
}

/**
 * A combo line as the update modal holds it. Only the quantity is editable —
 * the member items are fixed by the combo definition.
 */
export interface OrderDraftCombo {
  comboId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  /** Member-item sum for one unit; equals `unitPrice` when there is no saving. */
  originalUnitPrice: number;
  priceMode: ComboPriceMode | '';
  menuItemIds: string[];
  itemNames: string[];
  isNew: boolean;
}

/**
 * Prices, payment method and the delivery option are absent on purpose —
 * the backend owns all three. Only the lines are editable.
 */
export interface OrderUpdatePayload {
  items: { menuItemId: string; quantity: number }[];
  combos: { comboId: string; menuItemIds: string[]; quantity: number }[];
}

// ---------- Live updates (Socket.IO) ----------

/** Events the orders namespace emits. Both carry the same envelope. */
export type OrderSocketEventName = 'NEW_ORDER' | 'ORDER_UPDATE';

/**
 * One realtime message.
 *
 * `data` is the order as the socket serialises it, which is *not* the same
 * shape the list endpoint returns — `deliveryOption` arrives as a bare id
 * rather than `{ _id, title }`, `pickupType` uses a wider vocabulary, and
 * `clubMemberInfo` is absent. It is therefore only logged and used for its
 * ids; the rows themselves always come from a refetch of the list.
 */
export interface OrderSocketMessage {
  event: OrderSocketEventName;
  orderId: string;
  organizationId: string;
  data?: Partial<ApiOrder> & Record<string, unknown>;
  timestamp?: number;
}

/** Drives the header's live indicator. */
export type OrderSocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
